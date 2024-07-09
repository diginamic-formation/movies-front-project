const urlAppGenre = 'http://localhost:8080/genres';
const API_KEY = '8c876ad71559ac44edf7af86b9d77927';

function extractQueryParams(){
    return new URLSearchParams(window.location.search); 
}

const pageSize = 12;
let totalPageCount = 1000  ; // Nombre total de pages
let currentPage = 0;
/**
 * Fonction asynchrone pour récupérer une liste de films depuis une API avec pagination.
 * @param {number} pageNumber - Le numéro de la page à récupérer.
 * @returns {Promise} - Une promesse résolue avec les données des films ou rejetée en cas d'erreur.
 */
async function getFilmsByGenre(idGenre,genrePageNumber) {
    try {
        const response = await fetch(`${urlAppGenre}/${idGenre}/films?page=${genrePageNumber}&size=${pageSize}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching films:', error);
        throw error;
    }
}


/**
 * Fonction asynchrone pour récupérer le chemin du poster d'une entité à partir de l'ID IMDb.
 * @param {string} imdbId - L'ID IMDb de l'entité.
 * @returns {Promise<string>} - Une promesse résolue avec le chemin du poster complet ou une chaîne vide si aucun poster n'est trouvé.
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


// Fonction pour mettre à jour le stockage local avec la valeur actuelle de currentPage
function updateCurrentPageInLocalStorage(pageNumber) {
    localStorage.setItem('currentPage', pageNumber);
}

// Fonction pour obtenir la valeur actuelle de currentPage depuis le stockage local
function getCurrentPageFromLocalStorage() {
    return parseInt(localStorage.getItem('currentPage')) || 0;
}

async function filmDisplay(pageNumber, filmData) {
    try {
        for (const film of filmData.content) {
            const picture = await getPictures(film.referenceNumber)
                .then((picture) => picture)
                .catch((e) => "../images/no-poster-available.jpg");
            film.picture = picture;
        }
        document.querySelector(".films").innerHTML = filmData.content.map((film) => `
            <article class="col">
                <div class="card shadow p-3 mb-3 bg-body-tertiary rounded">
                    <img class="card-img-top" src=${film.picture} alt="image du film ${film.title}" />
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${film.title}</h5>
                        <h6 class="card-text text-truncate font-weight-bold">Année : ${film.year}</h6>
                        <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="${film.rating * 10}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar progress-bar-striped" style="width: ${film.rating * 10}%">${film.rating * 10} %</div>
                </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-outline-dark detail-film" id="${film.id}">Voir</button>
                    </div>
                </div>
            </article>
        `).join("");

        document.querySelector("#pagination-counter").innerHTML=`
        <li class="page-item enabled"><a class="page-link">${filmData.pageable.pageNumber+1} / ${filmData.totalPages}</a></li>
        `
        document.querySelector("#films-size").innerHTML=`
        <p class="font-weight-bold">Résultat : ${filmData.totalElements} films</p>
        `
        totalPageCount = filmData.totalPages
        let boutons = document.querySelectorAll(".detail-film");
        // Attache un écouteur d'événements à chaque bouton
        boutons.forEach((bouton) => {
            bouton.addEventListener("click", () => {
                // Redirection vers la page 'cart-film.html' avec l'ID du bouton en tant que paramètre dans la chaîne de requête
                window.location = `../cart-film.html?${bouton.id}`
            })
        })
        currentPage = pageNumber;
        updateCurrentPageInLocalStorage(currentPage); // Met à jour le stockage local
        return filmData;
    } catch (error) {
        console.error('Error displaying films:', error);
        throw error;
    }
}

// Récupérez la valeur de currentPage depuis le stockage local lors du chargement de la page
currentPage = getCurrentPageFromLocalStorage();

const navPagination = document.getElementById("navPagination");
function showNavPagination() {
    navPagination.style.display = "block";
}

// Ajouter un écouteur d'événements lorsque la page est complètement chargée
window.addEventListener("load", function () {
    // Définir un délai de 5 secondes (vous pouvez ajuster cela selon vos besoins)
    const delaiEnSecondes = 2;

    // Afficher navPagination après le délai spécifié
    setTimeout(showNavPagination, delaiEnSecondes * 1000); // Convertir les secondes en millisecondes
});

// Initial display

async function handleGenreMoviesPage(pageNumber) {
    idGenre = extractQueryParams().get("id")

    if (pageNumber < 0 || pageNumber > totalPageCount) {
        return; // Ne rien faire si la page demandée est en dehors des limites
    }
    const filmData = await getFilmsByGenre(idGenre,pageNumber);
    filmDisplay(pageNumber, filmData);
}

document.title = `${extractQueryParams().get("name")} -- films`
document.getElementById("prev").addEventListener("click", () => handleGenreMoviesPage(currentPage - 1));
document.getElementById("next").addEventListener("click", () => handleGenreMoviesPage(currentPage + 1));

handleGenreMoviesPage(0);