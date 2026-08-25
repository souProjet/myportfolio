/* Genere les pages d'entree secondaires a partir d'un gabarit unique.
   Le site reste 100 % statique : ce script est lance a la main, son resultat
   est commite, et Vercel ne fait que servir les fichiers.

   Lancer :  node tools/build-pages.mjs                                     */

import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://swannbougou.in";

/* ------------------------------------------------------------------ */
/* Gabarit partage                                                     */
/* ------------------------------------------------------------------ */

const head = (p) => `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title}</title>
    <meta name="description" content="${p.description}" />
    <link rel="canonical" href="${SITE}/${p.slug}" />
    <link rel="icon" href="assets/img/logo.png" />
    <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png" />
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="Swann Bougouin" />
    <meta property="og:title" content="${p.title}" />
    <meta property="og:description" content="${p.description}" />
    <meta property="og:url" content="${SITE}/${p.slug}" />
    <meta property="og:image" content="${SITE}/assets/img/cover.png" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "${SITE}/" },
              { "@type": "ListItem", "position": 2, "name": "${p.breadcrumb}", "item": "${SITE}/${p.slug}" }
            ]
          },
          {
            "@type": "Service",
            "name": "${p.service.name}",
            "description": "${p.description}",
            "serviceType": "${p.service.type}",
            "url": "${SITE}/${p.slug}",
            "areaServed": ${JSON.stringify(p.service.area)},
            "provider": {
              "@type": "ProfessionalService",
              "name": "Swameta",
              "alternateName": "Swann Bougouin",
              "url": "${SITE}/",
              "email": "contact@swameta.fr",
              "telephone": "+33602221182",
              "address": { "@type": "PostalAddress", "addressLocality": "Nantes", "addressCountry": "FR" }
            }
          }
        ]
      }
    </script>

    <script>
      // Applique le theme avant le premier rendu pour eviter le flash.
      (function () {
        try {
          var t = localStorage.getItem("theme");
          if (t === "light" || t === "dark")
            document.documentElement.setAttribute("data-theme", t);
        } catch (e) {}
      })();
    </script>

    <link rel="preload" as="font" type="font/woff2"
      href="assets/fonts/web/syne-400_800.woff2" crossorigin />
    <link rel="preload" as="font" type="font/woff2"
      href="assets/fonts/web/archivo-400_700.woff2" crossorigin />
    <link rel="stylesheet" href="assets/css/style.css" />

    <script async src="https://www.googletagmanager.com/gtag/js?id=G-J2QM7C3N3S"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag("js", new Date());
      gtag("config", "G-J2QM7C3N3S");
    </script>`;

const nav = `    <header class="nav" id="nav">
      <div class="nav-inner">
        <a class="brand" href="/">Swann Bougouin</a>

        <nav aria-label="Principale">
          <ul class="nav-links">
            <li><a href="/#travaux">Réalisations</a></li>
            <li><a href="/#methode">Méthode</a></li>
            <li><a href="/#parcours">Parcours</a></li>
            <li><a href="/#estimation">Estimation</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </nav>

        <div class="nav-tools">
          <button class="icon-btn theme-toggle" id="theme-toggle" type="button" aria-label="Changer de thème">
            <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.3 6.3 4.8 4.8M19.2 19.2l-1.5-1.5M17.7 6.3l1.5-1.5M4.8 19.2l1.5-1.5" />
            </svg>
            <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20.5 14.3A8.5 8.5 0 1 1 9.7 3.5a6.8 6.8 0 0 0 10.8 10.8Z" />
            </svg>
          </button>
          <a class="btn btn-solid" href="/#estimation">Estimer mon projet</a>
        </div>
      </div>
    </header>`;

const foot = (others) => `    <footer class="foot">
      <div class="shell foot-inner">
        <span>&copy; <span id="year">2026</span> Swann Bougouin / Swameta / Nantes</span>
        <nav aria-label="Pied de page">
${others.map((o) => `          <a href="/${o.slug}">${o.footLabel}</a>`).join("\n")}
          <a href="/mentions-legales.html">Mentions légales</a>
        </nav>
      </div>
    </footer>`;

/* Bloc de conversion identique en bas de chaque page. */
const cta = (p) => `      <section class="band on-ink">
        <div class="shell">
          <div class="head" data-reveal>
            <span class="kicker">Étape suivante</span>
            <h2>${p.ctaTitle}</h2>
            <p class="lede">
              Le simulateur donne une fourchette en trente secondes, sans
              inscription. Elle part avec votre message si vous décidez de
              m'écrire, et je réponds sous 24 heures ouvrées.
            </p>
          </div>
          <p class="legal-back">
            <a class="btn btn-solid" href="/#estimation">Estimer mon projet</a>
            <a class="btn" href="/#contact">Écrire directement</a>
          </p>
        </div>
      </section>`;

