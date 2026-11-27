const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const crypto = require('crypto');

const app = express();

app.use(express.static('public'));
app.use('/three', express.static('node_modules/three/build'));
app.use('/addons', express.static('node_modules/three/examples/jsm'));

const server = http.createServer(app);

const wss = new WebSocketServer({
  server,
  maxPayload: 2048
});

const players = new Map();

const classes = {
  Warrior: {
    hp: 180, mp: 90,
    range: 4, damage: 30,
    defense: 12, speed: 1,
    cooldown: 850
  },

  Archer: {
    hp: 120, mp: 110,
    range: 15, damage: 24,
    defense: 5, speed: 1.05,
    cooldown: 850
  },

  Mage: {
    hp: 100, mp: 180,
    range: 16, damage: 34,
    defense: 3, speed: 0.95,
    cooldown: 1100
  },

  Assassin: {
    hp: 125, mp: 110,
    range: 3.5, damage: 32,
    defense: 6, speed: 1.15,
    cooldown: 650
  }
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function expRequired(level) {
  return Math.ceil(500 * Math.pow(level, 2.2));
}

function upgradeChance(plus) {
  if (plus < 3) return 1;
  if (plus === 3) return 0.95;
  if (plus === 4) return 0.90;
  if (plus === 5) return 0.70;
  if (plus === 6) return 0.50;
  return 0.25 * Math.pow(0.5, plus - 7);
}

function rank(np) {
  if (np >= 1000000) return 'Immortal';
  if (np >= 500000) return 'Legend';
  if (np >= 150000) return 'Warlord';
  if (np >= 50000) return 'Commander';
  if (np >= 15000) return 'Elite Knight';
  if (np >= 5000) return 'Knight';
  if (np >= 1000) return 'Soldier';
  return 'Recruit';
}

function updateStats(p) {
  const a = classes[p.c];

  p.max = a.hp + (p.level - 1) * 5;
  p.mmax = a.mp + (p.level - 1) * 3;

  p.attack = a.damage + (p.level - 1) * 2;
  p.defense = a.defense + (p.level - 1);

  p.nextExp = expRequired(p.level);
}

function addExp(p, amount) {
  p.exp += Math.max(0, Math.floor(amount));

  while (p.exp >= p.nextExp) {
    p.exp -= p.nextExp;
    p.level++;

    updateStats(p);

    p.hp = p.max;
    p.mp = p.mmax;
  }
}

function spawn(p) {
  p.x = p.team === 'Human' ? -22 : 22;
  p.z = 0;

  p.hp = p.max;
  p.mp = p.mmax;

  p.dead = 0;
  p.dx = 0;
  p.dz = 0;

  p.protectedUntil = Date.now() + 5000;
  p.lastMove = Date.now();
}

function safeZone(p) {
  return p.team === 'Human'
    ? p.x < -18
    : p.x > 18;
}

const killHistory = new Map();

function rewardKill(p, q) {
  const now = Date.now();
  const key = p.id + ':' + q.id;

  const previous = killHistory.get(key) || 0;

  if (now - previous < 180000) return;

  killHistory.set(key, now);

  const difference = Math.abs(p.level - q.level);

  let reward = 50;

  if (difference > 5) reward = 25;
  if (difference > 10) reward = 10;
  if (difference > 20) reward = 0;

  if (!reward) return;

  p.kills++;
  p.streak++;

  q.deaths++;
  q.streak = 0;

  if (p.streak % 5 === 0) {
    reward += 100;
  }

  p.np += reward;
  p.spendableNP += reward;
  p.monthlyNP += reward;

  q.np = Math.max(0, q.np - 15);
  q.spendableNP = Math.max(0, q.spendableNP - 15);
  q.monthlyNP = Math.max(0, q.monthlyNP - 15);

  p.rank = rank(p.np);
  q.rank = rank(q.np);

  addExp(p, Math.min(1000, 25 + q.level * 5));
}

wss.on('connection', ws => {
  let p;

  ws.on('error', () => {});

  ws.on('message', raw => {
    let m;

    try {
      m = JSON.parse(raw);
    } catch {
      return;
    }

    if (!m || typeof m !== 'object') return;

    if (!p && m.t === 'join') {

      let requested = m.c;

      // Eski arayuzle gecici uyumluluk
      if (requested === 'Rogue') requested = 'Assassin';
      if (requested === 'Priest') requested = 'Warrior';

      const c = Object.hasOwn(classes, requested)
        ? requested
        : 'Warrior';

      p = {
        id: crypto.randomUUID(),

        name: String(m.name || 'Player').slice(0, 18),

        team: m.team === 'Orc' ? 'Orc' : 'Human',

        c,

        level: 1,
        exp: 0,
        nextExp: 500,

        np: 0,
        spendableNP: 0,
        monthlyNP: 0,

        rank: 'Recruit',

        gold: 0,
        kills: 0,
        deaths: 0,
        streak: 0,

        weaponPlus: 0,

        dx: 0,
        dz: 0,

        last: 0,
        pot: 0
      };

      updateStats(p);
      spawn(p);

      players.set(p.id, p);

      ws.send(JSON.stringify({
        t: 'id',
        id: p.id
      }));

      return;
    }

    if (!p || p.dead) return;

    const now = Date.now();
    const a = classes[p.c];

    if (m.t === 'move') {

      p.dx = clamp(Number(m.x) || 0, -1, 1);
      p.dz = clamp(Number(m.z) || 0, -1, 1);

      p.lastMove = now;
    }

    if (m.t === 'pot' && now > p.pot) {

      p.hp = Math.min(
        p.max,
        p.hp + Math.ceil(p.max * 0.25)
      );

      p.mp = Math.min(
        p.mmax,
        p.mp + Math.ceil(p.mmax * 0.35)
      );

      p.pot = now + 6000;
    }

    if (m.t === 'hit') {

      if (now - p.last < a.cooldown) return;

      const q = players.get(m.id);

      if (!q || q.dead || q.team === p.team) return;

      if (safeZone(p) || safeZone(q)) return;

      if (now < p.protectedUntil ||
          now < q.protectedUntil) return;

      if (Math.hypot(
        q.x - p.x,
        q.z - p.z
      ) > a.range) return;

      if (p.mp < 8) return;

      p.last = now;
      p.mp -= 8;

      const weaponBonus =
        Math.log2(1 + p.weaponPlus) * 8;

      const variation = 0.9 + Math.random() * 0.2;

      const damage = Math.max(
        1,
        Math.floor(
          (p.attack + weaponBonus) *
          variation - q.defense * 0.5
        )
      );

      q.hp = Math.max(0, q.hp - damage);

      if (q.hp === 0) {

        q.dead = now + 4000;
        q.dx = 0;
        q.dz = 0;

        rewardKill(p, q);
      }
    }
  });

  ws.on('close', () => {
    if (p) players.delete(p.id);
  });
});

setInterval(() => {

  const now = Date.now();

  for (const p of players.values()) {

    if (p.dead) {
      if (now > p.dead) spawn(p);
      continue;
    }

    if (now - p.lastMove > 500) {
      p.dx = 0;
      p.dz = 0;
    }

    const a = classes[p.c];

    const n = Math.max(
      1,
      Math.hypot(p.dx, p.dz)
    );

    p.x = clamp(
      p.x + p.dx / n * 0.28 * a.speed,
      -38, 38
    );

    p.z = clamp(
      p.z + p.dz / n * 0.28 * a.speed,
      -38, 38
    );

    p.mp = Math.min(
      p.mmax,
      p.mp + 0.12
    );
  }

  const state = JSON.stringify({
    t: 'state',
    players: [...players.values()]
  });

  for (const ws of wss.clients) {
    if (ws.readyState === 1 &&
        ws.bufferedAmount < 65536) {
      ws.send(state);
    }
  }

}, 50);

setInterval(() => {

  const now = Date.now();

  for (const [key, time] of killHistory) {
    if (now - time > 180000) {
      killHistory.delete(key);
    }
  }

}, 60000);

server.listen(
  process.env.PORT || 3000,
  '0.0.0.0'
);
