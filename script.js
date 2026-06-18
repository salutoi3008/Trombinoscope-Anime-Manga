/* =========================================================
            GESTION DU THÈME CLAIR/SOMBRE
   ========================================================= 
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("themeToggle");
    if (!btn) return; // sécurité : si le bouton n'existe pas dans le HTML, on arrête là



    let theme = localStorage.getItem("theme") || "auto";
    applyTheme(theme);



    // Au clic sur le bouton : on bascule entre "dark" et "light"
    btn.addEventListener("click", () => {
      if (theme === "dark") theme = "light";
      else theme = "dark";
      applyTheme(theme);
      localStorage.setItem("theme", theme); // on mémorise le choix pour la prochaine visite
    });



    // Applique le thème choisi : pose l'attribut data-theme sur <html>
    // (c'est cet attribut que style.css utilise pour changer les couleurs),
    // et met à jour l'icône du bouton (lune ou soleil).
    function applyTheme(mode) {
      if (mode === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        btn.textContent = "🌙";
      } else if (mode === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        btn.textContent = "☀️";
      }
    }
  });  */ 
  



  
  
  /* =========================================================
     LISTE DES PERSONNAGES
     C'est LE tableau des personnage avec leurs
     propres informations :
       - name   : nom affiché sur la fiche
       - photo  : chemin vers une image 
       - role   : petite accroche/description sous le nom
       - web    : lien vers une page perso (ex: un exercice du cours)
       - tech   : tableau de 3 (ou plus) technos/compétences -> affichées en pastilles
       - bio    : courte description
     Tout ce tableau est ensuite transformé en cartes HTML par
     la fonction cardTemplate() plus bas.
     ========================================================= */

  const students = [
    
      {
        name: "Black Goku",
        photo: "img/black.jpg",
        role: " Dernier Dieu en vie, il veut accomplir son plan Zéro Humains",
        web: "https://salutoi3008.github.io/Presentation-Black_Goku/", 
        tech: ["Super sayan rosé", "Super Kaméhaméha black rosé", "Fusion Potalas"],
        bio: "Dieu maléfique, il est né pour exterminer les êtres inférieurs.  "
      },


      {
        name: "Brook",
        photo: "img/brook.jpg",
        role: "Musicien et épéiste hors pair de l'équipage du chapeau de paille",
        web: "https://onepiece.fandom.com/wiki/Brook",
        tech: ["Soul Solid", "Style Kabuki", " Le bon rhum de Binks"],
        bio: "Ancien pirates des Rumbar, il a été ramené à la vie grâce au Yomi Yomi no Mi.  "
       
      },


      {
        name: "Itachi Uchiwa",
        photo: "img/itachi.jpg",
        role: "Génie déchu du clan Uchiwa, sacrifié pour la paix de Konoha",
        web: "https://naruto.fandom.com/fr/wiki/Itachi_Uchiwa",
        tech: ["Tsukuyomi", "Amaterasu", "Izanami"],
        bio: "Ninja de génie, il trahit son clan pour protéger son village et son petit-frère."
      },


      {
        name: "Levi Ackerman",
        photo: "img/Livai.jpg",
        role: " Soldat le plus fort de l'humanité, Commandant de l'Escouade Levi",
        web: "https://attackontitan.fandom.com/wiki/Levi_Ackerman", 
        tech: ["Equipement tri-dimensionnelle", "Commandant d'escouade", "Protecteur de l'humanité"],
        bio: "Né des bas-fonds de Paradis, il est devenu le soldat le plus fort du Bataillon d'exploration. "
      },


      
  ];
  
  /* =========================================================
     PETITS UTILITAIRES GÉNÉRIQUES
     ========================================================= */

  // Raccourcis pour document.querySelector / querySelectorAll.
  // $('.card') équivaut à document.querySelector('.card'), mais plus court à écrire.
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Échappe les caractères < et > pour éviter qu'un texte saisi par un élève
  // (nom, bio, techno...) ne soit interprété comme du code HTML.
  // C'est une protection basique contre les failles XSS.
  const sanitize = (s='') => String(s).replace(/[<>]/g, ch => ({'<':'&lt;','>':'&gt;'}[ch]));
  
  // Récupère les initiales d'un nom (ex: "Enzo Salutoi" -> "ES")
  // Utilisé comme avatar de secours quand il n'y a pas de photo (ou qu'elle ne charge pas).
  function initials(name) {
    const parts = String(name || '').trim().split(/\s+/).slice(0,2); // garde au max les 2 premiers "mots"
    return parts.map(p => p[0] ? p[0].toUpperCase() : '').join('');
  }
  
  // Génère une couleur (dégradé) toujours identique pour un même nom.
  // Principe : on transforme le texte du nom en nombre (hash), puis on
  // utilise ce nombre pour choisir une teinte (hue) de 0 à 359.
  // Ainsi "Enzo Salutoi" aura toujours la même couleur d'avatar.
  function colorFrom(name) {
   
    let h=0; for (let i=0;i<name.length;i++) h = (h*31 + name.charCodeAt(i))>>>0;
    const hue = h % 360;
    return `linear-gradient(135deg, hsl(${hue} 90% 55%), hsl(${(hue+60)%360} 90% 55%))`;
  }
  
  /* =========================================================
     CONSTRUCTION D'UNE CARTE (FICHE) ÉLÈVE
     Prend un objet "p" (un élément du tableau students) et
     renvoie le code HTML correspondant, sous forme de texte
     (template string), qui sera ensuite injecté dans la page.
     ========================================================= */
  function cardTemplate(p){
    // Valeurs par défaut si jamais "name" ou "role" sont absents
    const name = sanitize(p.name || 'Inconnu');
    const role = sanitize(p.role || 'Étudiant(e) BTS CIEL');
    // On affiche au maximum 5 technos, chacune dans une pastille <span class="tag">
    const tech = (p.tech||[]).slice(0,5).map(t=>`<span class="tag">${sanitize(t)}</span>`).join('');
  
    // Photo : si "photo" est renseigné, on affiche une <img>.
    // onerror="this.remove()..." : si l'image ne charge pas (lien cassé),
    // on la supprime du DOM et on prévient le parent .avatar pour qu'il
    // affiche les initiales à la place (voir l'écouteur "error" plus bas).
    const img = p.photo ? `<img src="${sanitize(p.photo)}" alt="Photo de ${name}" onerror="this.remove();this.closest('.avatar').dataset.fallback='1'">` : '';

    // Bouton Email : créé seulement si p.email existe (sinon chaîne vide -> rien ne s'affiche)
    const email = p.email ? `<a class="btn" href="mailto:${sanitize(p.email)}" title="Envoyer un email">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 6h18v12H3z" stroke="currentColor" stroke-width="2"/>
        <path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="2"/>
      </svg> Email</a>` : '';

    // Bouton GitHub : lien externe, target="_blank" ouvre dans un nouvel onglet,
    // rel="noopener" est une bonne pratique de sécurité pour les liens target="_blank"
    const gh = p.github ? `<a class="btn" target="_blank" rel="noopener" href="${sanitize(p.github)}" title="Profil GitHub">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58l-.02-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.35-1.76-1.35-1.76-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.31 3.52 1 .11-.79.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.46 11.46 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.64.25 2.86.12 3.16.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.47 5.93.43.37.82 1.11.82 2.24l-.01 3.32c0 .32.21.7.82.58A12 12 0 0012 .5z"/>
      </svg> GitHub</a>` : '';

    // Bouton "Web" : lien vers une page perso (souvent un exercice du cours).
    // Remarque : ce lien n'a pas target="_blank", il ouvre donc dans le même onglet.
    const web = p.web ? `<a class="btn" href="${sanitize(p.web)}" title="Page Web">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="currentColor" stroke-width="2"/>
      </svg> Web</a>` : '';

    // Bouton "Clicker" : optionnel, seulement présent chez certains élèves (champ "clic")
    const clic = p.clic ? `<a class="btn" target="_blank" rel="noopener"  href="${sanitize(p.clic)}" title="Page Clicker">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="currentColor" stroke-width="2"/>
      </svg> Clicker</a>` : '';
    
    // Assemblage final de la carte HTML pour cet élève.
    // tabindex="0" rend la carte focusable au clavier (accessibilité).
    return `
      <article class="card" tabindex="0">
        <div class="card-head">
          <div class="avatar" style="background:${colorFrom(name)}" data-name="${name}">${img || `<span>${initials(name)}</span>`}</div>
          <div>
            <h3>${name}</h3>
            <div class="role">${role}</div>
          </div>
        </div>
        <div class="tags">${tech || ''}</div>
        <div class="bio">${sanitize(p.bio || '')}</div>
  
        <div class="card-footer">
          <div class="btn-row space-between">${email} ${gh}</div>
          <div class="btn-row space-between">${web} ${clic}</div>
        </div>
      </article>`;
  }
  
  /* =========================================================
     AFFICHAGE DE LA LISTE
     Transforme un tableau d'élèves en HTML et l'injecte dans
     #list. Affiche/masque aussi le message "Aucun résultat".
     ========================================================= */
  function render(list){
    const el = document.getElementById('list');
    el.innerHTML = list.map(cardTemplate).join(''); // une carte par élève, concaténées
    document.getElementById('empty').hidden = list.length !== 0; // visible seulement si liste vide
  }
  
  /* =========================================================
     RECHERCHE / FILTRAGE
     Reçoit le texte tapé dans la barre de recherche et renvoie
     la liste des élèves correspondants (nom, rôle, bio ou technos).
     ========================================================= */
  function filter(q){
    const s = q.trim().toLowerCase();
    if(!s) return students; // champ vide -> on renvoie tout le monde
    return students.filter(p => {
      // On regroupe tous les champs textuels d'un élève dans une seule
      // grande chaîne ("hay" = "haystack"/botte de foin), pour chercher
      // le texte tapé n'importe où dedans en une seule fois.
      const hay = [p.name, p.role, p.bio, ...(p.tech||[])].join(' ').toLowerCase();
      return hay.includes(s);
    });
  }
  
  // Raccourci clavier "/" pour aller directement dans le champ de recherche,
  // sauf si on est déjà en train d'écrire dans un input ou un textarea.
  window.addEventListener('keydown', (e)=>{
    if(e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)){
      e.preventDefault(); document.getElementById('q').focus();
    }
  });
  
  // Une fois la page chargée : on branche la recherche en direct sur l'input,
  // et on affiche la liste complète des élèves au tout premier chargement.
  document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('q').addEventListener('input', (e)=> render(filter(e.target.value)));
    render(students);
  });
  
  /* =========================================================
     SECOURS SI UNE IMAGE NE CHARGE PAS
     Cet écouteur global capte TOUTES les erreurs de chargement
     d'image sur la page (le "true" final = on écoute l'événement
     dès qu'il apparaît, même sur des éléments ajoutés après coup).
     Si une photo d'élève est cassée, on remplace l'avatar par les
     initiales du nom, avec une couleur de fond générée.
     ========================================================= */
  document.addEventListener('error', (e)=>{
    const img = e.target;
    if(img.tagName === 'IMG'){
      const wrap = img.closest('.avatar');
      if(wrap){
        const name = wrap.dataset.name || '';
        wrap.innerHTML = `<span>${initials(name)}</span>`;
        wrap.style.background = colorFrom(name);
      }
    }
  }, true);
  
  /* =========================================================
     ⚠️ DOUBLON : ce bloc est une copie EXACTE du tout premier
     bloc en haut du fichier (gestion du bouton de thème).
     Le code fonctionne quand même car les deux écouteurs
     DOMContentLoaded s'exécutent simplement l'un après l'autre,
     mais ce second bloc est inutile et peut être supprimé sans
     rien casser sur la page.
     ========================================================= */
  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
  
    // Lire le thème stocké
    let theme = localStorage.getItem("theme") || "auto";
    applyTheme(theme);
  
    btn.addEventListener("click", () => {
      if (theme === "dark") theme = "light";
      else theme = "dark";
      applyTheme(theme);
      localStorage.setItem("theme", theme);
    });
  
    function applyTheme(mode) {
      if (mode === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        btn.textContent = "🌙";
      } else if (mode === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        btn.textContent = "☀️";
      }
    }
  });
  