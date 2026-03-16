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
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileOverlay = document.querySelector('.mobile-nav__overlay');
  const body = document.body;

  /* ----------------------------------------
     Mobile Navigation Toggle
     ---------------------------------------- */
  function openMobileNav() {
    if (!mobileNav || !navToggle) return;
    navToggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    body.classList.add('nav-open');
    // Focus the close button or first focusable element inside
    var firstFocusable = mobileNav.querySelector('.mobile-nav-close') || mobileNav.querySelector('a[href]');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeMobileNav() {
    if (!mobileNav || !navToggle) return;
    navToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    body.classList.remove('nav-open');
  }

  function toggleMobileNav() {
    var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileNav);
  }

  // Close button inside mobile nav
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', function () {
      closeMobileNav();
      if (navToggle) navToggle.focus();
    });
  }

  // Close on overlay click
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  // Close on ESC key and return focus to toggle button
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNav();
      if (navToggle) navToggle.focus();
    }
  });

  // Trap focus inside mobile nav when open
  if (mobileNav) {
    mobileNav.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = mobileNav.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // Close when clicking a mobile nav link
  if (mobileNav) {
    var mobileLinks = mobileNav.querySelectorAll('.nav-link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ----------------------------------------
     Sticky Header — .scrolled class
     ---------------------------------------- */
  var scrollThreshold = 80;
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
  // Run once on load in case the page is already scrolled
  handleHeaderScroll();

  /* ----------------------------------------
     Scroll Animations — IntersectionObserver
     ---------------------------------------- */
  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('.fade-in-up');
    if (!animatedElements.length) return;

    // Check for reduced motion preference
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      animatedElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      animatedElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initScrollAnimations();

  /* ----------------------------------------
     Smooth Scroll for Anchor Links
     ---------------------------------------- */
  function getHeaderHeight() {
    if (!header) return 0;
    return header.offsetHeight || 80;
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    var targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();

    var offset = getHeaderHeight() + 16;
    var targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Update URL without jumping
    if (history.pushState) {
      history.pushState(null, null, targetId);
    }
  });

  /* ----------------------------------------
     Active Nav Link Highlighting
     ---------------------------------------- */
  function setActiveNavLink() {
    var currentPath = window.location.pathname;
    // Normalize: remove trailing slash unless it's just "/"
    if (currentPath !== '/' && currentPath.endsWith('/')) {
      currentPath = currentPath.slice(0, -1);
    }

    var navLinks = document.querySelectorAll('.site-nav__link, .mobile-nav__link, .nav-link');

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      // Build an absolute path from the href for comparison
      var linkPath = href;
      // Handle relative paths
      if (!linkPath.startsWith('/') && !linkPath.startsWith('http')) {
        // Could be a relative path like "pages/about.html"
        // We'll compare against the end of currentPath
      }

      // Normalize link path
      if (linkPath !== '/' && linkPath.endsWith('/')) {
        linkPath = linkPath.slice(0, -1);
      }

      link.classList.remove('active');

      // Exact match or ends-with match for relative links
      if (currentPath === linkPath || currentPath.endsWith('/' + linkPath) || currentPath.endsWith(linkPath)) {
        // Avoid false positives on very short paths
        if (linkPath.length > 1 || currentPath === linkPath) {
          link.classList.add('active');
        }
      }

      // Special case: highlight "Home" link when on root
      if ((currentPath === '/' || currentPath === '/index.html') &&
          (linkPath === '/' || linkPath === 'index.html' || linkPath === './index.html')) {
        link.classList.add('active');
      }
    });
  }

  setActiveNavLink();

})();
