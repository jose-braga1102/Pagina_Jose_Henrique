// ==========================================================================
// MOBILE NAVIGATION MENU
// ==========================================================================
const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-list a");

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
    const expanded = nav.classList.contains("active");
    hamburger.setAttribute("aria-expanded", expanded);
  });

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const navbarHeight = 72;
        const offset = 16;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
      
      nav.classList.remove("active");
      hamburger.setAttribute("aria-expanded", false);
    });
  });
}

// ==========================================================================
// HERO CAROUSEL WITH FADE EFFECT
// ==========================================================================
const heroCarousel = document.querySelector(".hero .carousel");
if (heroCarousel) {
  const slides = heroCarousel.querySelectorAll(".carousel-img");
  const nextBtn = heroCarousel.querySelector(".next");
  const prevBtn = heroCarousel.querySelector(".prev");
  let current = 0;
  let heroInterval = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  }

  if (slides.length > 0) {
    showSlide(current);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetHeroTimer();
    });

    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetHeroTimer();
    });
  }

  function startHeroTimer() {
    if (slides.length > 1) {
      heroInterval = setInterval(nextSlide, 5000);
    }
  }

  function resetHeroTimer() {
    clearInterval(heroInterval);
    startHeroTimer();
  }

  startHeroTimer();

  // Mobile Touch Swipe for Hero Carousel
  let heroStartX = 0;
  heroCarousel.addEventListener('touchstart', (e) => {
    heroStartX = e.touches[0].clientX;
  }, { passive: true });

  heroCarousel.addEventListener('touchend', (e) => {
    const diffX = heroStartX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) nextSlide();
      else prevSlide();
      resetHeroTimer();
    }
  }, { passive: true });
}

// ==========================================================================
// MINI CAROUSELS (SOBRE O CONSULTÓRIO & TRATAMENTO CARDS)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const miniCarousels = document.querySelectorAll('.mini-carousel');
  
  miniCarousels.forEach(carousel => {
    const images = carousel.querySelectorAll('.mini-img');
    if (images.length <= 1) return;

    let currentIdx = 0;
    setInterval(() => {
      images[currentIdx].classList.remove('active');
      currentIdx = (currentIdx + 1) % images.length;
      images[currentIdx].classList.add('active');
    }, 3800);
  });
});

// ==========================================================================
// FADE-IN ON SCROLL OBSERVER
// ==========================================================================
const faders = document.querySelectorAll(".fade-in");
if ('IntersectionObserver' in window) {
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  faders.forEach(fader => appearOnScroll.observe(fader));
} else {
  faders.forEach(fader => fader.classList.add("visible"));
}

// ==========================================================================
// TRATAMENTOS HORIZONTAL SCROLL & DRAG
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('tratamentos-scroll');
  const leftBtn = document.querySelector('.scroll-btn.left');
  const rightBtn = document.querySelector('.scroll-btn.right');

  if (!scrollContainer) return;

  function getScrollAmount() {
    const item = scrollContainer.querySelector('.tratamento-item');
    if (item) {
      const styles = window.getComputedStyle(item);
      const gap = 20;
      return item.offsetWidth + gap;
    }
    return 300;
  }

  function updateArrowsVisibility() {
    if (!leftBtn || !rightBtn) return;
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

    if (maxScroll <= 5) {
      leftBtn.style.display = 'none';
      rightBtn.style.display = 'none';
      scrollContainer.style.justifyContent = 'center';
    } else {
      scrollContainer.style.justifyContent = 'flex-start';
      leftBtn.style.display = scrollContainer.scrollLeft > 10 ? 'flex' : 'none';
      rightBtn.style.display = scrollContainer.scrollLeft < maxScroll - 10 ? 'flex' : 'none';
    }
  }

  if (leftBtn && rightBtn) {
    leftBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }

  // Mouse drag functionality for desktop
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;

  scrollContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    scrollContainer.classList.add('grabbing');
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollStart = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener('mouseleave', () => {
    isDown = false;
    scrollContainer.classList.remove('grabbing');
  });

  scrollContainer.addEventListener('mouseup', () => {
    isDown = false;
    scrollContainer.classList.remove('grabbing');
  });

  scrollContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 1.4;
    scrollContainer.scrollLeft = scrollStart - walk;
  });

  scrollContainer.addEventListener('scroll', updateArrowsVisibility);
  window.addEventListener('resize', updateArrowsVisibility);
  updateArrowsVisibility();
});

