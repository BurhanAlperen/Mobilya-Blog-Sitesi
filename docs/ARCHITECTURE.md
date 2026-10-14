# Konfor Tasarım Mobilya - Sistem Mimarisi & Gelecek Admin / Veritabanı Entegrasyon Rehberi

Bu belge, **Konfor Tasarım Mobilya** kurumsal web sitesinin mimari yapısını, veri akışını ve ileride entegre edilecek **Admin Paneli & Veritabanı** sistemine nasıl bağlanacağını detaylandırmaktadır.

---

## 1. Mevcut Kod & Veri Mimarisi (Mevcut Durum)

Sistem, harici bağımlılık karmaşasına girmeden, yüksek hız, SEO performansı ve sürdürülebilirlik sunan modüler bir mimariyle tasarlanmıştır:

```
Konfor Tasarım Mobilya/
├── index.html                  # Ana Dijital Vitrin (Hero, Değerler, Vitrin, Hizmetler, Ekip, İletişim)
├── hakkimizda.html             # Kurumsal Hikaye, Atölye Kültürü, 4 Aşamalı Süreç, Malzeme Standartları
├── projeler.html               # Filtrelenebilir Proje Galerisi, Canlı Arama, Lightbox Modal
├── iletisim.html               # İletişim, Google Maps, Adres & Hızlı Danışma Formu
├── server.js                   # Node.js yerel HTTP sunucusu ve REST Mock API motoru
├── package.json                # Proje yapılandırması
├── data/                       # JSON Veri Kaynakları (Tek Gerçeklik Kaynağı - Single Source of Truth)
│   ├── company.json            # Firma bilgileri, iletişim, Selim Divarcı verileri
│   ├── projects.json           # Proje kataloğu, malzemeler, kategoriler
│   ├── services.json           # Kurumsal & Bireysel hizmet detayları
│   ├── team.json               # Atölye birimleri ve yetkili bilgileri
│   └── inquiries.json          # Formdan gelen taleplerin yerel JSON veritabanı
├── assets/
│   ├── css/
│   │   ├── variables.css       # Tasarım belirteçleri (Bordo #801424, Krom #C5C9CE, Obsidyen arka plan)
│   │   ├── base.css            # Tipografi, sıfırlamalar, kaydırma çubuğu
│   │   ├── layout.css          # Izgara sistemleri, konteynerler
│   │   ├── components.css      # Kartlar, modal, butonlar, formlar, navbar
│   │   └── responsive.css      # Mobil çekmece menü ve tablet uyumluluk kuralları
│   ├── js/
│   │   ├── data/
│   │   │   ├── company.js      # Global JS veri sarmalayıcı (CORS-bağımsız yerel açılış)
│   │   │   ├── projects.js     # Global JS proje verisi
│   │   │   ├── services.js     # Global JS hizmet verisi
│   │   │   └── store.js        # DataStore soyutlama katmanı (HTTP / Local dual-mode)
│   │   ├── gallery.js          # Kategori filtreleme, anlık arama, lightbox modal kontrolcüsü
│   │   ├── contact.js          # Form doğrulama, API/Storage kaydı ve WhatsApp formatlama
│   │   └── main.js             # Sayfa kaydırma, mobil menü ve genel etkileşimler
│   └── images/
│       ├── logo.png            # Orijinal kurumsal logo
│       ├── favicon.png         # Tarayıcı sekme ikonu
│       ├── hero/               # Manşet görselleri
│       ├── projects/           # Proje referans fotoğrafları
│       └── about/              # Atölye ve zanaat fotoğrafları
```

---

## 2. Gelecek Veritabanı Şeması (Database Schema)

Gelecekte PostgreSQL, MySQL veya SQLite (Prisma ORM veya Drizzle ORM) entegre edildiğinde kullanılacak veri modeli şeması:

### 2.1. Projects Tablosu (`projects`)
| Alan Adı | Tip | Açıklama |
| :--- | :--- | :--- |
| `id` | `VARCHAR(36)` (PK) | Benzersiz proje ID (örn: `proj-k01`) |
| `title` | `VARCHAR(255)` | Proje başlığı (örn: "Modern Yönetim Ofisi") |
| `category` | `ENUM('kurumsal','bireysel','ozel-ahsap')` | Proje ana kategorisi |
| `category_label` | `VARCHAR(100)` | Görüntülenen etiket (örn: "Kurumsal Proje") |
| `client_type` | `VARCHAR(100)` | "Kurumsal" veya "Bireysel / Villa" |
| `location` | `VARCHAR(255)` | Lokasyon (örn: "Ataşehir / İstanbul") |
| `scope` | `TEXT` | İmalat kapsamı |
| `materials` | `JSON / TEXT[]` | Kullanılan malzemeler dizisi |
| `year` | `VARCHAR(20)` | Uygulama yılı |
| `featured` | `BOOLEAN` | Ana sayfada öne çıkarılma durumu |
| `image_url` | `VARCHAR(500)` | Ana görsel dosya yolu / CDN linki |
| `gallery_urls` | `JSON / TEXT[]` | Ek görsel dosya yolları |
| `summary` | `TEXT` | Detaylı açıklama |
| `is_reference` | `BOOLEAN` | Temsili konsept mi, gerçek şantiye fotoğrafı mı? |
| `created_at` | `TIMESTAMP` | Oluşturulma tarihi |
| `updated_at` | `TIMESTAMP` | Güncellenme tarihi |