const band = (s) => `      <section class="band${s.tone ? " " + s.tone : ""}">
        <div class="shell svc">
          <div class="head" data-reveal>
            ${s.kicker ? `<span class="kicker">${s.kicker}</span>\n            ` : ""}<h2>${s.h2}</h2>
${s.lede ? `            <p class="lede">${s.lede}</p>\n` : ""}          </div>
          <div data-reveal>
${s.html}
          </div>
        </div>
      </section>`;

const faq = (items) => `            <dl class="faq">
${items
  .map((i) => `              <div><dt>${i.q}</dt><dd>${i.a}</dd></div>`)
  .join("\n")}
            </dl>`;

const marks = (items) =>
  `            <ul class="marks">\n${items.map((i) => `              <li>${i}</li>`).join("\n")}\n            </ul>`;

const sites = (items) => `            <div class="sites">
${items
  .map(
    (s) => `              <a class="site" href="${s.url}" target="_blank" rel="noopener">
                <img src="assets/img/${s.img}.webp" alt="${s.alt}" width="800" height="600" loading="lazy" decoding="async" />
                <div class="site-body"><strong>${s.name}</strong><span>${s.host}</span></div>
              </a>`
  )
  .join("\n")}
            </div>`;

const render = (p, others) => `<!DOCTYPE html>
<html lang="fr">
  <head>
<!-- Fichier genere par tools/build-pages.mjs : editez le script, pas ce fichier. -->
${head(p)}
  </head>

  <body id="top">
    <a href="#contenu" class="sr">Aller au contenu</a>

${nav}

    <main id="contenu">
      <section class="band">
        <div class="shell svc">
          <div class="head" data-reveal>
            <span class="kicker">${p.kicker}</span>
            <h1>${p.h1}</h1>
            <p class="lede">${p.lede}</p>
          </div>
          <p class="legal-back" data-reveal>
            <a class="btn btn-solid" href="/#estimation">Estimer mon projet</a>
            <a class="btn" href="/#contact">Me contacter</a>
          </p>
        </div>
      </section>

${p.sections.map(band).join("\n\n")}

${cta(p)}
    </main>

${foot(others)}

    <script src="assets/js/app.js" defer></script>
  </body>
</html>
`;

/* ------------------------------------------------------------------ */
/* Contenu des pages                                                   */
/* ------------------------------------------------------------------ */

const VITRINES = [
  { url: "https://bio-cut.fr/", img: "biocut", name: "Bio Cut", host: "bio-cut.fr", alt: "Site vitrine Bio Cut" },
  { url: "https://planetebois.swameta.fr/", img: "planetebois", name: "Planète Bois", host: "planetebois.swameta.fr", alt: "Site vitrine Planète Bois" },
  { url: "https://sofia.swameta.fr/", img: "sofiastruillou", name: "Sofia Struillou", host: "sofia.swameta.fr", alt: "Site vitrine de Sofia Struillou" },
  { url: "https://une-pause-en-soi.fr/", img: "unepauseensoi", name: "Une Pause En Soi", host: "une-pause-en-soi.fr", alt: "Site vitrine Une Pause En Soi" }
];

