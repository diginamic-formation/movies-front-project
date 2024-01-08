
const urlAppGenre = 'http://localhost:8080/genres'
const urlAppGenreId = 'http://localhost:8080/genres/'
const urlAppGenreInsert = 'http://localhost:8080/genres/add'

/**getGenreById
 * non utilisé
 * @param {*} id 
 * @returns 
 */
async function getGenreById(id){
    let datas = await fetch(`${urlAppGenreId}{id}`)
    .then((response) => {return response.json()})
    .catch(error => console.log(error))
return datas
}

/**
 * getGenres
 * affichage des genres de films
 * 
 */

async function getGenres() {
    let datas = await fetch(`${urlAppGenre}`)
        .then((response) => {return response.json()})
        .then(data =>{
             genres = data
            
          
        })
        .catch(error => console.log(error))
    
    return datas

}
/**
 * getFilmsByidGenre 
 * affichage des films par genre (id)
 * @param idGenr id genre récupéré
 * @returns liste de films
 */
async function getFilmsByidGenre(idGenr) {
    console.log(`${idGenr}`);
    let datas = await fetch(`http://localhost:8080/genres/${idGenr}/films`)
        .then((response) => {return response.json()})
        .then(data =>{
             films = data.content
              //console.log(films);
          
        })
        .catch(error => console.log(error))
    
    return datas

}


/**
 * addGenre
 * permet d'ajouter des nouveaux genres
 * 
 */
function addGenre() {


    //alert("insert")
    let newGenre = document.querySelector("#newGenre").value
    if (newGenre) {

        const result = fetch("http://localhost:8080/genres/add",
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify({ nameGenre: newGenre })
            }
        )
            .then(res => document.location.href="http://127.0.0.1:5500/genre.html");
    }
    else {
        alert("Saisie vide")
    }
}

/**
 * updateGenre
 * mise à jour et modification dans la base d'un genre
 */

function updateGenre() {
    let updatedGenre = document.querySelector("#newValGenre").value
    let idGenre = document.querySelector("#idGenre").value
    let id = parseInt(idGenre)
    if (updatedGenre) {
       
        const result = fetch(`http://localhost:8080/genres/update/${id}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ nameGenre: updatedGenre })
            }
        )
            .then(res => document.location.href="http://127.0.0.1:5500/genre.html");
            
    }
    else {
        alert("Modification non effectuée")
    }


}

/**
 * deleteGenre
 * permet de supprimer un genre
 * seul un genre qui n'a pas de films associés pourra être supprimé
 * 
 * @param {*} idG id du genre à supprimer
 */
function deleteGenre(idG){
    console.log(idG)
   
   
   const result = fetch(`http://localhost:8080/genres/delete/${idG}`,
           {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "DELETE",
                //body: JSON.stringify({ nameGenre: updatedGenre })
            }
        )
            .then(res =>document.location.href="http://127.0.0.1:5500/genre.html");
   
}


