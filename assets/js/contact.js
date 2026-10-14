/**
 * Konfor Tasarım Mobilya - Inquiry & Contact Form Controller
 */
(function() {
  function initInquiryForm() {
    const form = document.getElementById('projectInquiryForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim() || '';
      const details = form.querySelector('[name="details"]').value.trim();
      const projectTypeEl = form.querySelector('[name="projectType"]:checked');
      const projectType = projectTypeEl ? projectTypeEl.value : 'Kurumsal / Bireysel Proje';

      if (!name || !phone) {
        alert('Lütfen adınızı ve telefon numaranızı giriniz.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Talebiniz İletiliyor...</span>`;

      try {
        const result = await window.KonforStore.submitInquiry({
          name,
          phone,
          email,
          projectType,
          details
        });

        // Show success modal
        showSuccessModal(result.data, result.whatsappUrl);
        form.reset();
      } catch (err) {
        alert('Bir hata oluştu, lütfen telefon veya WhatsApp ile doğrudan iletişime geçiniz.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  function showSuccessModal(data, whatsappUrl) {
    let modal = document.getElementById('inquirySuccessModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'inquirySuccessModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-content" style="max-width: 540px; text-align: center; padding: 40px 32px;">
          <button class="modal-close-btn" onclick="document.getElementById('inquirySuccessModal').classList.remove('active')">&times;</button>
          <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 1px solid var(--accent-emerald); color: var(--accent-emerald); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px;">✓</div>
          <h3 class="font-serif" style="margin-bottom: 12px; font-size: 1.6rem;">Talebiniz Alındı</h3>
          <p style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 24px;">
            Sayın <strong style="color: #ffffff;" id="successClientName"></strong>, proje detaylarınız Selim Divarcı'ya iletildi. En kısa sürede sizinle iletişime geçilecektir.
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <a id="successWhatsAppLink" href="#" target="_blank" class="btn btn-whatsapp" style="width: 100%;">
              <span>WhatsApp'ta Doğrudan Mesajı Göster</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
            </a>
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('inquirySuccessModal').classList.remove('active')">
              Kapat
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const nameEl = modal.querySelector('#successClientName');
    const waLinkEl = modal.querySelector('#successWhatsAppLink');
    if (nameEl) nameEl.textContent = data.name;
    if (waLinkEl) waLinkEl.href = whatsappUrl;

    modal.classList.add('active');
  }

  document.addEventListener('DOMContentLoaded', initInquiryForm);
})();
