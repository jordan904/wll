/* ===== WOODS LAWN & LANDSCAPE — SCRIPTS ===== */

(function () {
  'use strict';

  /* --- Navbar scroll effect --- */
  var navbar = document.querySelector('.navbar');
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  var scrollThreshold = 60;

  function updateNavbar() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* Debounce utility */
  function debounce(fn, delay) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  }

  window.addEventListener('scroll', debounce(updateNavbar, 10), { passive: true });
  updateNavbar();

  /* --- Mobile nav toggle --- */
  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close mobile nav on link click */
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Close mobile nav on outside click */
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* --- Scroll-triggered fade-in animations --- */
  if ('IntersectionObserver' in window) {
    var fadeEls = document.querySelectorAll('.fade-in');
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var parent = entry.target.parentElement;
            var siblings = Array.from(parent.children).filter(function(c) {
              return c.classList.contains('fade-in');
            });
            var index = siblings.indexOf(entry.target);
            var delay = Math.min(index * 150, 600);
            setTimeout(function() {
              entry.target.classList.add('visible');
            }, delay);
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  /* --- Gallery lightbox --- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.querySelector('.lightbox-close');
  var lightboxPrev = document.querySelector('.lightbox-prev');
  var lightboxNext = document.querySelector('.lightbox-next');
  var galleryItems = document.querySelectorAll('.gallery-item');
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    var img = galleryItems[index].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    galleryItems[currentIndex].focus();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    var img = galleryItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    var img = galleryItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () {
      openLightbox(index);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

  /* Lightbox keyboard navigation */
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  /* Close lightbox on backdrop click */
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* --- Contact form --- */
  var form = document.getElementById('contact-form');
  var formSuccess = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Honeypot check */
      var hp = form.querySelector('[name="website_url"]');
      if (hp && hp.value) return;

      /* Validate fields */
      var valid = true;
      var fields = form.querySelectorAll('[required]');

      fields.forEach(function (field) {
        var errorMsg = field.parentElement.querySelector('.error-message');

        if (!field.value.trim()) {
          field.classList.add('invalid');
          field.setAttribute('aria-invalid', 'true');
          if (errorMsg) {
            errorMsg.style.display = 'block';
            field.setAttribute('aria-describedby', errorMsg.id);
          }
          valid = false;
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          field.classList.add('invalid');
          field.setAttribute('aria-invalid', 'true');
          if (errorMsg) {
            errorMsg.style.display = 'block';
            field.setAttribute('aria-describedby', errorMsg.id);
          }
          valid = false;
        } else if (field.type === 'tel' && !/^[\d\s()+-]{7,}$/.test(field.value)) {
          field.classList.add('invalid');
          field.setAttribute('aria-invalid', 'true');
          if (errorMsg) {
            errorMsg.style.display = 'block';
            field.setAttribute('aria-describedby', errorMsg.id);
          }
          valid = false;
        } else {
          field.classList.remove('invalid');
          field.removeAttribute('aria-invalid');
          if (errorMsg) {
            errorMsg.style.display = 'none';
            field.removeAttribute('aria-describedby');
          }
        }
      });

      if (!valid) {
        var firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /* Show success */
      form.style.display = 'none';
      formSuccess.classList.add('visible');
    });

    /* Clear error on input */
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('invalid');
        field.removeAttribute('aria-invalid');
        var errorMsg = field.parentElement.querySelector('.error-message');
        if (errorMsg) {
          errorMsg.style.display = 'none';
          field.removeAttribute('aria-describedby');
        }
      });
    });
  }
})();
