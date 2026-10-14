/**
 * Konfor Tasarım Mobilya - Main App Script
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize DataStore
  if (window.KonforStore) {
    await window.KonforStore.init();
  }

  // Header scroll dynamic behavior
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu drawer
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const drawerClose = document.querySelector('.drawer-close');

  function openDrawer() {
    drawer?.classList.add('open');
    backdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    backdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  // Close drawer on link click
  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Populate dynamic company info elements if present
  const comp = window.KonforStore ? window.KonforStore.getCompany() : window.KonforCompany;
  if (comp) {
    document.querySelectorAll('[data-bind="phone"]').forEach(el => {
      el.textContent = comp.contact.phone;
      if (el.tagName === 'A') el.href = `tel:${comp.contact.phoneRaw}`;
    });
    document.querySelectorAll('[data-bind="email"]').forEach(el => {
      el.textContent = comp.contact.email;
      if (el.tagName === 'A') el.href = `mailto:${comp.contact.email}`;
    });
    document.querySelectorAll('[data-bind="address"]').forEach(el => {
      el.textContent = comp.contact.address.full;
    });
    document.querySelectorAll('[data-bind="authorizedPerson"]').forEach(el => {
      el.textContent = comp.authorizedPerson.name;
    });
    document.querySelectorAll('[data-bind="whatsappLink"]').forEach(el => {
      if (el.tagName === 'A') el.href = comp.contact.whatsappLink;
    });
  }
});
