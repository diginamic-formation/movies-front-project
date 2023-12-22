const urlAppFilms = 'http://localhost:8080/films/all';


async function getFilms(pageNumber, pageSize) {
    let datas = await fetch(`${urlAppFilms}?page=${pageNumber}&size=${pageSize}`)
        .then((response) => {return response.json()})
        .catch(error => console.log(error))
    
    return datas

}

async function getPictures(imdbId) {
    const imdbUrl = `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`;
    let datas = await fetch(imdbUrl, {
        method: 'GET',
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':'GET,POST,PATCH,OPTIONS',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4Yzg3NmFkNzE1NTlhYzQ0ZWRmN2FmODZiOWQ3NzkyNyIsInN1YiI6IjY1ODJkOWE3MDgzNTQ3NDQ2ZjNlODM2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OXEejaV2yeDOEPnDrrpgz3seL0zwQdNYQti6UZt53hA',
            'X-Auth-Token': '8c876ad71559ac44edf7af86b9d77927',
            'accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => console.log(data.person_results[0].known_for))
        .catch(error => console.log(error))
    
    return datas
}

let filmData = [];
const filmDisplay = async () => {
    filmData = await getFilms(1, 2);
    filmData.content.forEach(async (film) => {
         let picture = await getPictures(film.referenceNumber);
        console.log(getPictures);
    });
    console.log(filmData);

}
filmDisplay();

