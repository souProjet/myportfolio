/* Swann Bougouin - comportements de la page. Vanilla, sans dependance. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mesure d'audience ----------
     posthog est absent des qu'un bloqueur agit ou que le snippet n'a pas ete
     charge : aucun appel ne doit interrompre le reste du script. Le stub pose
     par le snippet accepte capture() avant meme que array.js soit arrive. */
  var track = function (name, params) {
    if (!window.posthog || typeof window.posthog.capture !== "function") return;
    try {
      window.posthog.capture(name, params || {});
    } catch (e) {}
  };

  /* ---------- Theme ---------- */
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      if (!current) {
        current = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  /* ---------- Navigation ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 8) nav.setAttribute("data-stuck", "");
      else nav.removeAttribute("data-stuck");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var burger = document.getElementById("nav-burger");
  var drawer = document.getElementById("nav-drawer");
  if (burger && drawer) {
    var setDrawer = function (open) {
      if (open) drawer.setAttribute("data-open", "");
      else drawer.removeAttribute("data-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    };
    burger.addEventListener("click", function () {
      setDrawer(!drawer.hasAttribute("data-open"));
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setDrawer(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setDrawer(false);
    });
  }

  /* ---------- Apparition au defilement ---------- */
  var targets = document.querySelectorAll("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add("is-in");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    Array.prototype.forEach.call(targets, function (el) {
      io.observe(el);
    });
  }

  /* ---------- Notification ---------- */
  var toast = document.getElementById("toast");
  var toastTimer;
  var notify = function (title, message, isError) {
    if (!toast) return;
    document.getElementById("toast-title").textContent = title;
    document.getElementById("toast-message").textContent = message;
    if (isError) toast.setAttribute("data-error", "");
    else toast.removeAttribute("data-error");
    toast.setAttribute("data-show", "");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.removeAttribute("data-show");
    }, 5200);
  };

  /* ---------- Simulateur d'estimation ---------- */
  var quote = document.getElementById("quote-form");
  var estimate = null;
  var touched = false;

  if (quote) {
    var basePrice = {
      vitrine: { min: 450, max: 1000 },
      ecommerce: { min: 1500, max: 4000 },
      saas: { min: 3000, max: 15000 },
      application: { min: 3000, max: 15000 },
      mobile: { min: 5000, max: 20000 }
    };
    var baseMonthly = {
      vitrine: { min: 0, max: 17 },
      ecommerce: { min: 10, max: 30 },
      saas: { min: 10, max: 100 },
      application: { min: 10, max: 100 },
      mobile: { min: 20, max: 150 }
    };
    var baseDelay = {
      vitrine: { min: 1, max: 2 },
      ecommerce: { min: 2, max: 6 },
      saas: { min: 4, max: 16 },
      application: { min: 4, max: 16 },
      mobile: { min: 6, max: 20 }
    };
    var complexity = { simple: 1, medium: 1.3, complex: 1.6 };
    var size = { small: 1, medium: 1.3, large: 1.6 };
    var design = { simple: 1, custom: 1.2, premium: 1.4 };

    var typeLabel = {
      vitrine: "Site vitrine",
      ecommerce: "Boutique en ligne",
      saas: "Produit SaaS",
      application: "Application métier",
      mobile: "Application mobile"
    };
    var complexityLabel = { simple: "Logique simple", medium: "Logique intermédiaire", complex: "Logique avancée" };
    var sizeLabel = { small: "Compact", medium: "Moyen", large: "Large" };
    var designLabel = { simple: "Design sobre", custom: "Design sur mesure", premium: "Design signature" };

    var baseDeliverables = {
      vitrine: [
        "Maquettes validées avant développement",
        "Pages de présentation et formulaire de contact",
        "Référencement technique et fiches Google",
        "Affichage mobile, tablette et ordinateur"
      ],
      ecommerce: [
        "Catalogue, fiches produits et stocks",
        "Panier et tunnel de commande",
        "Paiement par carte via Stripe",
        "Back-office de gestion des commandes",
        "Emails de confirmation automatiques"
      ],
      saas: [
        "Inscription, connexion et gestion des comptes",
        "Abonnements et facturation Stripe",
        "Tableau de bord utilisateur",
        "Espace d'administration",
        "Base de données PostgreSQL hébergée"
      ],
      application: [
        "Comptes utilisateurs et rôles",
        "Écrans métier sur mesure",
        "Import et export de données",
        "Espace d'administration",
        "Connexion à vos outils existants"
      ],
      mobile: [
        "Application iOS et application Android",
        "Interface native adaptée à chaque plateforme",
        "Notifications push",
        "API et base de données dédiées",
        "Publication sur l'App Store et le Play Store"
      ]
    };

    var extras = {
      complexity: {
        simple: [],
        medium: ["Intégration de deux à trois services externes"],
        complex: [
          "Règles métier et automatisations sur mesure",
          "Tests automatisés sur les parcours critiques"
        ]
      },
      size: {
        small: [],
        medium: ["Une douzaine d'écrans"],
        large: ["Plus de vingt écrans et gestion des rôles"]
      },
      design: {
        simple: [],
        custom: ["Maquettes Figma validées écran par écran"],
        premium: [
          "Direction artistique complète",
          "Animations et micro-interactions sur mesure"
        ]
      }
    };

    var alwaysDeliverables = [
      "Code source livré sur votre dépôt Git",
      "Prise en main en visio (1 h)",
      "30 jours de garantie corrective"
    ];

    var phases = [
      { name: "Cadrage et maquettes", weight: 0.2 },
      { name: "Développement", weight: 0.45 },
      { name: "Intégration et tests", weight: 0.2 },
      { name: "Recette et mise en ligne", weight: 0.15 }
    ];

    var nf = new Intl.NumberFormat("fr-FR");
    var euro = {
      format: function (n) {
        return nf.format(n).replace(/\u202f/g, "\u00a0");
      }
    };

    var pick = function (name) {
      var el = quote.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    };

    var band = function (base, multiplier) {
      var range = base.max - base.min;
      var impact = (multiplier - 1) * range;
      var min = Math.round(base.min + impact * 0.3);
      var max = Math.round(base.max + impact * 0.7);
      if (min >= max) max = min + Math.round(range * 0.3);
      return { min: min, max: max };
    };

    /* Compteur anime sur les valeurs chiffrees. */
    var ease = function (t) {
      return 1 - Math.pow(1 - t, 3);
    };
    var countTo = function (el, values, render) {
      var from = el._vals || values.map(function () { return 0; });
      el._vals = values;
      if (reduced) {
        el.textContent = render(values);
        return;
      }
      if (el._raf) window.cancelAnimationFrame(el._raf);
      var start = null;
      var duration = 480;
      var step = function (now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / duration);
        var k = ease(t);
        el.textContent = render(
          values.map(function (v, i) {
            var a = from[i] === undefined ? 0 : from[i];
            return Math.round(a + (v - a) * k);
          })
        );
        if (t < 1) el._raf = window.requestAnimationFrame(step);
      };
      el._raf = window.requestAnimationFrame(step);
    };

    var priceOut = document.getElementById("out-price");
    var monthlyOut = document.getElementById("out-monthly");
    var delayOut = document.getElementById("out-delay");
    var effortOut = document.getElementById("out-effort");
    var gaugeOut = document.getElementById("out-gauge");
    var refOut = document.getElementById("sim-ref");
    var phasesOut = document.getElementById("sim-phases");
    var delivOut = document.getElementById("sim-deliverables");

    var renderPhases = function (weeksMin, weeksMax) {
      var html = "";
      var maxWeight = 0.45;
      /* En dessous d'un mois, decouper en semaines donne "1 sem." partout :
         on bascule sur des jours ouvres pour rester lisible. */
      var inDays = weeksMax <= 4;
      var unitMin = inDays ? weeksMin * 5 : weeksMin;
      var unitMax = inDays ? weeksMax * 5 : weeksMax;
      var suffix = inDays ? " j" : " sem.";
      phases.forEach(function (phase) {
        var lo = Math.max(1, Math.round(unitMin * phase.weight));
        var hi = Math.max(lo, Math.round(unitMax * phase.weight));
        var label = lo === hi ? lo + suffix : lo + " à " + hi + suffix;
        html +=
          '<div class="sim-phase"><b>' + phase.name + "</b><i>" + label +
          '</i><span class="sim-phase-track"><span data-w="' +
          Math.round((phase.weight / maxWeight) * 100) + '"></span></span></div>';
      });
      phasesOut.innerHTML = html;
      window.requestAnimationFrame(function () {
        var bars = phasesOut.querySelectorAll(".sim-phase-track > span");
        Array.prototype.forEach.call(bars, function (bar) {
          bar.style.width = bar.getAttribute("data-w") + "%";
        });
      });
    };

    var renderDeliverables = function (list) {
      var html = "";
      list.forEach(function (item, i) {
        html +=
          '<li style="animation-delay:' + (reduced ? 0 : i * 45) + 'ms">' +
          item + "</li>";
      });
      delivOut.innerHTML = html;
    };

    var compute = function () {
      var t = pick("type");
      var c = pick("complexity");
      var s = pick("size");
      var d = pick("design");
      if (!t || !c || !s || !d) return;

      var multiplier = complexity[c] * size[s] * design[d];
      var price = band(basePrice[t], multiplier);
      var monthly = band(baseMonthly[t], multiplier);

      var delayMin = baseDelay[t].min;
      var delayMax = baseDelay[t].max;
      if (c === "complex") { delayMin *= 1.3; delayMax *= 1.3; }
      if (s === "large") { delayMin *= 1.2; delayMax *= 1.2; }
      delayMin = Math.max(1, Math.round(delayMin));
      delayMax = Math.max(delayMin, Math.round(delayMax));

      countTo(priceOut, [price.min, price.max], function (v) {
        return euro.format(v[0]) + " à " + euro.format(v[1]) + "\u00a0€";
      });
      countTo(monthlyOut, [monthly.min, monthly.max], function (v) {
        return v[0] === v[1]
          ? euro.format(v[0]) + "\u00a0€"
          : euro.format(v[0]) + " à " + euro.format(v[1]) + "\u00a0€";
      });
      countTo(delayOut, [delayMin, delayMax], function (v) {
        return v[0] === v[1] ? v[0] + " semaines" : v[0] + " à " + v[1] + " semaines";
      });

      /* Jauge de charge : 1 = mini, 3.584 = toutes les options au maximum. */
      var ratio = (multiplier - 1) / (1.6 * 1.6 * 1.4 - 1);
      var effort = ratio < 0.25 ? "Légère" : ratio < 0.5 ? "Modérée" : ratio < 0.75 ? "Soutenue" : "Intense";
      effortOut.textContent = effort;
      gaugeOut.style.width = Math.round(12 + ratio * 88) + "%";

      renderPhases(delayMin, delayMax);

      var list = baseDeliverables[t]
        .concat(extras.complexity[c], extras.size[s], extras.design[d], alwaysDeliverables);
      renderDeliverables(list);

      var order = { simple: 1, medium: 2, complex: 3, small: 1, large: 3, custom: 2, premium: 3 };
      refOut.textContent =
        "EST-" + t.charAt(0).toUpperCase() + (order[c] || 1) + (order[s] || 1) + (order[d] || 1);

      estimate = {
        ref: refOut.textContent,
        priceMin: price.min,
        priceMax: price.max,
        type: typeLabel[t],
        choices: [complexityLabel[c], sizeLabel[s], designLabel[d]].join(", "),
        price: euro.format(price.min) + " à " + euro.format(price.max) + "\u00a0€",
        delay: delayMin + " à " + delayMax + " semaines",
        monthly:
          monthly.min === monthly.max
            ? euro.format(monthly.min) + "\u00a0€ / mois"
            : euro.format(monthly.min) + " à " + euro.format(monthly.max) + "\u00a0€ / mois",
        effort: effort,
        deliverables: list
      };

      if (touched) syncEstimate();
    };

    var startTracked = false;
    quote.addEventListener("change", function () {
      if (!startTracked) {
        startTracked = true;
        track("estimation_start");
      }
      touched = true;
      compute();
    });
    compute();
  }

  /* ---------- Transmission de l'estimation avec le message ---------- */
  var chip = document.getElementById("estimate-chip");
  var chipText = document.getElementById("estimate-chip-text");
  var fieldResume = document.getElementById("f-est-resume");
  var fieldDetails = document.getElementById("f-est-details");

  function syncEstimate() {
    if (!estimate || !fieldResume || !fieldDetails) return;
    var resume =
      estimate.ref + " · " + estimate.type + " · " + estimate.price +
      " · " + estimate.delay;
    fieldResume.value = resume;
    fieldDetails.value = [
      "Référence : " + estimate.ref,
      "Type de projet : " + estimate.type,
      "Options : " + estimate.choices,
      "Budget estimé : " + estimate.price,
      "Délai estimé : " + estimate.delay,
      "Hébergement et maintenance : " + estimate.monthly,
      "Charge de travail : " + estimate.effort,
      "",
      "Livrables retenus :",
      estimate.deliverables
        .map(function (d) { return "- " + d; })
        .join("\n")
    ].join("\n");

    if (chip && chipText) {
      chipText.textContent =
        estimate.type + " · " + estimate.price + " · " + estimate.delay;
      chip.setAttribute("data-on", "");
    }
  }

  /* Uniquement des valeurs issues de nos propres listes : le nom, l'email et
     le message du visiteur ne partent jamais vers Google Analytics. */
  function estimateParams() {
    if (!estimate) return { has_estimate: "non" };
    return {
      has_estimate: "oui",
      est_ref: estimate.ref,
      project_type: estimate.type,
      currency: "EUR",
      value: Math.round((estimate.priceMin + estimate.priceMax) / 2)
    };
  }

  var simSend = document.getElementById("sim-send");
  if (simSend) {
    simSend.addEventListener("click", function () {
      touched = true;
      syncEstimate();
      track("estimation_to_contact", estimateParams());

      var subject = document.getElementById("f-subject");
      var message = document.getElementById("f-message");
      if (subject && !subject.value && estimate) {
        subject.value = estimate.type + " · " + estimate.ref;
      }
      if (message && !message.value && estimate) {
        message.value =
          "Bonjour, j'ai simulé un projet de type " + estimate.type.toLowerCase() +
          " (" + estimate.price + ", " + estimate.delay + ").\n\nVoici le contexte : ";
      }

      var contact = document.getElementById("contact");
      if (contact) {
        contact.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }
      window.setTimeout(function () {
        var name = document.getElementById("f-name");
        if (name) name.focus({ preventScroll: true });
      }, reduced ? 0 : 600);
    });
  }

  /* ---------- Formulaire de contact ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (typeof emailjs === "undefined") {
        notify(
          "Envoi indisponible",
          "Écrivez directement à contact@swameta.fr, je réponds sous 24 h.",
          true
        );
        track("form_error", { reason: "emailjs_indisponible" });
        return;
      }
      if (touched) syncEstimate();

      var button = document.getElementById("contact-submit");
      var label = button.textContent;
      button.textContent = "Envoi en cours…";
      button.disabled = true;

      emailjs
        .sendForm("service_zy5f819", "template_1x6ly2q", form, {
          publicKey: "-2OuZv-a3yRdM-a8P"
        })
        .then(
          function () {
            track("generate_lead", touched ? estimateParams() : { has_estimate: "non" });
            notify(
              "Message envoyé",
              estimate && touched
                ? "Votre estimation " + estimate.ref + " est partie avec. Réponse sous 24 heures ouvrées."
                : "Je reviens vers vous sous 24 heures ouvrées.",
              false
            );
            form.reset();
            if (chip) chip.removeAttribute("data-on");
          },
          function () {
            notify("L'envoi a échoué", "Réessayez, ou écrivez à contact@swameta.fr.", true);
            track("form_error", { reason: "envoi_refuse" });
          }
        )
        .finally(function () {
          button.textContent = label;
          button.disabled = false;
        });
    });
  }

  /* ---------- Contacts directs ----------
     Un mail ou un appel ne passe pas par le formulaire : sans cela ces
     demandes, souvent les plus serieuses, restent invisibles. */
  document.addEventListener("click", function (event) {
    var el = event.target;
    if (!el || !el.closest) return;
    var link = el.closest('a[href^="mailto:"], a[href^="tel:"]');
    if (!link) return;
    track("contact_click", {
      method: link.getAttribute("href").indexOf("tel:") === 0 ? "telephone" : "email"
    });
  });

  /* ---------- Annee ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
