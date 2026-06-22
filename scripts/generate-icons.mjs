import sharp from 'sharp'
import { mkdirSync } from 'fs'

mkdirSync('public/icons', { recursive: true })

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed"/>
      <stop offset="100%" style="stop-color:#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <g transform="translate(256,256)" fill="white">
    <path d="M-60,-80 L-60,0 L-20,-40 L20,0 L20,-80 Z" opacity="0.9"/>
    <path d="M-80,20 L80,20 L80,60 L-80,60 Z" opacity="0.7"/>
    <path d="M-60,70 L60,70 L60,90 L-60,90 Z" opacity="0.5"/>
    <circle cx="50" cy="-50" r="20" opacity="0.8"/>
  </g>
</svg>`

const sizes = [192, 512]

for (const size of sizes) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(`public/icons/icon-${size}x${size}.png`)
  console.log(`Generated icon-${size}x${size}.png`)
}
