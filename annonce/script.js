document.addEventListener('DOMContentLoaded', function() {
    const annonceContainer = document.getElementById('annonce-container');
    const lastUpdatedElement = document.getElementById('last-updated');
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    function loadAnnonces() {
        annonceContainer.innerHTML = '<div class="loading">Chargement des annonces...</div>';
        
        fetch('annonces.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur de chargement des annonces');
                }
                return response.json();
            })
            .then(data => {
                displayAnnonces(data.annonces);
                updateLastUpdated(data.annonces);
            })
            .catch(error => {
                annonceContainer.innerHTML = `
                    <div class="error">
                        <h3>❌ Erreur de chargement</h3>
                        <p>${error.message}</p>
                        <p>Veuillez réessayer plus tard.</p>
                    </div>
                `;
                console.error('Erreur:', error);
            });
    }
    
    function displayAnnonces(annonces) {
        if (!annonces || annonces.length === 0) {
            annonceContainer.innerHTML = `
                <div class="empty">
                    <h3>📭 Aucune annonce</h3>
                    <p>Il n'y a aucune annonce pour le moment.</p>
                </div>
            `;
            return;
        }
        
        annonces.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        annonceContainer.innerHTML = '';
        
        annonces.forEach(annonce => {
            const annonceCard = document.createElement('div');
            annonceCard.className = 'annonce-card';
            annonceCard.innerHTML = `
                <h3>📌 ${annonce.titre}</h3>
                <p>${annonce.message}</p>
                <small>📅 Publié le: ${formatDate(annonce.date)}</small>
            `;
            annonceContainer.appendChild(annonceCard);
        });
    }
    
    function updateLastUpdated(annonces) {
        if (annonces && annonces.length > 0) {
            const dates = annonces.map(a => new Date(a.date));
            const latestDate = new Date(Math.max.apply(null, dates));
            lastUpdatedElement.textContent = `Dernière mise à jour: ${formatDate(latestDate)}`;
        }
    }
    
    loadAnnonces();
    setInterval(loadAnnonces, 300000);
});
