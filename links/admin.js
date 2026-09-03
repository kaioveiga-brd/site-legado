/**
 * LEGADO BRANDING — Admin Drag-and-Drop Editor Engine
 * Full reactivity, live preview sync, and multiple persistence tiers.
 */

// Master Default Configuration
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

let currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
let draggedIndex = null;

// Available 3D Backgrounds Preset Options
const BG_OPTIONS = [
  { label: "3D Destaque (Monólito & Cilindro Esculpido)", value: "assets/3d-destaque.jpg" },
  { label: "3D Contato (Espiral em Rocha Basalto)", value: "assets/3d-card-contact.jpg" },
  { label: "3D Comunidade (Anfiteatro Circular & Pilares)", value: "assets/3d-card-community.jpg" },
  { label: "3D Artigos (Esferas & Degraus Geométricos)", value: "assets/3d-card-articles.jpg" },
  { label: "3D Agenda (Relógio de Sol em Pedra)", value: "assets/3d-card-agenda.jpg" }
];

// Available Icons Preset Options
const ICON_OPTIONS = [
  { label: "Globo (Site Oficial)", value: "globe" },
  { label: "Chat / WhatsApp", value: "message-circle" },
  { label: "Comunidade / Pessoas", value: "users" },
  { label: "Livro / Artigos", value: "book-open" },
  { label: "Calendário / Agenda", value: "calendar" },
  { label: "Seta Direita", value: "arrow-right" }
];

/**
 * Check Authentication
 */
function initAuth() {
  const authOverlay = document.getElementById('authOverlay');
  const authInput = document.getElementById('authPassword');
  const authBtn = document.getElementById('authSubmit');
  const authError = document.getElementById('authError');

  // Check if session is already unlocked
  if (sessionStorage.getItem('legado_admin_auth') === 'true') {
    authOverlay.style.display = 'none';
    return;
  }

  function handleLogin() {
    const entered = authInput.value.trim();
    // Default master password
    if (entered === 'legado2026' || entered === 'legado' || entered === 'admin') {
      sessionStorage.setItem('legado_admin_auth', 'true');
      authOverlay.style.display = 'none';
    } else {
      authError.textContent = 'Senha incorreta. Tente novamente.';
      authInput.focus();
    }
  }

  authBtn.addEventListener('click', handleLogin);
  authInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
}

/**
 * Load Initial Configuration
 */
async function loadInitialData() {
  const localSaved = localStorage.getItem('legado_links_config');
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      if (parsed && parsed.blocks) {
        const grupo = parsed.blocks.find(b => b.id === 'block-grupo');
        if (grupo) {
          grupo.logoImg = 'assets/logo-marcas-negocios.png';
        }
        const agenda = parsed.blocks.find(b => b.id === 'block-agenda');
        if (agenda && (!agenda.url || agenda.url === 'https://calendar.google.com')) {
          agenda.url = 'https://calendar.app.google/TMKVBqm6VCWdFixg6';
        }
        currentConfig = parsed;
        return;
      }
    } catch (e) {
      console.warn("Invalid localStorage data:", e);
    }
  }

  try {
    const res = await fetch('links-data.json?v=' + Date.now());
    if (res.ok) {
      const remote = await res.json();
      currentConfig = remote;
      return;
    }
  } catch (err) {
    console.info("Using embedded default config:", err);
  }

  currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

/**
 * Populate Hero & Footer Form Fields
 */
function populateFormFields() {
  // Hero fields
  const hero = currentConfig.hero || {};
  document.getElementById('heroPrefix').value = hero.titlePrefix || '';
  document.getElementById('heroHighlight').value = hero.titleHighlight || '';
  document.getElementById('heroSuffix').value = hero.titleSuffix || '';
  document.getElementById('heroSubtitle').value = hero.subtitle || '';
  document.getElementById('heroTags').value = (hero.tags || []).join(', ');
  document.getElementById('heroPhotoUrl').value = hero.photoUrl || '';

  // Footer fields
  const footer = currentConfig.footer || {};
  document.getElementById('footerCopyright').value = footer.copyright || '';
  
  const social = footer.social || [];
  const ig = social.find(s => s.icon === 'instagram') || {};
  const inLink = social.find(s => s.icon === 'linkedin') || {};
  const mail = social.find(s => s.icon === 'mail') || {};

  document.getElementById('socialInstagram').value = ig.url || '';
  document.getElementById('socialLinkedin').value = inLink.url || '';
  document.getElementById('socialEmail').value = mail.url || '';
}

