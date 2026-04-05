# AIDAG Chain - Cloudflare Pages Deployment Guide

## Adım 1: GitHub Repository Oluştur

```bash
git init
git add .
git commit -m "Initial commit - AIDAG Chain"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aidag-chain.git
git push -u origin main
```

## Adım 2: Cloudflare Pages'a Bağla

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) > Pages
2. "Create a project" > "Connect to Git"
3. GitHub hesabını bağla ve repository'yi seç
4. Build ayarları:
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`

## Adım 3: Environment Variables Ekle

Cloudflare Dashboard > Settings > Environment Variables

### Production Secrets (Encrypt işaretli):
```
OPENAI_API_KEY = sk-your-openai-api-key
```

### Production Variables:
```
NEXT_PUBLIC_BSC_RPC = https://bsc-dataseed.binance.org/
NEXT_PUBLIC_ETH_RPC = https://eth.llamarpc.com
NEXT_PUBLIC_CHAIN_ID = 56
NEXT_PUBLIC_TOKEN_CONTRACT = 0x...
NEXT_PUBLIC_PRESALE_CONTRACT = 0x...
NEXT_PUBLIC_DAO_WALLET = 0x...
NEXT_PUBLIC_FOUNDER_WALLET = 0x...
```

## Adım 4: Deploy

"Save and Deploy" butonuna tıkla. İlk deployment birkaç dakika sürebilir.

## Proje Yapısı

```
aidag-chain/
├── pages/           # Next.js sayfaları (static HTML'e dönüşür)
├── components/      # React bileşenleri
├── lib/             # Yapılandırma ve yardımcı fonksiyonlar
├── functions/       # Cloudflare Pages Functions (serverless API)
│   └── api/
│       └── chat.js  # SoulwareAI OpenAI entegrasyonu
├── public/          # Statik dosyalar
├── styles/          # CSS dosyaları
└── out/             # Build çıktısı (Cloudflare'a yüklenir)
```

## SoulwareAI API

Cloudflare Pages Functions sayesinde gerçek OpenAI entegrasyonu çalışır:
- Endpoint: `/api/chat`
- Method: POST
- Body: `{ "message": "...", "history": [...] }`

## Önemli Notlar

1. **OPENAI_API_KEY** mutlaka "Encrypt" seçeneği işaretli olmalı
2. Build her GitHub push'ta otomatik tetiklenir
3. Custom domain eklemek için: Settings > Custom domains
4. Functions loglarını görmek için: Functions > Logs

## Sorun Giderme

### Build hatası alıyorsanız:
- Node.js version: 18.x
- Build command doğru mu kontrol edin
- Environment variables eksik olabilir

### SoulwareAI çalışmıyorsa:
- OPENAI_API_KEY doğru mu kontrol edin
- Functions > Real-time Logs'dan hataları görün
- API rate limitleri aşılmış olabilir

## Destek

- Cloudflare Docs: https://developers.cloudflare.com/pages/
- Next.js Static Export: https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
