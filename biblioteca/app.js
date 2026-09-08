/**
 * MARCAS & NEGÓCIOS — BIBLIOTECA DE CONTEÚDOS
 * Lógica da aplicação: Renderização dinâmica, filtros por Expert/Tema, alternador de visão e leitor de PDF.
 */

// Dados iniciais estáticos
const INITIAL_DATA = {
  "comunidade": {
    "nome": "Marcas & Negócios",
    "whatsappUrl": "https://chat.whatsapp.com/KJsUH6EaHdsDIMR26JgLV2",
    "formularioUrl": "/marcas-negocios"
  },
  "edicoes": [
    {
      "id": "edicao-03",
      "numero": "03",
      "destaque": true,
      "badge": "NOVO • GUIA DA SEMANA",
      "titulo": "Alfredo Soares — O canal é você",
      "autor": "Alfredo Soares",
      "tema": "Vendas & Posicionamento",
      "subtitulo": "Como transformar a voz do fundador no maior ativo de diferenciação, autoridade e tração de negócios.",
      "capa": "assets/capa-edicao-03-alfredo-soares.png",
      "pdf": "assets/edicao-03-alfredo-soares-o-canal-e-voce.pdf",
      "data": "08 Set 2026",
      "tempoLeitura": "6 min",
      "paginas": 7
    },
    {
      "id": "edicao-02",
      "numero": "02",
      "destaque": false,
      "badge": "POSICIONAMENTO",
      "titulo": "Cristina Junqueira — Inimigo comum",
      "autor": "Cristina Junqueira",
      "tema": "Branding & Narrativa",
      "subtitulo": "O poder do contra-posicionamento: como polarizar com elegância e construir um exército de defensores da marca.",
      "capa": "assets/capa-edicao-02-cris-junqueira.png",
      "pdf": "assets/edicao-02-cris-junqueira-inimigo-comum.pdf",
      "data": "04 Set 2026",
      "tempoLeitura": "7 min",
      "paginas": 7
    },
    {
      "id": "edicao-01",
      "numero": "01",
      "destaque": false,
      "badge": "ESTRATÉGIA & GESTÃO",
      "titulo": "Flávio Augusto — O custo invisível",
      "autor": "Flávio Augusto",
      "tema": "Decisão & Valor",
      "subtitulo": "A matemática oculta do que você deixa na mesa ao adiar decisões difíceis e como construir relevância defensável.",
      "capa": "assets/capa-edicao-01-flavio-augusto.png",
      "pdf": "assets/edicao-01-flavio-augusto-o-custo-invisivel.pdf",
      "data": "02 Set 2026",
      "tempoLeitura": "6 min",
      "paginas": 7
    }
  ]
};

let edicoesState = [...INITIAL_DATA.edicoes];

// Estado dos filtros
let activeFilter = {
  type: 'all', // 'all', 'expert', 'tema'
  value: null
};
let currentSearchTerm = '';
let currentViewMode = localStorage.getItem('biblioteca_view_mode') || 'expanded';

// Elementos DOM
const edicoesListEl = document.getElementById('edicoesList');
const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const emptyStateEl = document.getElementById('emptyState');
const totalEdicoesCountEl = document.getElementById('totalEdicoesCount');
const countAllBadge = document.getElementById('countAllBadge');

// Elementos de Filtros & Dropdowns
const btnFilterAll = document.getElementById('btnFilterAll');
const btnFilterExperts = document.getElementById('btnFilterExperts');
const btnFilterTemas = document.getElementById('btnFilterTemas');
const expertsDropdown = document.getElementById('expertsDropdown');
const temasDropdown = document.getElementById('temasDropdown');
const expertsListItems = document.getElementById('expertsListItems');
const temasListItems = document.getElementById('temasListItems');
const expertBtnLabel = document.getElementById('expertBtnLabel');
const temaBtnLabel = document.getElementById('temaBtnLabel');
const activeFilterBanner = document.getElementById('activeFilterBanner');
const activeFilterText = document.getElementById('activeFilterText');

// Botões de Modo de Visualização
const viewExpandedBtn = document.getElementById('viewExpandedBtn');
const viewCompactBtn = document.getElementById('viewCompactBtn');