/**
 * Render Blocks Editor List with Drag and Drop
 */
function renderBlocksEditor() {
  const listEl = document.getElementById('blocksEditorList');
  if (!listEl) return;

  listEl.innerHTML = '';

  currentConfig.blocks.forEach((block, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'block-item';
    itemEl.dataset.index = index;
    itemEl.draggable = true;

    const isFeatured = !!block.featured;
    const isActive = block.active !== false;

    itemEl.innerHTML = `
      <div class="block-item-header" onclick="toggleBlockAccordion(${index})">
        <div class="block-item-left">
          <div class="drag-handle" title="Arraste para reordenar" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="9" cy="6" r="1.5"></circle><circle cx="15" cy="6" r="1.5"></circle><circle cx="9" cy="12" r="1.5"></circle><circle cx="15" cy="12" r="1.5"></circle><circle cx="9" cy="18" r="1.5"></circle><circle cx="15" cy="18" r="1.5"></circle></svg>
          </div>
          <span class="block-item-title">${escapeHtml(block.title || 'Sem título')}</span>
          ${isFeatured ? '<span class="block-item-badge featured">★ Destaque</span>' : ''}
          ${!isActive ? '<span class="block-item-badge" style="background: rgba(231,76,60,0.2); color:#FF6B6B;">Oculto</span>' : ''}
        </div>

        <div class="block-item-right" onclick="event.stopPropagation()">
          <button class="btn btn-ghost" style="padding: 4px;" title="Excluir Bloco" onclick="deleteBlock(${index})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: #FF6B6B;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
          <div style="color: var(--branco-mutado); transform: rotate(0deg); transition: transform 0.2s;" id="chevron-${index}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </div>

      <div class="block-item-body ${index === 0 ? '' : 'hidden'}" id="body-${index}">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">Título do Bloco</label>
            <input type="text" class="form-input" value="${escapeHtml(block.title || '')}" oninput="updateBlockField(${index}, 'title', this.value)">
          </div>

          <div class="form-group full-width">
            <label class="form-label">Logo em Imagem no Card (opcional, substitui o texto do título)</label>
            <input type="text" class="form-input" placeholder="ex: assets/logo-marcas-negocios.png" value="${escapeHtml(block.logoImg || '')}" oninput="updateBlockField(${index}, 'logoImg', this.value)">
          </div>

          <div class="form-group full-width">
            <label class="form-label">Descrição / Subtítulo</label>
            <textarea class="form-textarea" oninput="updateBlockField(${index}, 'description', this.value)">${escapeHtml(block.description || '')}</textarea>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Link de Destino (URL)</label>
            <input type="text" class="form-input" value="${escapeHtml(block.url || '')}" oninput="updateBlockField(${index}, 'url', this.value)">
          </div>

          <div class="form-group">
            <label class="form-label">Texto da Ação / Botão</label>
            <input type="text" class="form-input" value="${escapeHtml(block.buttonText || '')}" oninput="updateBlockField(${index}, 'buttonText', this.value)">
          </div>

          <div class="form-group">
            <label class="form-label">Selo / Badge (opcional)</label>
            <input type="text" class="form-input" placeholder="ex: COMUNIDADE, CONTEÚDO" value="${escapeHtml(block.badge || '')}" oninput="updateBlockField(${index}, 'badge', this.value)">
          </div>

          <div class="form-group">
            <label class="form-label">Ícone do Bloco</label>
            <select class="form-select" onchange="updateBlockField(${index}, 'icon', this.value)">
              ${ICON_OPTIONS.map(opt => `<option value="${opt.value}" ${block.icon === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Textura 3D de Fundo</label>
            <select class="form-select" onchange="updateBlockField(${index}, 'bgImage', this.value)">
              ${BG_OPTIONS.map(opt => `<option value="${opt.value}" ${block.bgImage === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="border-top: 1px solid var(--borda); padding-top: 10px; margin-top: 6px;">
          <div class="toggle-row">
            <span class="toggle-label">
              ★ Bloco em Destaque (Largura Total + Glow Laranja)
            </span>
            <label class="switch">
              <input type="checkbox" ${isFeatured ? 'checked' : ''} onchange="toggleBlockFeatured(${index}, this.checked)">
              <span class="slider"></span>
            </label>
          </div>

          <div class="toggle-row">
            <span class="toggle-label">
              Visível na Página Pública
            </span>
            <label class="switch">
              <input type="checkbox" ${isActive ? 'checked' : ''} onchange="toggleBlockActive(${index}, this.checked)">
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    `;

    // Attach Drag and Drop Events
    attachDragEvents(itemEl, index);
    listEl.appendChild(itemEl);
  });
}

/**
 * Drag and Drop Mechanics
 */
function attachDragEvents(itemEl, index) {
  itemEl.addEventListener('dragstart', (e) => {
    draggedIndex = index;
    itemEl.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
  });

  itemEl.addEventListener('dragend', () => {
    itemEl.classList.remove('is-dragging');
    document.querySelectorAll('.block-item').forEach(el => el.classList.remove('drag-over'));
  });

  itemEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    itemEl.classList.add('drag-over');
  });

  itemEl.addEventListener('dragleave', () => {
    itemEl.classList.remove('drag-over');
  });

  itemEl.addEventListener('drop', (e) => {
    e.preventDefault();
    itemEl.classList.remove('drag-over');

    const targetIndex = Number(itemEl.dataset.index);
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      // Reorder blocks in currentConfig
      const movedItem = currentConfig.blocks.splice(draggedIndex, 1)[0];
      currentConfig.blocks.splice(targetIndex, 0, movedItem);

      // Re-render editor and update live preview
      renderBlocksEditor();
      syncLivePreview();
      showToast("Ordem dos blocos atualizada!");
    }
    draggedIndex = null;
  });
}

