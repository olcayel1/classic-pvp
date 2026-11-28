# JSON modları

Mod dosyaları `mods/` klasörüne eklenir ve sunucu yeniden başladığında yüklenir. Bu ilk mod sistemi mevcut haritalara yaratık ekler. Örnek paket `mods/example-creatures.json` içinde bulunur.

Her modda benzersiz ve küçük harfli bir `id` ile `creatures` listesi bulunmalıdır. Yaratıklar `market`, `human`, `orc`, `eslant`, `ardream`, `war`, `boss`, `pine`, `ash` veya `shard` haritalarına eklenebilir. Her yaratığın adı, harita anahtarı, 1–50 arası seviyesi, 1–20 arası sayısı ve 30–10000 arası can değeri belirtilir.

Yeni bir mod yüklemek için JSON dosyasını `mods/` klasörüne koyup projeyi sunucuda yeniden başlat. Sunucu `MODS_DIR` ortam değişkeni verilmişse o klasörü kullanır. Modlar JavaScript kodu çalıştırmaz. Yaratık adları, seviye, sayı ve can değerleri yükleme sırasında doğrulanır.