// Elementos do Modal de PDF
const pdfModal = document.getElementById('pdfModal');
const pdfModalTitle = document.getElementById('pdfModalTitle');
const pdfIframe = document.getElementById('pdfIframe');
const pdfDownloadBtn = document.getElementById('pdfDownloadBtn');
const pdfExternalBtn = document.getElementById('pdfExternalBtn');
const pdfModalClose = document.getElementById('pdfModalClose');

/**
 * Inicialização
 */
document.addEventListener('DOMContentLoaded', () => {
  initViewMode();
  renderFilterOptions();
  renderEdicoes();
  setupSearch();
  setupModalEvents();
  setupDropdownOutsideClick();
  fetchEdicoesJson();
  checkWelcomeMessage();
});

/**
 * Configuração do Modo de Visualização (Grade vs Expandido)
 */
function initViewMode() {
  setViewMode(currentViewMode, false);
}

function setViewMode(mode, save = true) {
  currentViewMode = mode;
  if (save) {
    localStorage.setItem('biblioteca_view_mode', mode);
  }

  if (mode === 'compact') {
    edicoesListEl.classList.add('compact-mode');
    viewCompactBtn.classList.add('active');
    viewExpandedBtn.classList.remove('active');
  } else {
    edicoesListEl.classList.remove('compact-mode');
    viewExpandedBtn.classList.add('active');
    viewCompactBtn.classList.remove('active');
  }
}

/**
 * Popula as opções dos dropdowns de Experts e Temas
 */
function renderFilterOptions() {
  if (countAllBadge) countAllBadge.textContent = edicoesState.length;
  if (totalEdicoesCountEl) totalEdicoesCountEl.textContent = edicoesState.length;

  // Extrair contagem de experts
  const expertCounts = {};
  const temaCounts = {};

  edicoesState.forEach(ed => {
    if (ed.autor) {
      expertCounts[ed.autor] = (expertCounts[ed.autor] || 0) + 1;
    }
    if (ed.tema) {
      temaCounts[ed.tema] = (temaCounts[ed.tema] || 0) + 1;
    }
  });

  // Renderiza itens no dropdown de Experts
  if (expertsListItems) {
    expertsListItems.innerHTML = '';
    Object.keys(expertCounts).forEach(expert => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `dropdown-item-btn ${activeFilter.type === 'expert' && activeFilter.value === expert ? 'selected' : ''}`;
      btn.innerHTML = `
        <span>${escapeHtml(expert)}</span>
        <span class="item-count">${expertCounts[expert]}</span>
      `;
      btn.onclick = () => selectFilter('expert', expert);
      expertsListItems.appendChild(btn);
    });
  }

  // Renderiza itens no dropdown de Temas
  if (temasListItems) {
    temasListItems.innerHTML = '';
    Object.keys(temaCounts).forEach(tema => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `dropdown-item-btn ${activeFilter.type === 'tema' && activeFilter.value === tema ? 'selected' : ''}`;
      btn.innerHTML = `
        <span>${escapeHtml(tema)}</span>
        <span class="item-count">${temaCounts[tema]}</span>
      `;
      btn.onclick = () => selectFilter('tema', tema);
      temasListItems.appendChild(btn);
    });
  }
}

/**
 * Alterna Dropdown aberto/fechado
 */
function toggleDropdown(dropdownId) {
  const target = document.getElementById(dropdownId);
  const isTargetOpen = target.classList.contains('show');

  closeAllDropdowns();

  if (!isTargetOpen) {
    target.classList.add('show');
    if (dropdownId === 'expertsDropdown') {
      btnFilterExperts.classList.add('open');
    } else if (dropdownId === 'temasDropdown') {
      btnFilterTemas.classList.add('open');
    }
  }
}

function closeAllDropdowns() {
  if (expertsDropdown) expertsDropdown.classList.remove('show');
  if (temasDropdown) temasDropdown.classList.remove('show');
  if (btnFilterExperts) btnFilterExperts.classList.remove('open');
  if (btnFilterTemas) btnFilterTemas.classList.remove('open');
}

