# Konfor Tasarım Mobilya - Yayınlama (Production Deployment) Kılavuzu

Bu kılavuz, **Konfor Tasarım Mobilya** web sitesinin farklı hosting ve sunucu ortamlarında **Temiz URL (.html uzantısız)** ile nasıl yayınlanacağını açıklar.

---

## 1. Vercel ile Yayınlama (Önerilen Bulut Dağıtımı)

Proje kök dizininde hazır bulunan `vercel.json` dosyası temiz URL desteğini otomatik sağlar:
```json
{
  "cleanUrls": true
}
```
1. GitHub veya GitLab reponuzu Vercel'e bağlayın.
2. Build Command veya Output Directory belirtmenize gerek yoktur (Statik kök dizin).
3. Sayfalarınız doğrudan `/`, `/projeler`, `/hakkimizda` ve `/iletisim` olarak yayınlanır.

---

## 2. cPanel / Apache / LiteSpeed ile Yayınlama (Geleneksel Hosting)

Türkiye'deki kurumsal hosting firmalarında (Turhost, Natro, İsimtescil vb.) en yaygın kullanılan yapıdır. Proje kökündeki `.htaccess` dosyası bu ortam için otomatik olarak hazırlandı:
- Ziyaretçi doğrudan `projeler.html` yazsa dahi `301 Kalıcı Yönlendirme` ile `/projeler` adresine yönlendirilir.
- Sunucu arka planda `/projeler` isteğini `projeler.html` dosyasından okur.
- Kurulum için FTP veya cPanel Dosya Yöneticisi ile tüm dosyaları `public_html` dizinine yüklemeniz yeterlidir.

---

## 3. Ubuntu / Nginx (VPS / Bulut Sunucu)

Kendi sanal sunucunuzda (VPS / Dedicated) Nginx kullanıyorsanız, `/etc/nginx/sites-available/konformobilya` yapılandırma bloğuna şu kuralları eklemeniz yeterlidir:

```nginx
server {
    listen 80;
    server_name konformobilya.com www.konformobilya.com;
    root /var/www/konfor-tasarim-mobilya;
    index index.html;

    # Temiz URL: .html uzantısız yönlendirme
    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # .html ile gelen istekleri temiz URL'e 301 yönlendir
    if ($request_uri ~ ^/(.*)\.html(\?.*)?$) {
        return 301 /$1$2;
    }

    # Statik varlıklar için önbellekleme
    location ~* \.(jpg|jpeg|png|webp|svg|css|js|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 4. Node.js Sunucusu ile Yayınlama (PM2)

Projeyle birlikte gelen `server.js` dosyasını bir Node.js ortamında kesintisiz çalıştırmak için:
```bash
# PM2 kurulumu (varsa atlayın)
npm install -g pm2

# Sunucuyu başlatma
pm2 start server.js --name "konfor-web"

# Otomatik başlangıç kaydı
pm2 startup
pm2 save
```
Bu sunucu dahili olarak `.html` uzantılarını 301 ile temiz URL'e yönlendirir ve `/projeler` isteklerini doğrudan `projeler.html` dosyasından sunar.
