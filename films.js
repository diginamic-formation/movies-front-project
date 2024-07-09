
const urlAppFilms = 'http://localhost:8080/films';
const API_KEY = '8c876ad71559ac44edf7af86b9d77927';

let GLOBAL_SEARCH = true;

const pageSize = 12;
let totalPageCount = 332; // Nombre total de pages
let currentPage = 0;
let selectedFilmId = null;



function searchFilmByTitle(){
    console.log("je suis la")
    if (selectedFilmId) {
      window.location.href = `/film.html?${selectedFilmId}`;  // Redirection vers la page de l'acteur
  } else {
      alert("Veuillez sélectionner un film dans la liste des suggestions.");
  }
  }
  
  
  function autocompleteFilm() {
    var input = document.getElementById('actor-name').value;
    if (input.length > 2) {  // Suggérer à partir de 3 caractères saisis
        fetch(`http://localhost:8080/films/auto-complete/${input}`)
        .then(response => response.json())
        .then(data => {
            let autocompleteList = document.getElementById('autocomplete-list');
            autocompleteList.innerHTML = '';  // Effacer les suggestions précédentes
            console.log(data)
            if (data.content) {
                data.content.slice(0,5).forEach(film => {
                    let listItem = document.createElement('a');
                    listItem.classList.add('list-group-item', 'list-group-item-action');
                    listItem.innerText = film.title;
                    listItem.href = '#';  // Modifier pour rediriger vers une page de détails
                    listItem.addEventListener('click', function() {
                        document.getElementById('actor-name').value = film.title;  // Sélection de l'acteur
                        selectedFilmId = film.id
                        autocompleteList.innerHTML = '';  // Effacer les suggestions après la sélection
                    });
                    autocompleteList.appendChild(listItem);
                });
            }
        });
    } else {
        document.getElementById('autocomplete-list').innerHTML = '';
    }
  }
  


/**
 * Fonction asynchrone pour récupérer une liste de films depuis une API avec pagination.
 * @param {number} pageNumber - Le numéro de la page à récupérer.
 * @returns {Promise} - Une promesse résolue avec les données des films ou rejetée en cas d'erreur.
 */
async function getFilms(pageNumber) {
    try {
        const response = await fetch(`${urlAppFilms}?page=${pageNumber}&size=${pageSize}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching films:', error);
        throw error;
    }
}

async function getFilmsByPeriod(pageNumber, startYear, endYear) {
    const url = `http://localhost:8080/films/period/year?start=${startYear}&end=${endYear}&page=${pageNumber}&size=${pageSize}`;
    try {
        const response = await fetch(`${url}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching filmsByPeriod:', error);
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
                .catch((e) => "images/no-poster-available.jpg");
            film.picture = picture;
        }
        document.querySelector(".films").innerHTML = filmData.content.map((film) => `
            <article class="col">
                <div class="card shadow p-3 mb-3 bg-body-tertiary rounded">
                    <img class="card-img-top" src=${film.picture} alt="image du film ${film.title}" />
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${film.title}</h5>
                        <p class="card-text text-truncate">${film.genres.join(", ")}</p>
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
                window.location = `film.html?${bouton.id}`
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

const footer = document.getElementById("footer");
function showFooter(){
    footer.style.display = "block";
}
// Ajouter un écouteur d'événements lorsque la page est complètement chargée
window.addEventListener("load", function () {
    // Définir un délai de 2 secondes
    const delaiEnSecondes = 2;
    // Afficher navPagination après le délai spécifié
    setTimeout(showNavPagination, delaiEnSecondes * 1000); // Convertir les secondes en millisecondes
    this.setTimeout(showFooter,delaiEnSecondes* 1000 );
});


async function getPeriodicDatas(pageNumber) {

    start = parseInt(localStorage.getItem('start'))
    end = parseInt(localStorage.getItem('end'))
    const filmPData = await getFilmsByPeriod(pageNumber, start, end);
    filmDisplay(pageNumber, filmPData);
}

async function getGlobalData(pageNumber) {
    if (pageNumber < 0 || pageNumber > totalPageCount) {
        return; // Ne rien faire si la page demandée est en dehors des limites
    }
    const filmData = await getFilms(pageNumber);
    filmDisplay(pageNumber, filmData);
}

// Récupération de l'élément DOM pour le formulaire de mise à jour et le conteneur de message
let updateFilmForm = document.getElementById("searchForm");
updateFilmForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    GLOBAL_SEARCH = false;
    // Récupération des valeurs des champs du formulaire
    const start = document.getElementById("startYear").value;
    const end = document.getElementById("endYear").value;
    localStorage.setItem('start', start);
    localStorage.setItem('end', end);
    getPeriodicDatas(0);
});

console.log("cureent page : ", currentPage);
getGlobalData(currentPage);

document.getElementById("prev").addEventListener("click", () =>{
    GLOBAL_SEARCH ? getGlobalData(currentPage - 1) : getPeriodicDatas(currentPage - 1)
    document.getElementById('pageHeader').scrollIntoView({
        behavior: 'smooth'
    });
});
document.getElementById("next").addEventListener("click", () =>{ 
    GLOBAL_SEARCH ? getGlobalData(currentPage + 1) : getPeriodicDatas(currentPage + 1)
    document.getElementById('pageHeader').scrollIntoView({
        behavior: 'smooth'
    });
});


document.querySelector("#button-filter").addEventListener("click", () => {
    document.querySelector("#searchForm").hidden = false
    document.querySelector("#button-filter").hidden = true
});

document.querySelector("#button-annuler").addEventListener("click", () => {
    document.querySelector("#searchForm").hidden = true
    document.querySelector("#button-filter").hidden = false
    GLOBAL_SEARCH=true
    getGlobalData(0);
});