

/**
 * rechercher films par nom sur navbar
 * non utilisé
 * 
 */

async function choice(){
    
    const vChoix = document.querySelector("#choix").value;
    vNom = document.querySelector("#name").value;
    //alert(vChoix)

    console.log(vChoix)
    if (vChoix == "film"){
        await filmDisp(vNom)
    }else if(vChoix == "person"){
       // await personDisplay(vNom)
    }

}

/**
 * rendre visible les champs de saisie ajout nouveau genre
 */

function saisie(){
    
    champs.style.visibility = "visible"
}

/**modifGenre
 * permet de saisir la modification du genre
 * @param {*} id id du genre
 * @param {*} nameGenre le genre
 */

function modifGenre(id, nameGenre){
console.log(id);
console.log(nameGenre);

   let modif = document.querySelector("#modifmodal") 
   modifmodal.innerHTML = (`
        
        <input type="hidden" id="idGenre" value ="${id}"></input>
        <input type="text" id = "newValGenre" value =${nameGenre}></input>
   `)
   
    
   }
/**genreDisp
 * permet d'afficher les genres de films dans genre.html
 * 
 */
const genreDisp = async () => {
    
    const genreData = await getGenres();
    let element =  document.querySelector("#genre") 
    
    
    genres.forEach(genre => {
    
   
    
    // bouton les films modifiés<button class="btn btn-outline-dark " onclick = "getFilmsByidGenre(${genre.id})" >Les films</button>
        element.innerHTML +=  (`
        <div >
    
            <article class="col">
                <div class="card shadow p-3 mb-5 bg-body-tertiary rounded bg-primary-subtle" style="width: 22rem;">
                    <div class="card-body ">
                    <img class="card-img" src="/images/${genre.id}.jpeg" alt="Card image" width="250" height="200">
                        <h5 class="card-title text-truncate" name="titre">${genre.nameGenre}</h5>
                        <input type="hidden" id="${genre.nameGenre}" name = "${genre.nameGenre}" value ="${genre.nameGenre}"></input>
                    </div>
                    <div class="card-footer">
                       
                        <button class="btn btn-outline-dark " onclick = "filmByGenreDisp(${genre.id}, '${genre.nameGenre}')" >Les films</button>
                        <button "button" class="btn btn-primary" data-toggle="modal" data-target="#Modal" onclick = "modifGenre(${genre.id}, '${genre.nameGenre}') ">Modifier </button>
                        <button type ="submit" class="btn btn-outline-danger "  onclick = "deleteGenre(${genre.id})">Supprimer </button>
                    </div>
                </div>
            </article>
        </div>
        `)

        }); 


 
} 

async function filmByGenreDisp(idGenr, nameGenr) {
    
    const filmData = await getFilmsByidGenre(idGenr);
    let element =  document.querySelector("#afficheFilmGenre") 
    let genre =  document.querySelector("#afficheGenre") 
    genre.hidden=true
    console.log(films);
  
    for (const film of films) {
        const picture = await getPictures(film.referenceNumber);
        film.picture = picture;
   /* }
    films.forEach(film => {*/
    
    
    // console.log(genre)
   
        
        element.innerHTML +=  (`
        <div >
           
            <article class="col">
                <div class="card shadow p-3 mb-5 bg-body-tertiary rounded bg-primary-subtle" style="width: 22rem;">
                    <div class="card-body ">
                        <h5 class="card-title text-truncate" name="titre">${film.title}</h5>
                        <h5> Genre : ${nameGenr}</h5>
                        <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
                             <img class="card-img-top" src=${film.picture} alt="image du film ${film.title}" />
                        </div>
                        <span>Année : ${film.year}</span>
                    </div>
                    <div class="card-footer">
                      
                    </div>
                </div>
            </article>
        </div>
        `)

        }; 

        
 
} 



