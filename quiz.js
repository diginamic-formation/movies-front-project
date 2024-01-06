let vChoix  = ""
let acteur1 = ""
let acteur2 = ""
let film    = ""
let film1   = ""
let film2   = ""
let actor   = ""
let texte   = ""
const API_KEY_Actor = "8c876ad71559ac44edf7af86b9d77927";
async function quizChoice(choix){
       //recherche d'acteurs  `http://localhost:8080/quiz/films/generate`
      //recherche dun film  `http://localhost:8080/quiz/actors/generate`
    vChoix = choix.value;
    console.log(vChoix);
    quizEnigme.setAttribute("hidden","true")
    quizSolution.setAttribute("hidden","true")

    if (vChoix == "film"){

        console.log("Recherche d'un film commun à deux acteurs ")
        quizEnigme.removeAttribute("hidden")
        let datas =   await fetch(`http://localhost:8080/quiz/actors/generate`)
        .then((response) => {return response.json()})
        .then(data =>{
                       
                        console.log(data);
                        affichageQuiz(data)
                    })
        .catch(error => console.log(error))
    
          return datas
  
    } 
    if (vChoix == "acteur"){
        console.log("Recherche d'un acteur commun à deux films ")
        quizEnigme.removeAttribute("hidden")
        let datas =   await fetch(`http://localhost:8080/quiz/films/generate`)
   
        .then((response) => {return response.json()})
        .then(data =>{
                       
                        console.log(data);
                        affichageQuiz(data)
                    })
        .catch(error => console.log(error))
    
          return datas
    }

  
   
}

async function affichageQuiz(data){
   
    console.log(vChoix);
    if(vChoix == "film" ){
        acteur1 = data.actor1
        acteur2 = data.actor2
        film    = data.films
        console.log(film);
        console.log(acteur2.referenceNumber);
        texteQuiz = `Dans quel film ont-ils joué ensemble ?`
        texteSolution = `Le film est :`

        const pictureFilm = await getPictMovie(film[0].referenceNumber);
        film[0].picture = pictureFilm
        const pictureActeur2 = await getPictActeur(acteur2.referenceNumber);
        acteur2.picture = pictureActeur2

        const pictureActeur1 = await getPictActeur(acteur1.referenceNumber);
        acteur1.picture = pictureActeur1

        let affQuiz= document.querySelector("#quizEnigme")
        affQuiz.innerHTML =""
        affQuiz.innerHTML += 
        (`
            <div >
                <article class="col">
                    <div class="card shadow p-3 mb-5 bg-body-tertiary rounded " style="width: 45rem;">
                    <h5 class="card-title text-truncate" name="titre">${texteQuiz}</h5>
                        <div class="card-body d-flex justify-content-between">
                            
                            <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
                               
                                <h5>${acteur1.fullName}</h5>
                                <img class="card-img-top" src=${acteur1.picture} alt="image ${acteur1.fullName}" />
    
                            </div>
                            <div class="card shadow p-3 mb-5 bg-body-tertiary rounded justify-content-center">
    
                                <h5>${acteur2.fullName}</h5>
                                <img class="card-img-top" src=${acteur2.picture} alt="image ${acteur2.fullName}" />
    
                            </div>
                           
                        </div>
                        <div class="card-footer">
                        
                        </div>
                    </div>
                </article>
            </div>
            
        `)
    
        let affSolution = document.querySelector("#quizSolution")
        affSolution.innerHTML =""
        affSolution.innerHTML += 
        (`
            <div style="width: 45rem; ">
                <article class="col" style="width: 45rem; max-height = 250px">
                    <div class="card shadow p-3 mb-5 bg-body-tertiary rounded h-75" >
                        <h5 class="card-title text-truncate" name="titre">${texteSolution}</h5>
                        <h5>${film[0].title}</h5>
                        
                        <div class="card-body d-flex justify-content-center justify-item-center" style="width: 45rem; height = 120px">
                            
                            <div class="card shadow p-3 mb-5 bg-body-tertiary rounded justify-content-center" >
                               
                               <img class="card-img-top" src=${film[0].picture} alt="image ${film[0].title}" />
    
                            </div>
                           
                        </div>
                        <div class="card-footer">
                        
                        </div>
                            
                    </div>
                </article>
            </div>
            
        `)
       
        
    }
    if(vChoix == "acteur" ){
       console.log("----     "); 
       console.log(film1);
       console.log("----     ");
       acteur=data.actors
       film1=data.film1;
       film2=data.film2;
       console.log(acteur);
        texteQuiz = `Qui est l'acteur ou l'actrice commun(e) aux films :`
        texteSolution ="L'acteur ou l'actrice est "
        const pictureActeur = await getPictActeur(acteur[0].referenceNumber);
        acteur[0].picture = pictureActeur
        const pictureFilm1 = await getPictMovie(film1.referenceNumber);
        film1.picture = pictureFilm1
        const pictureFilm2 = await getPictMovie(film2.referenceNumber);
        film2.picture = pictureFilm2
        let affQuiz= document.querySelector("#quizEnigme")
        affQuiz.innerHTML =""
        affQuiz.innerHTML += 
        (`
            <div >
                <article class="col">
                    <div class="card shadow p-3 mb-5 rounded " style="width: 45rem;">
                    <h5 class="card-title text-truncate" name="titre">${texteQuiz}</h5>
                        <div class="card-body d-flex justify-content-between">
                            <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
                               
                                <h5>${film1.title}</h5>
                                <img class="card-img-top" src=${film1.picture} alt="image ${film1.title}" />
    
                            </div>
                            <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
    
                                <h5>${film2.title}</h5>
                                <img class="card-img-top" src=${film2.picture} alt="image ${film2.title}" />
    
                            </div>
                           
                        </div>
                        <div class="card-footer">
                        
                        </div>
                    </div>
                </article>
            </div>
            
        `)
    
        let affSolution = document.querySelector("#quizSolution")
        affSolution.innerHTML =""
        affSolution.innerHTML += 
        (`
            <div >
                <article class="col">
                    <div class="card shadow p-3 mb-5 bg-body-tertiary rounded " style="width: 45rem;">
                    <h5 class="card-title text-truncate" name="titre">${texteSolution}</h5>
                        <div class="card-body d-flex justify-content-center justify-item-center">
                            
                            <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
                               
                                <h5>${acteur[0].fullName}</h5>
                                <img class="card-img-top" src=${acteur[0].picture} alt="image ${acteur[0].fullName}" />
    
                            </div>
                           
                           
                        </div>
                        <div class="card-footer">
                        
                        </div>
                    </div>
                </article>
            </div>
            
        `)
       
     
    }
    
   
}
function afficheSolution(){
    quizSolution.removeAttribute("hidden")
}
function getPictActeur(imdbId) {
    return fetch(
      `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY_Actor}`
    )
      .then((response) => response.json())
      .then((data) => {
        for (i in data) {
          if (data[i][0]) {
            return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].profile_path}`;
          }
        }
       return "images/no-poster-available.jpg"
      });
  }
 
  function getPictMovie(imdbId) {
    return fetch(
      `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY_Actor}`
    )
      .then((response) => response.json())
      .then((data) => {
        for (i in data) {
          if (data[i][0]) {
            return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].poster_path}`;
          }
        }
        return "images/no-poster-available.jpg";
       // throw new Error("Poster Not Found");
      });
  }