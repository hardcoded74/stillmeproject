/**
 * @file
 * Still Me Project — Front-end behaviours.
 *
 * Keeps things minimal: sticky header shadow, scroll-triggered
 * fade-ins, and smooth anchor scrolling.
 */

(function (Drupal) {
  'use strict';

  /* ================================================================
   *  1. Sticky header — add a shadow when the page is scrolled
   * ================================================================ */
  Drupal.behaviors.stillmeStickyHeader = {
    attach: function (context) {
      // Only act on the full document (first attach).
      if (context !== document) {
        return;
      }

      var navbar = document.querySelector('.navbar');
      if (!navbar) {
        return;
      }

      var scrollThreshold = 50;
      var ticking = false;

      function onScroll() {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            if (window.scrollY > scrollThreshold) {
              navbar.classList.add('scrolled');
            } else {
              navbar.classList.remove('scrolled');
            }
            ticking = false;
          });
          ticking = true;
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      // Run once on load in case the page is already scrolled.
      onScroll();
    }
  };

  /* ================================================================
   *  2. Fade-in-up — IntersectionObserver reveal
   * ================================================================ */
  Drupal.behaviors.stillmeFadeInUp = {
    attach: function (context) {
      if (!('IntersectionObserver' in window)) {
        // Fallback: just show everything immediately.
        var fallbacks = context.querySelectorAll('.fade-in-up');
        for (var i = 0; i < fallbacks.length; i++) {
          fallbacks[i].classList.add('is-visible');
        }
        return;
      }

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      var elements = context.querySelectorAll('.fade-in-up:not(.is-visible)');
      elements.forEach(function (el) {
        observer.observe(el);
      });
    }
  };

  /* ================================================================
   *  3. Smooth scroll — anchor links with fixed-navbar offset
   * ================================================================ */
  Drupal.behaviors.stillmeSmoothScroll = {
    attach: function (context) {
      if (context !== document) {
        return;
      }

      document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) {
          return;
        }

        var targetId = link.getAttribute('href');
        if (targetId === '#' || targetId === '') {
          return;
        }

        var target = document.querySelector(targetId);
        if (!target) {
          return;
        }

        e.preventDefault();

        var navbar = document.querySelector('.navbar');
        var offset = navbar ? navbar.offsetHeight + 16 : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });

        // Move focus for accessibility.
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    }
  };

})(Drupal);
