const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-list a");

const scrollContainer = document.getElementById("tratamentos-scroll");
const tratamentoItems = scrollContainer.querySelectorAll('.tratamento-item');
tratamentoItems.forEach(item => {
  item.draggable = false;
});

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
      const navbarHeight = 70;
      const offset = 30;
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

const slides = document.querySelectorAll(".carousel-img");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
let current = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

if (slides.length > 0) {
  showSlide(current);
}

nextBtn.addEventListener("click", () => {
  current = (current + 1) % slides.length;
  showSlide(current);
});

prevBtn.addEventListener("click", () => {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
});

if (!window.carouselInterval) {
  window.carouselInterval = setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 5000);
}

const faders = document.querySelectorAll(".fade-in");
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

faders.forEach(fader => appearOnScroll.observe(fader));

const btnLeft = document.querySelector(".scroll-btn.left");
const btnRight = document.querySelector(".scroll-btn.right");

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('tratamentos-scroll');
  const leftBtn = document.querySelector('.scroll-btn.left');
  const rightBtn = document.querySelector('.scroll-btn.right');

  function getScrollAmount() {
    const item = scrollContainer.querySelector('.tratamento-item');
    if (item) {
      const styles = window.getComputedStyle(item);
      const marginLeft = parseFloat(styles.marginLeft) || 0;
      const marginRight = parseFloat(styles.marginRight) || 0;
      return item.offsetWidth + marginLeft + marginRight;
    }
    return 350;
  }

  function snapToNearestItem() {
    const scrollAmount = getScrollAmount();
    const currentScroll = scrollContainer.scrollLeft;
    const nearestItemIndex = Math.round(currentScroll / scrollAmount);
    scrollContainer.scrollTo({
      left: nearestItemIndex * scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollContainer.scrollTo({
    left: 0,
    behavior: 'smooth'
  });

  leftBtn.addEventListener('click', () => {
    const scrollAmount = getScrollAmount();
    scrollContainer.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });

  rightBtn.addEventListener('click', () => {
    const scrollAmount = getScrollAmount();
    scrollContainer.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });

  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice()) {
    let isDragging = false;
    let startX;
    let scrollLeft;

    scrollContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      scrollContainer.classList.add('grabbing');
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX);
      scrollContainer.scrollLeft = scrollLeft - walk;
    });

    scrollContainer.addEventListener('mouseup', () => {
      isDragging = false;
      scrollContainer.classList.remove('grabbing');
      snapToNearestItem();
    });

    scrollContainer.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        scrollContainer.classList.remove('grabbing');
        snapToNearestItem();
      }
    });
  }

  scrollContainer.addEventListener('scroll', () => {
    clearTimeout(scrollContainer.scrollTimeout);
    scrollContainer.scrollTimeout = setTimeout(snapToNearestItem, 100);
  });

  window.addEventListener('resize', () => {
    scrollContainer.scrollTo({
      left: 0,
      behavior: 'smooth'
    });
  });
});

const btnTop = document.getElementById("btn-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    btnTop.classList.add("show");
  } else {
    btnTop.classList.remove("show");
  }
});

btnTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

const popup = document.getElementById("tratamento-popup");
const popupTitle = popup.querySelector(".popup-title");
const popupDescription = popup.querySelector(".popup-description");
const popupClose = popup.querySelector(".popup-close");
const saibaMaisButtons = document.querySelectorAll(".saiba-mais-btn");

// Novas variáveis para o carrossel do popup
const popupTrack = popup.querySelector(".popup-carousel-track");
const popupPrev = popup.querySelector(".prev-btn");
const popupNext = popup.querySelector(".next-btn");
let popupImagesList = [];
let popupCurrentIdx = 0;

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
      imgEl.alt = btn.dataset.title;
      if(idx === 0) imgEl.classList.add('active');
      popupTrack.appendChild(imgEl);
    });
    
    if(popupImagesList.length > 1) {
      popupPrev.style.display = 'flex';
      popupNext.style.display = 'flex';
    } else {
      popupPrev.style.display = 'none';
      popupNext.style.display = 'none';
    }

    popup.classList.add("active");
    lockScroll();
  });
});

function updatePopupCarousel() {
  const imgs = popupTrack.querySelectorAll('img');
  imgs.forEach((img, idx) => {
    img.classList.remove('active');
    if(idx === popupCurrentIdx) img.classList.add('active');
  });
}

popupPrev.addEventListener('click', () => {
  popupCurrentIdx = (popupCurrentIdx - 1 + popupImagesList.length) % popupImagesList.length;
  updatePopupCarousel();
});

popupNext.addEventListener('click', () => {
  popupCurrentIdx = (popupCurrentIdx + 1) % popupImagesList.length;
  updatePopupCarousel();
});

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

// Alternador automático de imagens para os cards de tratamentos (Mini Carrossel)
document.addEventListener('DOMContentLoaded', () => {
  const miniCarousels = document.querySelectorAll('.mini-carousel');
  
  miniCarousels.forEach(carousel => {
    const images = carousel.querySelectorAll('.mini-img');
    let currentIdx = 0;
    
    // Só roda o carrossel se tiver mais de 1 imagem
    if (images.length > 1) {
      setInterval(() => {
        images[currentIdx].classList.remove('active');
        currentIdx = (currentIdx + 1) % images.length;
        images[currentIdx].classList.add('active');
      }, 3500); // Troca a imagem a cada 3,5 segundos
    }
  });
});