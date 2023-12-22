const urlAppFilms = 'http://localhost:8080/films/all';
const API_KEY = '8c876ad71559ac44edf7af86b9d77927'

async function getFilms(pageNumber, pageSize) {
    let datas = await fetch(`${urlAppFilms}?page=${pageNumber}&size=${pageSize}`)
        .then((response) => {return response.json()})
        .catch(error => console.log(error))
    
    return datas

}


async function getPictures(imdbId) {
    const imdbUrl = `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY}`;
    let datas = await fetch(imdbUrl)
        .then(response => response.json())
        .then(data => {
            if(data.movie_results.length != 0){
                return data.movie_results[0].poster_path
            }else if(data.person_results.length != 0){
                return data.person_results[0].poster_path
            }else if(data.tv_results.length != 0){
                return data.tv_results[0].poster_path
            }else if(data.tv_episode_results.length != 0){
                return data.tv_episode_results[0].poster_path
            }else if(data.tv_season_results.length != 0){
                return data.tv_season_results[0].poster_path
            }else {
                return ''
            }


        })
        .catch(error => console.log(error))

    return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${datas}`
}

let filmData = [];
const filmDisplay = async () => {
    filmData = await getFilms(1, 2);
    filmData.content.forEach(async (film) => {
         let picture = await getPictures(film.referenceNumber);
        // console.log(picture);
        filmData.push(picture);
        console.log(filmData);
    });

    document.querySelector(".films").innerHTML = filmData.content.map( (film) =>`
    <article class="col">
    <div class="card">
    <img class="card-img-top" src=images/Alad2-2018-cinepassion34-1.jpg />
    <div class="card-body">
    <h5 class="card-title">${film.title}</h5>
    <p class="card-text">${film.genres[0]}</p>
    </div>
    </div>
    </article>
    `)
    console.log(filmData);

}
filmDisplay();

