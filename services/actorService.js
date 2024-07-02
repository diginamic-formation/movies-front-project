// services/actorService.js
const API_KEY = "8c876ad71559ac44edf7af86b9d77927";

export function getActorPicture(imdbId) {
    return fetch(
        `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY}`
    )
        .then(response => response.json())
        .then(data => {
            for (let i in data) {
                if (data[i][0] && data[i][0].profile_path) {
                    return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data[i][0].profile_path}`;
                }
            }
            return "/images/no-poster-available.jpg";
        });
}
