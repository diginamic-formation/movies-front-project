document.addEventListener('DOMContentLoaded', () => {
    const moviesData = [
        {
            "id": 2,
            "title": "The Man in the Santa Claus Suit",
            "year": 1979,
            "referenceNumber": "tt0077898",
            "rating": 6.5
        },
        {
            "id": 3,
            "title": "Galactica",
            "year": 1979,
            "referenceNumber": "tt0076984",
            "rating": 7.2
        },
        {
            "id": 4,
            "title": "A Family Upside Down",
            "year": 1978,
            "referenceNumber": "tt0077536",
            "rating": 6.9
        },
        {
            "id": 5,
            "title": "Un taxi mauve",
            "year": 1977,
            "referenceNumber": "tt0076851",
            "rating": 6.5
        },
        {
            "id": 6,
            "title": "The Easter Bunny Is Comin' to Town",
            "year": 1977,
            "referenceNumber": "tt0075971",
            "rating": 7.0
        },
        {
            "id": 7,
            "title": "Les Dobermans reviennent",
            "year": 1976,
            "referenceNumber": "tt0074130",
            "rating": 5.1
        },
        {
            "id": 8,
            "title": "La tour infernale",
            "year": 1974,
            "referenceNumber": "tt0072308",
            "rating": 7.0
        },
        {
            "id": 9,
            "title": "Santa Claus Is Comin' to Town",
            "year": 1970,
            "referenceNumber": "tt0066327",
            "rating": 7.7
        },
        {
            "id": 10,
            "title": "La vieille garde reprend du service",
            "year": 1970,
            "referenceNumber": "tt0066194",
            "rating": 5.6
        },
        {
            "id": 11,
            "title": "Opération vol",
            "year": 1970,
            "referenceNumber": "tt0062572",
            "rating": 7.5
        }
    ];

    const moviesContainer = document.getElementById('movies-container');

    moviesData.forEach(movie => {
        const cardHTML = `
            <div class="col-md-4 mb-4 d-flex align-items-stretch">
            <div class="form-check align-self-center ms-3">
                    <input type="radio" name="movieSelect" id="radio-${movie.id}" class="form-check-input">
                    <label for="radio-${movie.id}" class="form-check-label"></label>
                </div>    
            
            <div class="card card-unselected flex-grow-1" id="card-${movie.id}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-year">${movie.year}</p>
                        <p class="card-rating">Rating: ${movie.rating}</p>
                    </div>
                </div>
                
            </div>
        `;
        moviesContainer.innerHTML += cardHTML;
    });

    const radioButtons = document.querySelectorAll('input[type="radio"][name="movieSelect"]');
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', (e) => {
            const selectedId = e.target.id.replace('radio-', '');
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                if (card.id === `card-${selectedId}`) {
                    card.classList.replace('card-unselected', 'card-selected');
                } else {
                    card.classList.replace('card-selected', 'card-unselected');
                }
            });
        });
    });
});
