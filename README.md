# Not Alma Uygulaması

React + Vite + TypeScript kullanılarak geliştirilmiş Progressive Web App (PWA) not alma uygulaması. Netlify'da deploy edilebilir ve hem web'de hem mobil tarayıcıda çalışır.

## Özellikler

- ✅ Not ekleme, düzenleme ve silme
- ✅ Etiket (tag) sistemi ile notları organize etme
- ✅ Notlarda arama yapma
- ✅ Etiketlere göre filtreleme
- ✅ Yerel depolama (localStorage)
- ✅ Progressive Web App (PWA) - mobil cihazlara yüklenebilir
- ✅ Responsive tasarım - mobil ve masaüstü uyumlu
- ✅ Netlify'a deploy edilebilir

## Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcıda `http://localhost:5173` adresini açın

## Build ve Deploy

### Production Build

```bash
npm run build
```

Build dosyaları `dist` klasörüne oluşturulur.

### Netlify'a Deploy

1. Netlify hesabınıza giriş yapın
2. "Add new site" > "Import an existing project" seçin
3. GitHub/GitLab/Bitbucket repo'nuzu bağlayın veya manuel olarak `dist` klasörünü drag & drop yapın
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy butonuna tıklayın

Veya Netlify CLI kullanarak:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## PWA Özellikleri

Bu uygulama bir Progressive Web App'dir. Mobil cihazlarda:

1. Tarayıcıda uygulamayı açın
2. "Ana ekrana ekle" veya "Add to Home Screen" seçeneğini kullanın
3. Uygulama ana ekranınıza eklenecek ve native app gibi çalışacak

## Proje Yapısı

```
├── public/              # Statik dosyalar
├── src/
│   ├── context/         # React Context (state management)
│   ├── screens/         # Ekran bileşenleri
│   ├── types/           # TypeScript tipleri
│   ├── App.tsx          # Ana uygulama bileşeni
│   ├── main.tsx         # Giriş noktası
│   └── index.css        # Global stiller
├── index.html
├── vite.config.ts       # Vite yapılandırması
├── netlify.toml         # Netlify yapılandırması
└── package.json
```

## Teknolojiler

- **React 18** - UI kütüphanesi
- **TypeScript** - Tip güvenliği
- **Vite** - Build tool ve dev server
- **React Router** - Sayfa yönlendirme
- **PWA Plugin** - Progressive Web App desteği
- **CSS3** - Stil yönetimi

## Kullanım

1. **Not Ekleme**: Ana ekrandaki + butonuna tıklayarak yeni not ekleyebilirsiniz.
2. **Etiket Ekleme**: Not detay ekranında etiket alanına etiket adını yazıp Enter'a basarak veya + butonuna tıklayarak etiket ekleyebilirsiniz.
3. **Not Arama**: Ana ekrandaki arama kutusunu kullanarak notlarınızda arama yapabilirsiniz.
4. **Etiketler**: Alt menüdeki "Etiketler" sekmesinden tüm etiketlerinizi görüntüleyebilirsiniz.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
