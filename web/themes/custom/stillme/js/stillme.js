/**
 * @file
 * Still Me theme behaviors.
 *
 * Provides mobile menu toggle, sticky header, smooth scroll,
 * and scroll-triggered fade-in animations.
 */

(function (Drupal) {
  'use strict';

  /**
   * Mobile menu toggle.
   *
   * Opens and closes the mobile navigation overlay and manages
   * the hamburger button state and body scroll lock.
   */
  Drupal.behaviors.stillmeMobileMenu = {
    attach: function (context) {
      var toggle = context.querySelector('.nav-toggle');
      if (!toggle || toggle.dataset.stillmeProcessed) {
        return;
      }
      toggle.dataset.stillmeProcessed = 'true';

      var overlay = document.querySelector('.mobile-nav-overlay');
      if (!overlay) {
        return;
      }

      var toggleMenu = function () {
        var isOpen = overlay.classList.contains('is-open');

        toggle.classList.toggle('is-active', !isOpen);
        overlay.classList.toggle('is-open', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';

        toggle.setAttribute('aria-expanded', String(!isOpen));
      };

      toggle.addEventListener('click', toggleMenu);

      // Close menu when clicking a nav link inside the overlay.
      var links = overlay.querySelectorAll('.nav-link');
      links.forEach(function (link) {
        link.addEventListener('click', function () {
          if (overlay.classList.contains('is-open')) {
            toggleMenu();
          }
        });
      });

      // Close menu on Escape key.
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
          toggleMenu();
          toggle.focus();
        }
      });
    }
  };

  /**
   * Sticky header behavior.
   *
   * Adds an "is-scrolled" class to the site header when the
   * page has been scrolled past a threshold, enabling a
   * subtle shadow change.
   */
  Drupal.behaviors.stillmeStickyHeader = {
    attach: function (context) {
      var header = context.querySelector('.site-header');
      if (!header || header.dataset.stillmeStickyProcessed) {
        return;
      }
      header.dataset.stillmeStickyProcessed = 'true';

      var scrollThreshold = 10;
      var ticking = false;

      var onScroll = function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            if (window.scrollY > scrollThreshold) {
              header.classList.add('is-scrolled');
            } else {
              header.classList.remove('is-scrolled');
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      // Run once on load.
      onScroll();
    }
  };

  /**
   * Smooth scroll for anchor links.
   *
   * Intercepts clicks on same-page anchor links and scrolls
   * smoothly to the target element, accounting for the sticky
   * header height.
   */
  Drupal.behaviors.stillmeSmoothScroll = {
    attach: function (context) {
      var links = context.querySelectorAll('a[href^="#"]');
      links.forEach(function (link) {
        if (link.dataset.stillmeSmoothProcessed) {
          return;
        }
        link.dataset.stillmeSmoothProcessed = 'true';

        link.addEventListener('click', function (e) {
          var hash = this.getAttribute('href');
          if (hash.length <= 1) {
            return;
          }

          var target = document.querySelector(hash);
          if (!target) {
            return;
          }

          e.preventDefault();

          var header = document.querySelector('.site-header');
          var headerHeight = header ? header.offsetHeight : 0;
          var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL hash without jumping.
          if (history.pushState) {
            history.pushState(null, null, hash);
          }
        });
      });
    }
  };

  /**
   * Scroll-triggered fade-in animation.
   *
   * Uses IntersectionObserver to add an "is-visible" class to
   * elements with the "fade-in" class when they enter the viewport.
   */
  Drupal.behaviors.stillmeFadeIn = {
    attach: function (context) {
      // Check for IntersectionObserver support.
      if (!('IntersectionObserver' in window)) {
        // Fallback: make all fade-in elements visible immediately.
        var fallbackElements = context.querySelectorAll('.fade-in');
        fallbackElements.forEach(function (el) {
          el.classList.add('is-visible');
        });
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
          root: null,
          rootMargin: '0px 0px -60px 0px',
          threshold: 0.1
        }
      );

      var elements = context.querySelectorAll('.fade-in:not(.is-visible)');
      elements.forEach(function (el) {
        observer.observe(el);
      });
    }
  };

})(Drupal);
