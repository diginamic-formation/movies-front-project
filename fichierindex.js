
const urlAppGenre = 'http://localhost:8080/genres'
const urlAppGenreId = 'http://localhost:8080/genres/'
const urlAppGenreInsert = 'http://localhost:8080/genres/insertGenre'

let vNom1 ="";
let filmData = [];


async function getGenreById(id){
    let datas = await fetch(`${urlAppGenreId}{id}`)
    .then((response) => {return response.json()})
    .catch(error => console.log(error))
return datas
}

async function getGenres() {
    let datas = await fetch(`${urlAppGenre}`)
        .then((response) => {return response.json()})
        .then(data =>{
             genres = data
            
          
        })
        .catch(error => console.log(error))
    
    return datas

}

/*async function choice(){
    
    const vChoix = document.querySelector("#choix").value;
    vNom = document.querySelector("#name").value;
    //alert(vChoix)

    console.log(vChoix)
    if (vChoix == "film"){
        await filmDisp(vNom)
    }else if(vChoix == "person"){
       // await personDisplay(vNom)
    }

}*/
function saisie(){
    
    champs.style.visibility = "visible"
}

function validGenre(){
    
   
    //alert("insert")
    let newGenre = document.querySelector("#newGenre").value
    newGenre = JSON.stringify({nameGenre: newGenre})

    console.log(typeof(newGenre));
        console.log(newGenre);
    if (newGenre){
       
       const result =  fetch("http://localhost:8080/genres/insertGenre",
                                {
                                    method: "PUT",
                                    body:{ 
                                             newGenre
                                    }
                                }
                               
                            )
                            .then( res => console.log(res));                       
     
    }
    else{
        alert("Saisie vide")
    }

}
function delGenre(){
   
   
}
function modifGenre(){
    
   
    
}

 const genreDisp = async () => {
    
        const genreData = await getGenres();
        let element =  document.querySelector("#genre")
        
        genres.forEach(genre => {
        
        
        // console.log(genre)
            
            element.innerHTML +=  (`
            <div >
        
                <article class="col">
                    <div class="card shadow p-3 mb-5 bg-body-tertiary rounded bg-primary-subtle" style="width: 22rem;">
                        <div class="card-body ">
                            <h5 class="card-title text-truncate">${genre.nameGenre}</h5>
                            
                        </div>
                        <div class="card-footer">
                            <input id="essai" name = "essai" value=${genre.id}></input>
                            <button class="btn btn-outline-dark " >Les films</button>
                            <button type ="submit" class="btn btn-outline-primary "  onclick = "modifGenre() ">Modifier </button>
                            <button type ="submit" class="btn btn-outline-danger "  onclick = "delGenre()">Supprimer </button>
                        </div>
                    </div>
                </article>
            </div>
            `)
            }); 
   
    
     
} 


