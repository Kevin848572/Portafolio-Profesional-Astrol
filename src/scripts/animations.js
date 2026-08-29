import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;
let tickerCallback = null;

// Detección estricta de dispositivo táctil / móvil
const isMobileOrTouch = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.innerWidth < 768 ||
    window.matchMedia('(pointer: coarse)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
};

/**
 * 1. Smooth Scroll con Lenis (Activo ÚNICAMENTE en Desktop)
 */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return null;

  // En móvil usar 100% scroll nativo a 120 FPS
  if (isMobileOrTouch()) {
    if (lenisInstance) {
      lenisInstance.destroy();
      lenisInstance = null;
    }
    if (tickerCallback) {
      gsap.ticker.remove(tickerCallback);
      tickerCallback = null;
    }
    return null;
  }

  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }

  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  try {
    lenisInstance = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 0, // Desactivar cualquier intercepción táctil
      syncTouch: false,
      infinite: false,
      autoRaf: false
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    tickerCallback = (time) => {
      if (lenisInstance) {
        lenisInstance.raf(time * 1000);
      }
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(500, 33);
  } catch (e) {
    console.warn('Fallback a scroll nativo:', e);
  }

  return lenisInstance;
}

/**
 * 2. Preloader Ultrarrápido y Seguro
 */
export function initPreloader(onCompleteCallback) {
  if (typeof window === 'undefined') return;

  const preloader = document.getElementById('preloader');
  const counterNumber = document.getElementById('preloader-number');
  const progressBar = document.getElementById('preloader-progress-bar');
  const curtainTop = document.getElementById('preloader-curtain-top');
  const curtainBottom = document.getElementById('preloader-curtain-bottom');
  const preloaderLogo = document.getElementById('preloader-logo');
  const preloaderStatus = document.getElementById('preloader-status');

  const finish = () => {
    document.body.classList.remove('overflow-hidden');
    if (preloader) {
      preloader.style.display = 'none';
      preloader.setAttribute('aria-hidden', 'true');
    }
    if (onCompleteCallback) onCompleteCallback();
  };

  if (!preloader || !counterNumber) {
    finish();
    return;
  }

  const isDirectSubpage = window.location.pathname !== '/' && window.location.pathname !== '';
  const hasLoadedBefore = sessionStorage.getItem('portfolio_preloader_shown');

  if (hasLoadedBefore === 'true' || isDirectSubpage) {
    finish();
    return;
  }

  document.body.classList.add('overflow-hidden');

  const counterObj = { val: 0 };
  const fallbackTimer = setTimeout(finish, 2000);

  const tl = gsap.timeline({
    onComplete: () => {
      clearTimeout(fallbackTimer);
      sessionStorage.setItem('portfolio_preloader_shown', 'true');
      finish();
    }
  });

  // Duración reducida a 0.9s para que la carga sea instantánea
  tl.to(counterObj, {
    val: 100,
    duration: 0.9,
    ease: 'power2.inOut',
    onUpdate: () => {
      const current = Math.floor(counterObj.val);
      counterNumber.textContent = `${current.toString().padStart(2, '0')}%`;
      if (progressBar) progressBar.style.width = `${current}%`;
    }
  });

  tl.to([counterNumber, preloaderStatus, progressBar?.parentElement, preloaderLogo].filter(Boolean), {
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in'
  }, '+=0.05');

  if (curtainTop && curtainBottom) {
    tl.to(curtainTop, {
      yPercent: -100,
      duration: 0.5,
      ease: 'power3.inOut'
    }, '-=0.05');

    tl.to(curtainBottom, {
      yPercent: 100,
      duration: 0.5,
      ease: 'power3.inOut'
    }, '<');
  } else {
    tl.to(preloader, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut'
    });
  }
}

/**
 * 3. Hero Section y Kinetic Typography
 */
export function initHeroKinetic() {
  if (typeof window === 'undefined') return;

  const heroSection = document.querySelector('#inicio');
  if (!heroSection) return;

  const kineticLines = document.querySelectorAll('.kinetic-line-inner');
  const heroBadges = document.querySelectorAll('.hero-tech-badge');
  const heroCenterCard = document.querySelector('.hero-monogram-card');
  const heroImage = document.querySelector('.hero-profile-image');
  const heroCtaBtns = document.querySelectorAll('.hero-cta-btn');
  const heroStatusBadge = document.querySelector('.hero-status-badge');
  const watermarkTitle = document.querySelector('.portfolio-title');

  // En móvil o con reducción de movimiento: renderizado inmediato de alto rendimiento
  if (isMobileOrTouch() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set([watermarkTitle, heroStatusBadge, heroCenterCard, kineticLines, heroBadges, heroCtaBtns].filter(Boolean), {
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps: 'transform'
    });
    if (heroImage) {
      gsap.set(heroImage, { filter: 'grayscale(0%)', scale: 1 });
    }
    return;
  }

  const heroTl = gsap.timeline({
    defaults: { ease: 'power3.out', duration: 0.7 }
  });

  if (watermarkTitle) {
    heroTl.fromTo(watermarkTitle, { opacity: 0, y: 25 }, { opacity: 0.35, y: 0, duration: 0.9 }, 0);
  }

  if (heroStatusBadge) {
    heroTl.fromTo(heroStatusBadge, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1);
  }

  if (heroCenterCard) {
    heroTl.fromTo(heroCenterCard, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.7 }, 0.2);
  }

  if (heroImage) {
    heroTl.fromTo(heroImage, { scale: 1.1, filter: 'grayscale(100%)' }, { scale: 1.0, filter: 'grayscale(20%)', duration: 0.8 }, 0.2);
  }

  if (kineticLines.length > 0) {
    heroTl.fromTo(kineticLines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.07 }, 0.3);
  }

  if (heroBadges.length > 0) {
    heroTl.fromTo(heroBadges, { opacity: 0, scale: 0.7, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.05 }, 0.45);
  }

  if (heroCtaBtns.length > 0) {
    heroTl.fromTo(heroCtaBtns, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.6);
  }
}

