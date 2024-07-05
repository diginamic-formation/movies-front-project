// Extraction de la chaîne de requête de l'URL, puis suppression du caractère "?" pour obtenir l'ID du film
const cartFilm = window.location.search.split("?").join("");

const urlAppFilm = 'http://localhost:8080/films/'
const urlAppFilms = 'http://localhost:8080/films';
const API_KEY = '8c876ad71559ac44edf7af86b9d77927';

/**
 * Effectue une requête asynchrone pour récupérer les détails d'un film spécifique en utilisant son identifiant.
 * @param {string} cartFilm - L'identifiant du film à récupérer.
 * @returns {Promise<Object>} - Une promesse résolue avec les données du film si la requête est réussie, sinon une promesse rejetée avec l'erreur.
 */
async function getFilmById(cartFilm){
    let datas = await fetch(`${urlAppFilms}/${cartFilm}`)
    .then((response) => {return response.json()})
    .catch(error => console.log(error))
    return datas
   
}
/**
 * Effectue une requête asynchrone pour récupérer les rôles associés à un film spécifique.
 * @returns {Promise<Array>} - Une promesse résolue avec un tableau de rôles si la requête est réussie, sinon une promesse rejetée avec l'erreur.
 */
async function getRoleByFilm(){
    let datas = await fetch(`${urlAppFilms}/${cartFilm}/roles`)
    .then((response) => {return response.json()})
    .catch(error => console.log(error))
    return datas
}
/**
 * Fonction asynchrone qui récupère l'URL de l'affiche d'un film à partir de son identifiant IMDb en utilisant l'API The Movie Database (TMDb).
 * @param {string} imdbId - L'identifiant IMDb du film.
 * @returns {Promise<string>} - Une promesse qui résout avec l'URL de l'affiche ou est rejetée avec une erreur si l'affiche n'est pas trouvée.
 */
