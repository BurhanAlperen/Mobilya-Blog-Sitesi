/**
 * Konfor Tasarım Mobilya - Project Gallery & Modal Controller
 */
(function() {
  let currentCategory = 'all';
  let currentSearch = '';

  function renderProjects(containerId, isFeaturedOnly = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let list = [];
    if (isFeaturedOnly) {
      list = window.KonforStore ? window.KonforStore.getFeaturedProjects() : (window.KonforProjects || []).filter(p => p.featured);
    } else {
      list = window.KonforStore ? window.KonforStore.getProjects(currentCategory, currentSearch) : (window.KonforProjects || []);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
          <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 12px;">Bu kriterlere uygun proje bulunamadı.</p>
          <button class="btn btn-secondary btn-sm" onclick="KonforGallery.resetFilter()">Filtreleri Sıfırla</button>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(project => `
      <article class="project-card" data-id="${project.id}">
        <div class="project-thumb">
          <img src="${project.image}" alt="${project.title}" loading="lazy" />
          <span class="project-badge-type">${project.categoryLabel}</span>
          ${project.isReferenceConcept ? '<span class="project-badge-ref">Referans Konsept</span>' : ''}
        </div>
        <div class="project-body">
          <div class="project-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${project.location}</span>
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-scope">${project.scope}</p>
          <div class="project-materials-list">
            ${project.materials.slice(0, 3).map(m => `<span class="material-tag">${m}</span>`).join('')}
            ${project.materials.length > 3 ? `<span class="material-tag">+${project.materials.length - 3}</span>` : ''}
          </div>
          <div class="project-card-footer">
            <span style="font-size: 0.8rem; color: var(--text-muted);">${project.clientType}</span>
            <button type="button" class="project-details-btn" onclick="KonforGallery.openModal('${project.id}')">
              <span>İncele & Teklif Al</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  function initFilterBar() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('projectSearchInput');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category') || 'all';
        renderProjects('projectsGrid');
      });
    });

    searchInput?.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderProjects('projectsGrid');
    });
  }

  function openModal(projectId) {
    const project = window.KonforStore ? window.KonforStore.getProjectById(projectId) : (window.KonforProjects || []).find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const modalImage = document.getElementById('modalImage');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalLocation = document.getElementById('modalLocation');
    const modalYear = document.getElementById('modalYear');
    const modalScope = document.getElementById('modalScope');
    const modalSummary = document.getElementById('modalSummary');
    const modalMaterials = document.getElementById('modalMaterials');
    const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');

    if (modalImage) modalImage.src = project.image;
    if (modalCategory) modalCategory.textContent = project.categoryLabel;
    if (modalTitle) modalTitle.textContent = project.title;
    if (modalLocation) modalLocation.textContent = project.location;
    if (modalYear) modalYear.textContent = project.year;
    if (modalScope) modalScope.textContent = project.scope;
    if (modalSummary) modalSummary.textContent = project.summary;

    if (modalMaterials) {
      modalMaterials.innerHTML = project.materials.map(m => `
        <span class="material-tag" style="padding: 6px 12px; font-size: 0.85rem; background: var(--bg-surface); border-color: var(--border-medium);">${m}</span>
      `).join('');
    }

    if (modalWhatsAppBtn) {
      const text = encodeURIComponent(`Merhaba Selim Bey, sitenizde "${project.title}" projesini inceledim. Benzer bir proje için bilgi ve teklif almak istiyorum.`);
      modalWhatsAppBtn.href = `https://wa.me/905374303560?text=${text}`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('projectModal');
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Keyboard and outside click handling for modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
  });

  window.KonforGallery = {
    renderFeatured: () => renderProjects('featuredProjectsGrid', true),
    renderAll: () => {
      initFilterBar();
      renderProjects('projectsGrid', false);
    },
    openModal: openModal,
    closeModal: closeModal,
    resetFilter: () => {
      currentCategory = 'all';
      currentSearch = '';
      const searchInput = document.getElementById('projectSearchInput');
      if (searchInput) searchInput.value = '';
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-category') === 'all');
      });
      renderProjects('projectsGrid');
    }
  };
})();
