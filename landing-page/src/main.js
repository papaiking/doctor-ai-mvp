// Sticky Nav
const navbar = document.getElementById('navbar');
const hero = document.getElementById('hero');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      navbar.classList.add('glass-nav');
      navbar.classList.remove('bg-transparent');
    } else {
      navbar.classList.remove('glass-nav');
      navbar.classList.add('bg-transparent');
    }
  });
}, { threshold: 0 });

if (hero) observer.observe(hero);

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Active Nav Link Observer
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const activeNavObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

sections.forEach(section => activeNavObserver.observe(section));

// Reveal Intersection Observer
const revealOptions = {
  root: null,
  threshold: 0.15,
  rootMargin: '0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
      // Ensure staggered items within are visible too
      entry.target.querySelectorAll('.stagger-item').forEach(item => {
        item.classList.add('reveal-visible');
      });
    }
  });
}, revealOptions);

document.querySelectorAll('.reveal-hidden').forEach(el => revealObserver.observe(el));


// YouTube Embed
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      const el = entry.target;
      const iframe = el.querySelector('iframe');
      if (iframe) {
        const videoId = el.dataset.video;
        const imgPath = el.dataset.thumb || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        el.innerHTML = `
            <img src="${imgPath}" alt="Video Demo" loading="lazy" class="absolute inset-0 w-full h-full object-cover">
            <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-500"></div>
            <div class="play-button absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-primary transition-transform group-hover:scale-110"><path d="M8 5v14l11-7z"/></svg>
            </div>
        `;
      }
    }
  });
}, { threshold: 0 });

document.querySelectorAll('.youtube-placeholder').forEach(el => {
  const img = el.querySelector('img');
  if (img) el.dataset.thumb = img.getAttribute('src');
  videoObserver.observe(el);

  const playVideo = () => {
    if (!el.querySelector('iframe')) {
      const videoId = el.dataset.video;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.className = 'w-full h-full absolute inset-0';
      iframe.frameBorder = "0";
      el.innerHTML = '';
      el.appendChild(iframe);
    }
  };

  el.addEventListener('mouseenter', playVideo);
  el.addEventListener('click', playVideo);
});

// Modal
const modal = document.getElementById('cta-modal');

function openModal() {
  if(modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function closeModalOnBackdrop(e) {
  if (e.target === modal) closeModal();
}

// Form handling
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const submitBtn = document.getElementById('form-submit');
  const errorDiv = document.getElementById('form-error');
  const successDiv = document.getElementById('form-success');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Đang gửi...';
  errorDiv.classList.add('hidden');

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      form.classList.add('hidden');
      successDiv.classList.remove('hidden');
      setTimeout(closeModal, 3000);
    } else {
      errorDiv.classList.remove('hidden');
    }
  } catch (err) {
    errorDiv.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Gửi đăng ký';
  }

  return false;
}

window.openModal = openModal;
window.closeModal = closeModal;
window.closeModalOnBackdrop = closeModalOnBackdrop;
window.handleFormSubmit = handleFormSubmit;
