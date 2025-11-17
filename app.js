/* ============================================
   AEON JavaScript
   Interactions & Animations
   ============================================ */

(function() {
  'use strict';

  // Motion preference check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================
     Smooth Scroll & Active Nav Links
     ========================================== */

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const nav = document.querySelector('.nav');

  // Smooth scroll on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Update active nav link on scroll
  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Add scrolled class to nav
    if (scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateActiveNavLink);

  /* ==========================================
     Intersection Observer for Reveals
     ========================================== */

  const revealElements = document.querySelectorAll('.reveal');

  if (!prefersReducedMotion && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the reveals slightly
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 50);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // If reduced motion, show everything immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ==========================================
     Magnetic Buttons
     ========================================== */

  if (!prefersReducedMotion) {
    const magneticContainers = document.querySelectorAll('[data-magnetic-container]');

    magneticContainers.forEach(container => {
      const buttons = container.querySelectorAll('[data-magnetic]');

      buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          // Limit movement to 20px radius
          const distance = Math.sqrt(x * x + y * y);
          const maxDistance = 20;

          if (distance < maxDistance * 3) {
            const limitedX = (x / distance) * Math.min(distance, maxDistance);
            const limitedY = (y / distance) * Math.min(distance, maxDistance);

            button.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
          }
        });

        button.addEventListener('mouseleave', () => {
          button.style.transform = 'translate(0, 0)';
        });
      });
    });
  }

  /* ==========================================
     Starfield Canvas
     ========================================== */

  const canvas = document.getElementById('starfield');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    // Set canvas size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // Create stars
    function createStars(count = 150) {
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          opacity: Math.random() * 0.5 + 0.2,
          speed: Math.random() * 0.3 + 0.1
        });
      }
    }

    // Draw stars
    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scrollY = window.pageYOffset;

      stars.forEach(star => {
        // Parallax effect based on scroll
        const parallaxY = star.y - scrollY * star.speed * 0.5;

        // Only draw if star is in viewport (with buffer)
        if (parallaxY > -50 && parallaxY < canvas.height + 50) {
          ctx.beginPath();
          ctx.arc(star.x, parallaxY, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(230, 238, 248, ${star.opacity})`;
          ctx.fill();
        }
      });
    }

    // Animation loop with throttle
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    function animate(currentTime) {
      animationFrameId = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastTime;

      if (deltaTime > interval) {
        lastTime = currentTime - (deltaTime % interval);
        drawStars();
      }
    }

    // Initialize
    resizeCanvas();
    createStars();
    animate(0);

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        createStars();
      }, 250);
    });

    // Redraw on scroll (throttled)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          scrollTimeout = null;
        }, 50);
      }
    });
  }

  /* ==========================================
     Card Tilt Effect
     ========================================== */

  if (!prefersReducedMotion) {
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
      card.addEventListener('mouseenter', function(e) {
        this.style.transition = 'transform 0.1s ease-out';
      });

      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', function() {
        this.style.transition = 'transform 0.3s ease-out';
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  /* ==========================================
     Timeline Progress
     ========================================== */

  const timeline = document.querySelector('.timeline');
  const timelineProgress = document.querySelector('.timeline-progress');

  if (timeline && timelineProgress) {
    function updateTimelineProgress() {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const timelineHeight = timeline.offsetHeight;

      // Calculate progress based on scroll position
      const scrollProgress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + timelineHeight * 0.5)
      ));

      timelineProgress.style.height = `${scrollProgress * 100}%`;
    }

    window.addEventListener('scroll', updateTimelineProgress);
    updateTimelineProgress();
  }

  /* ==========================================
     FAQ Accordions
     ========================================== */

  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      // Close all other accordions
      faqQuestions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
      });

      // Toggle current accordion
      question.setAttribute('aria-expanded', !isExpanded);
    });

    // Keyboard support
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  /* ==========================================
     Protocol Card Interactions
     ========================================== */

  const protocolCards = document.querySelectorAll('.protocol-card');

  protocolCards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('expanded');
      }
    });
  });

  /* ==========================================
     Optional: Cursor Glow Effect
     ========================================== */

  if (!prefersReducedMotion && window.innerWidth > 768) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
      position: fixed;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(124, 92, 255, 0.15), transparent 70%);
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: screen;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s;
      opacity: 0;
    `;
    document.body.appendChild(cursorGlow);

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });

    // Smooth follow animation
    function animateGlow() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;

      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';

      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  /* ==========================================
     Initialize
     ========================================== */

  // Set initial active link
  updateActiveNavLink();

  // Log initialization
  console.log('%cAEON Protocol Initialized', 'color: #7C5CFF; font-size: 16px; font-weight: bold;');
  console.log('%cAgentic Enctription Optimization Network', 'color: #44FFD1; font-size: 12px;');

})();
