/**
 * ============================================================
 *  고객사별 교체 지점 #1 — 사이트 전역 설정
 * ============================================================
 *  새 고객사에 납품할 때 이 파일과 src/styles/tokens.css 두 개만
 *  바꾸면 브랜드 교체가 끝나도록 설계되어 있습니다.
 *  코드(컴포넌트/페이지)는 원칙적으로 건드리지 않습니다.
 * ============================================================
 */

import type {
  NavItem,
  Category,
  LayoutPreset,
  SiteConfig,
} from './src/lib/site-config.types';

// 기존 import 경로(`site.config` 에서 타입을 가져오던 곳)를 위해 다시 내보냅니다
export type { NavItem, Category, LayoutPreset, SiteConfig };

export const siteConfig: SiteConfig = {
  site: 'https://example.com',
  company: '물결서가',
  tagline: '한 해 스무 권',
  description:
    '물결서가는 소설·에세이·인문·과학·실용 분야의 책을 펴냅니다. 펴낸 책과 신간 소식을 살펴보세요.',
  logo: null,
  ogImage: '/og-default.png',
  lang: 'ko',

  layout: {
    // 책은 표지보다 제목·지은이가 먼저 읽혀야 해서 문구 중심 히어로
    hero: 'minimal',
    // 온라인 서점 목록처럼 좌측 표지 + 우측 서지정보
    productCard: 'list',
    // 표지는 세로로 긴 2:3
    imageRatio: '2:3',
    featured: 'grid',
    // 이 달의 책 → 기획전 → 분야 → 문의
    homeSections: ['featured', 'promo', 'categories', 'cta'],
  },

  nav: [
    { label: '전체 도서', href: '/products' },
    { label: '소설', href: '/products/category/novel' },
    { label: '에세이', href: '/products/category/essay' },
    { label: '인문·사회', href: '/products/category/humanities' },
    { label: '과학·기술', href: '/products/category/science' },
    { label: '출판사 소개', href: '/about' },
  ],

  utilityNav: {
    left: [{ label: '물결서가에 대하여', href: '/about/' }],
    right: [
      { label: '원고 투고', href: '/contact/' },
      { label: '도서 문의', href: '/contact/' },
      { label: '개인정보처리방침', href: '/privacy/' },
    ],
  },

  quickLinks: [
    { label: '도서 문의', href: '/contact/' },
    { label: '원고 투고', href: '/contact/' },
  ],

  terms: {
    item: '도서',
    unit: '권',
    featuredTitle: '이 달의 책',
    featuredDesc: '편집부가 먼저 권하는 네 권입니다.',
    categoriesDesc: '분야별로 살펴보세요.',
    ctaTitle: '찾는 책이 없으신가요?',
    ctaDesc: '절판·재쇄 문의나 단체 구입 상담을 남겨주시면 담당자가 안내해 드립니다.',
    searchPlaceholder: '책 제목·지은이 검색',
  },

  promo: {
    title: '2026 봄 신간 안내',
    description: '3월에 나온 다섯 권을 한자리에 모았습니다. 서점 입고 일정도 함께 안내합니다.',
    href: '/contact/',
    cta: '신간 안내받기',
    image: '/promo-books.jpg',
    keywords: ['장편소설', '에세이', '기후', '회계', '번역'],
  },

  /**
   * 제품 상세 "유의사항" 탭.
   * 모든 제품에 공통인 안내만 둡니다. 제품마다 다른 값은 specs 로 넣으세요.
   * 비우면 탭이 나오지 않습니다.
   */
  productNotice: {
    items: [
      '재고는 실시간이 아닙니다. 주문 전 재고 확인을 권합니다.',
      '정가와 판매가는 출판사 정책에 따라 변경될 수 있습니다.',
      '표지 이미지는 인쇄 쇄차에 따라 실물과 다를 수 있습니다.',
      '이 사이트에서는 결제가 이루어지지 않습니다. 견적과 계약은 별도로 진행됩니다.',
    ],
  },

  categories: [
    {
      id: 'novel',
      label: '소설',
      description: '한 권을 끝까지 읽게 만드는 이야기들입니다.',
    },
    {
      id: 'essay',
      label: '에세이',
      description: '짧게 끊어 읽어도 남는 글을 모았습니다.',
    },
    {
      id: 'humanities',
      label: '인문·사회',
      description: '지금 쓰이는 말과 제도를 다시 들여다봅니다.',
    },
    {
      id: 'science',
      label: '과학·기술',
      description: '전공자가 아니어도 끝까지 읽히는 책을 고릅니다.',
    },
    {
      id: 'practical',
      label: '경제·실용',
      description: '읽고 나서 다음 주에 바로 쓸 수 있는 책입니다.',
    },
  ],

  contact: {
    email: 'contact@example.com',
    phone: '02-0000-0000',
    address: '서울특별시 마포구 월드컵북로 000, 3층',
    businessNumber: '000-00-00000',
    ceo: '홍길동',
  },

  inquiry: {
    mode: 'external',
    // Google Forms → 보내기 → <> 탭의 iframe src 주소를 그대로 붙여넣습니다.
    embedUrl: 'https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true',
  },

  // 50권이라 한 번에 다 그리지 않고 끊어서 보여줍니다
  productsPerPage: 12,
  featuredCount: 4,
  enableSearch: true,

  verification: {
    // naver: 'abc123...',
    // google: 'xyz789...',
  },

  analytics: {
    // cloudflareToken: '0123456789abcdef...',
  },

  // 영업용 데모 공개 시 true. 실제 납품 시에는 반드시 false.
  demoBanner: {
    enabled: true,
    text: '이 사이트는 템플릿 시연용 데모입니다. 물결서가와 등장하는 책·지은이는 실재하지 않습니다.',
  },
};

export default siteConfig;
