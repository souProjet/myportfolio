document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('devisForm');

    // Prix de base par type de projet
    const basePrice = {
        vitrine: { min: 450, max: 1000 },
        ecommerce: { min: 1500, max: 4000 },
        saas: { min: 3000, max: 15000 },
        application: { min: 3000, max: 15000 }
    };

    // Frais mensuels de base par type de projet
    const baseMonthlyFees = {
        vitrine: { min: 0, max: 17 },
        ecommerce: { min: 10, max: 30 },
        saas: { min: 10, max: 100 },
        application: { min: 10, max: 100 }
    };

    // Multiplicateurs pour la complexité
    const complexityMultipliers = {
        simple: 1,
        medium: 1.3,
        complex: 1.6
    };

    // Multiplicateurs pour la taille
    const sizeMultipliers = {
        small: 1,
        medium: 1.3,
        large: 1.6
    };

    // Multiplicateurs pour le design
    const designMultipliers = {
        simple: 1,
        custom: 1.2,
        premium: 1.4
    };

    // Délais de base par type de projet (en semaines)
    const baseDelay = {
        vitrine: { min: 1, max: 2 },
        ecommerce: { min: 2, max: 6 },
        saas: { min: 4, max: 16 },
        application: { min: 4, max: 16 }
    };

    let selectedType = 'vitrine';
    let selectedComplexity = 'simple';
    let selectedSize = 'small';
    let selectedDesign = 'simple';

    // Fonction pour mettre à jour l'apparence des cartes de type de projet
    function updateProjectTypeCards() {
        document.querySelectorAll('.project-type-card').forEach(card => {
            const isSelected = card.dataset.type === selectedType;
            card.classList.toggle('border-[#f41a4a]', isSelected);
            card.classList.toggle('border-transparent', !isSelected);
            card.classList.toggle('bg-[#fff5f7]', isSelected);
        });
    }

    // Fonction pour mettre à jour l'apparence des boutons de complexité
    function updateComplexityButtons() {
        document.querySelectorAll('.complexity-btn').forEach(btn => {
            const isSelected = btn.dataset.complexity === selectedComplexity;
            btn.classList.toggle('border-[#f41a4a]', isSelected);
            btn.classList.toggle('bg-[#fff5f7]', isSelected);
            btn.classList.toggle('border-transparent', !isSelected);
        });
    }

    // Fonction pour mettre à jour l'apparence des boutons de taille
    function updateSizeButtons() {
        document.querySelectorAll('.size-btn').forEach(btn => {
            const isSelected = btn.dataset.size === selectedSize;
            btn.classList.toggle('border-[#f41a4a]', isSelected);
            btn.classList.toggle('bg-[#fff5f7]', isSelected);
            btn.classList.toggle('border-transparent', !isSelected);
        });
    }

    // Fonction pour mettre à jour l'apparence des boutons de design
    function updateDesignButtons() {
        document.querySelectorAll('.design-btn').forEach(btn => {
            const isSelected = btn.dataset.design === selectedDesign;
            btn.classList.toggle('border-[#f41a4a]', isSelected);
            btn.classList.toggle('bg-[#fff5f7]', isSelected);
            btn.classList.toggle('border-transparent', !isSelected);
        });
    }

    // Sélectionner les valeurs par défaut au chargement
    function setDefaultSelections() {
        selectedType = 'vitrine';
        selectedComplexity = 'simple';
        selectedSize = 'small';
        selectedDesign = 'simple';

        updateProjectTypeCards();
        updateComplexityButtons();
        updateSizeButtons();
        updateDesignButtons();
        calculateEstimate();
    }

    // Gestion des cards de type de projet
    document.querySelectorAll('.project-type-card').forEach(card => {
        card.addEventListener('click', function() {
            selectedType = this.dataset.type;
            updateProjectTypeCards();
            calculateEstimate();
        });
    });

    // Gestion des boutons de complexité
    document.querySelectorAll('.complexity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedComplexity = this.dataset.complexity;
            updateComplexityButtons();
            calculateEstimate();
        });
    });

    // Gestion des boutons de taille
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedSize = this.dataset.size;
            updateSizeButtons();
            calculateEstimate();
        });
    });

    // Gestion des boutons de design
    document.querySelectorAll('.design-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedDesign = this.dataset.design;
            updateDesignButtons();
            calculateEstimate();
        });
    });

    function calculateEstimate() {
        if (!selectedType) return;

        // Prix de base
        let minPrice = basePrice[selectedType].min;
        let maxPrice = basePrice[selectedType].max;

        // Frais mensuels de base
        let minMonthly = baseMonthlyFees[selectedType].min;
        let maxMonthly = baseMonthlyFees[selectedType].max;

        // Calculer le pourcentage d'augmentation total
        let totalMultiplier = 1;
        if (selectedComplexity) {
            totalMultiplier *= complexityMultipliers[selectedComplexity];
        }
        if (selectedSize) {
            totalMultiplier *= sizeMultipliers[selectedSize];
        }
        if (selectedDesign) {
            totalMultiplier *= designMultipliers[selectedDesign];
        }

        // Calculer la fourchette de prix en fonction des options
        const range = maxPrice - minPrice;
        const optionImpact = (totalMultiplier - 1) * range;
        
        // Ajuster min et max en fonction des options
        minPrice = Math.round(minPrice + (optionImpact * 0.3));
        maxPrice = Math.round(maxPrice + (optionImpact * 0.7));
        
        // S'assurer que min ne dépasse pas max
        if (minPrice >= maxPrice) {
            maxPrice = minPrice + Math.round(range * 0.3);
        }

        // Ajuster les frais mensuels de manière similaire
        const monthlyRange = maxMonthly - minMonthly;
        const monthlyOptionImpact = (totalMultiplier - 1) * monthlyRange;
        
        minMonthly = Math.round(minMonthly + (monthlyOptionImpact * 0.3));
        maxMonthly = Math.round(maxMonthly + (monthlyOptionImpact * 0.7));
        
        if (minMonthly >= maxMonthly) {
            maxMonthly = minMonthly + Math.round(monthlyRange * 0.3);
        }

        // Calculer le délai
        let minDelay = baseDelay[selectedType].min;
        let maxDelay = baseDelay[selectedType].max;

        // Ajuster le délai en fonction de la complexité et de la taille
        if (selectedComplexity === 'complex') {
            minDelay *= 1.3;
            maxDelay *= 1.3;
        }

        if (selectedSize === 'large') {
            minDelay *= 1.2;
            maxDelay *= 1.2;
        }

        // Arrondir les délais
        minDelay = Math.round(minDelay);
        maxDelay = Math.round(maxDelay);

        // Afficher les résultats avec animation
        const elements = {
            price: {
                element: document.querySelector('#estimationResult'),
                value: `${minPrice} € - ${maxPrice} €`
            },
            monthly: {
                element: document.querySelector('#monthlyResult'),
                value: `${minMonthly} € - ${maxMonthly} €`
            },
            delay: {
                element: document.querySelector('#delaiResult'),
                value: `${minDelay} - ${maxDelay} semaines`
            }
        };

        // Animer chaque résultat
        Object.values(elements).forEach(({element, value}) => {
            gsap.to(element, {
                opacity: 0,
                y: -10,
                duration: 0.2,
                onComplete: () => {
                    element.textContent = value;
                    gsap.to(element, {
                        opacity: 1,
                        y: 0,
                        duration: 0.3
                    });
                }
            });
        });
    }

    // Écouter les changements sur le formulaire
    form.addEventListener('change', calculateEstimate);

    // Animation initiale des éléments du formulaire
    gsap.from('#devisForm .method-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    });

    // Initialiser les sélections par défaut au chargement
    setDefaultSelections();
}); 