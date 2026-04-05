# AIDAG Chain

Kripto tarihinde bir ilk - Yapay Zeka tarafından tam otonom yönetilen blockchain projesi.

**NO FOUNDER INTERVENTION • NO HUMAN INTERVENTION**

## Whitepaper

[Read the Whitepaper](./WHITEPAPER.md) - Complete technical documentation including tokenomics, governance model, and roadmap.

## Linkler

| Platform | Link |
|----------|------|
| Website | https://aidag-chain.com |
| GitHub | https://github.com/DeepSea3474/aidagchain |
| Twitter/X | https://twitter.com/aidagDAO |
| Telegram | https://t.me/Aidag_Chain_Global_Community |
| BSCScan | https://bscscan.com/token/0xe6B06f7C63F6AC84729007ae8910010F6E721041 |
| Whitepaper | [WHITEPAPER.md](./WHITEPAPER.md) |

## Kontrat Bilgileri

| Özellik | Değer |
|---------|-------|
| Token Adı | AIDAG |
| Ağ | Binance Smart Chain (BSC) |
| Chain ID | 56 |
| Kontrat Adresi | `0xe6B06f7C63F6AC84729007ae8910010F6E721041` |
| Standart | BEP-20 |

## Özellikler

- **Tam Otonom**: SoulwareAI tarafından yönetilen, kurucu ve insan müdahalesi olmayan sistem
- **Quantum Güvenlik**: Gelecek nesil kuantum bilgisayarlara karşı dayanıklı
- **Multi-Chain**: BSC, Ethereum ve tüm EVM uyumlu zincirlerle uyumlu
- **DAO Yönetişimi**: Topluluk odaklı kararlar, AI destekli yürütme

## Tokenomics

| Özellik | Değer |
|---------|-------|
| Maksimum Arz | 21,000,000 AIDAG |
| Kurucu Tokenleri | 3,001,000 AIDAG (1 yıl kilitli) |
| DAO + SoulwareAI | 17,999,000 AIDAG |
| Gelir Dağılımı | %60 Kurucu, %40 Otonom Likidite |
| DAO Üyelik Ücreti | $5 USD (tek seferlik) |
| Oy Gücü | 1 AIDAG = 1 Oy |

## Ön Satış Fiyatları

| Aşama | Fiyat | Durum |
|-------|-------|-------|
| Stage 1 | $0.078 | Aktif |
| Stage 2 | $0.098 | Yakında |
| Listeleme | $0.12 | - |

## Dosya Yapısı

```
aidag-chain/
├── components/       # React bileşenleri
│   ├── Header.js
│   ├── Layout.js
│   ├── SoulwareChat.js
│   ├── GovernanceSection.js
│   └── ...
├── functions/        # Cloudflare Pages Functions
│   └── api/
│       └── chat.js   # SoulwareAI OpenAI entegrasyonu
├── lib/              # Yapılandırma ve yardımcı fonksiyonlar
│   ├── config.js
│   ├── blockchain.js
│   └── helpers.js
├── pages/            # Sayfa bileşenleri
│   ├── index.js      # Ana sayfa
│   ├── presale.js    # Ön satış
│   ├── dao.js        # DAO yönetişimi
│   └── docs.js       # Dokümantasyon
├── public/           # Statik dosyalar
│   ├── logo.svg      # Ana logo (şeffaf arka plan)
│   ├── logo.png      # Logo (PNG)
│   └── aidag-logo.jpg
├── styles/           # CSS dosyaları
│   └── globals.css
├── out/              # Build çıktısı (Cloudflare'a yüklenir)
├── next.config.js    # Next.js yapılandırması
├── wrangler.toml     # Cloudflare yapılandırması
└── package.json      # Bağımlılıklar
```

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusu (port 5000)
npm run dev

# Üretim için derleme (static export)
npm run build
```

## GitHub'a Gönderme

```bash
# Git repo başlat (eğer yoksa)
git init

# Tüm dosyaları ekle
git add .

# Commit yap
git commit -m "AIDAG Chain - Cloudflare ready"

# GitHub'a bağla
git remote add origin https://github.com/DeepSea3474/aidagchain.git
git branch -M main
git push -u origin main
```

## Cloudflare Pages Deployment

### Adım 1: GitHub'a Push
Projeyi GitHub repo'nuza gönderin.

### Adım 2: Cloudflare Pages Kurulumu
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) > Pages > Create a project
2. "Connect to Git" seçin
3. GitHub hesabınızı bağlayın
4. `aidagchain` repo'sunu seçin

### Adım 3: Build Ayarları
- **Framework preset**: Next.js (Static HTML Export)
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Node.js version**: 18 veya üzeri

### Adım 4: Environment Variables
Settings > Environment Variables bölümünden ekleyin:

**Secrets (Encrypt işaretli):**
```
OPENAI_API_KEY=sk-your-openai-key
```

**Variables:**
```
NEXT_PUBLIC_BSC_RPC=https://bsc-dataseed.binance.org/
NEXT_PUBLIC_ETH_RPC=https://eth.llamarpc.com
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_TOKEN_CONTRACT=0xe6B06f7C63F6AC84729007ae8910010F6E721041
```

### Adım 5: Custom Domain
1. Pages projenize gidin > Custom domains
2. Domain ekleyin: `aidag-chain.com`
3. Cloudflare DNS ayarlarını yapın

## Governance (DAO Yönetişimi)

- DAO üyelik sistemi aktif ($5 tek seferlik ücret)
- Kullanıcılara üyelik onayı sorulur
- DAO üyelerinin cüzdan adresleri zincirden okunup kısaltılmış gösterilir (ör. 0x5abc...350)
- 1 AIDAG = 1 Oy gücü
- Teklif türleri: Teknik, Ekonomik, Topluluk, Acil

## Teknolojiler

- Next.js 14 (Static Export)
- React 18
- Tailwind CSS 4
- Ethers.js 6
- i18next (Çoklu dil)
- OpenAI GPT-4 (SoulwareAI)

## Lisans

MIT License

---

**AIDAG Chain** - Kripto tarihinde bir ilk, yapay zeka yönetimli ilk coin.

🔗 https://aidag-chain.com | 🐦 @aidagDAO | 💬 t.me/Aidag_Chain_Global_Community