function getPictures(imdbId) {
    return fetch(
        `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY}`
    )
        .then((response) => response.json())
        .then((data) => {
            for (i in data) {
                if (data[i][0] && data[i][0].poster_path) {
                    return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].poster_path}`;
                }
            }
            throw new Error("Poster Not Found");
        });
}

/**
 * Fonction asynchrone qui met à jour les informations d'un film côté serveur en effectuant une requête POST.
 * @param {string} cartFilm - L'identifiant du film à mettre à jour.
 * @param {Object} updatedFilmData - Les données mises à jour du film au format JSON.
 * @returns {Promise<string>} - Une promesse qui résout avec la réponse du serveur ou est rejetée avec une erreur en cas d'échec.
 */
async function updateFilmOnServer(cartFilm, updatedFilmData) {
    try {
        const response = await fetch(`${urlAppFilm}${cartFilm}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFilmData)
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la mise à jour du film (${response.status})`);
        }

        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du film:', error);
        throw error;
    }
}

// Fonction pour obtenir et formater les données du film
async function fetchAndFormatFilmData(cartFilm) {
    try {
        const filmData = await getFilmById(cartFilm);

        if (filmData && typeof filmData === 'object') {
            const picture = await getPictures(filmData.referenceNumber)
            .then((picture) => picture)
            .catch((e) => "images/no-poster-available.jpg");
            filmData.picture = picture;
            const roles = await getRoleByFilm();
            filmData.role = roles;
            return filmData;
        } else {
            console.error('Format de données non valide reçu de getFilmById.');
            return null;
        }
    } catch (error) {
        console.error('Erreur de récupération ou de formatage des données film :', error);
        return null;
    }
}

// Fonction pour afficher les données du film
function displayFilm(filmData) {
    if (!filmData) {
        return;
    }

    document.getElementById("affich-film").innerHTML = `
        <!-- Votre code d'affichage du film ici -->
        <div class="d-flex justify-content-between bg-white affichFilm gy-2">
        <h2 class="text-start">${filmData.title}</h2>
        <a href="#formulaire" id="modifier" class="modifFilm">Modifier <i class="fa-regular fa-pen-to-square"></i></a>
    </div>
    <article class="col-12 col-md-4" id=${filmData.id}>
        <div class="card shadow p-3 mb-3 bg-body-tertiary rounded">
            <img class="card-img-top" src=${filmData.picture} alt="image du film ${filmData.title}" />
            <div class="card-body">
                <h5 class="card-title text-truncate">${filmData.title}</h5>
                <p class="card-text text-truncate">${filmData.genres.join(", ")}</p>
                <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="${filmData.rating*10}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar progress-bar-striped" style="width: ${filmData.rating*10}%">${filmData.rating*10} %</div>
            </div>
        </div>
    </article>
    <div class="col-12 col-md-6">
        <h5> <i class="fa-solid fa-book-open"></i> Sommaire</h5>
        <p class="summary">${filmData.summary}</p>
        <h5>Réalisateur(s)</h5>
        <p>${filmData.realisators.map(real => real.fullName).join(", ")}</p>
        <h5>Pays</h5>
        <p>${filmData.country}</p>
        <h5><i class="fa-solid fa-language"></i> Langue</h5>
        <p>${filmData.language}</p>
        <h5>Année de sortie</h5>
        <p>${filmData.year}</p>    
    </div>
    <div>
        <h5 class="text-center">Acteurs et rôles</h5>
        <table class="table table-bordered table-hover">
            <thead>
               <tr>
                  <th scope="col">Acteurs</th>
                  <th scope="col">Rôles</th>
               </tr>
            </thead>
        ${filmData.role.map(role => `
            <tbody>
                <tr>
                    <td>${role.actor}</td>
                    <td>${role.role}</td>
                </tr>
            </tbody>`).join("")}
        </table>
    </div>
    <div id="formulaire" style="display: none;">
    <h5 class="formulaire" >Formulaire de mise à jour</h5>
    <form id="updateFilmForm" class="row g-3">  
    <!-- Champs de formulaire pour la modification -->
        <div class="col-md-6">
            <label for="title" class="form-label">Titre :</label>
            <input type="text" id="title" class="form-control" name="title" value="${filmData.title}">
        </div>
        <div class="col-md-6">
            <label for="sommaire" class="form-label">Sommaire :</label>
            <input type="text" id="sommaire" class="form-control" name="sommaire" value="${filmData.summary}">
        </div>
        <div class="col-md-6">
            <label for="notation" class="form-label">Notation :</label>
            <input type="text" id="notation" class="form-control" name="notation" value="${filmData.rating}">
        </div>
        <div class="col-md-6">
            <label for="annee" class="form-label">Année de sortie :</label>
            <input type="text" id="annee" class="form-control" name="annee" value="${filmData.year}">
        </div>
        <div class="col-12">
            <button type="submit" class="btn btn-outline-dark">Mettre à jour</button>
        </div>
    </form>
    <div id="message"></div>
    </div>
    `;
    // Récupération des éléments DOM pour le lien de modification et le formulaire
    const modifier = document.getElementById("modifier");
    const formulaire = document.getElementById("formulaire");
    // Ajout d'un gestionnaire d'événements au clic sur le lien de modification
    modifier.addEventListener("click", function (event) {
        event.preventDefault();
        // Rend le formulaire visible en modifiant le style de l'élément
        formulaire.style.display = "block";
        // Fait défiler la page jusqu'au début du formulaire avec une animation fluide
        formulaire.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
    // Récupération de l'élément DOM pour le formulaire de mise à jour et le conteneur de message
    let updateFilmForm = document.getElementById("updateFilmForm");
    const messageContainer = document.getElementById('message');

    updateFilmForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Récupération des valeurs des champs du formulaire
        const updatedFilmData = {
            title: document.getElementById("title").value,
            summary: document.getElementById("sommaire").value,
            rating: document.getElementById("notation").value,
            year: document.getElementById("annee").value
        }

        try {
            // Appel de la fonction de mise à jour du film côté serveur
            const responseData = await updateFilmOnServer(cartFilm, updatedFilmData);
            // Affichage du message de succès dans le conteneur
            console.log('Réponse de mise à jour du film :', responseData);
            messageContainer.textContent = 'Le film a été mis à jour avec succès.';
        } catch (error) {
            // En cas d'erreur, affichage du message d'erreur dans le conteneur
            console.error('Erreur lors de la mise à jour du film :', error);
            messageContainer.textContent = 'Erreur lors de la mise à jour du film. Veuillez réessayer.';
        }
    });
}

const footer = document.getElementById("footer");
function showFooter(){
    footer.style.display = "block";
}
// Ajouter un écouteur d'événements lorsque la page est complètement chargée
window.addEventListener("load", function () {
    // Définir un délai de 2 secondes
    const delaiEnSecondes = 2;
    // Afficher navPagination après le délai spécifié
    setTimeout(showFooter,delaiEnSecondes* 1000 ); // Convertir les secondes en millisecondes
});

// Fonction principale pour afficher le film
async function cartFilmDisplay() {
    const filmData = await fetchAndFormatFilmData(cartFilm);
    console.log(filmData);
    displayFilm(filmData);
}

cartFilmDisplay();