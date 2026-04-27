const fs = require('fs');
const path = require('path');

const dir = './components';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.tsx')) {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // 1. Eğer useTranslation import edilmemişse ekle
    if (!content.includes('useTranslation')) {
      content = "import { useTranslation } from 'react-i18next';\n" + content;
    }

    // 2. Fonksiyon içine const { t } ekle (Eğer yoksa)
    if (!content.includes('const { t }')) {
      // Bileşen fonksiyonunun başlangıcını bul (Export default function veya const Name =)
      content = content.replace(/(export\s+default\s+function\s+\w+\s*\(.*?\)\s*{|const\s+\w+\s*=\s*\(.*?\)\s*=>\s*{)/, 
        "$1\n  const { t } = useTranslation('common');");
    }

    fs.writeFileSync(path.join(dir, file), content);
    console.log(`${file} yapısı tamamlandı.`);
  }
});