function setupDropdownOutsideClick() {
  document.addEventListener('click', (e) => {
    const navSection = document.getElementById('navFilterSection');
    if (navSection && !navSection.contains(e.target)) {
      closeAllDropdowns();
    }
  });
}

/**
 * Seleção de Filtro (Expert ou Tema)
 */
function selectFilter(type, value) {
  activeFilter = { type, value };
  closeAllDropdowns();
  updateFilterUI();
  applyFilters();
}

function resetAllFilters() {
  activeFilter = { type: 'all', value: null };
  currentSearchTerm = '';
  if (searchInput) searchInput.value = '';
  if (searchClearBtn) searchClearBtn.style.display = 'none';
  closeAllDropdowns();
  updateFilterUI();
  applyFilters();
}

function updateFilterUI() {
  // Atualiza pills principais
  btnFilterAll.classList.toggle('active', activeFilter.type === 'all');
  btnFilterExperts.classList.toggle('active', activeFilter.type === 'expert');
  btnFilterTemas.classList.toggle('active', activeFilter.type === 'tema');

  expertBtnLabel.textContent = activeFilter.type === 'expert' ? activeFilter.value : 'Experts';
  temaBtnLabel.textContent = activeFilter.type === 'tema' ? activeFilter.value : 'Temas';

  // Banner de Filtro Ativo
  if (activeFilter.type !== 'all' || currentSearchTerm) {
    activeFilterBanner.classList.add('show');
    let label = '';
    if (activeFilter.type === 'expert') {
      label = `Expert: <strong>${escapeHtml(activeFilter.value)}</strong>`;
    } else if (activeFilter.type === 'tema') {
      label = `Tema: <strong>${escapeHtml(activeFilter.value)}</strong>`;
    }
    if (currentSearchTerm) {
      label += `${label ? ' + ' : ''}Busca: "<em>${escapeHtml(currentSearchTerm)}</em>"`;
    }
    activeFilterText.innerHTML = `Filtrando por: ${label}`;
  } else {
    activeFilterBanner.classList.remove('show');
  }

  renderFilterOptions();
}

/**
 * Aplica os Filtros e Renderiza a Lista
 */
function applyFilters() {
  let list = edicoesState;

  if (activeFilter.type === 'expert') {
    list = list.filter(ed => ed.autor === activeFilter.value);
  } else if (activeFilter.type === 'tema') {
    list = list.filter(ed => ed.tema === activeFilter.value);
  }

  if (currentSearchTerm) {
    list = list.filter(ed => {
      const t = (ed.titulo || '').toLowerCase();
      const a = (ed.autor || '').toLowerCase();
      const s = (ed.subtitulo || '').toLowerCase();
      const tm = (ed.tema || '').toLowerCase();
      const n = (ed.numero || '').toLowerCase();

      return t.includes(currentSearchTerm) ||
             a.includes(currentSearchTerm) ||
             s.includes(currentSearchTerm) ||
             tm.includes(currentSearchTerm) ||
             n.includes(currentSearchTerm);
    });
  }

  renderEdicoes(list);
}

/**
 * Renderiza os cards das edições
 */
