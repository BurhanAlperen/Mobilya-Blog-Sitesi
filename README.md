# Konfor Tasarım Mobilya - Kurumsal Web Sitesi & Dijital Vitrin

**Konfor Tasarım Mobilya** için hazırlanan modern, premium ve özgün kurumsal web sitesi.

---

## 🏛️ Marka & İletişim Bilgileri
- **Firma:** Konfor Tasarım Mobilya
- **Yetkili:** Selim Divarcı
- **Telefon:** [+90 537 430 3560](tel:+905374303560)
- **E-posta:** [konformobilya2026@gmail.com](mailto:konformobilya2026@gmail.com)
- **Adres:** Aydınlar Mah. Sahra Sk. Bilir Apt. No:1-3A, Çekmeköy / İstanbul
- **Konsept:** Kurumsal Projeler (B2B ofis, otel, ticari mekanlar) & Bireysel Özel İmalat (Villa, giyinme odası, mutfak, ahşap panel kaplamalar)

---

## 🚀 Hızlı Başlangıç

Web sitesini çalıştırmak için 3 farklı kolay yöntem mevcuttur:

### Yöntem 1: Node.js ile Çalıştırma (Önerilen)
Sunucuyu başlatmak için proje dizininde şu komutu çalıştırın:
```bash
npm start
# veya
node server.js
```
Tarayıcınızda açın: **[http://localhost:3030](http://localhost:3030)** (Port meşgulse bir sonraki boş portu otomatik seçer).

### Yöntem 2: Python ile Çalıştırma
```bash
python3 -m http.server 3030
```

### Yöntem 3: Doğrudan Dosya Açma (Sıfır Sunucu)
`index.html` dosyasına çift tıklayarak herhangi bir tarayıcıda doğrudan açabilirsiniz. Kod yapısı hem `file://` hem de `http://` protokollerinde sorunsuz çalışacak şekilde tasarlanmıştır.

---

## 📂 Sayfa & Temiz URL Yapısı
1. **`/` (Ana Sayfa):** [`index.html`](file:///Users/alp/Desktop/Konfor%20Tasar%C4%B1m%20Mobilya/index.html) - Ana Dijital Vitrin
   - Hero manşet alanı, güven rozetleri, doğrudan arama ve WhatsApp aksiyonları
   - Üretim felsefesi ve Selim Divarcı liderlik güvencesi
   - Öne çıkan projeler vitrini (İnteraktif lightbox detay modallı)
   - Hizmet matrisi (Kurumsal, Bireysel ve Mimari Ahşap)
   - Atölye zanaatkârları ve şantiye montaj ekibi birimleri
   - İnteraktif proje danışma ve teklif formu
   - Çekmeköy harita ve konum paneli
2. **`/projeler` (Proje Galerisi):** [`projeler.html`](file:///Users/alp/Desktop/Konfor%20Tasar%C4%B1m%20Mobilya/projeler.html)
   - Dinamik kategori filtreleme (Kurumsal, Bireysel & Villa, Özel Mimari Ahşap)
   - Anlık arama (Malzeme, lokasyon veya proje adına göre canlı süzme)
   - Detaylı malzeme ve kapsam lightbox penceresi
   - Tek tıkla WhatsApp üzerinden proje adı seçili teklif isteme
3. **`/hakkimizda` (Hakkımızda & Atölye):** [`hakkimizda.html`](file:///Users/alp/Desktop/Konfor%20Tasar%C4%B1m%20Mobilya/hakkimizda.html)
   - 4 Aşamalı Anahtar Teslim Süreç (Rölöve -> Projelendirme -> İmalat -> Montaj)
   - Malzeme standartları (Doğal kaplama, E1 normu, Blum/Hettich raylar, İpek mat lake)
   - Selim Divarcı'nın vizyon ve taahhüt metni
4. **`/iletisim` (İletişim & Lokasyon):** [`iletisim.html`](file:///Users/alp/Desktop/Konfor%20Tasar%C4%B1m%20Mobilya/iletisim.html)
   - Google Haritalar entegrasyonu ve tek tıkla navigasyon
   - Doğrudan arama, WhatsApp mesajı ve form iletme alanı
   - Çalışma ve atölye randevu saatleri

---

## 🛠️ Gelecek Admin Paneli & Veritabanı Mimarisi
Detaylı mimari dokümantasyonu için inceleyiniz: **[docs/ARCHITECTURE.md](file:///Users/alp/Desktop/Konfor%20Tasar%C4%B1m%20Mobilya/docs/ARCHITECTURE.md)**

- Tüm veriler `data/projects.json`, `data/company.json`, `data/services.json` altında yapılandırılmıştır.
- Web sitesi `assets/js/data/store.js` veri soyutlama katmanı üzerinden çalışır.
- İleride bir admin paneli ve veritabanı (PostgreSQL, Supabase veya SQLite) bağlandığında, ön yüz bileşenlerinde hiçbir kod değişikliği yapılmasına gerek kalmadan doğrudan REST API'ye bağlanabilir.
- Gelen web sitesi formları şimdiden `/api/inquiry` endpoint'i üzerinden yakalanıp `data/inquiries.json` dosyasına güvenle kaydedilmektedir.

---

## 🎨 Tasarım Sistemi (Design Tokens)
- **Bordo (Logo Kırmızısı):** `#801424` / `#9D1B2E`
- **Krom / Platin Metalik:** `#C5C9CE` / `#E8EBEE`
- **Obsidyen Siyahı:** `#0C0D0F` / `#121417`
- **Doğal Ahşap & Taş Tonları:** `#B3865D` / `#F5F2EB`
- **Tipografi:** Cinzel (Başlıklar) & Plus Jakarta Sans (Gövde metinleri)
