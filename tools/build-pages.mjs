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

/* Fil d'Ariane : une realisation se range sous /#travaux, un service non. */
const crumbs = (p) => {
  const items = [{ name: "Accueil", item: `${SITE}/` }];
  if (p.work) items.push({ name: "Réalisations", item: `${SITE}/#travaux` });
  items.push({ name: p.breadcrumb, item: `${SITE}/${p.slug}` });
  return items
    .map(
      (c, i) =>
        `              { "@type": "ListItem", "position": ${i + 1}, "name": "${c.name}", "item": "${c.item}" }`
    )
    .join(",\n");
};

const PROVIDER = `{
              "@type": "ProfessionalService",
              "name": "Swameta",
              "alternateName": "Swann Bougouin",
              "url": "${SITE}/",
              "email": "contact@swameta.fr",
              "telephone": "+33602221182",
              "address": { "@type": "PostalAddress", "addressLocality": "Nantes", "addressCountry": "FR" }
            }`;

const mainNode = (p) =>
  p.work
    ? `          {
            "@type": "CreativeWork",
            "name": "${p.work.name}",
            "headline": "${p.work.name}",
            "description": "${p.description}",
            "url": "${SITE}/${p.slug}",
            "inLanguage": "fr-FR",
            "author": ${PROVIDER},
            "about": {
              "@type": "SoftwareApplication",
              "name": "${p.work.name}",
              "applicationCategory": "${p.work.category}",
              "operatingSystem": "${p.work.os}",
              "url": "${p.work.url}"
            }
          }`
    : `          {
            "@type": "Service",
            "name": "${p.service.name}",
            "description": "${p.description}",
            "serviceType": "${p.service.type}",
            "url": "${SITE}/${p.slug}",
            "areaServed": ${JSON.stringify(p.service.area)},
            "provider": ${PROVIDER}
          }`;

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
${crumbs(p)}
            ]
          },
${mainNode(p)}
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

    <!-- Mesure d'audience sans cookie : ni cookie, ni stockage local ou de
         session. L'identifiant est reconstruit cote serveur par un hachage
         irreversible dont la cle change chaque jour. Heberge dans l'UE. -->
    <script>
      !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      posthog.init("phc_BXwB7J33LBWBARGmR7yYLdz7KM5iUtbV4jdddWYPj6Lb", {
        api_host: "https://eu.i.posthog.com",
        defaults: "2026-05-30",
        cookieless_mode: "always",
        capture_dead_clicks: false,
        capture_exceptions: false
      });
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

const foot = () => `    <footer class="foot">
      <div class="shell foot-inner">
        <span>&copy; <span id="year">2026</span> Swann Bougouin / Swameta / Nantes</span>
        <nav aria-label="Pied de page">
${SERVICES.map((o) => `          <a href="/${o.slug}">${o.footLabel}</a>`).join("\n")}
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

const facts = (items) => `            <dl class="case-facts">
${items
  .map((i) => `              <div><dt>${i.k}</dt><dd>${i.v}</dd></div>`)
  .join("\n")}
            </dl>`;

/* Renvoi vers les autres etudes de cas : maillage interne entre realisations. */
const otherCases = (p) => `      <section class="band">
        <div class="shell svc">
          <div class="head" data-reveal>
            <span class="kicker">Autres réalisations</span>
            <h2>Voir aussi</h2>
          </div>
          <p class="legal-back" data-reveal>
${CASES.filter((c) => c.slug !== p.slug)
  .map((c) => `            <a class="btn" href="/${c.slug}">${c.work.name}</a>`)
  .join("\n")}
          </p>
        </div>
      </section>`;

const render = (p) => `<!DOCTYPE html>
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
${
  p.work
    ? `            <a class="btn btn-solid" href="${p.work.url}" target="_blank" rel="noopener">Voir ${p.work.name} en ligne</a>
            <a class="btn" href="/#contact">Parler d'un projet</a>`
    : `            <a class="btn btn-solid" href="/#estimation">Estimer mon projet</a>
            <a class="btn" href="/#contact">Me contacter</a>`
}
          </p>
${p.hero ? `          <div class="case-shot${p.heroClass || ""}" data-reveal>\n${p.hero}\n          </div>\n` : ""}${p.facts ? `          <div data-reveal>\n${facts(p.facts)}\n          </div>\n` : ""}        </div>
      </section>

${p.sections.map(band).join("\n\n")}

${p.work ? otherCases(p) + "\n\n" : ""}${cta(p)}
    </main>

${foot()}

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

