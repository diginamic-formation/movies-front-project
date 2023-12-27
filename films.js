
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

function getPictures(imdbId) {
    return fetch(`https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            for (i in data) {
                if (data[i][0]) {
                    return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].poster_path}`
                }
            }
            throw new Error("Poster Not Found")
        })
}


function getPictureFromOmDbApi(imdbId) {
    
    return fetch(`https://www.omdbapi.com/?i=${imdbId}&plot=full&apikey=218f3e08`)
        .then(response => response.json())
        .then(data => {
            if(data?.Poster && data.Poster !== "N/A"){
                return data.Poster
            }else{
                throw new Error("Picture Not Found")
            }
            
        })

}


async function filmDisplay(pageNumber) {
    try {
        if (pageNumber < 0 || pageNumber > totalPageCount) {
            return; // Ne rien faire si la page demandée est en dehors des limites
        }

        const filmData = await getFilms(pageNumber);
        for (film of filmData.content) {
            const picture = await Promise.any([getPictureFromOmDbApi(film.referenceNumber),getPictures(film.referenceNumber)]).
            then(picture => picture)
            .catch(e => 'images/no-poster-available.jpg')
            film.picture = picture    
        }
    
console.log(filmData);
        document.querySelector(".films").innerHTML = filmData.content.map((film) => `
            <article class="col">
                <div class="card">
                    <img class="card-img-top" src=${film.picture} alt="image du film ${film.title}" />
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${film.title}</h5>
                        <p class="card-text text-truncate">${film.genres}</p>
                    </div>
                    <div class="card-footer">
                        <a href="cart-film.html" class="btn btn-outline-dark detail-film" id=${film.id}>Voir</a>
                    </div>
                </div>
            </article>
        `).join("");

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

