// Extraction de la chaîne de requête de l'URL, puis suppression du caractère "?" pour obtenir l'ID du film
const cartFilm = window.location.search.split("?").join("");
const urlAppFilms = 'http://localhost:8080/films/all';
const API_KEY = '8c876ad71559ac44edf7af86b9d77927';

async function getFilmById(cartFilm){
    let datas = await fetch(`${urlAppFilms}/${cartFilm}`)
    .then((response) => {return response.json()})
    .catch(error => console.log(error))
    return datas
   
}

async function getRoleByFilm(){
    let datas = await fetch(`${urlAppFilms}/${cartFilm}/roles`)
    .then((response) => {return response.json()})
    .catch(error => console.log(error))
    return datas
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

let cartFilmData = {};
const cartFilmDisplay = async () => {
    try {
        cartFilmData = await getFilmById(cartFilm);
        if (cartFilmData && typeof cartFilmData === 'object') {
            const picture = await getPictures(cartFilmData.referenceNumber);
            cartFilmData.picture = picture;
            const roles = await getRoleByFilm();
            cartFilmData.role = roles;
            console.log(cartFilmData);

            document.getElementById("affich-film").innerHTML = `
                <h2 class="text-start">Les données d'un film</h2>
                <article class="col-12 col-md-4" id=${cartFilmData.id}>
                    <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
                        <img class="card-img-top" src=${cartFilmData.picture} alt="image du film ${cartFilmData.title}" />
                        <div class="card-body">
                            <h5 class="card-title text-truncate">${cartFilmData.title}</h5>
                            <p class="card-text text-truncate">${cartFilmData.genres.join(", ")}</p>
                        </div>
                    </div>
                </article>
                <div class="col-12 col-md-8">
                    <h5>Sommaire</h5>
                    <p class="summary">${cartFilmData.summary}</p>
                    <h5>Réalisateur(s)</h5>
                    <p>${cartFilmData.realisators.join(", ")}</p>
                    <h5>Langue</h5>
                    <p>${cartFilmData.language}</p>
                    <h5>Année de sortie</h5>
                    <p>${cartFilmData.yearEnd}</p>
                </div>
                <div>
                    <h5 class="text-center">Acteurs et rôles</h5>
                    <ol class="list-group list-group-numbered">
                    ${roles.map(role => `<li class="list-group-item">actor: '${role.actor}', role: '${role.role}'</li>`).join('')}
                    </ol>
                </div>
            `;
        } else {
            console.error('Invalid data format received from getFilmById.');
        }
    } catch (error) {
        console.error('Error displaying films:', error);
    }
};

cartFilmDisplay();
