
const urlAppPerson ="http://localhost:8080/persons/"
const urlAppFilms = 'http://localhost:8080/films/all'
const urlAppFilm = 'http://localhost:8080/films/'
const urlApiFilm = 'http://localhost:8080/films/title/'
const imdbUrl = 'https://api.themoviedb.org/3/find/?external_source=imdb_id'
let vNom1 ="";
let filmData = [];
async function getPersonByid(id) {
    let datas = await fetch(urlApp + id)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))

}

async function getFilmById(id){
    let datas = await fetch(`${urlAppFilm}{id}`)
    .then((response) => {return response.json()})
    .catch(error => console.log(error))
return datas
}

async function getFilms(pageNumber, pageSize) {
    let datas = await fetch(`${urlAppFilms}?page=${pageNumber}&size=${pageSize}`)
        .then((response) => {return response.json()})
        .catch(error => console.log(error))
    
    return datas

}
async function getFilmByTitle(vNom){
    vNom1 = vNom
    console.log(vNom)
    const complet = `${urlApiFilm}${vNom}` //urlApiFilm + vNom
    //alert("complet "+complet)
    let datas = await fetch(complet)
    .then((response) => {return response.json()})
    .catch(error => console.log(error))
    
    return datas

   
}
async function getPictures(imdbId) {
    let datas = await fetch(imdbUrl, {
        method: 'GET',
        withCredentials: true,
        headers: {
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
async function choice(){
    const vChoix = document.querySelector("#choix").value;
    vNom = document.querySelector("#name").value;
    //alert(vChoix)

    console.log(vChoix)
    if (vChoix == "film"){
     await filmDisplay(vNom)

   
 }
}


const filmDisplay = async () => {
    
    filmData = await getFilmByTitle(vNom);
    console.log(filmData);
   

}
//filmDisplay();

