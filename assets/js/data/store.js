/**
 * Konfor Tasarım Mobilya - DataStore
 * Clean architecture data service designed for seamless transition
 * to future Admin Panel, CMS and Database APIs.
 */
(function() {
  const DataStore = {
    // Check if we are running in an HTTP environment or static file
    isHttp: window.location.protocol.startsWith('http'),

    async init() {
      // If served via HTTP, attempt to fetch latest JSON files; fallback to bundled data
      if (this.isHttp) {
        try {
          const [compRes, projRes, srvRes] = await Promise.all([
            fetch('/data/company.json').catch(() => null),
            fetch('/data/projects.json').catch(() => null),
            fetch('/data/services.json').catch(() => null)
          ]);
          if (compRes && compRes.ok) {
            const data = await compRes.json();
            window.KonforCompany = data.company || data;
          }
          if (projRes && projRes.ok) {
            window.KonforProjects = await projRes.json();
          }
          if (srvRes && srvRes.ok) {
            window.KonforServices = await srvRes.json();
          }
        } catch (e) {
          console.warn('Using bundled data fallback:', e);
        }
      }
      return true;
    },

    getCompany() {
      return window.KonforCompany || {};
    },

    getProjects(category = 'all', searchQuery = '') {
      let list = window.KonforProjects || [];
      if (category && category !== 'all') {
        list = list.filter(p => p.category === category);
      }
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        list = list.filter(p => 
          p.title.toLowerCase().includes(q) ||
          p.scope.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.materials.some(m => m.toLowerCase().includes(q))
        );
      }
      return list;
    },

    getFeaturedProjects() {
      const list = window.KonforProjects || [];
      return list.filter(p => p.featured);
    },

    getProjectById(id) {
      const list = window.KonforProjects || [];
      return list.find(p => p.id === id);
    },

    getServices() {
      return window.KonforServices || [];
    },

    getTeam() {
      return window.KonforTeam || {};
    },

    /**
     * Submit user project inquiry.
     * Posts to backend if available, stores in localStorage, and formats for WhatsApp & Mailto.
     */
    async submitInquiry(formData) {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        projectType: formData.projectType || 'Genel Proje',
        details: formData.details || '',
        preferredContact: formData.preferredContact || 'Telefon',
        timestamp: new Date().toISOString()
      };

      // 1. Try server POST if HTTP
      let serverSaved = false;
      if (this.isHttp) {
        try {
          const res = await fetch('/api/inquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) serverSaved = true;
        } catch (e) {
          console.log('Server save skipped, fallback to client store.');
        }
      }

      // 2. Always persist locally
      try {
        const stored = JSON.parse(localStorage.getItem('konfor_inquiries') || '[]');
        stored.unshift({ id: 'LOCAL-' + Date.now(), ...payload, serverSaved });
        localStorage.setItem('konfor_inquiries', JSON.stringify(stored));
      } catch (e) {
        console.error('Storage error:', e);
      }

      // 3. Generate direct WhatsApp format
      const waText = encodeURIComponent(
        `*Yeni Proje Danışma Talebi - Konfor Tasarım Mobilya*\n\n` +
        `👤 *Müşteri:* ${payload.name}\n` +
        `📞 *Telefon:* ${payload.phone}\n` +
        `✉️ *E-posta:* ${payload.email || 'Belirtilmedi'}\n` +
        `🏷️ *Proje Türü:* ${payload.projectType}\n` +
        `📝 *Detaylar:* ${payload.details}\n` +
        `⏰ *Tarih:* ${new Date().toLocaleString('tr-TR')}`
      );
      const whatsappUrl = `https://wa.me/905374303560?text=${waText}`;

      return {
        success: true,
        data: payload,
        whatsappUrl: whatsappUrl
      };
    }
  };

  window.KonforStore = DataStore;
})();
