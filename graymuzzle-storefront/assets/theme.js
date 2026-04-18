(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ========= Cart drawer ========= */
  const drawer = $('[data-cart-drawer]');
  const openCart = () => {
    if (!drawer) return;
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeCart = () => {
    if (!drawer) return;
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  $$('[data-cart-toggle]').forEach(btn => btn.addEventListener('click', openCart));
  $$('[data-cart-close]').forEach(btn => btn.addEventListener('click', closeCart));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  /* ========= AJAX add-to-cart ========= */
  async function refreshCart() {
    const res = await fetch('/cart.js', { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return;
    const cart = await res.json();
    $$('[data-cart-count]').forEach(el => { el.textContent = cart.item_count; });

    // Re-render the drawer body by fetching the cart drawer snippet via section rendering API
    try {
      const secRes = await fetch('/?sections=cart-drawer');
      if (secRes.ok) {
        const json = await secRes.json();
        if (json['cart-drawer']) {
          const parsed = new DOMParser().parseFromString(json['cart-drawer'], 'text/html');
          const fresh = parsed.querySelector('[data-cart-drawer]');
          if (fresh && drawer) drawer.innerHTML = fresh.innerHTML;
        }
      }
    } catch (_) { /* non-fatal */ }
  }

  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-ajax-cart]');
    if (!form) return;
    e.preventDefault();
    const action = form.getAttribute('action') || '/cart/add';
    const body = new FormData(form);
    const res = await fetch(action, {
      method: 'POST',
      body,
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    });
    if (res.ok) {
      await refreshCart();
      if (action.includes('/cart/add')) openCart();
    } else {
      form.submit();
    }
  });

  /* ========= Sticky ATC ========= */
  const sticky = $('[data-sticky-atc]');
  const mainCta = $('.product__form button[type="submit"]');
  if (sticky && mainCta) {
    const io = new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting;
      sticky.classList.toggle('is-visible', !visible);
      sticky.setAttribute('aria-hidden', visible ? 'true' : 'false');
    }, { threshold: 0 });
    io.observe(mainCta);
  }

  /* ========= Reveal on scroll (lightweight) ========= */
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity = '1';
        en.target.style.transform = 'translateY(0)';
        reveal.unobserve(en.target);
      }
    });
  }, { threshold: 0.08 });
  $$('.product-card, .testimonial').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity .4s ease, transform .4s ease';
    reveal.observe(el);
  });
})();