// ==========================================================================
// SCROLL TO TOP BUTTON
// ==========================================================================
const btnTop = document.getElementById("btn-top");
if (btnTop) {
  window.addEventListener("scroll", () => {
    btnTop.classList.toggle("show", window.scrollY > 350);
  });

  btnTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ==========================================================================
// MODAL POPUP & DYNAMIC GALLERY
// ==========================================================================
const popup = document.getElementById("tratamento-popup");
if (popup) {
  const popupTitle = popup.querySelector(".popup-title");
  const popupDescription = popup.querySelector(".popup-description");
  const popupClose = popup.querySelector(".popup-close");
  const popupTrack = popup.querySelector(".popup-carousel-track");
  const popupPrev = popup.querySelector(".prev-btn");
  const popupNext = popup.querySelector(".next-btn");
  const saibaMaisButtons = document.querySelectorAll(".saiba-mais-btn");

  let popupImagesList = [];
  let popupCurrentIdx = 0;

  function lockScroll() {
    document.body.classList.add("no-scroll");
  }

  function unlockScroll() {
    document.body.classList.remove("no-scroll");
  }

  function updatePopupCarousel() {
    const imgs = popupTrack.querySelectorAll('img');
    imgs.forEach((img, idx) => {
      img.classList.toggle('active', idx === popupCurrentIdx);
    });
  }

  saibaMaisButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      popupTitle.textContent = btn.dataset.title || "Tratamento";
      popupDescription.textContent = btn.dataset.description || "Descrição do tratamento.";
      
      const imgsData = btn.dataset.img || "slide1.jpeg";
      popupImagesList = imgsData.split(',').map(img => img.trim());
      popupCurrentIdx = 0;
      
      popupTrack.innerHTML = '';
      popupImagesList.forEach((src, idx) => {
        const imgEl = document.createElement('img');
        imgEl.src = src;
        imgEl.alt = `${btn.dataset.title} - Imagem ${idx + 1}`;
        if (idx === 0) imgEl.classList.add('active');
        popupTrack.appendChild(imgEl);
      });
      
      const hasMultiple = popupImagesList.length > 1;
      popupPrev.style.display = hasMultiple ? 'flex' : 'none';
      popupNext.style.display = hasMultiple ? 'flex' : 'none';

      popup.classList.add("active");
      lockScroll();
    });
  });

  if (popupPrev && popupNext) {
    popupPrev.addEventListener('click', () => {
      popupCurrentIdx = (popupCurrentIdx - 1 + popupImagesList.length) % popupImagesList.length;
      updatePopupCarousel();
    });

    popupNext.addEventListener('click', () => {
      popupCurrentIdx = (popupCurrentIdx + 1) % popupImagesList.length;
      updatePopupCarousel();
    });
  }

  popupClose.addEventListener("click", () => {
    popup.classList.remove("active");
    unlockScroll();
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.remove("active");
      unlockScroll();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("active")) {
      popup.classList.remove("active");
      unlockScroll();
    }
  });
}

// ==========================================================================
// REAL-TIME OFFICE CLOCK (BRASÍLIA TIMEZONE)
// ==========================================================================
function updateBusinessHours() {
  const clockEl = document.getElementById("hora-atual");
  if (!clockEl) return;

  const now = new Date();
  const timeString = now.toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit'
  });
  clockEl.textContent = `${timeString} •`;
}

updateBusinessHours();
setInterval(updateBusinessHours, 30000);