const SERVICES = [
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
          { url: "https://zendra.pro/", img: "zendra", name: "Zendra", host: "zendra.pro", alt: "Page d'accueil de Zendra" },
          { url: "https://splaze.fr/", img: "splaze", name: "Splaze", host: "splaze.fr", alt: "Page d'accueil de Splaze" }
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
            </p>
            <p>
              Les deux options sont en ligne et téléchargeables :
              <a href="/realisation-splaze.html">Splaze</a> en natif Swift et
              Kotlin, <a href="/realisation-questia.html">Questia</a> en React
              Native avec le web sur la même base de code.
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
          { url: "https://splaze.fr/", img: "splaze", name: "Splaze", host: "splaze.fr", alt: "Page d'accueil de Splaze" }
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
/* Etudes de cas                                                       */
/* ------------------------------------------------------------------ */

/* Visuel d'ouverture : meme fichier que l'accueil, affiche pleine largeur.
   Charge en differe : le titre est l'element LCP, le visuel ne doit pas
   disputer la bande passante a la police pendant le premier rendu. */
const shot = (name, alt, ratio) =>
  `            <img src="assets/img/${name}.webp"
              srcset="assets/img/${name}-700.webp 700w, assets/img/${name}-1000.webp 1000w, assets/img/${name}.webp 1400w"
              sizes="(min-width: 1240px) 1200px, 94vw" alt="${alt}" width="1400" height="${ratio}" loading="lazy" decoding="async" />`;

const CASES = [
  /* ---------------------------------------------------------------- */
  {
    slug: "realisation-splaze.html",
    breadcrumb: "Splaze",
    title: "Splaze : plateforme web et apps iOS et Android | Étude de cas",
    description:
      "Étude de cas Splaze : réunir les trophées PlayStation, Steam et Xbox dans un seul profil. Site et back-office Next.js, app iOS en Swift, app Android en Kotlin, synchronisation continue.",
    kicker: "Étude de cas · Plateforme + apps mobiles",
    h1: "Splaze, un profil unique <br class='br-lg' />pour trois plateformes",
    lede:
      "Réunir les jeux, les trophées et les succès d'un joueur venus de PlayStation, Steam et Xbox dans un seul profil, sur le web comme sur mobile. Quatre surfaces, une seule source de vérité.",
    ctaTitle: "Un produit web <br class='br-lg' />et mobile ?",
    work: { name: "Splaze", url: "https://splaze.fr", category: "GameApplication", os: "Web, iOS, Android" },
    hero: shot("splaze", "Page d'accueil de Splaze", 875),
    facts: [
      { k: "Rôle", v: "Développeur produit, au sein de l'équipe" },
      { k: "Surfaces", v: "Site public, back-office, application iOS, application Android" },
      { k: "Technologies", v: "Next.js, Swift, Kotlin, Supabase, PostgreSQL, Node" },
      { k: "État", v: "En production, plus de 1 800 joueurs inscrits" },
      { k: "En ligne", v: "<a href=\"https://splaze.fr\" target=\"_blank\" rel=\"noopener\">splaze.fr</a>" }
    ],
    sections: [
      {
        kicker: "Le point de départ",
        h2: "Une progression qui <br class='br-lg' />n'existe nulle part",
        lede:
          "Un joueur possède rarement une seule machine. Sa bibliothèque se répartit entre une console, un PC et parfois une deuxième console, et chaque écosystème garde jalousement ses données.",
        html: `            <p>
              PlayStation compte ses trophées, Steam ses succès, Xbox ses
              points. Les trois utilisent un vocabulaire différent, un rythme de
              mise à jour différent et une définition différente de ce qu'est
              « terminer » un jeu. Résultat : quinze ans de parties existent en
              trois morceaux, et nulle part en entier.
            </p>
            <p>
              Splaze répond à ce manque. Un seul profil rassemble la
              bibliothèque complète, la progression réelle par jeu, la
              comparaison avec ses amis et le partage. Ce qui paraît simple vu
              du visiteur suppose, derrière, de faire parler ensemble trois
              sources qui n'ont pas été conçues pour cela.
            </p>`
      },
      {
        tone: "on-violet",
        kicker: "Ce que je développe",
        h2: "Quatre surfaces, <br class='br-lg' />un seul produit",
        html: `            <p>
              Je travaille sur l'ensemble du produit, du rendu d'un écran mobile
              jusqu'aux traitements serveur qui tournent sans personne devant.
            </p>
` + marks([
          "<strong>Le site public</strong> en Next.js : profils, bibliothèques, pages de jeux, comparaisons, tout ce qui doit être indexable et rapide au premier affichage",
          "<strong>Le back-office</strong>, également en Next.js : administration du catalogue, des comptes et de ce qui part en production",
          "<strong>L'application iOS</strong> en Swift, native, avec les composants et les gestes attendus sur la plateforme",
          "<strong>L'application Android</strong> en Kotlin, native elle aussi, publiée sur le Google Play Store",
          "<strong>Les traitements serveur</strong> en Node : synchronisation continue des comptes de jeu, alimentation de la base PostgreSQL derrière Supabase"
        ]) + `
            <p>
              Le choix du natif sur mobile n'est pas un réflexe. Une application
              qui affiche des milliers de vignettes, garde une bibliothèque
              consultable hors connexion et se rafraîchit en tâche de fond
              travaille sur le terrain où les couches intermédiaires coûtent le
              plus cher. Deux bases de code séparées demandent plus de
              discipline, mais donnent un produit qui se comporte comme le
              système sur lequel il tourne.
            </p>`
      },
      {
        kicker: "Le vrai sujet",
        h2: "La synchronisation, <br class='br-lg' />pas l'interface",
        lede:
          "Sur ce genre de produit, la difficulté n'est presque jamais l'écran. Elle est dans ce qui se passe entre deux écrans.",
        html: `            <p>
              Chaque plateforme expose ses données à sa façon : formats,
              identifiants, granularité, fraîcheur. Un même jeu peut porter
              trois noms, trois identifiants et trois listes de succès qui ne se
              recouvrent pas exactement. Rapprocher tout cela demande un travail
              de correspondance qui ne se voit pas et qui conditionne pourtant
              la confiance du joueur : si sa progression est fausse, le produit
              est mort.
            </p>
            <p>
              La synchronisation tourne en continu, côté serveur, sans
              intervention. Elle doit rester rejouable sans dupliquer,
              reprendre après une coupure, et absorber le fait qu'une source
              soit temporairement indisponible sans mettre le profil entier en
              défaut. C'est cette partie invisible qui occupe la plus grande
              part du travail.
            </p>`
      },
      {
        tone: "on-jaune",
        kicker: "Travail collectif",
        h2: "Une base de code <br class='br-lg' />partagée",
        html: `            <p>
              Je ne suis pas seul sur Splaze. Le produit avance au sein d'une
              équipe, sur une base de code commune, avec des choix arbitrés à
              plusieurs et un suivi partagé de ce qui part en production.
            </p>
            <p>
              C'est une dimension que je tiens à afficher, parce qu'elle ne
              s'improvise pas. Écrire du code que quelqu'un d'autre reprendra,
              défendre une décision technique devant des personnes qui ne
              partagent pas votre intuition, accepter d'en abandonner une, tenir
              une convention même quand elle vous ralentit sur le moment : rien
              de tout cela n'apparaît quand on travaille seul.
            </p>
            <p>
              Pour un client, cela change une chose concrète. Un projet livré
              par mes soins n'est pas un objet personnel illisible par le
              suivant. Il est écrit pour être repris.
            </p>`
      },
      {
        kicker: "Où ça en est",
        h2: "En production, <br class='br-lg' />sur trois magasins",
        html: `            <p>
              Splaze compte plus de 1 800 joueurs inscrits. Les deux
              applications mobiles sont publiées : l'une sur l'App Store,
              l'autre sur le Google Play Store, avec tout ce que cela suppose de
              conformité, de fiches, de captures, de politiques de
              confidentialité et de cycles de validation.
            </p>
            <p>
              Passer la revue d'Apple et celle de Google n'est pas une
              formalité. C'est une compétence en soi, faite de règles écrites
              nulle part au même endroit, et c'est souvent là que les projets
              mobiles s'enlisent. Je l'ai faite, deux fois, sur deux
              plateformes.
            </p>
            <p>
              <a class="case-link" href="https://splaze.fr" target="_blank" rel="noopener">splaze.fr &#8599;</a>
            </p>`
      },
      {
        kicker: "Questions fréquentes",
        h2: "Ce qu'on me <br class='br-lg' />demande ensuite",
        html: faq([
          {
            q: "Pouvez-vous faire la même chose pour mon produit ?",
            a: "Si votre projet suppose un site, un back-office et une ou deux applications mobiles qui partagent les mêmes données, oui : c'est exactement la forme de Splaze. Voir la page <a href=\"/developpeur-application-mobile.html\">développeur d'application mobile</a> pour le cadre et les tarifs."
          },
            {
            q: "Natif ou React Native ?",
            a: "Cela dépend du produit. Une application riche en interactions, en affichage de listes longues ou en fonctionnement hors connexion gagne au natif. Une application de contenu, publiée vite sur les deux magasins avec un budget contenu, gagne au multiplateforme. Je pratique les deux et je vous dis lequel sert votre cas, pas lequel m'arrange."
          },
          {
            q: "Combien de temps pour une application publiée ?",
            a: "Comptez huit à quatorze semaines entre le cadrage et la mise en ligne sur les magasins pour une première version sérieuse, revue Apple et Google incluses. Le <a href=\"/#estimation\">simulateur</a> donne une fourchette en trente secondes."
          },
          {
            q: "Qui possède le code ?",
            a: "Sur mes missions client, vous. Le code source est livré sur votre dépôt Git à la fin du projet, sans dépendance à un compte que je contrôlerais."
          }
        ])
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "realisation-questia.html",
    breadcrumb: "Questia",
    title: "Questia : une app Android et web conçue et publiée seul | Étude de cas",
    description:
      "Étude de cas Questia : une quête par jour dans la vraie vie, générée par un moteur de profil et un modèle de langage encadré. Application Android publiée sur le Play Store et application web, même compte, code TypeScript partagé.",
    kicker: "Étude de cas · App Android et web publiée",
    h1: "Questia, une quête par jour <br class='br-lg' />pour chaque joueur",
    lede:
      "Une application qui propose chaque matin une mission courte à faire dans la vraie vie, calibrée sur le profil de la personne. Application Android publiée sur le Play Store, application web, un seul compte, une seule base de code.",
    ctaTitle: "Une application mobile <br class='br-lg' />à sortir vraiment ?",
    work: { name: "Questia", url: "https://questia.fr", category: "LifestyleApplication", os: "Android, Web" },
    hero: shot("questia", "Page d'accueil de Questia", 875),
    facts: [
      { k: "Rôle", v: "Conception, développement, publication" },
      { k: "Surfaces", v: "Application Android sur le Play Store, application web, même compte" },
      { k: "Technologies", v: "Expo / React Native, Next.js, TypeScript partagé, PostgreSQL, modèle de langage" },
      { k: "Particularité", v: "Moteur de profil déterministe qui encadre la génération de texte" },
      { k: "En ligne", v: "<a href=\"https://questia.fr\" target=\"_blank\" rel=\"noopener\">questia.fr</a> · <a href=\"https://play.google.com/store/apps/details?id=fr.questia.app\" target=\"_blank\" rel=\"noopener\">Google Play</a>" }
    ],
    sections: [
      {
        kicker: "Le point de départ",
        h2: "Une liste de tâches <br class='br-lg' />ne se termine jamais",
        lede:
          "Les applications de motivation empilent des objectifs, comptent les jours consécutifs et rappellent à leur utilisateur tout ce qu'il n'a pas fait. Au premier jour manqué, la série tombe et l'application se désinstalle.",
        html: `            <p>
              Le pari de Questia est inverse : une seule mission par matin, avec
              une fin nette. On la fait ou on la refuse, et il n'y a rien
              derrière. Pas de série à tenir, pas de rattrapage, pas de tableau
              de bord qui rappelle son retard à quelqu'un qui a déjà une semaine
              chargée.
            </p>
            <p>
              Le problème intéressant n'est donc pas de gérer des tâches, c'est
              de proposer la bonne mission. Trop facile, elle ne vaut pas le
              déplacement. Trop ambitieuse, elle est refusée et la personne ne
              revient pas le lendemain. Toute la difficulté du produit tient
              dans ce réglage, et c'est là qu'est passé l'essentiel du travail.
            </p>`
      },
      {
        tone: "on-violet",
        kicker: "Le produit",
        h2: "Deux questions, puis <br class='br-lg' />une mission par matin",
        html: marks([
          "<strong>Deux questions au départ</strong> : ce qu'on aime, ce qu'on est prêt à tenter, et c'est tout pour commencer",
          "<strong>Une quête par matin</strong> : trente à quatre-vingt-dix minutes, une fin claire, le droit de refuser sans conséquence",
          "<strong>Un contexte pris en compte</strong> : météo, ville, jour de la semaine, pour ne pas proposer une sortie sous l'orage un mardi à 7 h",
          "<strong>Deux surfaces, un compte</strong> : l'application Android et le site partagent le profil, l'historique et la progression",
          "<strong>Des garde-fous explicites</strong> : consentement avant une quête physique, repli sur une mission calme quand les conditions ne s'y prêtent pas"
        ]) + `
            <p>
              Le produit est bilingue, gère les notifications, le partage d'une
              carte de quête, les pages légales et une boutique. Rien de tout
              cela n'est visible dans une démonstration de deux minutes, et tout
              cela est obligatoire pour qu'une application existe ailleurs que
              sur le téléphone de son auteur.
            </p>`
      },
      {
        kicker: "Sous le capot",
        h2: "Un modèle de langage <br class='br-lg' />tenu par un moteur",
        lede:
          "Demander directement des idées de sortie à un modèle de langage donne une liste plausible, générique et sans mémoire. Ce n'est pas un produit, c'est une démonstration.",
        html: `            <p>
              Questia sépare donc deux responsabilités. Un moteur écrit en
              TypeScript décide <em>quoi</em> proposer : il compare le profil
              déclaré à un profil déduit de l'historique, mesure l'écart entre
              les deux, en tire une phase de progression et une intensité cible,
              puis choisit une famille de quête et une durée. Ce moteur est
              déterministe, testé, et ne demande rien à personne.
            </p>
            <p>
              Le modèle de langage n'intervient qu'ensuite, pour écrire la
              mission dans ces limites : famille imposée, intensité imposée,
              durée imposée, contexte du jour fourni. Sa sortie est validée
              avant d'être servie, et si l'appel échoue ou renvoie quelque chose
              d'invalide, un tirage déterministe dans la même famille prend le
              relais. L'utilisateur reçoit sa quête, que le fournisseur soit
              debout ou non.
            </p>
            <p>
              C'est la question que je pose à chaque projet où l'on veut mettre
              de l'IA : que se passe-t-il quand le modèle répond mal, répond
              lentement, ou ne répond pas ? Si la réponse est « l'écran reste
              vide », la fonctionnalité n'est pas finie. Le même raisonnement
              qu'à propos des sources citées dans
              <a href="/realisation-zendra.html">Zendra</a> : ce qui rend un
              produit utilisable au quotidien n'est presque jamais la partie
              qu'on montre en démonstration.
            </p>`
      },
      {
        kicker: "Deux plateformes",
        h2: "Une base de code <br class='br-lg' />pour le mobile et le web",
        html: `            <p>
              L'application Android est développée en React Native avec Expo, le
              site en Next.js. Les deux vivent dans le même dépôt et partagent
              le même TypeScript : les types, les constantes, le moteur de
              profil et une partie de l'interface sont écrits une fois. Une
              règle de calibrage corrigée est corrigée des deux côtés, ce qui
              évite la dérive classique où le mobile et le web finissent par ne
              plus tout à fait dire la même chose.
            </p>
            <p>
              Ce n'est pas le bon choix partout. Sur
              <a href="/realisation-splaze.html">Splaze</a>, les applications
              sont écrites en Swift et en Kotlin, parce que le produit demande
              ce que chaque plateforme fait de mieux. Ici, une personne seule
              devait tenir deux surfaces à jour : mutualiser était le seul moyen
              de sortir l'application sans laisser le site derrière. Le choix se
              décide projet par projet, et je le pose au cadrage plutôt qu'après
              coup.
            </p>`
      },
      {
        tone: "on-jaune",
        kicker: "Jusqu'au Play Store",
        h2: "Publier, c'est un <br class='br-lg' />métier en plus",
        html: `            <p>
              Questia est en ligne sur questia.fr et publié sur le Google Play
              Store. Entre l'application qui tourne sur mon téléphone et
              l'application téléchargeable, il y a eu la signature des binaires,
              la fiche du magasin, le questionnaire de classification, le
              formulaire de sécurité des données, la politique de
              confidentialité, les conditions de vente, la vérification que rien
              dans les textes ne laisse croire à une promesse thérapeutique, et
              plusieurs allers-retours de révision.
            </p>
            <p>
              C'est la partie que les devis oublient et que je chiffre
              séparément, parce qu'elle se compte en jours et qu'elle bloque une
              sortie de plusieurs semaines quand on la découvre à la fin. Avoir
              franchi cette étape sur mes propres produits est précisément ce
              qui me permet de la cadrer sur les vôtres : voir la page
              <a href="/developpeur-application-mobile.html">développeur d'application mobile</a>.
            </p>
            <p>
              <a class="case-link" href="https://questia.fr" target="_blank" rel="noopener">questia.fr &#8599;</a>
            </p>`
      },
      {
        kicker: "Questions fréquentes",
        h2: "Ce qu'on me <br class='br-lg' />demande ensuite",
        html: faq([
          {
            q: "Combien coûte une application mobile de ce genre ?",
            a: "Cela dépend surtout du nombre de surfaces et de la présence de comptes et de paiements. Le <a href=\"/#estimation\">simulateur</a> donne un ordre de grandeur en deux minutes, et je le confirme après un échange."
          },
          {
            q: "Faut-il une application native ou une base partagée ?",
            a: "Une base partagée quand les deux plateformes font la même chose et que l'équipe est petite, du natif quand le produit dépend de ce que chaque système fait de mieux. Je tranche au cadrage, avec l'argument correspondant."
          },
          {
            q: "Prenez-vous en charge la publication sur les magasins ?",
            a: "Oui : comptes développeurs, signature, fiches, questionnaires de confidentialité et de classification, puis les révisions jusqu'à la mise en ligne. C'est une ligne à part du devis, parce que c'est un vrai travail."
          },
          {
            q: "Mon produit a-t-il besoin d'un modèle de langage ?",
            a: "Souvent non. Quand la réponse est oui, il faut décider dès le cadrage ce qui se passe si le modèle échoue, ce qui est envoyé au fournisseur et ce qui reste chez vous. Ces réponses figurent au devis, pas après la mise en ligne."
          }
        ])
      }
    ]
  },
  /* ---------------------------------------------------------------- */
  {
    slug: "realisation-selfsolution.html",
    breadcrumb: "Self Solution",
    title: "Self Solution : un SaaS de comptabilité conçu et vendu | Étude de cas",
    description:
      "Étude de cas Self Solution : comptabilité pour indépendants et module Budget pour les particuliers. Produit conçu, développé, hébergé et commercialisé seul, abonnement Stripe compris.",
    kicker: "Étude de cas · SaaS conçu et vendu",
    h1: "Self Solution, un SaaS <br class='br-lg' />porté de bout en bout",
    lede:
      "Une comptabilité pour indépendants qui fait peu de choses et les fait bien. Conçu, développé, hébergé, facturé et suivi par une seule personne, abonnement récurrent compris.",
    ctaTitle: "Un produit <br class='br-lg' />à mettre en vente ?",
    work: { name: "Self Solution", url: "https://selfsolution.fr", category: "BusinessApplication", os: "Web" },
    hero:
      `            <img src="assets/img/selfsolution.webp"
              srcset="assets/img/selfsolution-700.webp 700w, assets/img/selfsolution-1000.webp 1000w, assets/img/selfsolution.webp 1400w"
              sizes="(min-width: 1240px) 1200px, 94vw" alt="Interface de Self Solution" width="1400" height="665" loading="lazy" decoding="async" />
            <img src="assets/img/selfsolutionbudget.webp"
              srcset="assets/img/selfsolutionbudget-700.webp 700w, assets/img/selfsolutionbudget-1000.webp 1000w, assets/img/selfsolutionbudget.webp 1400w"
              sizes="(min-width: 1240px) 1200px, 94vw" alt="Interface de Self Solution Budget" width="1400" height="665" loading="lazy" decoding="async" />`,
    heroClass: " case-shot-duo",
    facts: [
      { k: "Rôle", v: "Conception, développement, hébergement, commercialisation" },
      { k: "Produits", v: "Self Solution pour les indépendants, Self Solution Budget pour les particuliers" },
      { k: "Technologies", v: "Next.js, PostgreSQL, Stripe, Vercel" },
      { k: "Modèle", v: "Abonnement récurrent" },
      { k: "En ligne", v: "<a href=\"https://selfsolution.fr\" target=\"_blank\" rel=\"noopener\">selfsolution.fr</a>" }
    ],
    sections: [
      {
        kicker: "Le point de départ",
        h2: "Entre le tableur <br class='br-lg' />et l'expert-comptable",
        lede:
          "Un freelance qui démarre n'a ni les moyens d'un cabinet au mois, ni la patience d'un classeur de calcul qu'il faut recoller chaque trimestre.",
        html: `            <p>
              Les logiciels de gestion existants visent des entreprises
              constituées. Ils proposent la facturation, les devis, les
              relances, la paie, les immobilisations, le multi-utilisateur, le
              rapprochement bancaire automatique. Pour un indépendant seul, tout
              cela se paye et ne se lit pas : il faut traverser quinze menus pour
              savoir combien il reste à la fin du mois.
            </p>
            <p>
              À l'autre extrémité, le tableur ne coûte rien et ne tient pas. Il
              se casse dès qu'on change d'ordinateur, ne sait pas produire un
              export propre et n'aide pas à repérer qu'un poste de dépense a
              doublé.
            </p>
            <p>
              Self Solution occupe l'espace entre les deux, volontairement
              étroit.
            </p>`
      },
      {
        tone: "on-violet",
        kicker: "Le produit",
        h2: "Peu de choses, <br class='br-lg' />vraiment finies",
        html: marks([
          "Suivi des entrées et des sorties, saisie rapide, sans jargon comptable",
          "Classement par catégories, avec un moteur de catégorisation qui apprend de vos habitudes de saisie",
          "Statistiques lisibles : évolution mensuelle, répartition par poste, tendance",
          "Exports exploitables, y compris pour transmettre à un comptable le moment venu",
          "Rien d'autre : ni paie, ni immobilisations, ni modules qu'on paye sans jamais les ouvrir"
        ]) + `
            <p>
              Ce dernier point est une décision de produit, pas une lacune.
              Chaque fonctionnalité ajoutée coûte de la clarté à l'écran, de la
              maintenance dans le temps et du support à traiter. Un outil qui
              s'arrête là où le besoin s'arrête reste utilisable trois ans plus
              tard.
            </p>`
      },
      {
        kicker: "Le produit dérivé",
        h2: "Self Solution Budget, <br class='br-lg' />le même moteur",
        lede:
          "Le classement automatique des mouvements n'a rien de spécifiquement professionnel. Il fonctionne aussi bien sur le budget d'un foyer.",
        html: `            <p>
              Self Solution Budget est né de ce constat. C'est un module dérivé,
              ouvert aux particuliers, qui reprend le même moteur de
              catégorisation et les mêmes statistiques, appliqués aux dépenses
              d'un ménage plutôt qu'à une activité professionnelle.
            </p>
            <p>
              Techniquement, c'est le socle qui est partagé, pas l'interface : le
              vocabulaire, les catégories par défaut et les écrans changent parce
              que la personne en face n'a pas les mêmes questions. Un
              indépendant veut savoir s'il a de quoi payer ses cotisations. Un
              foyer veut savoir où part l'argent.
            </p>
            <p>
              Un produit qui donne naissance à un second sans réécriture, c'est
              le signe que le découpage initial était le bon. C'est aussi ce que
              je cherche à obtenir sur les projets que je livre à des clients.
            </p>`
      },
      {
        tone: "on-jaune",
        kicker: "Au-delà du code",
        h2: "Vendre, c'est <br class='br-lg' />un autre métier",
        html: `            <p>
              Développer le produit n'était que la moitié du travail. Self
              Solution est aussi facturé, hébergé et suivi par moi seul.
            </p>
` + marks([
          "Abonnement récurrent branché sur Stripe : essai, paiement, changement de formule, échec de prélèvement, résiliation, chacun avec son cas limite",
          "Hébergement sur Vercel, base PostgreSQL, sauvegardes et surveillance",
          "Pages de vente, tarification, conditions générales, mentions obligatoires",
          "Support : répondre soi-même aux utilisateurs, ce qui apprend très vite quels écrans sont mal fichus",
          "Mises à jour dans la durée, sur un produit qui doit rester disponible pendant qu'on le modifie"
        ]) + `
            <p>
              Cette expérience change la façon dont je conseille un client.
              Quand quelqu'un me décrit une application à abonnement, je sais
              quelles lignes du devis sont sous-estimées, où passe le temps après
              le lancement, et quelles fonctionnalités on regrette d'avoir
              promises.
            </p>`
      },
      {
        kicker: "Questions fréquentes",
        h2: "Ce qu'on me <br class='br-lg' />demande ensuite",
        html: faq([
          {
            q: "Pouvez-vous développer mon SaaS ?",
            a: "Oui, c'est une partie centrale de mon activité. Le cadre, les étapes et les fourchettes sont détaillés sur la page <a href=\"/creation-application-web-saas.html\">création d'application web et SaaS</a>."
          },
          {
            q: "Faut-il tout construire avant de vendre ?",
            a: "Non, et c'est l'erreur la plus coûteuse. Une première version doit résoudre un problème précis pour un profil précis, être payante dès le premier jour, et se laisser corriger vite. Le reste s'ajoute quand des utilisateurs le réclament, pas avant."
          },
          {
            q: "Combien coûte un premier SaaS ?",
            a: "La fourchette dépend surtout du nombre de rôles utilisateurs et de la complexité de la facturation. Le <a href=\"/#estimation\">simulateur</a> donne un ordre de grandeur en trente secondes, sans inscription."
          },
          {
            q: "Qui paye l'hébergement et Stripe ?",
            a: "Vous, directement, sur vos propres comptes. Je les configure, mais ils restent à votre nom : c'est la seule façon de garantir que vous gardez la main sur votre produit et sur vos revenus."
          }
        ])
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "realisation-selenevasions.html",
    breadcrumb: "SelenEvasion",
    title: "SelenEvasion : un site de séjours de groupe qui génère des devis | Étude de cas",
    description:
      "Étude de cas SelenEvasion : présenter des séjours de groupe partout en France avec une carte interactive, une recherche par lieu et un réseau de 26 hôtels, pour déclencher des demandes de devis.",
    kicker: "Étude de cas · Mission client",
    h1: "SelenEvasion, un site <br class='br-lg' />qui déclenche des devis",
    lede:
      "Des séjours de groupe clé en main partout en France. L'enjeu du site n'était pas d'être joli : c'était qu'un responsable de groupe comprenne l'offre et demande un devis sans avoir à appeler.",
    ctaTitle: "Un site qui doit <br class='br-lg' />faire venir des demandes",
    work: { name: "SelenEvasion", url: "https://selenevasions.fr", category: "WebApplication", os: "Web" },
    hero: shot("selenevasions", "Page d'accueil de SelenEvasion", 875),
    facts: [
      { k: "Rôle", v: "Mission client, conception et développement" },
      { k: "Secteur", v: "Séjours de groupe : randonnée, cyclotourisme, patrimoine, cohésion d'équipe" },
      { k: "Technologies", v: "Next.js, carte interactive, référencement, Vercel" },
      { k: "Point clé", v: "Réseau de 26 hôtels et villages vacances à rendre lisible" },
      { k: "En ligne", v: "<a href=\"https://selenevasions.fr\" target=\"_blank\" rel=\"noopener\">selenevasions.fr</a>" }
    ],
    sections: [
      {
        kicker: "Le point de départ",
        h2: "Une offre riche, <br class='br-lg' />difficile à saisir",
        lede:
          "SelenEvasion organise des séjours de groupe clé en main dans toute la France : randonnée, cyclotourisme, découverte du patrimoine, cohésion d'équipe.",
        html: `            <p>
              Le problème d'une offre pareille n'est pas de manquer d'arguments.
              C'est d'en avoir trop. Plusieurs thématiques, des dizaines de
              destinations, un réseau d'hébergements, des formules qui varient
              selon la taille du groupe et la saison : présenté à plat, cela
              devient un catalogue qu'on ne lit pas.
            </p>
            <p>
              Le visiteur, lui, arrive avec une question très étroite. Il
              organise un séjour pour une association, un comité d'entreprise,
              un club ou un groupe scolaire, il a une région en tête ou une
              activité en tête, et il veut savoir en deux minutes si cette offre
              correspond. S'il ne le sait pas, il ne téléphone pas : il ferme
              l'onglet.
            </p>`
      },
      {
        tone: "on-violet",
        kicker: "Le parti pris",
        h2: "Entrer par la carte, <br class='br-lg' />pas par le menu",
        html: `            <p>
              La question spontanée d'un responsable de groupe est
              géographique : « qu'est-ce qui existe autour de là où je veux
              aller ? » Le site part de là.
            </p>
` + marks([
          "Une <strong>carte interactive</strong> des destinations, sur laquelle on se repère sans lire une liste",
          "Une <strong>recherche par lieu</strong>, pour les visiteurs qui savent déjà où ils vont",
          "La mise en avant du <strong>réseau de 26 hôtels et villages vacances</strong>, qui transforme un argument abstrait en preuve concrète",
          "Le <strong>téléchargement de la brochure</strong>, pour ceux qui doivent faire valider le projet par un comité",
          "Une demande de devis accessible depuis n'importe quelle page, sans formulaire à rallonge"
        ]) + `
            <p>
              La brochure mérite un mot. Dans ce métier, la décision se prend
              rarement seul : le responsable doit présenter l'offre à d'autres
              personnes, souvent hors ligne. Un document à emporter n'est pas un
              gadget, c'est l'outil qui permet au dossier d'avancer entre deux
              visites sur le site.
            </p>`
      },
      {
        kicker: "Référencement",
        h2: "Être trouvé sur <br class='br-lg' />une intention précise",
        lede:
          "Les recherches de ce secteur sont longues et localisées, du type « séjour randonnée groupe Vercors » ou « village vacances groupe Auvergne ».",
        html: `            <p>
              Ce genre de requête ne se gagne pas avec une page d'accueil
              généraliste. Il faut des pages qui existent réellement pour
              chaque intention, avec un titre qui reprend les mots employés par
              le visiteur, un contenu qui répond vraiment et une structure que
              Google peut parcourir.
            </p>
            <p>
              Le travail technique va avec : rendu côté serveur pour que le
              contenu soit lisible sans exécuter de script, données structurées,
              plan de site, images compressées et servies à la bonne taille,
              affichage rapide sur un téléphone en 4G. Une carte interactive est
              exactement le genre de composant qui plombe une page si on la
              charge sans précaution.
            </p>
            <p>
              C'est la même méthode que celle décrite sur la page
              <a href="/creation-site-internet-nantes.html">création de site internet</a>,
              appliquée à un secteur où la concurrence se joue sur des dizaines
              de requêtes locales plutôt que sur une seule.
            </p>`
      },
      {
        tone: "on-jaune",
        kicker: "Ce qu'il faut retenir",
        h2: "Un site se juge <br class='br-lg' />sur les demandes",
        html: `            <p>
              Un site vitrine n'a qu'un seul indicateur qui compte : le nombre
              de demandes qualifiées qu'il produit. Le reste, le nombre de
              visites, le temps passé, la beauté de la page d'accueil, ne sert
              qu'à expliquer ce chiffre.
            </p>
            <p>
              C'est pour cette raison que je commence toujours par la même
              question, avant le design : qui doit vous contacter, et
              qu'est-ce qui l'en empêche aujourd'hui ? Sur SelenEvasion, la
              réponse tenait dans la géographie et dans la preuve du réseau. Sur
              votre projet, elle sera ailleurs.
            </p>
            <p>
              <a class="case-link" href="https://selenevasions.fr" target="_blank" rel="noopener">selenevasions.fr &#8599;</a>
            </p>`
      },
      {
        kicker: "Questions fréquentes",
        h2: "Ce qu'on me <br class='br-lg' />demande ensuite",
        html: faq([
          {
            q: "Travaillez-vous en dehors de Nantes ?",
            a: "Oui. Le cadrage et le suivi se font en visio, et je me déplace en Loire-Atlantique quand une rencontre facilite les choses. SelenEvasion couvre toute la France."
          },
          {
            q: "Combien coûte un site de ce type ?",
            a: "Un site vitrine soigné démarre à 450 €. Un site avec carte interactive, recherche et pages de destinations se situe au-dessus : le <a href=\"/#estimation\">simulateur</a> donne la fourchette selon le nombre de pages et de fonctionnalités."
          },
          {
            q: "Mon site actuel est daté, faut-il tout refaire ?",
            a: "Pas toujours. Parfois la structure tient et seul l'habillage est à reprendre. La page <a href=\"/refonte-site-internet.html\">refonte de site internet</a> détaille comment je tranche entre retouche et reconstruction."
          },
          {
            q: "Pouvez-vous reprendre un site fait par quelqu'un d'autre ?",
            a: "Oui, à condition d'avoir accès au code et à l'hébergement. Je commence par un état des lieux écrit avant de m'engager sur un devis."
          }
        ])
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "realisation-zendra.html",
    breadcrumb: "Zendra",
    title: "Zendra : recherche sémantique dans ses documents | Étude de cas",
    description:
      "Étude de cas Zendra : un assistant documentaire qui classe les fichiers à l'arrivée, cherche par le sens plutôt que par mots-clés et répond en langage naturel. Conçu et commercialisé seul.",
    kicker: "Étude de cas · SaaS conçu et vendu",
    h1: "Zendra, retrouver un document <br class='br-lg' />sans le mot exact",
    lede:
      "La recherche par mots-clés échoue dès qu'on ne se souvient plus du terme employé dans le fichier. Zendra cherche par le sens, classe à l'arrivée et répond aux questions posées en français.",
    ctaTitle: "Une idée de produit <br class='br-lg' />à mettre au monde ?",
    work: { name: "Zendra", url: "https://zendra.pro", category: "BusinessApplication", os: "Web" },
    hero: shot("zendra", "Page d'accueil de Zendra", 875),
    facts: [
      { k: "Rôle", v: "Conception, développement, commercialisation" },
      { k: "Nature", v: "Assistant documentaire, recherche sémantique et questions en langage naturel" },
      { k: "Technologies", v: "Next.js, PostgreSQL, recherche sémantique, Stripe" },
      { k: "Modèle", v: "Abonnement récurrent" },
      { k: "En ligne", v: "<a href=\"https://zendra.pro\" target=\"_blank\" rel=\"noopener\">zendra.pro</a>" }
    ],
    sections: [
      {
        kicker: "Le point de départ",
        h2: "La recherche par <br class='br-lg' />mots-clés ne suffit plus",
        lede:
          "Tout le monde a déjà cherché un document dont il se rappelait le contenu, mais pas le titre, pas la date, pas le mot exact qui s'y trouvait.",
        html: `            <p>
              Un moteur classique compare des chaînes de caractères. Si le
              fichier dit « avenant au contrat de prestation » et que vous tapez
              « modification du devis », il ne renvoie rien, alors que c'est le
              même document. Plus une base de documents grossit, plus cet écart
              coûte cher : le fichier existe, il est au bon endroit, et il reste
              introuvable.
            </p>
            <p>
              Le second problème est le rangement. Personne ne classe ses
              documents au moment où il les reçoit, parce que c'est
              précisément le moment où l'on a autre chose à faire. Six mois plus
              tard, le dossier est un tas.
            </p>`
      },
      {
        tone: "on-violet",
        kicker: "Le produit",
        h2: "Chercher par le sens, <br class='br-lg' />pas par la lettre",
        html: marks([
          "<strong>Classement à l'arrivée</strong> : chaque document est analysé et rangé au moment où il entre, sans action de l'utilisateur",
          "<strong>Recherche sémantique</strong> : la requête est comparée au sens du contenu, pas à ses caractères, donc « modification du devis » retrouve « avenant au contrat »",
          "<strong>Questions en langage naturel</strong> : on demande ce qu'on veut savoir, et la réponse cite les documents sur lesquels elle s'appuie",
          "<strong>Une base qui reste la vôtre</strong> : les fichiers ne servent qu'à répondre à vos questions"
        ]) + `
            <p>
              Le point sensible d'un produit de ce genre est la confiance. Une
              réponse en langage naturel qui ne montre pas d'où elle vient ne
              vaut rien : l'utilisateur ne peut pas la vérifier, donc il ne
              l'utilise pas. Rattacher chaque réponse à ses sources est moins
              spectaculaire à démontrer, mais c'est ce qui fait la différence
              entre un gadget et un outil de travail.
            </p>`
      },
      {
        kicker: "Sous le capot",
        h2: "Une pile volontairement <br class='br-lg' />ordinaire",
        lede:
          "Next.js pour l'interface et le rendu, PostgreSQL pour les données et les vecteurs, Stripe pour l'abonnement. Rien d'exotique, et c'est délibéré.",
        html: `            <p>
              La recherche sémantique se construit en transformant chaque
              passage de document en une représentation numérique, puis en
              comparant la question à ces représentations. Cette mécanique peut
              se loger dans une base spécialisée de plus, avec sa facture, son
              tableau de bord et son mode de panne propre. Elle tient aussi dans
              PostgreSQL, à côté du reste des données.
            </p>
            <p>
              J'ai choisi la seconde option. Une brique de moins à surveiller,
              une sauvegarde unique, une facture unique, et la possibilité de
              joindre les résultats de recherche aux données métier dans la même
              requête. Sur un produit porté par une seule personne, réduire le
              nombre de choses susceptibles de tomber la nuit vaut plus qu'un
              gain de performance théorique.
            </p>
            <p>
              C'est le raisonnement que j'applique aussi chez mes clients :
              choisir la plus petite architecture qui répond vraiment au besoin
              d'aujourd'hui, et laisser la porte ouverte plutôt que de construire
              la salle en avance.
            </p>`
      },
      {
        tone: "on-jaune",
        kicker: "Du premier écran à la facture",
        h2: "Un produit mené <br class='br-lg' />jusqu'à la vente",
        html: `            <p>
              Zendra est conçu, développé et commercialisé seul, du premier
              écran à l'abonnement récurrent. La partie visible, la recherche,
              n'est qu'un morceau : il a fallu décider du positionnement, écrire
              les pages de vente, fixer un prix, brancher les paiements, tenir
              l'hébergement et répondre aux utilisateurs.
            </p>
            <p>
              Comme pour <a href="/realisation-selfsolution.html">Self Solution</a>,
              c'est cette partie-là qui apprend le plus. On découvre vite que la
              fonctionnalité dont on était le plus fier n'est pas celle qui
              déclenche l'abonnement, et qu'un écran de départ mal fichu coûte
              plus d'utilisateurs qu'un défaut technique.
            </p>
            <p>
              <a class="case-link" href="https://zendra.pro" target="_blank" rel="noopener">zendra.pro &#8599;</a>
            </p>`
      },
      {
        kicker: "Questions fréquentes",
        h2: "Ce qu'on me <br class='br-lg' />demande ensuite",
        html: faq([
          {
            q: "Pouvez-vous ajouter ce type de recherche à mon outil existant ?",
            a: "Oui, c'est souvent plus rapide que de créer un produit à part : la recherche sémantique s'ajoute à une base déjà en place. Il faut d'abord regarder comment vos documents sont stockés aujourd'hui."
          },
          {
            q: "Où partent les documents ?",
            a: "Cela se décide au cadrage, et cela dépend de vos contraintes : hébergement en Europe, fournisseur de modèle, durée de conservation. Sur un projet client, ces réponses figurent au devis avant la première ligne de code."
          },
          {
            q: "Faut-il forcément de l'IA dans mon produit ?",
            a: "Non. Beaucoup de projets qui arrivent avec « il faut de l'IA » se règlent mieux avec une recherche bien indexée et un formulaire clair. Je le dis quand c'est le cas : cela vous coûte moins cher et cela tombe moins souvent en panne."
          },
          {
            q: "Comment démarrer un projet avec vous ?",
            a: "Par le <a href=\"/#estimation\">simulateur</a> pour un ordre de grandeur, puis un échange de trente minutes. Voir aussi la page <a href=\"/developpeur-web-freelance-nantes.html\">développeur web freelance</a> pour ma façon de travailler."
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
for (const p of [...SERVICES, ...CASES]) {
  writeFileSync(path.join(ROOT, p.slug), render(p), "utf8");
  console.log("ecrit", p.slug);
}

/* Sitemap regenere a partir de la meme source. */
const urls = [
  { loc: `${SITE}/`, freq: "monthly" },
  ...SERVICES.map((p) => ({ loc: `${SITE}/${p.slug}`, freq: "monthly" })),
  ...CASES.map((p) => ({ loc: `${SITE}/${p.slug}`, freq: "yearly" })),
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
