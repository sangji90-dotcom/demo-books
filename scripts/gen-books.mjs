/**
 * 데모용 도서 데이터·표지 생성기.
 *
 *   node scripts/gen-books.mjs
 *
 * 실제 납품 시에는 고객사 도서 데이터와 표지 이미지로 전부 교체합니다.
 * (책이 50권이면 손으로 md를 쓰지 않고 `npm run import` 로 엑셀을 변환하세요)
 *
 * 표지는 책마다 반드시 달라야 합니다 — 같은 그림이 나오면 Astro가
 * 이미지를 하나로 합쳐 버려서 목록의 책이 전부 같아 보입니다.
 * 카테고리 색 + 제목 글자 + 책마다 다른 장식으로 구분합니다.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { BOOKS, CATEGORY_STYLE, CATEGORY_AUDIENCE } from './books-data.mjs';

const PUBLISHER = '물결서가';

const assetsDir = new URL('../src/assets/products/', import.meta.url).pathname;
const contentDir = new URL('../src/content/products/', import.meta.url).pathname;
rmSync(assetsDir, { recursive: true, force: true });
rmSync(contentDir, { recursive: true, force: true });
mkdirSync(assetsDir, { recursive: true });
mkdirSync(contentDir, { recursive: true });

const W = 800;
const H = 1200; // 2:3 — 국내 단행본 표지 비율에 가깝습니다

/** 한글은 자동 줄바꿈이 없으므로 글자 수로 끊습니다 */
function wrap(text, perLine) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if ([...next].length > perLine && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** YAML 안전 문자열 — 콜론·따옴표가 있어도 frontmatter가 깨지지 않게 */
function yaml(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/**
 * 책마다 다른 장식.
 * 같은 카테고리 안에서도 index 에 따라 위치·개수가 달라집니다.
 */
function ornament(mark, i, ink) {
  const o = `${ink}`;
  // 제목 윗단(552 - 74 = 478)과 겹치지 않도록 장식은 420 아래로 내려오지 않게 둡니다
  const y = 330 + (i % 5) * 15;
  switch (mark) {
    case 'rule':
      return `<line x1="90" y1="${y}" x2="${260 + (i % 4) * 90}" y2="${y}"
                    stroke="${o}" stroke-width="3" opacity="0.7"/>`;
    case 'dot':
      return Array.from({ length: 3 + (i % 4) }, (_, k) =>
        `<circle cx="${100 + k * 46}" cy="${y}" r="${7 + (i % 3) * 2}" fill="${o}" opacity="0.55"/>`
      ).join('');
    case 'frame':
      return `<rect x="88" y="${y - 26}" width="${240 + (i % 3) * 110}" height="52"
                    fill="none" stroke="${o}" stroke-width="3" opacity="0.6"/>`;
    case 'grid':
      return Array.from({ length: 4 + (i % 3) }, (_, k) =>
        `<line x1="${96 + k * 52}" y1="${y - 30}" x2="${96 + k * 52}" y2="${y + 30}"
               stroke="${o}" stroke-width="2" opacity="0.5"/>`
      ).join('');
    case 'bar':
      return Array.from({ length: 3 + (i % 3) }, (_, k) =>
        `<rect x="92" y="${y - 24 + k * 18}" width="${90 + ((i + k) % 5) * 58}" height="8"
               fill="${o}" opacity="${0.35 + k * 0.12}"/>`
      ).join('');
    default:
      return '';
  }
}

let made = 0;

for (const [i, book] of BOOKS.entries()) {
  const [
    slug, title, author, cat, pages, year, month, listPrice,
    summary, intro, tags, translator, badge, featured,
  ] = book;

  const style = CATEGORY_STYLE[cat];

  // ---------- 표지 ----------
  const titleLines = wrap(title, 9);
  const titleSize = titleLines.length > 2 ? 62 : 74;
  const titleTop = 552;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="${style.from}"/>
        <stop offset="100%" stop-color="${style.to}"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>

    ${/* 책등 쪽 음영 — 표지처럼 보이게 하는 최소한의 장치 */ ''}
    <rect width="26" height="${H}" fill="rgba(0,0,0,0.18)"/>

    ${ornament(style.mark, i, style.ink)}

    ${titleLines
      .map(
        (line, k) => `<text x="90" y="${titleTop + k * (titleSize + 16)}"
        font-family="Noto Serif CJK KR, serif" font-size="${titleSize}" font-weight="700"
        fill="${style.ink}">${escapeXml(line)}</text>`
      )
      .join('')}

    <text x="90" y="${titleTop + titleLines.length * (titleSize + 16) + 46}"
          font-family="Noto Sans CJK KR, sans-serif" font-size="30"
          fill="${style.ink}" opacity="0.8">${escapeXml(author)}${
            translator ? ` 지음 · ${escapeXml(translator)} 옮김` : ' 지음'
          }</text>

    <line x1="90" y1="${H - 150}" x2="${W - 90}" y2="${H - 150}"
          stroke="${style.ink}" stroke-width="2" opacity="0.35"/>
    <text x="90" y="${H - 104}" font-family="Noto Serif CJK KR, serif" font-size="28"
          fill="${style.ink}" opacity="0.75" letter-spacing="4">${PUBLISHER}</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${assetsDir}${slug}.jpg`);

  // ---------- 가격 ----------
  // 도서정가제상 가격할인 상한이 정가의 10% 입니다.
  // 할인율은 화면에서 자동 계산되므로 판매가만 정확히 넣으면 됩니다.
  const price = Math.round((listPrice * 0.9) / 10) * 10;

  // ---------- 본문 ----------
  const audience = CATEGORY_AUDIENCE[cat]
    .map((line) => `- ${line}`)
    .join('\n');

  const body = `## 책 소개

${intro}

## 이런 분께 권합니다

${audience}

## 지은이

${author}${translator ? ` (옮긴이 ${translator})` : ''}. ${PUBLISHER}에서 펴낸 책입니다.
`;

  // ---------- frontmatter ----------
  const specs = [
    ['지은이', author],
    ...(translator ? [['옮긴이', translator]] : []),
    ['출판사', PUBLISHER],
    ['출간일', `${year}년 ${String(month).padStart(2, '0')}월`],
    ['쪽수', `${pages}쪽`],
    ['판형', i % 3 === 0 ? '128 × 188 mm' : '140 × 205 mm'],
    // 데모용 가짜 번호입니다. 실제 ISBN이 아닙니다.
    ['ISBN', `979-11-00000-${String(i + 1).padStart(2, '0')}-0`],
  ];

  const front = [
    '---',
    `title: ${yaml(title)}`,
    `summary: ${yaml(summary)}`,
    `category: ${cat}`,
    `thumbnail: ../../assets/products/${slug}.jpg`,
    'specs:',
    ...specs.map(([k, v]) => `  ${yaml(k)}: ${yaml(v)}`),
    `tags: [${[...tags, ...(translator ? [translator] : [])].map(yaml).join(', ')}]`,
    `price: ${price}`,
    `listPrice: ${listPrice}`,
    ...(badge ? [`badge: ${yaml(badge)}`] : []),
    'externalLinks:',
    // 데모라 실존 서점으로 보내지 않습니다.
    // example.com 은 예시 전용으로 지정된 도메인이라 오인될 일이 없습니다.
    '  - label: "구매 페이지로 이동"',
    '    url: "https://example.com/"',
    `featured: ${featured ? 'true' : 'false'}`,
    `order: ${i + 1}`,
    'draft: false',
    '---',
    '',
    body,
  ].join('\n');

  writeFileSync(`${contentDir}${slug}.md`, front, 'utf8');
  made += 1;
}

// ---------- OG 이미지 ----------
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#33485c"/><stop offset="100%" stop-color="#1c2836"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <line x1="80" y1="250" x2="420" y2="250" stroke="#f3efe7" stroke-width="3" opacity="0.6"/>
  <text x="80" y="350" font-family="Noto Serif CJK KR, serif" font-size="76"
        font-weight="700" fill="#f3efe7">${PUBLISHER}</text>
  <text x="80" y="418" font-family="Noto Sans CJK KR, sans-serif" font-size="32"
        fill="rgba(243,239,231,0.8)">한 해 스무 권, 오래 읽히는 책을 만듭니다</text>
</svg>`;
await sharp(Buffer.from(og))
  .png()
  .toFile(new URL('../public/og-default.png', import.meta.url).pathname);

// ---------- 기획전 배너 ----------
const promo = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="500">
  <defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="0.6">
    <stop offset="0%" stop-color="#1c2836"/><stop offset="100%" stop-color="#4d6579"/>
  </linearGradient></defs>
  <rect width="1600" height="500" fill="url(#p)"/>
  ${Array.from({ length: 7 }, (_, k) =>
    `<rect x="${1010 + k * 78}" y="${150 + (k % 3) * 24}" width="58" height="${
      220 - (k % 3) * 30
    }" rx="4" fill="rgba(243,239,231,${0.1 + (k % 4) * 0.05})"/>`
  ).join('')}
</svg>`;
await sharp(Buffer.from(promo))
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(new URL('../public/promo-books.jpg', import.meta.url).pathname);

console.log(`도서 ${made}권의 md와 표지, OG·기획전 이미지를 생성했습니다.`);
