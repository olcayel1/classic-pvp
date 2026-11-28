# JSON mod yükleme rehberi

Sunucu, proje kökündeki `mods/` klasöründeki `.json` paketlerini başlatılırken yükler. `MODS_DIR` ortam değişkeni verilirse o klasör kullanılır. Modlar yalnızca veri içerir; JavaScript, SQL veya istemci dosyası çalıştırılmaz. Var olan içerikler modlardan önce açılır ve mod eklemek kayıt dosyalarını ya da mevcut haritaları değiştirmez.

Bir paket `maps`, `creatures` ve `items` listelerinden birini veya birkaçını içerebilir. Her mod dosyası önce bütünüyle doğrulanır; herhangi bir alan geçersizse o dosyanın hiçbir içeriği uygulanmaz. Diğer geçerli mod dosyaları yüklenmeye devam eder. Aynı `id` ikinci kez görülürse yinelenen paket atlanır.

## Yaratık modları

Yaratıklar var olan veya aynı pakette tanımlanan bir haritaya eklenir. `map` alanı aşağıdaki anahtarlardan biri olmalıdır: `market`, `human`, `orc`, `eslant`, `ardream`, `war`, `boss`, `pine`, `ash`, `shard` ya da bir modun `maps[].id` değeri.

| Alan | Gerekli | Sınır ve varsayılan |
| --- | --- | --- |
| `map` | Evet | Var olan veya modda tanımlanan harita anahtarı |
| `name` | Evet | 2–32 karakter |
| `level` | Evet | Tam sayı, 1–50 |
| `count` | Evet | Tam sayı, 1–20 |
| `health` | Evet | Tam sayı, 30–10000 |
| `combat.damage` | Hayır | 1–3000; varsayılan `4 + level × 2` |
| `combat.armor` | Hayır | 0–2000; varsayılan 0 |
| `combat.expReward` | Hayır | 1–1000000 temel EXP; varsayılan `80 + level × 10`; seviye farkına göre ölçeklenir |
| `combat.attackCooldownMs` | Hayır | 500–10000 ms; varsayılan 1500 ms |
| `combat.moveSpeed` | Hayır | 0.02–0.3 dünya birimi/tick; varsayılan 0.11 |
| `spawn.x`, `spawn.z` | Hayır | Dünya koordinatı; varsayılan harita merkezi |
| `spawn.radius` | Hayır | 0–40; varsayılan harita boyutuna göre seçilir. Doğma alanı harita sınırında kalmalı. |

Örnek yaratık tanımı:

```json
{
  "map": "pine",
  "name": "Orman Gölgesi",
  "level": 12,
  "count": 4,
  "health": 360,
  "combat": {
    "damage": 28,
    "armor": 14,
    "expReward": 120,
    "attackCooldownMs": 1800,
    "moveSpeed": 0.09
  },
  "spawn": { "x": 300, "z": 300, "radius": 10 }
}
```

Yaratıklar mevcut hedef seçme, saldırı, EXP, ganimet kutusu ve yeniden doğma akışını kullanır. Modun hasar, zırh, EXP, saldırı beklemesi ve hareket hızı ayarları oyun davranışına uygulanır.

## Eşya modları

Eşyalar `items` listesine eklenir. Eşya anahtarı envanter, kuşanma, pazar ve ganimet işlemlerinde kullanılır. `tier`, eşyanın renk ve ganimet havuzu sınıfını belirler.

| Alan | Gerekli | Sınır ve değerler |
| --- | --- | --- |
| `id` | Evet | 2–32 karakter; küçük harfle başlamalı; harf, rakam, `_` ve `-` |
| `name` | Evet | 2–48 karakter |
| `slot` | Evet | `weapon`, `armor`, `shield`, `ring`, `neck`, `ear`, `belt`, `cape`, `wings`, `material` |
| `power` | Hayır | Tam sayı, 0–100; varsayılan 0 |
| `defense` | Hayır | 0–200 |
| `cls` | Hayır | `Warrior`, `Archer`, `Mage`, `Assassin`, `Rogue`, `Priest` |
| `tier` | Hayır | `Material`, `Low Class`, `Middle Class`, `High Class`, `Rare`, `Unique`, `Exceptional`; varsayılan `Material` |
| `lifesteal`, `heal`, `crit`, `poison`, `stun` | Hayır | Sırasıyla en çok 0.2, 0.1, 0.5, 0.3 ve 0.5 oranı |

Örnek eşya:

```json
{
  "id": "moonblade",
  "name": "Ay Kılıcı",
  "slot": "weapon",
  "power": 24,
  "cls": "Warrior",
  "tier": "Rare",
  "crit": 0.12
}
```

`Low Class`, `Middle Class`, `High Class` ve `Rare` eşyalar normal eşya ganimet havuzuna girer. Daha yüksek sınıflar paket yüklenince otomatik düşmez; mevcut oyun akışının özel ganimet kurallarına ihtiyaç duyar. Mevcut eşya kimliklerini tekrar kullanmayın. Görsel model ve ikon tanımları henüz mod JSON biçiminde sunulmaz; istemci eşyayı mevcut envanter görünümüyle ve metin adıyla gösterir.

