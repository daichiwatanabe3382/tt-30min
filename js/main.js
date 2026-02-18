// ================================
// TechTrain LP - JavaScript
// ================================

document.addEventListener('DOMContentLoaded', function () {
  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileNavLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        var headerHeight = document.querySelector('.header').offsetHeight;
        var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenuBtn.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });

  // --- Header Scroll Effect ---
  var header = document.getElementById('header');

  function onScroll() {
    var scrollY = window.scrollY;

    // Header shadow
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll);
  onScroll();

  // --- Hero Card Shuffle ---
  var heroCards = document.querySelectorAll('.hero-card');
  var currentCardIndex = 0;

  function clearCardClasses(card) {
    card.classList.remove('active', 'slide-out', 'slide-in', 'slide-standby');
  }

  function goToNextCard() {
    if (heroCards.length < 2) return;

    var currentCard = heroCards[currentCardIndex];
    var nextIndex = (currentCardIndex + 1) % heroCards.length;
    var standbyIndex = (nextIndex + 1) % heroCards.length;
    var nextCard = heroCards[nextIndex];
    var standbyCard = heroCards[standbyIndex];

    // Clean up all cards
    heroCards.forEach(clearCardClasses);

    // Animate
    currentCard.classList.add('slide-out');
    nextCard.classList.add('slide-in', 'active');
    standbyCard.classList.add('slide-standby');

    currentCardIndex = nextIndex;
  }

  if (heroCards.length > 1) {
    setInterval(goToNextCard, 3500);
  }

  // --- Scroll Reveal (Intersection Observer) ---
  if ('IntersectionObserver' in window) {
    var revealElements = document.querySelectorAll('.scroll-reveal');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    document.querySelectorAll('.scroll-reveal').forEach(function (el) {
      el.classList.add('revealed');
    });
  }
});
