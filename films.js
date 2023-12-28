
const urlAppFilms = 'http://localhost:8080/films/all';
const API_KEY = '8c876ad71559ac44edf7af86b9d77927';

const pageSize = 12;
let totalPageCount = 332; // Nombre total de pages
let currentPage = 0;

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

async function getPictures(imdbId) {
    const imdbUrl = `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY}`;
    let datas = await fetch(imdbUrl)
        .then(response => response.json())
        .then(data => {
            if (data.movie_results.length != 0) {
                return data.movie_results[0].poster_path
            } else if (data.person_results.length != 0) {
                return data.person_results[0].poster_path
            } else if (data.tv_results.length != 0) {
                return data.tv_results[0].poster_path
            } else if (data.tv_episode_results.length != 0) {
                return data.tv_episode_results[0].poster_path
            } else if (data.tv_season_results.length != 0) {
                return data.tv_season_results[0].poster_path
            } else {
                return ''
            }


        })
        .catch(error => console.log(error))

    return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${datas}`
}

async function filmDisplay(pageNumber) {
    try {
        if (pageNumber < 0 || pageNumber > totalPageCount) {
            return; // Ne rien faire si la page demandée est en dehors des limites
        }

        const filmData = await getFilms(pageNumber);
        for (const film of filmData.content) {
            const picture = await getPictures(film.referenceNumber);
            film.picture = picture;
        }
console.log(filmData);
        document.querySelector(".films").innerHTML = filmData.content.map((film) => `
            <article class="col">
                <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
                    <img class="card-img-top" src=${film.picture} alt="image du film ${film.title}" />
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${film.title}</h5>
                        <p class="card-text text-truncate">${film.genres.join(", ")}</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-outline-dark detail-film" id="${film.id}">Voir</button>
                    </div>
                </div>
            </article>
        `).join("");
        let boutons = document.querySelectorAll(".detail-film");
        console.log(boutons);
        // Attacher un écouteur d'événements à chaque bouton
        boutons.forEach((bouton) => {
            bouton.addEventListener("click", () =>{
                console.log(bouton);
                // Redirection vers la page 'cart-film.html' avec l'ID du bouton en tant que paramètre dans la chaîne de requête
                window.location = `cart-film.html?${bouton.id}`
            })
        })
        currentPage = pageNumber;
        return filmData;
    } catch (error) {
        console.error('Error displaying films:', error);
        throw error;
    }
}

document.getElementById("prev").addEventListener("click", () => filmDisplay(currentPage - 1));
document.getElementById("next").addEventListener("click", () => filmDisplay(currentPage + 1));

// Initial display
filmDisplay(currentPage);