function renderEdicoes(list = edicoesState) {
  if (!edicoesListEl) return;
  edicoesListEl.innerHTML = '';

  if (list.length === 0) {
    if (emptyStateEl) emptyStateEl.style.display = 'block';
    return;
  }

  if (emptyStateEl) emptyStateEl.style.display = 'none';

  list.forEach(ed => {
    const card = document.createElement('article');
    card.className = `edition-card ${ed.destaque ? 'featured-card' : ''}`;
    card.id = ed.id;

    card.innerHTML = `
      <div class="card-cover-wrapper" onclick="openPdfModal('${ed.pdf}', '${escapeHtml(ed.titulo)}')">
        <img 
          src="${ed.capa}" 
          alt="${escapeHtml(ed.titulo)}" 
          class="card-cover-img"
          loading="lazy"
          onerror="this.src='../links/assets/3d-card-articles.jpg'"
        >
        <div class="card-cover-overlay"></div>
        
        <div class="card-top-badges">
          <span class="badge-edicao ${ed.destaque ? 'destaque' : ''}">${ed.badge || `EDIÇÃO #${ed.numero}`}</span>
          ${ed.tema ? `<span class="badge-tema">${escapeHtml(ed.tema)}</span>` : ''}
        </div>

        <div class="cover-quick-view">
          <div class="cover-quick-view-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Visualizar Guia</span>
          </div>
        </div>
      </div>

      <div class="card-content">
        <div class="card-title-row">
          <h2 class="card-title">${escapeHtml(ed.titulo)}</h2>
          <p class="card-subtitle">${escapeHtml(ed.subtitulo || '')}</p>
        </div>

        <div class="card-meta-row">
          <span class="card-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${escapeHtml(ed.tempoLeitura || '6 min')}
          </span>
          <span class="card-meta-dot">•</span>
          <span class="card-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            ${ed.paginas || 7} páginas
          </span>
          <span class="card-meta-dot">•</span>
          <span class="card-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${escapeHtml(ed.data || '')}
          </span>
        </div>

        <div class="card-actions">
          <button 
            type="button" 
            class="btn-read-pdf" 
            onclick="openPdfModal('${ed.pdf}', '${escapeHtml(ed.titulo)}')"
            title="Ler Guia no leitor integrado"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <span>Ler Guia Completo</span>
          </button>

          <a 
            href="${ed.pdf}" 
            download 
            class="btn-download-pdf" 
            title="Baixar PDF diretamente"
            onclick="event.stopPropagation();"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </a>
        </div>
      </div>
    `;

    edicoesListEl.appendChild(card);
  });
}

/**
 * Busca de Texto
 */
function setupSearch() {
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.trim().toLowerCase();
    if (searchClearBtn) {
      searchClearBtn.style.display = currentSearchTerm ? 'flex' : 'none';
    }
    updateFilterUI();
    applyFilters();
  });

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchTerm = '';
      searchClearBtn.style.display = 'none';
      updateFilterUI();
      applyFilters();
      searchInput.focus();
    });
  }
}

/**
 * Busca do JSON remoto para manter sincronizado
 */
async function fetchEdicoesJson() {
  try {
    const res = await fetch('edicoes.json?t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.edicoes)) {
        edicoesState = data.edicoes;
        renderFilterOptions();
        applyFilters();
      }
    }
  } catch (e) {
    console.log('Utilizando cache padrão de edições');
  }
}

/**
 * Leitor e Modal de PDF
 */
function openPdfModal(pdfUrl, title) {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 640;
  
  if (isMobile) {
    window.open(pdfUrl, '_blank');
    return;
  }

  if (pdfModal && pdfIframe) {
    pdfModalTitle.textContent = title;
    pdfIframe.src = pdfUrl + '#toolbar=1&navpanes=0';
    pdfDownloadBtn.href = pdfUrl;
    pdfExternalBtn.href = pdfUrl;

    pdfModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    window.open(pdfUrl, '_blank');
  }
}

function closePdfModal() {
  if (pdfModal) {
    pdfModal.classList.remove('active');
    if (pdfIframe) pdfIframe.src = '';
    document.body.style.overflow = '';
  }
}

function setupModalEvents() {
  if (pdfModalClose) {
    pdfModalClose.addEventListener('click', closePdfModal);
  }

  if (pdfModal) {
    pdfModal.addEventListener('click', (e) => {
      if (e.target === pdfModal) {
        closePdfModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal && pdfModal.classList.contains('active')) {
      closePdfModal();
    }
  });
}

/**
 * Toast / Boas-vindas para leads vindos da Isca
 */
function checkWelcomeMessage() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('origem') === 'isca' || urlParams.get('desbloqueado') === '1') {
    showToast('Acesso liberado! Bem-vindo à biblioteca exclusiva.');
  }
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #181818;
    color: #F5F1EB;
    border: 1px solid #E05A1C;
    padding: 12px 20px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    box-shadow: 0 10px 30px rgba(0,0,0,0.7), 0 0 20px rgba(224,90,28,0.25);
    z-index: 2000;
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  toast.innerHTML = `
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#E05A1C;"></span>
    <span>${escapeHtml(msg)}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 100);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
