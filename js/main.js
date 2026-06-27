/* ==========================================================
   XBOX SHOWCASE — Скрипты авто-демонстрации
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // 1. АВТО-СЛАЙДЕР (Carousel)
  // ==============================
  const carousel = (() => {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.carousel__dot');
    if (!track || !dots.length) return;

    const slides = track.querySelectorAll('.carousel__slide');
    const totalSlides = dots.length; // реальных слайдов (без дубля)
    // track содержит totalSlides + 1 (дубль первого для бесшовного цикла)
    let current = 0;
    let interval = null;
    let isTransitioning = false;

    // Позиция — индекс слайда в track (0…totalSlides)
    const goTo = (index, instant = false) => {
      if (isTransitioning) return;
      isTransitioning = true;

      track.style.transition = instant
        ? 'none'
        : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

      track.style.transform = `translateX(-${index * 100}%)`;

      // Обновить точки
      const realIndex = index >= totalSlides ? 0 : index;
      dots.forEach((dot, i) => {
        const active = i === realIndex;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-selected', active);
      });

      current = index;

      // Если дошли до дубля — мгновенно перемотать на настоящий первый
      if (index === totalSlides) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            track.style.transition = 'none';
            track.style.transform = `translateX(0%)`;
            current = 0;
            isTransitioning = false;
          });
        });
        return;
      }

      // Ждём окончания transition
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    };

    const next = () => goTo(current + 1);
    const start = () => {
      stop();
      interval = setInterval(next, 4000);
    };
    const stop = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    // Точки-навигаторы
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        if (idx !== current) {
          stop();
          goTo(idx);
          start();
        }
      });
    });

    // Пауза при наведении на слайдер
    const carouselEl = document.querySelector('.carousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', stop);
      carouselEl.addEventListener('mouseleave', start);
    }

    // Старт
    goTo(0, true);
    start();

    return { next, start, stop };
  })();

  // ==============================
  // 2. АВТО-ТАЙПЕР (Typewriter)
  // ==============================
  const typer = (() => {
    const el = document.getElementById('typerText');
    if (!el) return;

    const phrases = [
      'Game Pass Ultimate',
      'Cloud Gaming',
      'Quick Resume',
      'Smart Delivery',
      'Cross-Play',
      'Auto HDR',
      'Ray Tracing',
      'FPS Boost',
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timer = null;

    const type = () => {
      const currentPhrase = phrases[phraseIdx];

      if (isDeleting) {
        charIdx--;
        el.textContent = currentPhrase.slice(0, charIdx);
      } else {
        charIdx++;
        el.textContent = currentPhrase.slice(0, charIdx);
      }

      let delay = isDeleting ? 35 : 80;

      if (!isDeleting && charIdx === currentPhrase.length) {
        // Пауза перед удалением
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 400;
      }

      timer = setTimeout(type, delay);
    };

    type();

    return { destroy: () => clearTimeout(timer) };
  })();

  // ==============================
  // 3. СЧЁТЧИК АКТИВНЫХ СЕССИЙ
  // ==============================
  const counter = (() => {
    const el = document.getElementById('counterValue');
    if (!el) return;

    const target = 142857;
    const duration = 3000; // 3 секунды
    const startTime = performance.now();
    const startVal = 0;

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Плавное замедление (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startVal + (target - startVal) * eased);

      el.textContent = currentVal.toLocaleString('ru-RU');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  })();

  // ==============================
  // 4. ХОВЕР-ЭФФЕКТ ДЛЯ ТОЧЕК СЛАЙДЕРА
  // ==============================
  // Акцент на точках при наведении уже через CSS

  // ==============================
  // 5. ПЛАВНАЯ СМЕНА АКТИВНОЙ ССЫЛКИ В ХЕДЕРЕ
  // ==============================
  const navLinks = document.querySelectorAll('.header__nav-link');
  if (navLinks.length) {
    const sections = document.querySelectorAll('section[id]');

    const updateActiveLink = () => {
      let currentId = 'hero';
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        if (top <= 150) {
          currentId = section.id;
        }
      });

      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${currentId}`;
        link.classList.toggle('active', isActive);
      });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

});