const PAGES = [
  /* ---------------------------------------------------------------- */
  {
    slug: "creation-site-internet-nantes.html",
    footLabel: "Site internet",
    breadcrumb: "Création de site internet à Nantes",
    title: "Création de site internet à Nantes | Swann Bougouin",
    description:
      "Création de site vitrine à Nantes par un développeur indépendant : cadrage, design, développement, référencement local et mise en ligne. Dès 450 €.",
    kicker: "Site vitrine",
    h1: "Création de site <br class='br-lg' />internet à Nantes",
    lede:
      "Un site qui vous fait trouver sur les recherches locales, qui inspire confiance en une seconde et qui vous amène des demandes directement. Un seul interlocuteur du premier échange à la mise en ligne.",
    ctaTitle: "Votre site, <br class='br-lg' />chiffré maintenant",
    service: { name: "Création de site internet", type: "Création de site vitrine", area: ["Nantes", "Loire-Atlantique", "France"] },
    sections: [
      {
        kicker: "Pour qui",
        h2: "Artisans et <br class='br-lg' />indépendants",
        lede:
          "Le besoin de fond est toujours le même : exister sur Google quand quelqu'un cherche votre métier près de chez lui, et pouvoir être contacté sans friction.",
        html: `            <p>
              Coiffeur, menuisier, thérapeute, agence de voyages, profession
              libérale : vous n'avez pas besoin d'un site de vingt pages. Vous
              avez besoin de trois choses qui fonctionnent vraiment. Que votre
              nom sorte sur une recherche locale. Qu'un visiteur comprenne en
              cinq secondes ce que vous faites et pour qui. Qu'il puisse vous
              appeler, vous écrire ou réserver sans chercher.
            </p>
            <p>
              Je ne pars pas d'un thème que j'habille. Je pars de votre métier,
              de vos clients et de ce qui déclenche un appel chez vous. Le site
              se construit autour de ça.
            </p>`
      },
      {
        tone: "on-violet",
        kicker: "Compris dans le prix",
        h2: "Ce qui est livré, <br class='br-lg' />sans supplément",
        html: `            <p>
              Le devis est ferme après le cadrage. Il n'y a pas de ligne qui
              apparaît en cours de route.
            </p>
` + marks([
          "Cadrage écrit : périmètre, arborescence, contenus attendus de votre côté",
          "Maquettes validées écran par écran avant la première ligne de code",
          "Développement sur mesure, sans thème acheté ni constructeur de pages",
          "Affichage soigné sur mobile, tablette et ordinateur, testé largeur par largeur",
          "Référencement technique : balises, données structurées, sitemap, vitesse",
          "Formulaire de contact relié à votre boîte mail, sans intermédiaire payant",
          "Mise en ligne, nom de domaine, certificat HTTPS et hébergement configurés",
          "Prise en main en visio d'une heure, puis 30 jours de garantie corrective",
          "Code source livré sur votre dépôt Git : le site vous appartient"
        ])
      },
      {
        kicker: "Référencement local",
        h2: "Sortir sur les <br class='br-lg' />recherches locales",
        lede:
          "Un site vitrine seul ne suffit pas à apparaître. Voici ce qui compte réellement, dans l'ordre.",
        html: `            <p>
              La fiche Google Business Profile pèse davantage que le site pour
              le pack local, ces trois résultats avec une carte qui s'affichent
              en haut. Je la configure avec vous : catégories, zone
              d'intervention, horaires, photos, services. C'est gratuit et
              c'est le premier levier.
            </p>
            <p>
              Ensuite vient la structure du site. Une page par intention de
              recherche, pas une page fourre-tout : votre métier principal, vos
              prestations distinctes, votre zone. Une seule page ne peut se
              positionner que sur une seule chose.
            </p>
            <p>
              Enfin la cohérence de vos coordonnées partout où votre entreprise
              apparaît : même nom, même adresse, même téléphone sur le site, la
              fiche Google et les annuaires. Les écarts coûtent des positions.
            </p>`
      },
      {
        kicker: "Sur pièce",
        h2: "Des sites en ligne, <br class='br-lg' />pas des maquettes",
        lede: "Tout ce qui suit est public. Cliquez, testez sur votre téléphone, jugez.",
        html: sites(VITRINES)
      },
      {
        tone: "on-jaune",
        kicker: "Budget",
        h2: "À partir de 450 €, <br class='br-lg' />en 1 à 2 semaines",
        html: `            <p>
              Un site vitrine simple démarre à 450 €. La fourchette monte selon
              le nombre de pages, le travail de design et les fonctions
              ajoutées : prise de rendez-vous, galerie, multilingue,
              intégration d'un outil que vous utilisez déjà.
            </p>
            <p>
              L'hébergement se situe entre 0 et 17 € par mois selon le trafic
              et les besoins, sans engagement, sur votre propre compte. Vous
              n'êtes attaché à rien ni à personne.
            </p>
            <p>
              Le simulateur vous donne une fourchette précise en trente
              secondes, avec le détail des livrables retenus.
            </p>`
      },
      {
        kicker: "Questions fréquentes",
        h2: "Ce qu'on me <br class='br-lg' />demande souvent",
        html: faq([
          {
            q: "Est-ce que je pourrai modifier mon site moi-même ?",
            a: "Oui si vous le souhaitez. On décide au cadrage : soit vous restez autonome sur vos textes et vos photos via une interface simple, soit vous préférez me confier les mises à jour au coup par coup. Les deux se chiffrent différemment, autant en parler dès le départ."
          },
          {
            q: "Combien de temps avant d'apparaître sur Google ?",
            a: "L'indexation prend quelques jours. Le pack local avec la fiche Google Business Profile peut sortir en deux à quatre semaines. Un positionnement durable sur des requêtes concurrentielles demande plusieurs mois de contenu et de citations locales. Méfiez-vous de quiconque vous promet la première place en un mois."
          },
          {
            q: "Vous travaillez uniquement à Nantes ?",
            a: "Je suis basé à Nantes et je me déplace volontiers en Loire-Atlantique pour le cadrage. Le reste se fait très bien à distance, et je travaille avec des clients partout en France."
          },
          {
            q: "Que se passe-t-il si j'ai un problème après la mise en ligne ?",
            a: "Trente jours de garantie corrective sont compris. Au-delà, vous pouvez prendre une maintenance au mois ou me solliciter à l'heure. Dans les deux cas c'est moi qui interviens, pas un support anonyme."
          },
          {
            q: "Le site m'appartient vraiment ?",
            a: "Oui. Le code source est livré sur votre dépôt Git, le nom de domaine et l'hébergement sont à votre nom. Si vous changez de prestataire un jour, vous partez avec tout."
          }
        ])
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "creation-application-web-saas.html",
    footLabel: "Application web",
    breadcrumb: "Création d'application web et SaaS",
    title: "Création d'application web et SaaS sur mesure | Swann Bougouin",
    description:
      "Développement d'applications web et de produits SaaS sur mesure : comptes clients, paiement, back-office, automatisations. Développeur indépendant à Nantes.",
    kicker: "Application web & SaaS",
    h1: "Application web <br class='br-lg' />et SaaS sur mesure",
    lede:
      "Remplacer les tableurs, vendre en ligne, gérer des comptes clients, automatiser ce qui vous prend des heures chaque semaine. Développé sur mesure, hébergé chez vous, sans licence mensuelle imposée.",
    ctaTitle: "Votre produit, <br class='br-lg' />chiffré maintenant",
    service: { name: "Développement d'application web et SaaS", type: "Développement d'application web", area: ["France"] },
    sections: [
      {
        kicker: "Le déclencheur",
        h2: "Quand le tableur <br class='br-lg' />ne suffit plus",
        html: `            <p>
              Les signes sont toujours les mêmes. Plusieurs personnes modifient
              le même fichier et les versions divergent. Vous recopiez à la
              main des données d'un outil vers un autre. Vous facturez à partir
              d'informations qui vivent à trois endroits différents. Une
              opération de dix minutes revient chaque jour et personne n'a le
              temps de la supprimer.
            </p>
            <p>
              À ce stade, un outil sur mesure coûte moins cher que le temps que
              vous perdez. Le calcul se fait au cadrage, chiffres en main : si
              l'application ne se rembourse pas, je vous le dis.
            </p>`
      },
      {
        tone: "on-violet",
        kicker: "Briques disponibles",
        h2: "Ce qu'on peut <br class='br-lg' />construire dedans",
        html: `            <p>
              On ne prend que ce dont vous avez besoin. Chaque brique ajoutée se
              chiffre séparément et se voit dans le simulateur.
            </p>
` + marks([
          "Comptes utilisateurs, rôles et permissions par équipe",
          "Paiement en ligne et abonnements récurrents via Stripe",
          "Facturation automatique, relances et export comptable",
          "Back-office d'administration pour piloter sans passer par moi",
          "Tableaux de bord et exports pour suivre ce qui compte",
          "Connexion à vos outils existants par API : CRM, ERP, messagerie",
          "Import et migration de vos données actuelles depuis vos tableurs",
          "Notifications par email et traitements planifiés côté serveur"
        ])
      },
      {
        kicker: "Sur pièce",
        h2: "Des produits <br class='br-lg' />réellement en ligne",
        lede: "Deux produits que j'ai conçus et développés de bout en bout, plus une plateforme sur laquelle j'interviens en équipe.",
        html: sites([
          { url: "https://selfsolution.fr/", img: "selfsolution", name: "SelfSolution", host: "selfsolution.fr", alt: "Page d'accueil de SelfSolution" },
          { url: "https://zendra.fr/", img: "zendra", name: "Zendra", host: "zendra.fr", alt: "Page d'accueil de Zendra" },
          { url: "https://splaze.io/", img: "splaze", name: "Splaze", host: "splaze.io", alt: "Page d'accueil de Splaze" }
        ]) + `
            <p style="margin-top:1.5rem">
              SelfSolution est un SaaS que je vends et que j'exploite, avec son
              sous-produit SelfSolution Budget. Sur Splaze, je développe le site
              et le back-office en Next.js au sein d'une équipe, sur une base de
              code partagée. Le détail de chaque projet est sur
              <a href="/#travaux">la page des réalisations</a>.
            </p>`
      },
      {
        kicker: "Technique",
        h2: "Une stack que <br class='br-lg' />vous pourrez reprendre",
        html: `            <p>
              Next.js et React côté interface, Node.js et PostgreSQL côté
              serveur, déploiement sur Vercel ou sur un serveur à vous. Ce sont
              des technologies très répandues : si vous recrutez un développeur
              ou changez de prestataire, il trouvera ses repères en quelques
              jours.
            </p>
            <p>
              Je ne construis pas sur un outil propriétaire dont vous ne pourriez
              plus sortir. Le code source est livré sur votre dépôt Git, la base
              de données est standard, l'hébergement est à votre nom.
            </p>`
      },
      {
        tone: "on-jaune",
        kicker: "Budget",
        h2: "À partir de 1 500 €, <br class='br-lg' />en 2 à 16 semaines",
        html: `            <p>
              Un premier périmètre utile démarre à 1 500 €. Un produit complet
              avec comptes, paiement et back-office se situe plus haut, et le
              délai suit le périmètre.
            </p>
            <p>
              Je livre par étapes, sur une adresse de test accessible en
              permanence. Vous voyez le produit avancer chaque semaine et vous
              corrigez le tir tôt, quand ça ne coûte encore rien.
            </p>`
      },
      {
        kicker: "Questions fréquentes",
        h2: "Ce qu'on me <br class='br-lg' />demande souvent",
        html: faq([
          {
            q: "Peut-on commencer petit et étendre ensuite ?",
            a: "C'est même la bonne façon de faire. On isole le périmètre qui vous fait gagner du temps dès le premier mois, on le met en service, et on décide de la suite avec de l'usage réel plutôt qu'avec des suppositions."
          },
          {
            q: "Que deviennent mes données actuelles ?",
            a: "Elles sont importées. Tableurs, base existante, export d'un ancien outil : la migration fait partie du cadrage et se chiffre dedans. On garde l'ancien système accessible en lecture le temps de la bascule."
          },
          {
            q: "Qui héberge l'application ?",
            a: "Vous, sur votre propre compte. Je configure tout et je vous en remets les accès. Vous ne dépendez pas de mon infrastructure et vous ne payez pas de licence mensuelle pour un outil qui vous appartient."
          },
          {
            q: "Et si vous n'êtes plus disponible ?",
            a: "Le code est chez vous, sur des technologies courantes, documenté au niveau où c'est utile. C'est précisément pour ça que je n'utilise pas d'outil exotique : un autre développeur doit pouvoir reprendre sans repartir de zéro."
          }
        ])
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "developpeur-application-mobile.html",
    footLabel: "Application mobile",
    breadcrumb: "Développeur d'application mobile",
    title: "Développeur d'application mobile iOS et Android | Swann Bougouin",
    description:
      "Développement d'applications mobiles iOS et Android, en natif Swift et Kotlin ou en React Native. Publication sur l'App Store et le Play Store comprise.",
    kicker: "Application mobile",
    h1: "Développeur <br class='br-lg' />d'application mobile",
    lede:
      "iOS et Android, en natif Swift et Kotlin ou en React Native selon ce que votre produit demande vraiment. Publication sur les deux magasins comprise, mises à jour incluses.",
    ctaTitle: "Votre application, <br class='br-lg' />chiffrée maintenant",
    service: { name: "Développement d'application mobile", type: "Développement d'application iOS et Android", area: ["France"] },
    sections: [
      {
        kicker: "Le vrai choix",
        h2: "Natif ou React Native, <br class='br-lg' />et pourquoi",
        lede:
          "C'est la première décision et elle engage tout le reste. Voici comment je la tranche, sans religion.",
        html: `            <p>
              <b>React Native</b> quand l'application affiche, saisit et
              synchronise des données, et que les deux magasins doivent sortir
              en même temps avec un budget maîtrisé. Une seule base de code,
              donc une seule correction quand quelque chose casse. C'est le bon
              choix pour la grande majorité des applications métier.
            </p>
            <p>
              <b>Swift et Kotlin en natif</b> quand l'application pousse la
              plateforme : animations complexes, usage intensif du matériel,
              traitement en arrière-plan, widgets système, ou simplement une
              exigence de finition que le cross-platform n'atteint pas. C'est
              plus cher parce que ce sont deux développements, et parfois ça
              vaut chaque euro.
            </p>
            <p>
              Je pratique les deux au quotidien, donc je n'ai aucun intérêt à
              vous pousser vers l'un ou l'autre. On tranche au cadrage, sur
              votre besoin réel.
            </p>`
      },
      {
        tone: "on-violet",
        kicker: "Compris dans le prix",
        h2: "De l'idée <br class='br-lg' />aux magasins",
        html: marks([
          "Cadrage des parcours et des écrans avant tout développement",
          "Maquettes validées écran par écran, iOS et Android",
          "Développement de l'application et de l'API serveur si nécessaire",
          "Comptes utilisateurs, notifications push, mode hors ligne selon le besoin",
          "Tests sur appareils réels, pas seulement sur simulateur",
          "Création et configuration des comptes développeur Apple et Google",
          "Soumission, passage de la revue Apple et publication sur les deux magasins",
          "Fiches de magasin : descriptions, captures, mots-clés",
          "Prise en main, puis 30 jours de garantie corrective"
        ])
      },
      {
        kicker: "Sur pièce",
        h2: "Du natif, <br class='br-lg' />en production",
        html: `            <p>
              Sur Splaze, je développe l'application iOS en Swift et
              l'application Android en Kotlin, en plus du site et du back-office
              en Next.js. Le produit réunit les jeux, trophées et succès d'un
              joueur venus de PlayStation, Steam et Xbox dans un seul profil,
              avec des traitements serveur qui synchronisent les comptes de jeu
              en continu.
            </p>
            <p>
              Ce n'est pas un projet solo : le produit avance au sein d'une
              équipe, sur une base de code partagée, avec des choix arbitrés à
              plusieurs. Savoir tenir deux applications natives et un back-office
              cohérents entre eux, à plusieurs, c'est exactement ce qui manque
              sur beaucoup de projets mobiles.
            </p>
` + sites([
          { url: "https://splaze.io/", img: "splaze", name: "Splaze", host: "splaze.io", alt: "Page d'accueil de Splaze" }
        ])
      },
      {
        tone: "on-jaune",
        kicker: "Budget",
        h2: "À partir de 5 000 €, <br class='br-lg' />en 6 à 20 semaines",
        html: `            <p>
              Une application mobile démarre à 5 000 €. Le prix dépend surtout
              de trois choses : le nombre d'écrans, l'existence ou non d'une API
              serveur à construire, et le choix natif ou React Native.
            </p>
            <p>
              Comptez en plus 99 $ par an pour le compte développeur Apple et
              25 $ une fois pour le compte Google Play. Ces comptes sont créés à
              votre nom : les applications vous appartiennent, y compris leurs
              installations et leurs avis.
            </p>`
      },
      {
        kicker: "Questions fréquentes",
        h2: "Ce qu'on me <br class='br-lg' />demande souvent",
        html: faq([
          {
            q: "Combien de temps prend la validation sur l'App Store ?",
            a: "La revue Apple prend généralement 24 à 48 heures, parfois plus pour une première soumission. Un refus est courant et rarement grave : il s'agit le plus souvent d'une mention manquante ou d'une règle de confidentialité à préciser. Je gère les allers-retours, c'est compris."
          },
          {
            q: "Faut-il vraiment sortir sur iOS et Android en même temps ?",
            a: "Pas toujours. Si votre public est clairement sur une plateforme, sortir d'abord là où il est permet de valider le produit pour moitié moins cher. C'est une vraie option, on la regarde au cadrage."
          },
          {
            q: "Qui possède les comptes développeur ?",
            a: "Vous. Je les configure avec vous et je travaille dessus avec un accès délégué. Vos applications, vos installations, vos avis et vos revenus restent sur vos comptes."
          },
          {
            q: "Et les mises à jour après la sortie ?",
            a: "Une application mobile n'est jamais finie : Apple et Google imposent des mises à jour techniques chaque année. Je propose un suivi au mois qui couvre ces montées de version, sinon on intervient au coup par coup."
          }
        ])
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "developpeur-web-freelance-nantes.html",
    footLabel: "Freelance",
    breadcrumb: "Développeur web freelance à Nantes",
    title: "Développeur web freelance à Nantes | Swann Bougouin",
    description:
      "Développeur web et mobile freelance à Nantes : mission au forfait, renfort d'équipe ou sous-traitance pour agence. React, Next.js, React Native, Swift, Kotlin.",
    kicker: "Freelance",
    h1: "Développeur web <br class='br-lg' />freelance à Nantes",
    lede:
      "Un interlocuteur unique, pas une agence à cinq intermédiaires ni une régie qui vous envoie un profil différent chaque trimestre. Web et mobile, du cadrage à la production.",
    ctaTitle: "Parlons de <br class='br-lg' />votre besoin",
    service: { name: "Développeur web freelance", type: "Prestation de développement web et mobile", area: ["Nantes", "Loire-Atlantique", "France"] },
    sections: [
      {
        kicker: "Formats",
        h2: "Trois façons de <br class='br-lg' />me faire intervenir",
        html: `            <p>
              <b>Au forfait.</b> Vous avez un projet avec un début et une fin.
              Périmètre écrit, prix ferme après le cadrage, livraison par
              étapes. C'est le format le plus courant pour un site, une
              application web ou une application mobile.
            </p>
            <p>
              <b>En renfort d'équipe.</b> Votre équipe technique est en
              surcharge ou il lui manque une compétence précise, souvent le
              mobile. J'arrive sur votre base de code, je respecte vos
              conventions et vos processus de revue, et je repars quand le
              besoin est passé.
            </p>
            <p>
              <b>En sous-traitance pour agence.</b> Vous êtes une agence web ou
              de communication et vous avez un projet technique à faire réaliser.
              Je travaille en marque blanche, je parle directement à votre chef
              de projet, et je ne me présente jamais à votre client final.
            </p>`
      },
      {
        tone: "on-violet",
        kicker: "Ce que ça change",
        h2: "Travailler avec <br class='br-lg' />un indépendant",
        html: marks([
          "La personne qui chiffre est celle qui développe : pas de devis déconnecté du terrain",
          "Un seul interlocuteur, joignable, du premier échange à la mise en ligne",
          "Pas de marge d'agence ni de commission de plateforme dans le prix",
          "Le code source part sur votre dépôt Git, sans dépendance à mon infrastructure",
          "Après la livraison, c'est encore moi qui corrige et fais évoluer"
        ])
      },
      {
        kicker: "Compétences",
        h2: "Web et mobile, <br class='br-lg' />pas l'un ou l'autre",
        html: `            <p>
              Côté web : React et Next.js pour l'interface, Node.js et PostgreSQL
              côté serveur, déploiement sur Vercel ou sur un serveur dédié.
              Côté mobile : React Native quand une base commune suffit, Swift et
              Kotlin quand le natif s'impose.
            </p>
            <p>
              Cette double compétence est ce qui rend un produit cohérent. Quand
              la même personne tient le site, l'API et les applications, les
              modèles de données ne divergent pas et les décisions se prennent
              une fois.
            </p>`
      },
      {
        kicker: "Références",
        h2: "Ce que je fais <br class='br-lg' />quand je ne suis pas seul",
        html: `            <p>
              Chez Splaze, je développe le site et le back-office en Next.js,
              l'application iOS en Swift et l'application Android en Kotlin. Le
              produit avance en équipe, sur une base de code partagée, avec des
              arbitrages à plusieurs et un suivi commun de ce qui part en
              production.
            </p>
            <p>
              Chez Avancial, filiale du groupe SNCF, j'ai développé des outils
              utilisés en interne et travaillé directement avec les
              automaticiens. Un environnement où les contraintes sont réelles et
              où l'on ne livre pas approximativement.
            </p>
            <p>
              Autrement dit : je sais aussi bien mener un projet seul que
              m'intégrer dans une équipe existante. Le détail est sur
              <a href="/#parcours">la page parcours</a>.
            </p>`
      },
      {
        tone: "on-jaune",
        kicker: "Déroulé",
        h2: "Comment ça <br class='br-lg' />commence",
        html: `            <p>
              Un premier échange de trente minutes, gratuit et sans engagement,
              pour comprendre ce que vous cherchez à obtenir. Si le besoin est
              clair, vous repartez avec un périmètre écrit et un prix ferme sous
              quelques jours. Si ce n'est pas mon métier, je vous le dis et je
              vous oriente.
            </p>
            <p>
              Vous pouvez aussi passer par le simulateur d'abord : il donne une
              fourchette en trente secondes et cadre la discussion budgétaire
              avant même le premier appel.
            </p>`
      },
      {
        kicker: "Questions fréquentes",
        h2: "Ce qu'on me <br class='br-lg' />demande souvent",
        html: faq([
          {
            q: "Vous intervenez sur place à Nantes ?",
            a: "Oui, je me déplace pour le cadrage et les points importants en Loire-Atlantique. Le développement se fait très bien à distance, et je travaille avec des clients partout en France."
          },
          {
            q: "Quel est votre tarif journalier ?",
            a: "Pour une mission en régie ou en renfort d'équipe, on cale le tarif selon la durée et le niveau d'engagement. Pour un projet avec un périmètre défini, je préfère le forfait : vous connaissez le prix total avant de commencer plutôt qu'une facture qui dépend du temps passé."
          },
          {
            q: "Travaillez-vous avec des agences ?",
            a: "Oui, en marque blanche. Vous gardez la relation client, je fournis la réalisation technique et je m'adapte à votre processus. C'est un format qui marche bien quand un projet sort de vos compétences internes ou arrive au mauvais moment."
          },
          {
            q: "Êtes-vous disponible tout de suite ?",
            a: "Ça dépend du mois. Écrivez-moi avec les grandes lignes de votre besoin et une date souhaitée, je vous réponds sous 24 heures ouvrées avec ma disponibilité réelle. Si je ne peux pas tenir votre échéance, je vous le dis tout de suite."
          }
        ])
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "refonte-site-internet.html",
    footLabel: "Refonte",
    breadcrumb: "Refonte de site internet",
    title: "Refonte de site internet sans perdre son référencement | Swann Bougouin",
    description:
      "Refonte de site web à Nantes : audit préalable, plan de redirections 301, migration des contenus et suivi des positions. Sans casser votre référencement.",
    kicker: "Refonte",
    h1: "Refonte de <br class='br-lg' />site internet",
    lede:
      "Refaire un site est le meilleur moyen de perdre le référencement qu'il avait mis des années à construire. Ça n'arrive pas si on s'y prend dans le bon ordre.",
    ctaTitle: "Votre refonte, <br class='br-lg' />chiffrée maintenant",
    service: { name: "Refonte de site internet", type: "Refonte et migration de site web", area: ["Nantes", "Loire-Atlantique", "France"] },
    sections: [
      {
        kicker: "Le bon moment",
        h2: "Quand refondre <br class='br-lg' />vraiment",
        lede: "Un site daté n'est pas forcément un site à refaire. Ces signaux-là, en revanche, le justifient.",
        html: marks([
          "Le site est illisible ou cassé sur téléphone, là où arrive la majorité de vos visiteurs",
          "Il met plusieurs secondes à s'afficher et vous perdez des visiteurs avant même la première image",
          "Vous ne pouvez plus rien modifier sans rappeler le prestataire d'origine",
          "Le socle technique n'est plus mis à jour et devient une porte d'entrée pour des attaques",
          "Le site décrit une activité que vous n'exercez plus tout à fait",
          "Il ne reçoit aucune demande, alors que vous avez du trafic"
        ]) + `
            <p style="margin-top:1.5rem">
              Le dernier cas est le plus fréquent et c'est rarement un problème
              de design. C'est un problème de parcours et de preuve. Une refonte
              qui ne traite que l'apparence ne change rien au nombre d'appels.
            </p>`
      },
      {
        tone: "on-violet",
        kicker: "Avant de toucher au site",
        h2: "L'audit qui <br class='br-lg' />évite la casse",
        html: `            <p>
              Rien ne commence avant d'avoir cette photographie de l'existant.
              C'est ce qui distingue une refonte d'une remise à zéro.
            </p>
` + marks([
          "Inventaire complet des adresses en ligne et de celles qui reçoivent du trafic",
          "Relevé des positions et des requêtes qui vous amènent des visiteurs aujourd'hui",
          "Repérage des pages qui reçoivent des liens depuis d'autres sites",
          "Récupération des contenus, images et avis à conserver",
          "Mesure de la vitesse et de l'affichage mobile, pour avoir un point de comparaison"
        ])
      },
      {
        kicker: "La bascule",
        h2: "Ce qu'on ne <br class='br-lg' />casse pas",
        html: `            <p>
              <b>Le plan de redirections.</b> Chaque ancienne adresse pointe vers
              son équivalent sur le nouveau site, en redirection permanente 301.
              C'est ce qui transfère l'ancienneté acquise. Une adresse oubliée,
              c'est une page qui disparaît des résultats et des visiteurs qui
              tombent sur une erreur.
            </p>
            <p>
              <b>Les contenus qui fonctionnent.</b> Les pages qui vous amènent
              déjà des visiteurs sont reprises, pas réécrites pour le plaisir.
              On les améliore, on ne les remplace pas.
            </p>
            <p>
              <b>La mesure.</b> Analytics et Search Console sont rebranchés le
              jour de la bascule, et je surveille les positions les semaines qui
              suivent. Une chute se rattrape si on la voit dans les jours qui
              suivent, beaucoup moins six mois plus tard.
            </p>`
      },
      {
        kicker: "Sur pièce",
        h2: "Des sites refaits <br class='br-lg' />et en ligne",
        html: sites(VITRINES)
      },
      {
        tone: "on-jaune",
        kicker: "Budget",
        h2: "Le prix dépend <br class='br-lg' />de l'existant",
        html: `            <p>
              Une refonte de site vitrine se situe dans les mêmes ordres de
              grandeur qu'une création, à partir de 450 €. Ce qui fait varier le
              prix, c'est le volume de contenu à reprendre, le nombre d'adresses
              à rediriger et l'état de ce qu'on récupère.
            </p>
            <p>
              L'audit préalable est compris dans le devis. Si sa conclusion est
              qu'une refonte complète n'est pas ce dont vous avez besoin, je
              vous le dis et on traite le vrai problème.
            </p>`
      },
      {
        kicker: "Questions fréquentes",
        h2: "Ce qu'on me <br class='br-lg' />demande souvent",
        html: faq([
          {
            q: "Vais-je perdre mes positions sur Google ?",
            a: "Une variation de quelques semaines est normale, le temps que Google recroise les nouvelles pages. Une perte durable vient presque toujours de redirections manquantes ou de contenus supprimés sans équivalent. C'est exactement ce que l'audit et le plan de redirections empêchent."
          },
          {
            q: "Mon site sera-t-il coupé pendant la refonte ?",
            a: "Non. Le nouveau site se construit sur une adresse de test le temps du chantier, l'actuel reste en ligne. La bascule se fait en une fois, sur un créneau choisi avec vous."
          },
          {
            q: "Puis-je garder mon nom de domaine et mes adresses mail ?",
            a: "Oui, et c'est la règle. Le domaine reste le vôtre et les boîtes mail ne sont pas touchées par la refonte du site. Si elles sont chez le même prestataire que l'hébergement, on planifie la migration séparément."
          },
          {
            q: "Que faire si je n'ai plus les accès à mon site actuel ?",
            a: "Ça arrive souvent. On peut reconstruire à partir de ce qui est public : les pages en ligne, les archives du web et les données de Search Console si vous y avez accès. Récupérer les accès reste préférable, je peux vous aider à faire les démarches auprès du prestataire ou du bureau d'enregistrement."
          }
        ])
      }
    ]
  }
];

/* ------------------------------------------------------------------ */
/* Ecriture                                                            */
/* ------------------------------------------------------------------ */

mkdirSync(ROOT, { recursive: true });
for (const p of PAGES) {
  const others = PAGES.filter((o) => o.slug !== p.slug);
  writeFileSync(path.join(ROOT, p.slug), render(p, others), "utf8");
  console.log("ecrit", p.slug);
}

/* Sitemap regenere a partir de la meme source. */
const urls = [
  { loc: `${SITE}/`, freq: "monthly" },
  ...PAGES.map((p) => ({ loc: `${SITE}/${p.slug}`, freq: "monthly" })),
  { loc: `${SITE}/mentions-legales.html`, freq: "yearly" }
];
writeFileSync(
  path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${process.env.LASTMOD || "2026-08-25"}</lastmod>
    <changefreq>${u.freq}</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>
`,
  "utf8"
);
console.log("ecrit sitemap.xml");
