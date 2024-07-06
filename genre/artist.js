const urlAppGenre = 'http://localhost:8080/genres';
const API_KEY = '8c876ad71559ac44edf7af86b9d77927';
let actors = []


function extractQueryParams(){
    return new URLSearchParams(window.location.search); 
}

const pageSize = 12;
let totalPageCount = 20  ; // Nombre total de pages
let currentPage = 0;
/**
 * Fonction asynchrone pour récupérer une liste de films depuis une API avec pagination.
 * @param {number} pageNumber - Le numéro de la page à récupérer.
 * @returns {Promise} - Une promesse résolue avec les données des films ou rejetée en cas d'erreur.
 */
async function getActorsByGenre(idGenre) {
    try {
        const response = await fetch(`${urlAppGenre}/${idGenre}/actors`);
        const data = await response.json();
        console.log(data);
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
                if (data[i][0] && data[i][0].profile_path) {
                    return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].profile_path}`;
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

async function actorDisplay(pageNumber, actorData) {
    indexStart = pageNumber*pageSize
    indexEnd = indexStart + pageSize 
    let actorsToDisplay=[]
    try {
        totalPageCount = Math.ceil(actorData.length/pageSize)
        for (let i = indexStart; i< indexEnd && i<actorData.length; i++) {            
            let actor = actorData[i]
            const picture = await getPictures(actor.referenceNumber)
                .then((picture) => picture)
                .catch((e) => "../images/no-poster-available.jpg");
                actor.picture = picture;
                console.log(picture);
                actorsToDisplay.push(actor)
        }
        document.querySelector(".films").innerHTML = actorsToDisplay.map((actor) => `
            <article class="col">
                <div class="card shadow p-3 mb-3 bg-body-tertiary rounded">
                    <img class="card-img-top" src=${actor.picture} alt="image de l'acteur / actrice ${actor.fullName}" />
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${actor.fullName}</h5>
                        <h6 class="card-text text-truncate font-weight-bold">Films : ${actor.nbFilms} films</h6>
                </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-outline-dark detail-film" id="${actor.id}">Voir</button>
                    </div>
                </div>
            </article>
        `).join("");

        document.querySelector("#pagination-counter").innerHTML=`
        <li class="page-item enabled"><a class="page-link">${pageNumber+1} / ${totalPageCount}</a></li>
        `
        document.querySelector("#films-size").innerHTML=`
        <p class="font-weight-bold">Résultat : ${actorData.length} films</p>
        `
        let boutons = document.querySelectorAll(".detail-film");
        // Attache un écouteur d'événements à chaque bouton
        boutons.forEach((bouton) => {
            bouton.addEventListener("click", () => {
                // Redirection vers la page 'cart-film.html' avec l'ID du bouton en tant que paramètre dans la chaîne de requête
                window.location = `../actor.html?${bouton.id}`
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

async function handleGenreActorPage(pageNumber) {
    idGenre = extractQueryParams().get("id")
    console.log(actors.length);
    if(actors.length === 0){
        actors = await getActorsByGenre(idGenre);
    }
    actorDisplay(pageNumber,actors);
}
document.title = `${extractQueryParams().get("name")} -- acteurs`
document.getElementById("prev").addEventListener("click", () => handleGenreActorPage(currentPage - 1));
document.getElementById("next").addEventListener("click", () => handleGenreActorPage(currentPage + 1));
handleGenreActorPage(0);