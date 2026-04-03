/* ============================================================
   GUIDE-TRADING.FR — Main JavaScript
   Vanilla JS, zero dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. NAVBAR — Toggle mobile menu
     ---------------------------------------------------------- */
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileLinks = document.querySelectorAll('.navbar__mobile-panel .navbar__link');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      const isOpen = document.body.classList.contains('nav-open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Fermer le menu au clic sur un lien mobile
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------------
     2. NAVBAR — Compacter au scroll
     ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }
    };

    // Debounce via requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Etat initial
    onScroll();
  }

  /* ----------------------------------------------------------
     3. BARRE DE PROGRESSION DE LECTURE
     ---------------------------------------------------------- */
  const progressBar = document.querySelector('.reading-progress-bar');

  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = Math.min(progress, 100) + '%';
      }
    };

    let progressTicking = false;
    window.addEventListener('scroll', () => {
      if (!progressTicking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          progressTicking = false;
        });
        progressTicking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  /* ----------------------------------------------------------
     4. TABLE DES MATIERES — Highlight section active
     ---------------------------------------------------------- */
  const tocLinks = document.querySelectorAll('.toc__link');
  const articleHeadings = document.querySelectorAll('.article-content h2[id]');

  if (tocLinks.length > 0 && articleHeadings.length > 0) {
    const tocObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0
    });

    articleHeadings.forEach(heading => tocObserver.observe(heading));
  }

  /* ----------------------------------------------------------
     5. ANIMATIONS D'ENTREE AU SCROLL
     ---------------------------------------------------------- */
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }

  /* ----------------------------------------------------------
     6. SMOOTH SCROLL SUR LES ANCRES
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });

        // Mettre a jour l'URL sans scroll
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  /* ----------------------------------------------------------
     7. RECHERCHE LEXIQUE — Filtrage instantane
     ---------------------------------------------------------- */
  const lexiqueSearch = document.querySelector('.lexique-search');
  const lexiqueTerms = document.querySelectorAll('.lexique-term');
  const lexiqueSections = document.querySelectorAll('.lexique-section');

  if (lexiqueSearch && lexiqueTerms.length > 0) {
    lexiqueSearch.addEventListener('input', () => {
      const query = lexiqueSearch.value.toLowerCase().trim();

      lexiqueTerms.forEach(term => {
        const termName = (term.dataset.term || '').toLowerCase();
        const termText = term.textContent.toLowerCase();
        const match = !query || termName.includes(query) || termText.includes(query);
        term.style.display = match ? '' : 'none';
      });

      // Masquer les sections alphabetiques vides
      if (lexiqueSections.length > 0) {
        lexiqueSections.forEach(section => {
          const visibleTerms = section.querySelectorAll('.lexique-term:not([style*="display: none"])');
          section.style.display = visibleTerms.length > 0 ? '' : 'none';
        });
      }
    });
  }

  /* ----------------------------------------------------------
     8. NAVIGATION ALPHABETIQUE LEXIQUE
     ---------------------------------------------------------- */
  const alphaButtons = document.querySelectorAll('.alpha-nav__btn');

  if (alphaButtons.length > 0) {
    alphaButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const letter = btn.dataset.letter;
        const targetSection = document.querySelector(`#lexique-${letter}`);

        // Highlight le bouton actif
        alphaButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ----------------------------------------------------------
     9. FILTRES PAR CATEGORIE
     ---------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const filterableItems = document.querySelectorAll('[data-category]');

  if (filterButtons.length > 0 && filterableItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter;

        // Mettre a jour le bouton actif
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filtrer les elements
        filterableItems.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            item.style.display = '';
            // Re-trigger fade-in si applicable
            if (item.classList.contains('fade-in')) {
              item.classList.remove('visible');
              requestAnimationFrame(() => {
                item.classList.add('visible');
              });
            }
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------
     10. CALCULATEURS (outils)
     ---------------------------------------------------------- */
  const toolInputs = document.querySelectorAll('.tool-input');

  if (toolInputs.length > 0) {
    toolInputs.forEach(input => {
      input.addEventListener('input', () => {
        const form = input.closest('.tool-form');
        if (!form) return;

        const calculatorId = form.dataset.calculator;
        if (calculatorId && typeof window.calculators !== 'undefined' && window.calculators[calculatorId]) {
          window.calculators[calculatorId](form);
        }
      });
    });
  }

  /**
   * Registre global pour les calculateurs.
   * Chaque page d'outil enregistre sa fonction :
   *   window.calculators.positionSize = function(form) { ... }
   */
  window.calculators = window.calculators || {};

  /**
   * Utilitaire : mettre a jour un resultat avec animation
   */
  window.updateResult = function(element, value, status) {
    if (!element) return;

    const resultContainer = element.closest('.tool-result');
    if (resultContainer) {
      resultContainer.classList.remove('result-good', 'result-warning', 'result-danger');
      if (status) {
        resultContainer.classList.add('result-' + status);
      }
    }

    // Animation de transition
    element.style.opacity = '0';
    element.style.transform = 'translateY(-5px)';

    requestAnimationFrame(() => {
      element.textContent = value;
      element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  };

  /* ----------------------------------------------------------
     11. LAZY LOADING IMAGES
     ---------------------------------------------------------- */
  const lazyImages = document.querySelectorAll('img[data-src]');

  if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;

          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }

          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /* ----------------------------------------------------------
     12. ANIMATED COUNTERS (bonus)
     ---------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count-to]');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.countTo, 10);
          const duration = parseInt(el.dataset.countDuration || '2000', 10);
          const suffix = el.dataset.countSuffix || '';
          const prefix = el.dataset.countPrefix || '';

          animateCounter(el, 0, target, duration, prefix, suffix);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(el, start, end, duration, prefix, suffix) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);

      el.textContent = prefix + current.toLocaleString('fr-FR') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

});