/**
 * Accordion Expand/Collapse
 */
window.toggleBlockAccordion = function(index) {
  const body = document.getElementById(`body-${index}`);
  const chevron = document.getElementById(`chevron-${index}`);
  if (body) {
    const isHidden = body.classList.toggle('hidden');
    if (chevron) {
      chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
    }
  }
};

/**
 * Update Individual Block Fields
 */
window.updateBlockField = function(index, field, value) {
  if (currentConfig.blocks[index]) {
    currentConfig.blocks[index][field] = value;
    syncLivePreview();
  }
};

/**
 * Toggle Block Destaque
 */
window.toggleBlockFeatured = function(index, checked) {
  if (currentConfig.blocks[index]) {
    currentConfig.blocks[index].featured = checked;
    renderBlocksEditor();
    syncLivePreview();
  }
};

/**
 * Toggle Block Active
 */
window.toggleBlockActive = function(index, checked) {
  if (currentConfig.blocks[index]) {
    currentConfig.blocks[index].active = checked;
    renderBlocksEditor();
    syncLivePreview();
  }
};

/**
 * Add New Block
 */
window.addNewBlock = function() {
  const newBlock = {
    id: "block-" + Date.now(),
    active: true,
    featured: false,
    badge: "NOVO",
    icon: "globe",
    title: "Novo Botão",
    description: "Descrição breve da ação ou conteúdo.",
    buttonText: "Acessar",
    buttonType: "arrow",
    url: "https://legadobranding.com.br",
    bgImage: "assets/3d-card-articles.jpg"
  };

  currentConfig.blocks.push(newBlock);
  renderBlocksEditor();
  syncLivePreview();
  showToast("Novo bloco adicionado!");

  // Expand the newly added block
  setTimeout(() => {
    const lastIndex = currentConfig.blocks.length - 1;
    const body = document.getElementById(`body-${lastIndex}`);
    if (body) body.classList.remove('hidden');
  }, 50);
};