### 2.2. Inquiries Tablosu (`inquiries`)
| Alan Adı | Tip | Açıklama |
| :--- | :--- | :--- |
| `id` | `VARCHAR(36)` (PK) | Talep ID (örn: `INQ-1729000000`) |
| `name` | `VARCHAR(255)` | Müşteri / Firma Adı |
| `phone` | `VARCHAR(50)` | Telefon numarası |
| `email` | `VARCHAR(255)` | E-posta adresi |
| `project_type` | `VARCHAR(100)` | Seçilen proje türü (Kurumsal / Bireysel) |
| `details` | `TEXT` | Proje notları / metraj |
| `status` | `ENUM('yeni', 'gorusuldu', 'teklif_verildi', 'onaylandi', 'arsiv')` | Talep takip durumu |
| `created_at` | `TIMESTAMP` | Geliş tarihi |

### 2.3. Admin Users Tablosu (`admins`)
| Alan Adı | Tip | Açıklama |
| :--- | :--- | :--- |
| `id` | `VARCHAR(36)` (PK) | Kullanıcı ID |
| `email` | `VARCHAR(255)` (UNIQUE)| Giriş e-postası |
| `password_hash` | `VARCHAR(255)` | Argon2 / Bcrypt hash |
| `name` | `VARCHAR(100)` | "Selim Divarcı" |
| `role` | `VARCHAR(50)` | "superadmin" |

---

## 3. Gelecek Admin Paneli REST API Sözleşmesi

Web sitesinin `assets/js/data/store.js` dosyası halihazırda bu API yapısına hazır olarak kurgulanmıştır:

- `GET /api/projects`: Tüm aktif projeleri JSON olarak döner (arama ve kategori filtrelerini query params ile alabilir).
- `GET /api/projects/:id`: Tek bir projenin tüm detaylarını döner.
- `POST /api/admin/projects`: Yeni proje ekleme (Çoklu görsel yükleme desteğiyle).
- `PUT /api/admin/projects/:id`: Proje bilgilerini ve görsellerini güncelleme.
- `DELETE /api/admin/projects/:id`: Projeyi silme veya arşivleme.
- `GET /api/admin/inquiries`: Web sitesi formundan gelen teklif ve danışma taleplerini listeleme.
- `PATCH /api/admin/inquiries/:id`: Talebin durumunu güncelleme (örn: "Selim Bey aradı", "Teklif iletildi").
- `POST /api/inquiry`: Ziyaretçilerin gönderdiği formu veritabanına ve bildirim servisine kaydetme (Mevcut `server.js` dosyasında çalışan bir prototip halihazırda yer almaktadır).

---

## 4. Admin Paneli Entegrasyon Adımları (Geliştirme Planı)

İleride admin paneli kodlanmaya başlandığında izlenecek en yalın ve verimli adımlar:

1. **Backend Tercihi:**
   - İster Node.js / Express veya Next.js Route Handlers, ister Python / FastAPI veya Go ile bu endpoints implemente edilir.
   - Veritabanı olarak SQLite (hafif, sıfır maliyet) veya PostgreSQL (Supabase / Neon) kullanılır.

2. **Frontend Entegrasyonu:**
   - `assets/js/data/store.js` içindeki `DataStore.init()` fonksiyonu zaten HTTP ortamında otomatik olarak `/api/projects` çağrısı yapacak şekilde hazırlanmıştır. Hiçbir HTML veya JS dosyasını baştan yazmaya gerek kalmaz.

3. **Görsel Yükleme (Media Management):**
   - Admin panelinden yüklenen fotoğraflar `/assets/images/projects/` klasörüne kaydedilir veya AWS S3 / Cloudflare R2 / Cloudinary üzerine yüklenerek URL'i `image_url` alanına atanır.
   - Gerçek şantiye fotoğrafları eklendiğinde `is_reference: false` yapılarak "Referans Konsept" rozeti otomatik olarak kalkar.

4. **Doğrudan Bildirimler:**
   - Yeni bir form doldurulduğunda, sistem Telegram Bot API veya WhatsApp Business API üzerinden Selim Divarcı'nın telefonuna anlık bildirim gönderebilir.
