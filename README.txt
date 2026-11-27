Siege 10.0: Alliance 9.0 + timed faction PvP event and UTC daily rewards. Upload server.js and public/index.html. War starts 60 seconds after boot, lasts 5 minutes, repeats after 15 minutes. Winning eligible online players receive 200 gold and 100 spendable NP. Local JSON persistence requires persistent disk. No live tests.
Forge 11.0: mining at (+/-20,+/-25), 8s per player cooldown, crafting at safe zone. Upload server.js and public/index.html. Local JSON requires persistent disk. Syntax checked; no live tests.

Stronghold 12: central capture, shared dungeon area, rare loot. Live tests pending.

Evolution 13.0: batched cobblestones, battlements, timber details and broadleaf trees. Visual-only additions; live testing pending.

ODYSSEY 14: bank, fishing and mount speed. Mount has no separate model. Bank and ownership use existing JSON save. Live tests pending.

LEGACY 15.0: pet, achievements, basic horse and wolf models. Health endpoint /healthz. Persistent disk: set SAVE_FILE=/var/data/accounts.json on a mounted Render disk. No live testing.

Guardian 16.0: rate limits, reduced public player data, shutdown save. Set SAVE_FILE=/var/data/accounts.json with a persistent Render disk mounted at /var/data. Without disk data can disappear on deploy. Back up accounts.json before migration.

AWAKENING 17.0: monster pursuit, return to spawn, attack animation timestamp, wolf variants, giant and demon visual details. Both server.js and public/index.html must be updated. Procedural models, not GLB.

ETERNAL 18.0: 156x156 terrain, 24 additional mobs, two outer regions, equipment visual overlays, class attack motion and skill effects. SQLite optional: Node 22.13+ and DATABASE_PATH=/var/data/classic.sqlite on a persistent Render disk. Without disk, saves can disappear. Existing JSON accounts imported on first database start if present. Procedural models, not professional GLB. Live multiplayer not tested.

KNIGHTS 19.0: Original procedural class silhouettes, armor plates, robes, quiver, mask and Orc facial details. No imported KO assets. Browser runtime not tested.

VALOR 20.0: procedural facial details, armor ornaments, shield silhouette and class-specific attack poses. No external assets.

Origins 21: original low-poly GLB skins and Idle/Run/Attack clips. Upload server.js, public/index.html and all eight GLB files to public/models. Old model fallback on loader failure. Browser test pending.

22.0: GLB ekipman efektleri, golge destegi, healthz surum duzeltmesi. Canli test yapilmadi.

Vanguard 23.0: GLB character selection preview, responsive login. Browser runtime not tested. Upload all public/models files when installing from older releases.

Emperor 25.0: target boss HP banner, synthesized ambient tones (sound toggle), decorative trading stalls, HUD styling, health endpoint version. Browser testing pending.

Warborn 26.0: eight GLB files updated with four class-specific attack clips; attack playback is one-shot and restarts for new attacks. Browser test pending.

IMMORTAL 27.0: Bone-attached weapon ornaments, upgrade colors 7/8/9/10+, armor rivets and facial geometry. Existing GLB assets retained. Browser visual testing pending.

INFERNO 28.0: animated additive weapon flame sprites for +7 and above, tier intensity and dragonblade orange flame. Browser visual testing pending.

29.0: 12 weapons, rare lifesteal drops, class restrictions, actual damage based healing. Existing global upgrade and class weapon models retained.

Relics 30: distinct procedural equipment shapes attached to GLB arm; browser test pending.
Legendary 31: rarity, boss loot, announcements, accessories; browser test pending.

32.0: Guardian ve Titan set savunması, kalkanlar, Vampir yüzüğü (%1 farm, %0.5 PK), sunucu savunma hesapları. Canlı test gerekli.

33.0 Phoenix: cosmetics, weapon procs, boss area damage, minimap. Browser testing pending.

34.0: Daily kill/boss/PK missions with server-side claims and clan NP leaderboard. UTC reset.

Titan 35.0: FPS and draw-call HUD, optional adaptive resolution, nearby PvE auto-targeting. No auto movement or PvP targeting. Browser testing pending.

36.0: Pet ve binek sistemleri kaldirildi; hareket ve farm bonuslari iptal edildi.

37.0 Kingdom: Kalici esya turu kilidi, pazar satin alma/satis onayi, takas ve depo kilit kontrolu. Pet/binek yok.

38.0: Aylik NP ve irk bazli kral oylamasi. UTC ay basinda yeni sezon; level 10, ayda bir oy, ilk 10 aday. Kral oy ve NP ile belirlenir.

39.0: faction treasury, king war call, monthly clan NP, random world boss, immediate market saves. Live tests pending.

40.0: Royal crown, treasury grants, server authorization. Live testing pending.

41.0 Exodus: Ash and Frost farm groups (12 mobs, levels 30–40); World Dragon bonus loot roll: 1% blood weapon, otherwise 4% conditional Drake ring. Existing loot unchanged. Reject array WebSocket messages. No pets or mounts.

42.0 Bazaar: Pazar arama, fiyat sıralama, kendi ilanları filtresi, ilan tarihi ve hesap başına 12 ilan sınırı.

43.0: 17 skills per class, level gates, learned ranks, separate cooldowns, reset and paged bar.
44: Rogue unified, Priest healing prototype; legacy model reuse; live tests pending.