/**
 * Delete Block
 */
window.deleteBlock = function(index) {
  const title = currentConfig.blocks[index].title || 'este bloco';
  if (confirm(`Tem certeza que deseja excluir "${title}"?`)) {
    currentConfig.blocks.splice(index, 1);
    renderBlocksEditor();
    syncLivePreview();
    showToast("Bloco excluído.");
  }
};

/**
 * Sync Hero Form Changes
 */
function attachHeroListeners() {
  function readHero() {
    currentConfig.hero = {
      titlePrefix: document.getElementById('heroPrefix').value,
      titleHighlight: document.getElementById('heroHighlight').value,
      titleSuffix: document.getElementById('heroSuffix').value,
      subtitle: document.getElementById('heroSubtitle').value,
      tags: document.getElementById('heroTags').value.split(',').map(s => s.trim()).filter(Boolean),
      photoUrl: document.getElementById('heroPhotoUrl').value
    };
    syncLivePreview();
  }

  ['heroPrefix', 'heroHighlight', 'heroSuffix', 'heroSubtitle', 'heroTags', 'heroPhotoUrl'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', readHero);
  });
}

/**
 * Sync Footer Form Changes
 */
function attachFooterListeners() {
  function readFooter() {
    currentConfig.footer = {
      copyright: document.getElementById('footerCopyright').value,
      social: [
        { name: "Instagram", url: document.getElementById('socialInstagram').value, icon: "instagram" },
        { name: "LinkedIn", url: document.getElementById('socialLinkedin').value, icon: "linkedin" },
        { name: "E-mail", url: document.getElementById('socialEmail').value, icon: "mail" }
      ]
    };
    syncLivePreview();
  }

  ['footerCopyright', 'socialInstagram', 'socialLinkedin', 'socialEmail'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', readFooter);
  });
}

/**
 * Sync Live Preview Iframe
 */
function syncLivePreview() {
  // Save draft state to localStorage so preview iframe picks it up immediately
  localStorage.setItem('legado_links_config', JSON.stringify(currentConfig));

  const iframe = document.getElementById('previewIframe');
  if (iframe && iframe.contentWindow) {
    try {
      // If same domain, call render directly or reload iframe
      if (iframe.contentWindow.renderPage) {
        iframe.contentWindow.renderPage(currentConfig);
      } else {
        iframe.contentWindow.location.reload();
      }
    } catch (e) {
      // Cross-origin fallback reload
      iframe.src = 'index.html?t=' + Date.now();
    }
  }
}

/**
 * Save Configuration Permanently to Browser LocalStorage
 */
window.saveConfig = function() {
  localStorage.setItem('legado_links_config', JSON.stringify(currentConfig));
  syncLivePreview();
  showToast("Rascunho salvo no navegador! Clique em 'Publicar no Site' para colocar no ar.");
};

/**
 * Open/Close GitHub Publish Modal
 */
window.publishToSite = function() {
  const token = localStorage.getItem('legado_github_pat');
  const modal = document.getElementById('githubModal');
  const input = document.getElementById('githubTokenInput');
  const status = document.getElementById('githubPublishStatus');
  if (status) status.innerHTML = '';
  
  if (!token) {
    if (modal) modal.style.display = 'flex';
    if (input) input.focus();
  } else {
    executeGitHubPublish();
  }
};

window.closeGitHubModal = function() {
  const modal = document.getElementById('githubModal');
  if (modal) modal.style.display = 'none';
};

/**
 * Execute Direct Publish via GitHub API (Dispatches commit to main, which Vercel auto-deploys)
 */
