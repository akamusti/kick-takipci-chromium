# AGENTS.md — Kick Yayın Bildirici (Chromium)

Bu depoda çalışan tüm AI ajanlarının uyması zorunlu kurallar.

---

## 1. Dil iletişim kuralları

- Kullanıcıyla her zaman Türkçe konuş. Açıklamalar, sorular ve özetler Türkçe olmalı.
- Commit mesajları ve GitHub'a yazılan her şey İngilizce olmalı.
- Kod yorumları dosyada var olan stile uymalı; bu projede Türkçe yorumlar kullanılıyor.

---

## 2. Proje hakkında

- Chrome, Edge, Brave ve diğer Chromium tabanlı tarayıcılar için Manifest V3 eklentisidir.
- Kick yayıncılarını takip eder ve canlıya geçtiklerinde bildirim gönderir.
- Arka plan kodu bir Chromium extension service worker'ıdır (`background.js`).
- Service worker içinde `Audio` kullanılamaz. Bildirim zil sesi gerekiyorsa mevcut `offscreen.html` ve `offscreen.js` düzenini kullan.
- Veriler yalnızca `chrome.storage.local` içinde saklanır; sunucu, veritabanı veya analitik yoktur.
- Ağ istekleri yalnızca `https://kick.com/api/v1/...` uçlarına yapılabilir. Başka API'lere, CDN'lere veya üçüncü taraf servislere istek eklemek yasaktır.
- `manifest.json` içindeki `version` değerini yalnızca kullanıcı isterse yükselt.
- Manifest izinlerini yalnızca gereken özellikler için ekle. Özellikle `offscreen` iznini yalnızca offscreen belge kullanan özellikler için koru.

---

## 3. Her kod işinden sonra zorunlu güvenlik kontrolü

Commit'ten önce değişen ve eklenen dosyaları ve diff'i aşağıdaki riskler için tara:

| Aranan | Örnek |
|---|---|
| API anahtarı, token, secret veya şifre | `api_key`, `token`, `secret`, `password`, `bearer`, `authorization` |
| Cookie veya oturum verisi | `cookie`, `session_id`, `refresh_token` |
| Kişisel bilgi | Gerçek e-posta adresi, telefon, kimlik veya kart numarası, ev adresi |
| Uzun rastgele değer | 32+ karakterlik hex/base64 benzeri dizeler, `sk_live_...`, `AKIA...`, `ghp_...` |
| Kimlik bilgisi içeren veya dahili URL | `https://kullanici:sifre@...`, internal host |

Bu eklentiye gizli anahtar veya kimlik bilgisi ekleme. Tarama sırasında böyle bir değer bulunursa değeri kaynak koda, dokümantasyona veya Git geçmişine kopyalama; işi durdurup kullanıcıya bildir. Tarayıcı eklentilerinde `.env` değerleri güvenli biçimde saklanamaz ve paketlenen uzantıdan gizlenemez.

Push'tan önce `git status` çıktısında `.env` olmadığını doğrula. Mümkünse staged diff'i token, secret ve API anahtarı desenleri için ayrıca tara. Güvenlik taraması temiz değilse kullanıcıya bildir ve açık onayı olmadan push yapma.

---

## 4. Commit ve push kuralları

- Commit mesajı İngilizce ve Conventional Commits biçiminde olmalı:
  ```
  feat: add channel pinning
  fix: badge count on startup
  chore: bump version to 1.6.0
  docs: add AGENTS.md
  ```
- Her anlamlı iş birimi ayrı commit olmalı; ilgisiz değişiklikleri aynı commit'e karıştırma.
- Commit ve push sonrası `git log --oneline -1` ile commit'i doğrula.

---

## 5. Test

1. Chrome veya Chromium tabanlı tarayıcıda `chrome://extensions` adresini aç.
2. Geliştirici modunu etkinleştir ve **Paketlenmemiş öğe yükle (Load unpacked)** ile bu depodaki `manifest.json` dosyasını yükle.
3. Eklenti popup'ında kanal ekleme/silme ve ilgili ayarları dene.
4. `chrome://extensions` sayfasındaki service worker incelemesini açıp arka plan hatalarını; popup geliştirici araçlarında da arayüz hatalarını kontrol et.
5. Zil sesi veya offscreen davranışını değiştirdiysen bildirim sesini ve offscreen belge mesajlaşmasını ayrıca dene.

---

## 6. Dosyalar

| Yol | Amaç |
|---|---|
| `manifest.json` | Manifest V3 tanımı; sürüm yalnızca istenirse yükseltilir |
| `background.js` | Service worker: alarm, Kick kontrolü, rozet ve bildirim mantığı |
| `offscreen.html`, `offscreen.js` | Service worker'dan kullanılamayan ses oynatma |
| `popup/` | Arayüz: `popup.js`, `popup.html`, `popup.css`, `i18n.js` (TR/EN), `themes.js`, `suggestions.js` |
| `sounds/` | Yerel bildirim zil sesi (`notify.wav`); dışarıdan indirilmiş ses ekleme |
| `icon/` | Eklenti ikonları |
