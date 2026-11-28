# Knight Online Classic PvP — proje paketi

Bu paket çok oyunculu tarayıcı oyununun çalıştırılabilir Node.js sunucusunu, web istemcisini ve JSON mod örneğini içerir. Giriş ekranı ve `/healthz` sürüm bilgisini kontrol edin. `olcayto1` hesabında daha önce istenen bir defalık +8 deneme desteği korunmuştur.

## Proje yapısı

```text
server.js
package.json
public/index.html
mods/example-creatures.json
MODS.md
README.md
```

## Render dağıtımı

1. ZIP dosyasını telefonda indirip Dosyalar uygulamasından **çıkartın**.
2. GitHub'da kendi hesabınızla oturum açın. Open-KO/OpenKO-db deposuna yüklemeyin; o başkasının kaynak deposudur. Yeni bir depo açın, örneğin `knight-online-classic-pvp`.
3. ZIP içindeki dosyaları depo köküne yükleyin. `server.js`, `package.json`, `README.md` ve `MODS.md` kökte; `index.html` `public/` içinde; örnek JSON `mods/` içinde olmalı.
4. Render hesabında **New + → Web Service** seçin, yeni GitHub deponuzu bağlayın.
5. **Runtime/Language: Node**, **Build Command: `npm install`**, **Start Command: `npm start`** ayarlayın ve dağıtımı başlatın.
6. Dağıtım tamamlanınca Render'ın verdiği `https://…onrender.com` adresini Chrome'da açın. `https://…onrender.com/healthz` yanıtında `ok: true` görünmeli.

Render uygulaması için GitHub'a ZIP'in kendisini değil, ZIP içinden çıkardığınız proje dosyalarını gönderin. Sunucu `0.0.0.0` üzerinde `PORT` ortam değişkenini kullanır.
