const fs = require('fs');
const path = require('path');

const dir = './components';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.tsx')) {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Basit metinleri t() fonksiyonu ile değiştirir (Örnek: >Metin< -> >{t('Metin')}<)
    const fixedContent = content.replace(/>([^<{]+)</g, (match, text) => {
      const trimmed = text.trim();
      if (trimmed.length > 1 && !trimmed.includes('{')) {
        return `>{t('${trimmed.toLowerCase().replace(/\s+/g, '_')}')}<`;
      }
      return match;
    });

    fs.writeFileSync(path.join(dir, file), fixedContent);
    console.log(`${file} düzenlendi.`);
  }
});
