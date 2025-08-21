document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('annonce-container');
    const form = document.getElementById('annonce-form');
    const titreInput = document.getElementById('titre');
    const messageInput = document.getElementById('message');
    const dateInput = document.getElementById('date');
    const editIndex = document.getElementById('edit-index');
    const passwordInput = document.getElementById('password');
    let annonces = [];

    function loadAnnonces() {
        fetch('annonces.json')
            .then(r => r.json())
            .then(data => {
                annonces = data.annonces || [];
                displayAnnonces();
            });
    }

    function displayAnnonces() {
        container.innerHTML = '';
        annonces.forEach((a, i) => {
            const card = document.createElement('div');
            card.className = 'annonce-card';
            card.innerHTML = `
                <h3>${a.titre}</h3>
                <p>${a.message}</p>
                <small>${a.date}</small><br>
                <button class="edit" data-index="${i}">✏️ Modifier</button>
                <button class="delete" data-index="${i}">🗑 Supprimer</button>
            `;
            container.appendChild(card);
        });

        document.querySelectorAll('.edit').forEach(btn =>
            btn.addEventListener('click', e => {
                const i = e.target.dataset.index;
                titreInput.value = annonces[i].titre;
                messageInput.value = annonces[i].message;
                dateInput.value = annonces[i].date;
                editIndex.value = i;
            })
        );

        document.querySelectorAll('.delete').forEach(btn =>
            btn.addEventListener('click', e => {
                const i = e.target.dataset.index;
                if (confirm('Supprimer cette annonce ?')) {
                    annonces.splice(i, 1);
                    saveAnnonces();
                }
            })
        );
    }

    function saveAnnonces() {
        const password = passwordInput.value.trim();
        fetch('update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, annonces })
        })
        .then(r => r.json())
        .then(res => {
            if (res.success) {
                loadAnnonces();
                form.reset();
                editIndex.value = '';
            } else {
                alert("Erreur: " + res.error);
            }
        });
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const annonce = {
            titre: titreInput.value,
            message: messageInput.value,
            date: dateInput.value
        };

        if (editIndex.value) {
            annonces[editIndex.value] = annonce;
        } else {
            annonces.push(annonce);
        }
        saveAnnonces();
    });

    loadAnnonces();
});
