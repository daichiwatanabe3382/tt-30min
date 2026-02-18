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

  // --- Mentor Card Stack Shuffle ---
  var mentorSlider = document.getElementById('mentorSlider');
  if (mentorSlider) {
    var mCards = mentorSlider.querySelectorAll('.mentor-card');
    var prevBtn = document.getElementById('mentorPrev');
    var nextBtn = document.getElementById('mentorNext');
    var mCurrentIndex = 0;
    var mAnimating = false;

    function updateStack() {
      mCards.forEach(function (card, i) {
        card.classList.remove('stack-slide-out', 'stack-slide-in');
        var pos = i - mCurrentIndex;
        // Only show cards within range of -2 to 2
        if (pos >= -2 && pos <= 2) {
          card.setAttribute('data-pos', pos);
        } else {
          card.removeAttribute('data-pos');
        }
      });
    }

    function goToMentor(newIndex, direction) {
      if (mAnimating || newIndex === mCurrentIndex) return;
      mAnimating = true;

      var oldCard = mCards[mCurrentIndex];
      var newCard = mCards[newIndex];

      // Remove all positions first
      mCards.forEach(function (c) {
        c.classList.remove('stack-slide-out', 'stack-slide-in');
      });

      // Animate old card out
      oldCard.removeAttribute('data-pos');
      oldCard.classList.add('stack-slide-out');

      // Update index and position surrounding cards
      mCurrentIndex = newIndex;

      // Position surrounding cards immediately
      mCards.forEach(function (card, i) {
        if (i === newIndex) return; // new active handled separately
        var oldPos = card.getAttribute('data-pos');
        card.classList.remove('stack-slide-out', 'stack-slide-in');
        var pos = i - mCurrentIndex;
        if (pos >= -2 && pos <= 2) {
          card.setAttribute('data-pos', pos);
        } else {
          card.removeAttribute('data-pos');
        }
      });

      // Animate new card in
      newCard.removeAttribute('data-pos');
      newCard.classList.add('stack-slide-in');

      setTimeout(function () {
        newCard.classList.remove('stack-slide-in');
        oldCard.classList.remove('stack-slide-out');
        newCard.setAttribute('data-pos', '0');
        mAnimating = false;
      }, 600);
    }

    prevBtn.addEventListener('click', function () {
      var prev = (mCurrentIndex - 1 + mCards.length) % mCards.length;
      goToMentor(prev, 'prev');
    });

    nextBtn.addEventListener('click', function () {
      var next = (mCurrentIndex + 1) % mCards.length;
      goToMentor(next, 'next');
    });

    // Touch/swipe support
    var mTouchStartX = 0;
    mentorSlider.addEventListener('touchstart', function (e) {
      mTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    mentorSlider.addEventListener('touchend', function (e) {
      var diff = mTouchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToMentor((mCurrentIndex + 1) % mCards.length, 'next');
        else goToMentor((mCurrentIndex - 1 + mCards.length) % mCards.length, 'prev');
      }
    }, { passive: true });

    // Auto shuffle every 4 seconds
    var mentorAutoplay = setInterval(function () {
      var next = (mCurrentIndex + 1) % mCards.length;
      goToMentor(next, 'next');
    }, 4000);

    // Pause autoplay on interaction
    [prevBtn, nextBtn].forEach(function (btn) {
      btn.addEventListener('click', function () {
        clearInterval(mentorAutoplay);
      });
    });

    // Initialize
    updateStack();
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
