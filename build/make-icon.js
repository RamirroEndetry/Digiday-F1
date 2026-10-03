// Převod build/icon.svg na icon.png (512) a icon.ico (16–256) pro Electron
const sharp = require('sharp');
const pngToIcoMod = require('png-to-ico'); const pngToIco = pngToIcoMod.default || pngToIcoMod;
const fs = require('fs');
const path = require('path');

const svg = fs.readFileSync(path.join(__dirname, 'icon.svg'));

(async () => {
  await sharp(svg).resize(512, 512).png().toFile(path.join(__dirname, 'icon.png'));
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const pngs = await Promise.all(sizes.map(s => sharp(svg).resize(s, s).png().toBuffer()));
  fs.writeFileSync(path.join(__dirname, 'icon.ico'), await pngToIco(pngs));
  console.log('icon.png + icon.ico hotovo');
})().catch(e => { console.error(e); process.exit(1); });
