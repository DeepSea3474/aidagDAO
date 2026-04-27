import os

with open('app/page.tsx', 'r') as f:
    original_content = f.read()

# Eğer dosya "use client" ile başlamıyorsa ekle
if not original_content.startswith('"use client";'):
    new_content = '"use client";\n' + original_content
    with open('app/page.tsx', 'w') as f:
        f.write(new_content)
    print("Mühür vuruldu: 'use client' eklendi.")
else:
    print("Mühür zaten var.")