## Harita modları

Yeni harita `maps` listesine eklenir. İstemci haritayı bölge geçişi menüsüne ekler ve basit bir arazi platformu oluşturur. Harita anahtarı benzersiz olmalı; koordinatları mevcut oyun dünyasının sınırları içinde seçin.

| Alan | Gerekli | Sınır ve varsayılan |
| --- | --- | --- |
| `id` | Evet | Küçük harfle başlayan, 2–24 karakterlik benzersiz anahtar |
| `name` | Evet | 2–32 karakter |
| `x`, `z` | Evet | Dünya merkezi, -580 ile 580 arası |
| `level` | Hayır | Giriş seviyesi 1–50; varsayılan 1 |
| `team` | Hayır | `Human`, `Orc` veya boş; varsayılan boş |
| `color` | Hayır | `#RRGGBB`; varsayılan `#536c82` |
| `radius` | Hayır | Tam sayı, 25–58; varsayılan 48 |

Örnek harita:

```json
{
  "id": "moonvale",
  "name": "Ay Vadisi",
  "x": -520,
  "z": -520,
  "level": 30,
  "team": "",
  "color": "#4f8973",
  "radius": 50
}
```

Harita erişimi sunucuda seviye ve ırk kurallarına göre denetlenir. Yeni haritanın arazi, geçit ve dekoru istemcide temel geometrilerle çizilir. Özel 3B model, doku, ses veya görev tanımı bu mod biçiminin kapsamına girmez.

## Paket, kurulum ve örnek kod

Aynı pakette yeni harita tanımlayıp yaratıkları oraya yerleştirebilirsiniz. Aşağıdaki JSON, `example-creatures.json` dosyasındaki tam örnek paketin kısaltılmış halidir:

```json
{
  "id": "moon-expansion",
  "name": "Ay Vadisi Paketi",
  "maps": [{ "id": "moonvale", "name": "Ay Vadisi", "x": -520, "z": -520, "level": 30, "color": "#4f8973", "radius": 50 }],
  "creatures": [{ "map": "moonvale", "name": "Ay Muhafızı", "level": 32, "count": 3, "health": 900, "combat": { "damage": 68, "armor": 24, "expReward": 420 }, "spawn": { "radius": 12 } }],
  "items": [{ "id": "moonblade", "name": "Ay Kılıcı", "slot": "weapon", "power": 24, "cls": "Warrior", "tier": "Rare", "crit": 0.12 }]
}
```

1. Proje kökünde `mods/` klasörünü oluşturun. Render gibi bir dağıtımda kalıcı disk veya dağıtım yapılandırması uygunsa `MODS_DIR` değişkenini bu klasöre ayarlayın.
2. Her paketi benzersiz bir adla `mods/<paket>.json` olarak kaydedin. UTF-8 ve geçerli JSON kullanın; örnek şablon için [`example-creatures.json`](chatgpt-library-file://libfile_bef5d53239988191a65a43291080420f) dosyasını kopyalayıp düzenleyin.
3. Değişikliği sunucu projesine ekleyin ve sunucuyu yeniden başlatın. Modlar çalışan sunucuya anlık yüklenmez.
4. Başlangıç günlüğünde `Mod yüklendi: <id>` satırını arayın. Hata varsa `Mod yüklenemedi (<dosya>): <neden>` mesajını okuyup JSON'u düzeltin.

## Test ve sorun giderme

1. Sunucu açılışında modun yüklendiğini ve harita, yaratık, eşya adetlerinin günlüğe yazıldığını doğrulayın.
2. Oyuna girin; yeni haritanın Bölge geçişi menüsünde adı, seviyesi ve ırk kısıtlamasıyla göründüğünü kontrol edin. Gerekli seviyedeki karakterle haritaya gidin.
3. Haritada mod yaratıklarının göründüğünü ve hedef seçme, saldırı, yaratığın oyuncuya saldırması, EXP, ganimet kutusu ve yeniden doğmanın çalıştığını kontrol edin. `combat` değerlerini hasar/tempo farkıyla doğrulayın.
4. `Rare` örnek eşyasını ganimetten alın veya test hesabına ekleyin; envanter adını, sınıf kısıtını, kuşanmayı, saldırı gücünü ve pazar işlemlerini kontrol edin.
5. Negatif deneme için geçersiz slot, var olan eşya/harita `id`si veya harita sınırını aşan doğma alanı kullanın. Sunucu hata yazmalı ve o mod dosyasındaki değişiklikleri yüklememelidir.
6. Sunucu yeniden başlatıldıktan sonra aynı içeriklerin bir kez bulunduğunu doğrulayın. Aynı kimlikli paket kopyasını bırakmayın; tekrarlanan mod kimliği yüklenmez.

Bu kontrolleri test sunucusunda yapın. Modlar JSON doğrulaması ve oyun kurallarındaki sayısal sınırlarla güvenli tutulur; bu sınırlar oyun dengesini garanti etmez. SQL şemaları (`K_MONSTER`, `K_NPCPOS`) ve resmi istemci varlıkları doğrudan içe aktarılmaz.