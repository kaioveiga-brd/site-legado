/**
 * LEGADO BRANDING — Dynamic Link Tree Renderer
 * Loads from localStorage or links-data.json, with offline fallback.
 */

// Embedded default fallback configuration
const DEFAULT_CONFIG = {
  hero: {
    titlePrefix: "Branding estratégico para marcas com ",
    titleHighlight: "direção",
    titleSuffix: ".",
    subtitle: "Revelamos o posicionamento que faz a marca vender, e traduzimos isso em estratégia, identidade e ativação.",
    tags: ["Estratégia", "Design", "Identidade"],
    photoUrl: "assets/kaio-photo.png"
  },
  blocks: [
    {
      id: "block-agenda",
      active: true,
      featured: true,
      badge: "VAGAS GRATUITAS LIMITADAS",
      icon: "calendar",
      title: "Agendar conversa",
      description: "Marque um horário pra gente falar sobre a sua marca e o seu próximo passo.",
      buttonText: "Agendar",
      buttonType: "arrow",
      url: "https://calendar.app.google/TMKVBqm6VCWdFixg6",
      bgImage: "assets/3d-card-community.jpg"
    },
    {
      id: "block-grupo",
      active: true,
      featured: true,
      badge: "COMUNIDADE",
      icon: "users",
      title: "Grupo Marcas e Negócios",
      description: "Conteúdo de marca e negócio para empresários que querem crescer, cobrar mais e sair da guerra de preço.",
      buttonText: "Preencha o formulário",
      buttonType: "arrow",
      url: "https://legadobranding.com.br/marcas-negocios",
      bgImage: "assets/3d-card-articles.jpg",
      logoImg: "assets/logo-marcas-negocios.png"
    },
    {
      id: "block-site",
      active: true,
      featured: false,
      badge: "★ DESTAQUE",
      icon: "globe",
      title: "Nosso site",
      description: "Conheça o método da Legado: como transformamos empresas em marcas que vendem, do posicionamento à ativação.",
      buttonText: "Acesse o site",
      buttonType: "circle-arrow",
      url: "https://legadobranding.com.br",
      bgImage: "assets/3d-destaque.jpg"
    },
    {
      id: "block-contato",
      active: true,
      featured: false,
      badge: "ORÇAMENTOS",
      icon: "message-circle",
      title: "Fale com a gente",
      description: "Vamos entender onde sua marca pode chegar. Chame no WhatsApp.",
      buttonText: "Enviar mensagem",
      buttonType: "arrow",
      url: "https://wa.me/5519989808383",
      bgImage: "assets/3d-card-contact.jpg"
    },
    {
      id: "block-artigos",
      active: true,
      featured: false,
      badge: "CONTEÚDO",
      icon: "book-open",
      title: "Artigos",
      description: "Ideias sobre marca, posicionamento e crescimento — para quem constrói negócio de verdade.",
      buttonText: "Acessar artigos",
      buttonType: "arrow",
      url: "https://www.linkedin.com/company/legadobranding/",
      bgImage: "assets/3d-card-articles.jpg"
    }
  ],
  footer: {
    copyright: "© 2026 Legado Studio. Todos os direitos reservados.",
    social: [
      { name: "Instagram", url: "https://instagram.com/studio.legado", icon: "instagram" },
      { name: "LinkedIn", url: "https://www.linkedin.com/company/legadobranding/", icon: "linkedin" },
      { name: "E-mail", url: "mailto:contato@legadobranding.com.br", icon: "mail" }
    ]
  }
};

