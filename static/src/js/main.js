/* ============================================================
   Still Me Project — Main JavaScript
   Vanilla JS — No dependencies
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------
     DOM References
     ---------------------------------------- */
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav__close');
  const mobileOverlay = document.querySelector('.mobile-nav__overlay');
  const body = document.body;

  /* ----------------------------------------
     Mobile Navigation
     ---------------------------------------- */
  function openMobileNav() {
    if (!mobileNav || !navToggle) return;
    navToggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    body.classList.add('nav-open');
    // Focus the close button
    var closeBtn = mobileNav.querySelector('.mobile-nav__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeMobileNav() {
    if (!mobileNav || !navToggle) return;
    navToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    body.classList.remove('nav-open');
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMobileNav() : openMobileNav();
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', function () {
      closeMobileNav();
      if (navToggle) navToggle.focus();
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  // ESC key closes mobile nav
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNav();
      if (navToggle) navToggle.focus();
    }
  });

  // Focus trap inside mobile nav
  if (mobileNav) {
    mobileNav.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = mobileNav.querySelectorAll('a[href], button, input, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Close on link click
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ----------------------------------------
     Sticky Header
     ---------------------------------------- */
  var scrollThreshold = 20; /* Lower threshold since masthead scrolls away first */
  var headerScrolled = false;

  function handleHeaderScroll() {
    if (!header) return;
    var scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > scrollThreshold && !headerScrolled) {
      header.classList.add('scrolled');
      headerScrolled = true;
    } else if (scrollY <= scrollThreshold && headerScrolled) {
      header.classList.remove('scrolled');
      headerScrolled = false;
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ----------------------------------------
     Scroll Animations
     ---------------------------------------- */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.fade-in-up');
    if (!elements.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  initScrollAnimations();

  /* ----------------------------------------
     Smooth Scroll for Anchor Links
     ---------------------------------------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    var target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    var offset = (header ? header.offsetHeight : 80) + 16;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });

  /* ----------------------------------------
     Active Nav Link
     ---------------------------------------- */
  (function () {
    var currentPath = window.location.pathname;
    if (currentPath !== '/' && currentPath.endsWith('/')) {
      currentPath = currentPath.slice(0, -1);
    }

    document.querySelectorAll('.site-nav__link, .mobile-nav__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPath = href;
      if (linkPath !== '/' && linkPath.endsWith('/')) {
        linkPath = linkPath.slice(0, -1);
      }
      link.classList.remove('active');
      if (currentPath === linkPath) {
        link.classList.add('active');
      }
      if ((currentPath === '/' || currentPath === '') && (linkPath === '/' || linkPath === '')) {
        link.classList.add('active');
      }
    });
  })();

})();
