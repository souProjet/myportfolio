(function() {
    emailjs.init("-2OuZv-a3yRdM-a8P");
})();

// Fonction pour afficher la notification
function showNotification(title, message, isError = false) {
    const notification = document.getElementById('notification');
    const titleElement = document.getElementById('notification-title');
    const messageElement = document.getElementById('notification-message');
    
    // Mettre à jour le contenu
    titleElement.textContent = title;
    messageElement.textContent = message;
    
    // Changer l'icône et la couleur en fonction du type de notification
    const icon = notification.querySelector('i');
    if (isError) {
        icon.className = 'ri-error-warning-line text-red-500 text-2xl';
        notification.querySelector('.border').classList.remove('border-[#f41a4a]');
        notification.querySelector('.border').classList.add('border-red-500');
        titleElement.classList.remove('text-green-600');
        titleElement.classList.add('text-red-500');
    } else {
        icon.className = 'ri-checkbox-circle-line text-green-500 text-2xl';
        notification.querySelector('.border').classList.remove('border-red-500');
        notification.querySelector('.border').classList.add('border-green-500');
        titleElement.classList.remove('text-red-500');
        titleElement.classList.add('text-green-600');
    }
    
    // Afficher la notification
    notification.classList.remove('translate-x-full');
    
    // La cacher après 5 secondes
    setTimeout(() => {
        notification.classList.add('translate-x-full');
    }, 5000);
}

// Gérer la soumission du formulaire
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Afficher un message de chargement
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;

    // Envoyer l'email
    emailjs.sendForm('service_zy5f819', 'template_1x6ly2q', this)
        .then(function() {
            // Succès
            showNotification('Succès', 'Votre message a été envoyé avec succès !');
            document.getElementById('contactForm').reset();
        }, function(error) {
            // Erreur
            showNotification('Erreur', 'Une erreur est survenue. Veuillez réessayer.', true);
            console.error('Erreur:', error);
        })
        .finally(function() {
            // Réinitialiser le bouton
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
}); 