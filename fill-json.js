const fs = require('fs');
const path = require('path');

const dir = './components';
const localesDir = './public/locales';
const keys = new Set();

// 1. Tüm dosyalardaki t('...') anahtarlarını topla
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.tsx')) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const matches = content.matchAll(/t\('([^']+)'\)/g);
    for (const match of matches) {
      keys.add(match[1]);
    }
  }
});

// 2. TR ve EN dosyalarını güncelle
['en', 'tr'].forEach(lang => {
  const filePath = path.join(localesDir, lang, 'common.json');
  let json = {};
  if (fs.existsSync(filePath)) {
    json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  keys.forEach(key => {
    if (!json[key]) {
      // Anahtar yoksa, key'i okunabilir metne çevirip ekle
      json[key] = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  console.log(`${lang}/common.json güncellendi.`);
});
