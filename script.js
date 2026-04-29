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

// —— Supabase: form_submissions (opción A, una tabla) ——
const FORM_SUCCESS = {
  contacto: '¡Mensaje enviado! Te responderemos en menos de 1 hora hábil.',
  index_contacto: '¡Gracias! Te contactaremos en menos de 1 hora hábil.',
  newsletter: '¡Suscripción confirmada!',
  torneos_inscripcion: '¡Recibido! Te confirmamos cupo en menos de 24 horas.',
  academia_inscripcion: '¡Recibido! Te contactamos en menos de 1 hora hábil.',
  membresias: '¡Recibido! Te contactaremos en menos de 1 hora.',
  quick_reserva: null
};

function supabaseConfigOk(cfg) {
  return Boolean(
    cfg &&
    typeof cfg.url === 'string' &&
    cfg.url.length > 10 &&
    typeof cfg.anonKey === 'string' &&
    cfg.anonKey.length > 20
  );
}

function formDataToPayload(form) {
  const fd = new FormData(form);
  const payload = {};
  fd.forEach((value, key) => {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      const prev = payload[key];
      payload[key] = Array.isArray(prev) ? [...prev, value] : [prev, value];
    } else {
      payload[key] = value;
    }
  });
  return payload;
}

function pickEmailFromPayload(p) {
  const v = (p.email || p.correo || '').toString().trim();
  return v || null;
}

function pickNameFromPayload(p) {
  const v = (p.nombre || p.nombre_completo || p.alumno_nombre || '').toString().trim();
  return v || null;
}

(function initFormSubmissions() {
  document.querySelectorAll('form[data-form-key]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const key = form.dataset.formKey;
      if (!key) return;

      const cfg = window.__SUPABASE_CONFIG__;
      if (!supabaseConfigOk(cfg)) {
        alert('Configura Supabase: en Vercel añade SUPABASE_URL y SUPABASE_ANON_KEY, o copia config.example.js como config.js en local.');
        return;
      }

      const base = cfg.url.replace(/\/$/, '');
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const payload = formDataToPayload(form);
      const row = {
        form_key: key,
        payload,
        email: pickEmailFromPayload(payload),
        name: pickNameFromPayload(payload)
      };

      try {
        const res = await fetch(`${base}/rest/v1/form_submissions`, {
          method: 'POST',
          headers: {
            apikey: cfg.anonKey,
            Authorization: `Bearer ${cfg.anonKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal'
          },
          body: JSON.stringify(row)
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || res.statusText);
        }

        const msg = FORM_SUCCESS[key];
        if (msg) alert(msg);

        if (key === 'quick_reserva' && form.dataset.afterSubmit === 'navigate') {
          const dest = form.getAttribute('action') || 'reservas.html';
          window.location.href = dest;
          return;
        }

        form.reset();
      } catch (err) {
        console.error(err);
        alert('No se pudo enviar el formulario. Intenta de nuevo o escríbenos por WhatsApp.');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
})();
