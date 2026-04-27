import os

path = 'app/page.tsx'
with open(path, 'r') as f:
    content = f.read()

# Wagmi'den mainnet'i kaldır, altına ayrı import ekle
content = content.replace("mainnet, useAccount } from 'wagmi';", "useAccount } from 'wagmi';")
if "import { mainnet } from 'wagmi/chains';" not in content:
    content = content.replace("import { WagmiConfig", "import { mainnet } from 'wagmi/chains';\nimport { WagmiConfig")

with open(path, 'w') as f:
    f.write(content)
print("Zincir mühürlendi: mainnet doğru yerden çağrılıyor.")
