/* =========================================================
   LISTE DES PERSONNAGES
   ========================================================= */

const students = [
  {
    name: "Black Goku",
    photo: "img/black.jpg",
    role: "Dernier Dieu en vie, il veut accomplir son plan Zéro Humains",
    web: "https://salutoi3008.github.io/Presentation-Black_Goku/",
    sound: "sons/goku-black.mp3",
    tech: ["Super sayan rosé", "Super Kaméhaméha black rosé", "Fusion Potalas"],
    bio: "Dieu maléfique, il est né pour exterminer les êtres inférieurs."
  },

  {
    name: "Brook",
    photo: "img/brook.jpg",
    role: "Musicien et épéiste hors pair de l'équipage du chapeau de paille",
    web: "https://onepiece.fandom.com/wiki/Brook",
    tech: ["Soul Solid", "Style Kabuki", "Le bon rhum de Binks"],
    bio: "Ancien pirates des Rumbar, il a été ramené à la vie grâce au Yomi Yomi no Mi."
  },

  {
    name: "Itachi Uchiwa",
    photo: "img/Itachi.jpg",
    role: "Génie déchu du clan Uchiwa, sacrifié pour la paix de Konoha",
    web: "https://naruto.fandom.com/fr/wiki/Itachi_Uchiwa",
    sound: "sons/itachi-uchiwa.mp3",
    tech: ["Tsukuyomi", "Amaterasu", "Izanami"],
    bio: "Ninja de génie, il trahit son clan pour protéger son village et son petit-frère."
  },

  {
    name: "Levi Ackerman",
    photo: "img/Livai.jpg",
    role: "Soldat le plus fort de l'humanité, Commandant de l'Escouade Levi",
    web: "https://attackontitan.fandom.com/wiki/Levi_Ackerman",
    tech: ["Equipement tri-dimensionnelle", "Commandant d'escouade", "Protecteur de l'humanité"],
    bio: "Né des bas-fonds de Paradis, il est devenu le soldat le plus fort du Bataillon d'exploration."
  }
];

/* =========================================================
   PETITS UTILITAIRES GÉNÉRIQUES
   ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const sanitize = (s = '') => String(s).replace(/[<>]/g, ch => ({'<': '&lt;', '>': '&gt;'}[ch]));

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0] ? p[0].toUpperCase() : '').join('');
}

function colorFrom(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  const hue = h % 360;
  return `linear-gradient(135deg, hsl(${hue} 90% 55%), hsl(${(hue + 60) % 360} 90% 55%))`;
}

/* =========================================================
   CONSTRUCTION D'UNE CARTE
   ========================================================= */
function cardTemplate(p) {
  const name = sanitize(p.name || 'Inconnu');
  const role = sanitize(p.role || 'Étudiant(e) BTS CIEL');
  const tech = (p.tech || []).slice(0, 5).map(t => `<span class="tag">${sanitize(t)}</span>`).join('');

  const img = p.photo 
    ? `<img src="${sanitize(p.photo)}" alt="Photo de ${name}" onerror="this.remove();this.closest('.avatar').dataset.fallback='1'">` 
    : '';

  const web = p.web 
    ? `<a class="btn" href="${p.web}" title="Page Web" target="_blank" rel="noopener">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="currentColor" stroke-width="2"/>
        </svg> Web</a>` 
    : '';

  const sound = p.sound 
    ? `<button class="btn sound-btn" data-src="${sanitize(p.sound)}" title="Écouter la voix">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg> Voix</button>` 
    : '';

  return `
    <article class="card" tabindex="0">
      <div class="card-head">
        <div class="avatar" style="background:${colorFrom(name)}" data-name="${name}">${img || `<span>${initials(name)}</span>`}</div>
        <div>
          <h3>${name}</h3>
          <div class="role">${role}</div>
        </div>
      </div>
      <div class="tags">${tech}</div>
      <div class="bio">${sanitize(p.bio || '')}</div>

      <div class="card-footer">
        <div class="btn-row space-between">${web} ${sound}</div>
      </div>
    </article>`;
}

/* =========================================================
   AFFICHAGE & RECHERCHE
   ========================================================= */
function render(list) {
  const el = document.getElementById('list');
  el.innerHTML = list.map(cardTemplate).join('');
  document.getElementById('empty').hidden = list.length !== 0;
}

function filter(q) {
  const s = q.trim().toLowerCase();
  if (!s) return students;
  return students.filter(p => {
    const hay = [p.name, p.role, p.bio, ...(p.tech || [])].join(' ').toLowerCase();
    return hay.includes(s);
  });
}

// Raccourci clavier "/"
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) {
    e.preventDefault();
    document.getElementById('q').focus();
  }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('q').addEventListener('input', (e) => render(filter(e.target.value)));
  render(students);
});

/* =========================================================
   GESTION DES ERREURS D'IMAGES
   ========================================================= */
document.addEventListener('error', (e) => {
  const img = e.target;
  if (img.tagName === 'IMG') {
    const wrap = img.closest('.avatar');
    if (wrap) {
      const name = wrap.dataset.name || '';
      wrap.innerHTML = `<span>${initials(name)}</span>`;
      wrap.style.background = colorFrom(name);
    }
  }
}, true);

/* =========================================================
   GESTION DU SON
   ========================================================= */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.sound-btn');
  if (!btn) return;

  const card = btn.closest('.card');
  let audio = card.querySelector('audio.card-audio');

  // Si le bouton est déjà en mode "Stop" → on arrête
  if (btn.textContent.trim().includes("Stop")) {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    // Remet le bouton en mode "Voix"
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg> Voix`;
    return;
  }

  // Sinon → c'est un clic sur "Voix" → on joue le son

  // Arrêter tous les autres sons
  document.querySelectorAll('audio.card-audio').forEach(a => {
    a.pause();
    a.currentTime = 0;
    const otherBtn = a.closest('.card')?.querySelector('.sound-btn');
    if (otherBtn) {
      otherBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg> Voix`;
    }
  });

  // Créer l'audio s'il n'existe pas
  if (!audio) {
    audio = document.createElement('audio');
    audio.className = 'card-audio';
    audio.src = btn.dataset.src;
    card.appendChild(audio);
  }

  audio.play().catch(err => console.warn("Lecture audio bloquée :", err));

  // Change le bouton en Stop
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
      <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
    </svg> Stop`;

  // Quand le son se termine naturellement
  audio.onended = () => {
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg> Voix`;
  };
});