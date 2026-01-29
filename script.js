// ================================
// TechTrain Direct LP - JavaScript
// ================================

document.addEventListener('DOMContentLoaded', function() {
  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a nav link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
      header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }

    lastScrollY = currentScrollY;
  });

  // --- Scroll Reveal Animation ---
  const scrollRevealElements = document.querySelectorAll(
    '.problem-card, .feature-item, .plan-card, .reason-item, .case-card, .stat-item'
  );

  const revealOnScroll = function() {
    scrollRevealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add('revealed');
      }
    });
  };

  // Add scroll-reveal class to elements
  scrollRevealElements.forEach(element => {
    element.classList.add('scroll-reveal');
  });

  // Initial check (1フレーム遅らせてtransitionを有効にする)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      revealOnScroll();
    });
  });

  // Check on scroll
  window.addEventListener('scroll', revealOnScroll);

  // --- Form Validation ---
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Basic validation
      const company = document.getElementById('company');
      const name = document.getElementById('name');
      const email = document.getElementById('email');

      let isValid = true;

      // Reset styles
      [company, name, email].forEach(field => {
        field.style.borderColor = '';
      });

      // Validate required fields
      if (!company.value.trim()) {
        company.style.borderColor = '#dc2626';
        isValid = false;
      }

      if (!name.value.trim()) {
        name.style.borderColor = '#dc2626';
        isValid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        email.style.borderColor = '#dc2626';
        isValid = false;
      }

      if (isValid) {
        // Show success message
        showFormSuccess();
      }
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showFormSuccess() {
    const form = document.getElementById('contactForm');
    const formTitle = document.querySelector('.form-title');

    form.innerHTML = `
      <div style="text-align: center; padding: 2rem 0;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">✓</div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: #1a365d; margin-bottom: 0.5rem;">
          送信完了しました
        </h3>
        <p style="color: #6b7280;">
          ご入力いただいたメールアドレス宛に<br>資料をお送りいたします。
        </p>
      </div>
    `;

    if (formTitle) {
      formTitle.textContent = 'ありがとうございます';
    }
  }

  // --- Stat Counter Animation ---
  const statItems = document.querySelectorAll('.stat-item');
  let statsAnimated = false;

  const animateStats = function() {
    if (statsAnimated) return;

    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const heroBottom = heroSection.getBoundingClientRect().bottom;

    if (heroBottom > 0 && heroBottom < window.innerHeight + 200) {
      statsAnimated = true;

      statItems.forEach(item => {
        const statNumber = item.querySelector('.stat-number');
        if (!statNumber) return;

        // 元のHTMLを保存
        const originalHTML = statNumber.innerHTML;

        // 数値を抽出（カンマを除去）
        const textContent = statNumber.textContent;
        const numberMatch = textContent.match(/[\d,]+/);
        if (!numberMatch) return;

        const numberStr = numberMatch[0].replace(/,/g, '');
        const targetNumber = parseInt(numberStr, 10);
        if (isNaN(targetNumber)) return;

        // 数値の前後のテキストを特定
        const hasComma = numberMatch[0].includes(',');

        let current = 0;
        const duration = 1500;
        const steps = 60;
        const increment = targetNumber / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
          }

          // 数値をフォーマット
          let displayNumber;
          if (hasComma) {
            displayNumber = Math.floor(current).toLocaleString();
          } else {
            displayNumber = Math.floor(current);
          }

          // 元のHTMLの数値部分だけを置換
          statNumber.innerHTML = originalHTML.replace(/[\d,]+/, displayNumber);
        }, stepTime);
      });
    }
  };

  window.addEventListener('scroll', animateStats);
  animateStats(); // Initial check

  // --- Plan Card Hover Effect ---
  const planCards = document.querySelectorAll('.plan-card');

  planCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
      this.style.transition = 'transform 0.3s ease';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // --- Active Navigation Highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = function() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);

  // --- Intersection Observer for Performance ---
  if ('IntersectionObserver' in window) {
    const lazyElements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    lazyElements.forEach(element => {
      observer.observe(element);
    });
  }
});
