const searchInput = document.getElementById('search-input')
const insertCard = document.getElementById('insert-card')
const btnLast = document.getElementById('btn-last')
const btnNext = document.getElementById('btn-next')
var listCharacters20 = []
var page = 1
var countCard = 0

api.get('/location')
    .then(function (response) {
        const locationSpan = document.getElementById('location-span')
        const numberLocation = response.data.info.count
        locationSpan.innerHTML = numberLocation
    })
    .catch(function (error) {
        console.error(error)
    })

api.get('/episode')
    .then(function (response) {
        const episodeSpan = document.getElementById('episode-span')
        const numberEpisode = response.data.info.count
        episodeSpan.innerHTML = numberEpisode
    })
    .catch(function (error) {
        console.error(error)
    })

const getCharacters = async (page) => {
    await api.get(`/character/?page=${page}`)
        .then(function (res) {
            const characterSpan = document.getElementById('character-span')
            characterSpan.innerHTML = `${res.data.info.count}`
            listCharacters20 = res.data.results.slice()
            console.log(listCharacters20)
        })
        .catch(function (error) {
            console.error(error)
        })
}

function paginateList(page) {
    let listCharacters6 = listCharacters20.slice()
    let offset = (page * 6) - 6
    if (listCharacters20.length >= offset) {
        listCharacters6 = listCharacters6.slice(offset, (offset + 6))
        return listCharacters6
    }
}

function characterStatus(status) {
    switch (status) {
        case "Alive":
            return "🟢"
        case "Dead":
            return "🔴"
        default:
            return "⚪"
    }
}

function impressCharactersCard(characters) {
    characters.forEach(character => {
        if (countCard <= 3) {
            insertCard.innerHTML += `
                <div data-id="${countCard}" data-bs-toggle="modal" data-bs-target="#exampleModal" class="col-4 d-flex card-custom rounded mb-5">
                        <img src="${character.image}" class="img-card-custom" style="width: 15rem;" alt="...">
                        <div class="p-2 d-flex flex-column justify-content-between">
                            <div class="body-one">
                                <h5 class="card-title">${character.name}</h5>
                                <p>${characterStatus(character.status)} ${character.status} - ${character.species}</p>
                            </div>
                            <div class="body-two">
                                <span>Última localização conhecida</span>
                                <p>${character.location.name}</p>
                            </div>
                            <div class="body-three">
                                <span>Visto última vez em</span>
                                <p>Episódio ${character.episode.length}</p>
                            </div>
                        </div>
                    </div>
            `
        } else {
            insertCard.innerHTML += `
                <div class="row">
                <div data-id="${countCard}" data-bs-toggle="modal" data-bs-target="#exampleModal" id="two-last-card" class="col-4 d-flex card-custom rounded mb-5">
                        <img src="${character.image}" class="img-card-custom" style="width: 15rem;" alt="...">
                        <div class="p-2 d-flex flex-column justify-content-between">
                            <div class="body-one">
                                <h5 class="card-title">${character.name}</h5>
                                <p>${characterStatus(character.status)} ${character.status} - ${character.species}</p>
                            </div>
                            <div class="body-two">
                                <span>Última localização conhecida</span>
                                <p>${character.location.name}</p>
                            </div>
                            <div class="body-three">
                                <span>Visto última vez em</span>
                                <p>Episódio ${character.episode.length}</p>
                            </div>
                        </div>
                    </div>
                    </div>
            `
        }
        countCard++
    });
    const cardClick = document.querySelectorAll('.card-custom')
    cardClick.forEach(card => {
        card.addEventListener('click', function () {
            const cardClickID = this.dataset.id
            console.log(`Card clicado: ${cardClickID}`)
            var modalHead = document.getElementById('exampleModalLabel')
            var modalBody = document.getElementById('modal-body')
            modalBody.innerHTML = ''
            modalHead.innerHTML = ''
            modalHead.innerHTML = `<h1>${characters[cardClickID].name}</h1>`
            modalBody.innerHTML = `
                                <img src="${characters[cardClickID].image}" alt="">
                                <h1 class="mt-3">${characters[cardClickID].name}</h1>
                                <p class="mt-5 fs-5">${characterStatus(characters[cardClickID].status)} <span class="color-w">${characters[cardClickID].species}</span></p>
                                <p class="fs-5">Última localização conhecida</p>
                                <span class="fs-5 color-w">${characters[cardClickID].location.name}</span>
                                <p class="fs-5 mt-3">Último Episódio: <span class="color-w">${characters[cardClickID].episode.length}</span></p>
                            `;
        })
    })
}

const getCharacterSearch = async (input) => {
    await api.get(`/character/?name=${input}`)
        .then(function (response) {
            character = response.data.results
            character = character.slice(0, 6)
            countCard = 0
            insertCard.innerHTML = ""
            impressCharactersCard(character)
        })
        .catch(error => {
            insertCard.innerHTML = ""
            insertCard.innerHTML = `<div class="d-flex justify-content-center align-items-center">
      <p class="fs-4 text-white" font-size: 24px;">Personagem não encontrado</p>
    </div>`
        })
}

searchInput.addEventListener('input', function (event) {
    getCharacterSearch(searchInput.value.toLowerCase())
})

btnNext.addEventListener('click', function (event) {
    page++
    countCard = 0
    insertCard.innerHTML = ""
    getCharacters(page)
        .then(() => {
            impressCharactersCard(paginateList(page))
        })
        .catch(error => {
            console.error(error)
        })
    if (page > 0) {
        btnLast.disabled = false
    }
})

btnLast.addEventListener('click', function (event) {
    page--
    countCard = 0
    insertCard.innerHTML = ""
    getCharacters(page)
        .then(() => {
            impressCharactersCard(paginateList(page))
        })
        .catch(error => {
            console.error(error)
        })
    if (page <= 1) {
        btnLast.disabled = true
    }
})


getCharacters(page)
    .then(() => {
        impressCharactersCard(paginateList(page))
    })
    .catch(error => {
        console.error(error)
    })