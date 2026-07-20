// ============================================================
// Como Viver o Sistema Persuasivo — interações
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- rastreamento dos cliques em CTA ---------- */
  // Dispara um evento de "InitiateCheckout" no Pixel no momento do clique,
  // antes do redirecionamento para o Hotmart. Isso dá ao Meta um sinal de
  // intenção mais forte que o simples PageView, ajudando o algoritmo de
  // entrega de anúncios a otimizar para quem realmente demonstra interesse.
  document.querySelectorAll('.js-cta').forEach(link => {
    link.addEventListener('click', () => {
      const local = link.getAttribute('data-cta-local') || 'desconhecido';
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', { content_name: 'cta-' + local });
      }
    });
  });

  /* ---------- barra de CTA fixa (mobile) ---------- */
  // Mantém o caminho para a compra sempre visível depois que a pessoa
  // rola para além do hero, sem depender de lembrar onde ficou o botão.
  const stickyBar = document.createElement('div');
  stickyBar.className = 'sticky-cta';
  stickyBar.innerHTML = `
    <a href="https://pay.hotmart.com/E106641456I?off=uct61qwl" class="btn btn--wine btn--block js-cta" data-cta-local="sticky-mobile">
      Quero entrar na jornada
    </a>`;
  document.body.appendChild(stickyBar);
  stickyBar.querySelector('.js-cta').addEventListener('click', () => {
    if (typeof fbq === 'function') {
      fbq('track', 'InitiateCheckout', { content_name: 'cta-sticky-mobile' });
    }
  });

  const heroEl = document.querySelector('.hero');
  const stickyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      stickyBar.classList.toggle('is-visible', !entry.isIntersecting);
    });
  }, { threshold: 0 });
  if (heroEl) stickyObserver.observe(heroEl);

  /* ---------- barra de progresso da jornada ---------- */
  const progressFill = document.getElementById('progressFill');
  function updateProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ---------- acordeão de objeções (FAQ) ---------- */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    const button = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    button.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';

      // fecha os outros itens (acordeão exclusivo)
      faqItems.forEach(other => {
        if (other !== item) {
          other.setAttribute('data-open', 'false');
          other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq__answer').style.maxHeight = '0px';
        }
      });

      if (isOpen) {
        item.setAttribute('data-open', 'false');
        button.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';
      } else {
        item.setAttribute('data-open', 'true');
        button.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

});
