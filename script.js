// =========================================================
// Lomas del Río Pádel — Interacciones del sitio
// =========================================================

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
  });
}

// Close menu on link click (mobile)
document.querySelectorAll('.menu a').forEach(a => {
  a.addEventListener('click', () => {
    if (hamburger && hamburger.classList.contains('open')) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    }
  });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if (q) {
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  }
});

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Date pills (booking page)
document.querySelectorAll('.date-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

// Slot selection (booking page)
document.querySelectorAll('.slot.available, .slot.peak').forEach(slot => {
  slot.addEventListener('click', () => {
    slot.classList.toggle('selected');
    updateBookingTotal();
  });
});

function updateBookingTotal() {
  const selected = document.querySelectorAll('.slot.selected').length;
  const totalEl = document.getElementById('booking-count');
  const sumEl = document.getElementById('booking-sum');
  if (totalEl) totalEl.textContent = selected;
  if (sumEl) {
    const peakCount = document.querySelectorAll('.slot.peak.selected').length;
    const offCount = document.querySelectorAll('.slot.available.selected').length;
    const total = peakCount * 480 + offCount * 350;
    sumEl.textContent = '$' + total.toLocaleString('es-MX');
  }
}

// Set default date to today on quick reservation
const dateInput = document.querySelector('.quickres input[type="date"]');
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.value = `${yyyy}-${mm}-${dd}`;
}

// Membership selector (membresias.html)
document.querySelectorAll('.compare-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.compare-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Tournament filter
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const filter = pill.dataset.filter;
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    document.querySelectorAll('.tournament').forEach(t => {
      if (filter === 'all' || t.dataset.cat === filter) {
        t.style.display = '';
      } else {
        t.style.display = 'none';
      }
    });
  });
});