// SVG Icons Dictionary
const ICONS = {
  "globe": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  "message-circle": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
  "users": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  "book-open": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
  "calendar": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  "arrow-right": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  "instagram": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
  "linkedin": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
  "mail": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  "lock": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`
};

/**
 * Load configuration from localStorage or links-data.json
 */
async function loadConfig() {
  const isPreview = window.self !== window.top || window.location.search.includes('preview=true');

  // 1. If in preview mode (iframe inside admin or ?preview=true), load from localStorage immediately
  if (isPreview) {
    const localSaved = localStorage.getItem('legado_links_config');
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        if (parsed && parsed.blocks) {
          return parsed;
        }
      } catch (e) {
        console.warn("Could not parse preview local config:", e);
      }
    }
  }

  // 2. Live page (Mobile / Public visitors): Always fetch fresh links-data.json from server
  try {
    const res = await fetch('links-data.json?v=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const remoteData = await res.json();
      return remoteData;
    }
  } catch (err) {
    console.info("Fetching links-data.json failed, falling back to local/default:", err);
  }

  // 3. Fallback to localStorage if offline, else DEFAULT_CONFIG
  const localSaved = localStorage.getItem('legado_links_config');
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      if (parsed && parsed.blocks) return parsed;
    } catch (e) {}
  }

  return DEFAULT_CONFIG;
}

/**
 * Render the entire link tree
 */
function renderPage(config) {
  renderHero(config.hero);
  renderBlocks(config.blocks);
  renderFooter(config.footer);
}

/**
 * Render Hero
 */
function renderHero(hero) {
  if (!hero) return;

  const avatarImg = document.getElementById('heroAvatarImg');
  if (avatarImg && hero.photoUrl) {
    avatarImg.src = hero.photoUrl;
  }

  const titleEl = document.getElementById('heroTitle');
  if (titleEl) {
    const prefix = hero.titlePrefix || "Branding estratégico para marcas com ";
    const highlight = hero.titleHighlight || "direção";
    const suffix = hero.titleSuffix || ".";
    titleEl.innerHTML = `${escapeHtml(prefix)}<span class="accent">${escapeHtml(highlight)}</span>${escapeHtml(suffix)}`;
  }

  const subEl = document.getElementById('heroSubtitle');
  if (subEl) {
    subEl.textContent = hero.subtitle || "";
  }

  const tagsEl = document.getElementById('heroTags');
  if (tagsEl && Array.isArray(hero.tags)) {
    tagsEl.innerHTML = hero.tags
      .map((tag, idx) => {
        const dot = idx > 0 ? `<span class="dot">•</span>` : '';
        return `${dot}<span>${escapeHtml(tag)}</span>`;
      })
      .join('');
  }
}

/**
 * Render Blocks (Featured full-width and 2-column grid)
 */
function renderBlocks(blocks) {
  const container = document.getElementById('blocksContainer');
  if (!container || !Array.isArray(blocks)) return;

  container.innerHTML = '';

  const activeBlocks = blocks.filter(b => b.active !== false);

  // Separate featured full-width blocks and grid blocks
  let gridCards = [];

  function flushGrid() {
    if (gridCards.length > 0) {
      const gridEl = document.createElement('div');
      gridEl.className = 'blocks-grid';
      gridCards.forEach(cardEl => gridEl.appendChild(cardEl));
      container.appendChild(gridEl);
      gridCards = [];
    }
  }

  activeBlocks.forEach(block => {
    if (block.featured) {
      // If we have accumulated grid cards before this featured card, flush them
      flushGrid();

      // Render Featured Full-Width Card
      const featuredCard = createFeaturedCard(block);
      container.appendChild(featuredCard);
    } else {
      // Create Grid Card
      const card = createGridCard(block);
      gridCards.push(card);
    }
  });

  // Flush any remaining grid cards
  flushGrid();
}

/**
 * Create a Featured (Full-Width) Card
 */
function createFeaturedCard(block) {
  const a = document.createElement('a');
  a.className = 'link-block featured';
  a.href = block.url || '#';
  a.target = block.url.startsWith('http') ? '_blank' : '_self';
  a.rel = 'noopener noreferrer';
  a.id = block.id || '';

  const bgStyle = block.bgImage ? `background-image: url('${block.bgImage}');` : '';

  a.innerHTML = `
    <div class="link-block-bg" style="${bgStyle}"></div>
    <div class="link-block-overlay"></div>
    <div class="link-block-inner">
      <div>
        ${block.badge ? `<div class="badge-destaque">${escapeHtml(block.badge)}</div>` : ''}
        <div class="featured-header-row" style="${block.badge ? 'margin-top: 10px;' : ''}">
          ${block.logoImg ? `
            <img src="${escapeHtml(block.logoImg)}" alt="${escapeHtml(block.title)}" style="height: 32px; width: auto; max-width: 230px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));">
          ` : `
            <h2 class="featured-title">${escapeHtml(block.title)}</h2>
          `}
          <div class="circular-arrow-btn">
            ${ICONS['arrow-right']}
          </div>
        </div>
        <p class="featured-desc">${escapeHtml(block.description || '')}</p>
      </div>

      <div class="featured-action-row">
        ${ICONS[block.icon] || ICONS['globe']}
        <span>${escapeHtml(block.buttonText || 'Acesse o site')}</span>
      </div>
    </div>
  `;

  return a;
}

/**
 * Create a Regular 2-Column Grid Card
 */
function createGridCard(block) {
  const a = document.createElement('a');
  a.className = 'link-block grid-card';
  a.href = block.url || '#';
  a.target = block.url.startsWith('http') ? '_blank' : '_self';
  a.rel = 'noopener noreferrer';
  a.id = block.id || '';

  const bgStyle = block.bgImage ? `background-image: url('${block.bgImage}');` : '';
  const iconSvg = ICONS[block.icon] || ICONS['message-circle'];

  a.innerHTML = `
    <div class="link-block-bg" style="${bgStyle}"></div>
    <div class="link-block-overlay"></div>
    <div class="link-block-inner">
      <div>
        <div class="card-top-row">
          <div class="card-icon-wrap">${iconSvg}</div>
          ${block.badge ? `<div class="card-badge-pill">${escapeHtml(block.badge)}</div>` : ''}
        </div>
        
        <div class="card-main-info">
          <div class="card-title-row">
            ${block.logoImg ? `
              <img src="${escapeHtml(block.logoImg)}" alt="${escapeHtml(block.title)}" class="card-title-logo">
            ` : `
              <h3 class="card-title">${escapeHtml(block.title)}</h3>
            `}
          </div>
          <p class="card-desc">${escapeHtml(block.description || '')}</p>
        </div>
      </div>

      <div class="card-bottom-row">
        <span class="card-action-text">${escapeHtml(block.buttonText || 'Acessar')}</span>
        <div class="circular-arrow-btn" style="width: 28px; height: 28px;">
          <div style="transform: scale(0.85); display: flex;">
            ${ICONS['arrow-right']}
          </div>
        </div>
      </div>
    </div>
  `;

  return a;
}

/**
 * Render Footer
 */
function renderFooter(footer) {
  if (!footer) return;

  const copyEl = document.getElementById('footerCopyright');
  if (copyEl) {
    copyEl.textContent = footer.copyright || '© 2026 Legado Studio. Todos os direitos reservados.';
  }

  const socialRow = document.getElementById('footerSocialRow');
  if (socialRow && Array.isArray(footer.social)) {
    socialRow.innerHTML = footer.social
      .map(item => `
        <a href="${escapeHtml(item.url)}" class="social-icon-circle" target="_blank" rel="noopener noreferrer" title="${escapeHtml(item.name)}" aria-label="${escapeHtml(item.name)}">
          ${ICONS[item.icon] || ICONS['globe']}
        </a>
      `)
      .join('');
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const config = await loadConfig();
    renderPage(config);
  } catch (e) {
    console.error("Initialization error:", e);
    renderPage(DEFAULT_CONFIG);
  }
});