window.executeGitHubPublish = async function() {
  const input = document.getElementById('githubTokenInput');
  let token = input ? input.value.trim() : '';
  if (!token) {
    token = localStorage.getItem('legado_github_pat') || '';
  }

  if (!token) {
    const status = document.getElementById('githubPublishStatus');
    if (status) status.innerHTML = '<span style="color:#FF6B6B;">Insira o seu token do GitHub.</span>';
    return;
  }

  const btn = document.getElementById('btnConfirmPublish');
  const btnTop = document.getElementById('btnPublish');
  if (btn) btn.disabled = true;
  if (btnTop) btnTop.disabled = true;

  const status = document.getElementById('githubPublishStatus');
  if (status) status.innerHTML = '<span style="color:var(--laranja);">Conectando ao GitHub e publicando...</span>';

  try {
    const repo = 'kaioveiga-brd/site-legado';
    const path = 'links/links-data.json';
    const getUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

    // 1. Get current file SHA
    const getRes = await fetch(getUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (getRes.status === 401 || getRes.status === 403) {
      throw new Error('Token do GitHub inválido ou sem permissão de escrita no repositório.');
    }

    let sha = null;
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }

    // 2. Prepare content Base64 (supporting Unicode UTF-8)
    const jsonStr = JSON.stringify(currentConfig, null, 2);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    const b64 = btoa(binary);

    // 3. Commit to GitHub
    const putRes = await fetch(getUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: 'feat(links): update links tree configuration via admin editor',
        content: b64,
        sha: sha || undefined
      })
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      throw new Error(errData.message || 'Erro ao enviar commit ao GitHub.');
    }

    // Save token if successful
    localStorage.setItem('legado_github_pat', token);
    localStorage.setItem('legado_links_config', JSON.stringify(currentConfig));

    closeGitHubModal();
    showToast("🚀 Publicado no GitHub! A Vercel atualizará o site em ~15 segundos.");

  } catch (err) {
    if (status) {
      status.innerHTML = `<span style="color:#FF6B6B;">${escapeHtml(err.message)}</span>`;
    }
    showToast("Erro ao publicar: " + err.message);
  } finally {
    if (btn) btn.disabled = false;
    if (btnTop) btnTop.disabled = false;
  }
};

/**
 * Copy JSON to Clipboard
 */
window.copyConfigJson = function() {
  const jsonStr = JSON.stringify(currentConfig, null, 2);
  navigator.clipboard.writeText(jsonStr).then(() => {
    showToast("JSON copiado para a área de transferência!");
  }).catch(() => {
    prompt("Copie a configuração abaixo:", jsonStr);
  });
};

/**
 * Download links-data.json File
 */
window.downloadConfigJson = function() {
  const jsonStr = JSON.stringify(currentConfig, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'links-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Download do links-data.json concluído!");
};

/**
 * Reset to Default Configuration
 */
window.resetConfig = function() {
  if (confirm("Deseja restaurar a árvore de links para as configurações originais da Legado? Todas as alterações personalizadas serão redefinidas.")) {
    currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    localStorage.removeItem('legado_links_config');
    populateFormFields();
    renderBlocksEditor();
    syncLivePreview();
    showToast("Configurações originais restauradas.");
  }
};

/**
 * Mobile Tabs Switcher
 */
window.switchTab = function(tabName) {
  const editorPane = document.getElementById('editorPane');
  const previewPane = document.getElementById('previewPane');
  const tabEditor = document.getElementById('tabEditor');
  const tabPreview = document.getElementById('tabPreview');

  if (tabName === 'editor') {
    editorPane.classList.remove('hidden-tab');
    previewPane.classList.remove('active-tab');
    tabEditor.classList.add('active');
    tabPreview.classList.remove('active');
  } else {
    editorPane.classList.add('hidden-tab');
    previewPane.classList.add('active-tab');
    tabEditor.classList.remove('active');
    tabPreview.classList.add('active');
    syncLivePreview();
  }
};

/**
 * Toast Notification
 */
function showToast(msg) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#E05A1C" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${escapeHtml(msg)}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * Escape HTML
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
  initAuth();
  await loadInitialData();
  populateFormFields();
  renderBlocksEditor();
  attachHeroListeners();
  attachFooterListeners();

  // Initial preview sync
  setTimeout(() => {
    syncLivePreview();
  }, 300);
});
