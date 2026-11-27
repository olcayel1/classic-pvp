const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const crypto = require('crypto');

const app = express();
app.use(express.static('public'));
app.use('/three', express.static('node_modules/three/build'));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, maxPayload: 2048 });
const players = new Map();

const classes = {
  Warrior: [180, 90, 5, 30],
  Rogue: [125, 110, 9, 24],
  Mage: [100, 180, 16, 34],
  Priest: [145, 150, 7, 22]
};

function spawn(p) {
  p.x = p.team === 'Human' ? -22 : 22;
  p.z = 0;
  p.hp = p.max;
  p.mp = p.mmax;
  p.dead = 0;
  p.dx = 0;
  p.dz = 0;
}

wss.on('connection', ws => {
  let p;

  ws.on('message', raw => {
    let m;
    try {
      m = JSON.parse(raw);
    } catch {
      return;
    }

    if (!m || typeof m !== 'object') return;

    if (!p && m.t === 'join') {
      let c = Object.hasOwn(classes, m.c) ? m.c : 'Warrior';
      let a = classes[c];

      p = {
        id: crypto.randomUUID(),
        name: String(m.name || 'Player').slice(0, 18),
        team: m.team === 'Orc' ? 'Orc' : 'Human',
        c,
        max: a[0],
        mmax: a[1],
        np: 0,
        dx: 0,
        dz: 0,
        last: 0,
        pot: 0
      };

      spawn(p);
      players.set(p.id, p);
      ws.send(JSON.stringify({ t: 'id', id: p.id }));
      return;
    }

    if (!p || p.dead) return;

    if (m.t === 'move') {
      p.dx = Math.max(-1, Math.min(1, Number(m.x) || 0));
      p.dz = Math.max(-1, Math.min(1, Number(m.z) || 0));
    }

    if (m.t === 'pot' && Date.now() > p.pot) {
      p.hp = Math.min(p.max, p.hp + 45);
      p.mp = Math.min(p.mmax, p.mp + 35);
      p.pot = Date.now() + 6000;
    }

    if (m.t === 'hit' && Date.now() - p.last > 850) {
      let q = players.get(m.id);
      let a = classes[p.c];

      if (!q || q.dead || q.team === p.team ||
          Math.hypot(q.x - p.x, q.z - p.z) > a[2] ||
          p.mp < 8) return;

      p.last = Date.now();
      p.mp -= 8;
      q.hp = Math.max(0, q.hp - a[3]);

      if (!q.hp) {
        q.dead = Date.now() + 4000;
        p.np += 50;
      }
    }
  });

  ws.on('close', () => {
    if (p) players.delete(p.id);
  });
});

setInterval(() => {
  for (let p of players.values()) {
    if (p.dead) {
      if (Date.now() > p.dead) spawn(p);
      continue;
    }

    let n = Math.max(1, Math.hypot(p.dx, p.dz));

    p.x = Math.max(-38, Math.min(38, p.x + p.dx / n * 0.28));
    p.z = Math.max(-38, Math.min(38, p.z + p.dz / n * 0.28));
    p.mp = Math.min(p.mmax, p.mp + 0.12);
  }

  let s = JSON.stringify({
    t: 'state',
    players: [...players.values()]
  });

  for (let ws of wss.clients) {
    if (ws.readyState === 1) ws.send(s);
  }
}, 50);

server.listen(process.env.PORT || 3000, '0.0.0.0');
       