/**
 * 4. Showcase de Proyectos 3D (Solo en Desktop)
 */
export function initProject3DCards() {
  if (typeof window === 'undefined' || isMobileOrTouch()) return;

  const cards = document.querySelectorAll('.project-card-3d');
  if (cards.length === 0) return;

  cards.forEach((card) => {
    const cardEl = card;
    const glowOverlay = cardEl.querySelector('.card-glow-overlay');
    let rafId = null;
    let rect = null;

    const onMouseEnter = () => {
      rect = cardEl.getBoundingClientRect();
    };

    const onMouseMove = (e) => {
      if (!rect) rect = cardEl.getBoundingClientRect();
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        cardEl.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg)`;

        if (glowOverlay) {
          glowOverlay.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212, 175, 55, 0.18) 0%, transparent 60%)`;
          glowOverlay.style.opacity = '1';
        }
      });
    };

    const onMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rect = null;
      cardEl.style.transition = 'transform 0.4s ease-out';
      cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';

      setTimeout(() => {
        cardEl.style.transition = '';
      }, 400);

      if (glowOverlay) glowOverlay.style.opacity = '0';
    };

    cardEl.addEventListener('mouseenter', onMouseEnter, { passive: true });
    cardEl.addEventListener('mousemove', onMouseMove, { passive: true });
    cardEl.addEventListener('mouseleave', onMouseLeave, { passive: true });
  });
}

/**
 * 5. Timeline / Experiencia
 */
export function initTimelineScroll() {
  if (typeof window === 'undefined') return;

  const timelineSection = document.querySelector('#experiencia-timeline');
  if (!timelineSection) return;

  const yearBackgrounds = timelineSection.querySelectorAll('.timeline-bg-year');
  const progressLine = timelineSection.querySelector('.timeline-progress-fill');

  // En pantallas grandes: parallax suave
  if (!isMobileOrTouch() && window.innerWidth > 900) {
    yearBackgrounds.forEach((yearEl) => {
      const speed = parseFloat(yearEl.getAttribute('data-parallax-speed') || '20');
      gsap.to(yearEl, {
        xPercent: -speed,
        opacity: 0.18,
        ease: 'none',
        scrollTrigger: {
          trigger: yearEl.closest('.timeline-block') || timelineSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.4
        }
      });
    });
  }

  if (progressLine) {
    gsap.fromTo(progressLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: timelineSection,
          start: 'top 80%',
          end: 'bottom 65%',
          scrub: 0.2
        }
      }
    );
  }
}

/**
 * 6. Microinteracciones UI (Solo en Desktop)
 */
export function initBadgeInteractions() {
  if (typeof window === 'undefined' || isMobileOrTouch()) return;

  const magneticElements = document.querySelectorAll('.magnetic-btn');

  magneticElements.forEach((el) => {
    const target = el;
    let rect = null;

    target.addEventListener('mouseenter', () => {
      rect = target.getBoundingClientRect();
    }, { passive: true });

    target.addEventListener('mousemove', (e) => {
      if (!rect) rect = target.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
      target.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0px)`;
    }, { passive: true });

    target.addEventListener('mouseleave', () => {
      rect = null;
      target.style.transition = 'transform 0.3s ease-out';
      target.style.transform = 'translate3d(0px, 0px, 0px)';
      setTimeout(() => {
        target.style.transition = '';
      }, 300);
    }, { passive: true });
  });
}

/**
 * 7. Revelado General al Scroll (Ligero y con `once: true` en móvil)
 */
export function initGlobalScrollTriggers() {
  if (typeof window === 'undefined') return;

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length === 0) return;

  if (isMobileOrTouch()) {
    // En móviles: revelado instantáneo sin listeners pesados de scroll
    revealElements.forEach(el => {
      el.classList.remove('opacity-0', 'translate-y-10');
      el.classList.add('opacity-100', 'translate-y-0');
    });
    return;
  }

  revealElements.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true
        }
      }
    );
  });
}

/**
 * Orquestador Maestro de Animaciones
 */
export function initAllAnimations() {
  initSmoothScroll();
  initPreloader(() => {
    initHeroKinetic();
  });

  const preloader = document.getElementById('preloader');
  if (!preloader || preloader.style.display === 'none') {
    initHeroKinetic();
  }

  initProject3DCards();
  initTimelineScroll();
  initBadgeInteractions();
  initGlobalScrollTriggers();
}

/**
 * Limpieza limpia para Astro View Transitions
 */
export function cleanupAnimations() {
  if (typeof window !== 'undefined') {
    if (tickerCallback) {
      gsap.ticker.remove(tickerCallback);
      tickerCallback = null;
    }
    if (lenisInstance) {
      lenisInstance.destroy();
      lenisInstance = null;
    }
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }
}
