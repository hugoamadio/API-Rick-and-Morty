const urlParams = new URLSearchParams(window.location.search)
let limit = parseInt(urlParams.get("limit")) || 6
let page = parseInt(urlParams.get("page")) || 1
var count = 0
var character = []
let searchInput = document.getElementById('search-input')
let characterCards = document.getElementById('characterCards')
let btnNext = document.getElementById('proxima')
let btnLast = document.getElementById('anterior')

var c1 = 1
var c2 = 2
var c3 = 3
var c4 = 4
var c5 = 5
var c6 = 6

api.get('/character')
  .then(function (response) {
    const characterSpan = document.getElementById('character-span')
    const numberCharacter = response.data.info.count
    characterSpan.innerHTML = numberCharacter
  })
  .catch(function (error) {
    console.error(error)
  })

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


const getCharacter = async (page) => {
  await api.get(`/character/${c1},${c2},${c3},${c4},${c5},${c6}`)
    .then(function (response) {
      character = response.data
    })
    .catch(error => {
      console.error(error)
    })
}

getCharacter(page)

const getCharacterAPI = async (page) => {
  await api.get(`/character/?page=${page}`)
    .then(function (response) {
      character = response.data.results.slice()
      return character
    })
    .catch(error => {
      console.error(error)
    })
}

const impressCharactes = (character) => {
  character.forEach(personagem => {
    const novaDiv = document.createElement("div")
    if (window.innerWidth > 1200) {
      novaDiv.innerHTML =
        `
                              <div data-id="${count}" data-bs-toggle="modal" data-bs-target="#exampleModal" id="cardPersonagem" class="card-personagem mb-3 offset-3 col-6">
                                <div class="d-flex align-items-center justify-content-center custom-h13">
                                  <section class="profile bg-color-custom-green custom-w80 d-flex rounded custom-h13">
                                    <div class="image-profile">
                                      <img class="custom-h13" src="${personagem.image}" alt="">
                                    </div>
                                    <div class="info-profile p-1">
                                      <h6 class="color-w m-0">${personagem.name}</h6>
                                      <p class="font-s color-w mb-0">${characterStatus(personagem.status)} ${personagem.species}</p>
                                      <p class="font-s mb-0 color-gray">Última localização conhecida</p>
                                      <p class="color-w font-s mb-0">${personagem.location.name}</p>
                                      <p class="font-s m-0 color-gray">Visto a última vez em:</p>
                                      <p class="color-w font-s" id="episode-name">Episódio ${personagem.episode.length}</p>
                                    </div>
                                  </section>
                                </div>
                              </div>
                              
                            `
      count++
    } else {
      novaDiv.innerHTML =
        `
                            <div data-id="${count}" data-bs-toggle="modal" data-bs-target="#exampleModal" id="cardPersonagem" class="card-personagem row mb-3">
                              <div class="col-12 col-md-6 d-flex align-items-center justify-content-center custom-h13">
                                <section class="profile bg-color-custom-green custom-w80 d-flex rounded custom-h13">
                                  <div class="image-profile">
                                    <img class="custom-h13" src="${personagem.image}" alt="">
                                  </div>
                                  <div class="info-profile p-2">
                                    <h6 class="color-w m-0">${personagem.name}</h6>
                                    <p class="font-s color-w mb-2">${characterStatus(personagem.status)} ${personagem.species}</p>
                                    <p class="font-s mb-0 color-gray">Última localização conhecida</p>
                                    <p class="color-w font-s mb-2">${personagem.location.name}</p>
                                    <p class="font-s m-0 color-gray">Visto a última vez em:</p>
                                    <p class="color-w font-s" id="episode-name">Episódio ${personagem.episode.length}</p>
                                  </div>
                                </section>
                              </div>
                            </div>
                          `
      count++
    }


    characterCards.appendChild(novaDiv)
  })
  addEventCard()
}

const getCharacterSearch = async (input) => {
  await api.get(`/character/?name=${input}`)
    .then(function (response) {
      character = response.data.results
      characterCards.innerHTML = ""
      impressCharactes(character)
    })
    .catch(error => {
      characterCards.innerHTML = ""
      characterCards.innerHTML = `<div class="d-flex justify-content-center align-items-center">
    <p class="text color-green" font-size: 24px;">Personagem não encontrado</p>
  </div>`
    })
}

searchInput.addEventListener('input', function (event) {
  getCharacterSearch(searchInput.value.toLowerCase())
})

function addEventCard() {
  const cardCharacter = document.querySelectorAll('.card-personagem')
  cardCharacter.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id')
      const modalBody = document.getElementById('modal-body')
      modalBody.innerHTML = `<img class="custom-w60 border border-black rounded" src="${character[id].image}" alt="${character[id].name}">`
      modalBody.innerHTML += `<h1 class="mt-3">${character[id].name}</h1>`
      modalBody.innerHTML += `<p class="mt-5 fs-5">${characterStatus(character[id].status)} <span class="color-w">${character[id].species}</span></p>`
      modalBody.innerHTML += `<p class="fs-5">Última localização conhecida</p>`
      modalBody.innerHTML += `<span class="fs-5 color-w">${character[id].location.name}</span>`
      modalBody.innerHTML += `<p class="fs-5 mt-3">Último Episódio: <span class="color-w">${character[id].episode.length}</span></p>`
      // ${character[id].name}
    })
  })
}

function characterStatus(specie) {
  switch (specie) {
    case "Alive":
      return "🟢"

    case "Dead":
      return "🔴"

    default:
      return "⚪"
  }
}

btnNext.addEventListener('click', function (event) {
  page++
  characterCards.innerHTML = ""
  c1 += 6
  c2 += 6
  c3 += 6
  c4 += 6
  c5 += 6
  c6 += 6
  count = 0

  getCharacter(page)
    .then(() => {
      impressCharactes(character)
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
  characterCards.innerHTML = ""
  c1 -= 6
  c2 -= 6
  c3 -= 6
  c4 -= 6
  c5 -= 6
  c6 -= 6
  getCharacter(page)
    .then(() => {
      impressCharactes(character)
    })
    .catch(error => {
      console.error(error)
    })

  if (page <= 1) {
    btnLast.disabled = true
  }
})

getCharacter(page)
  .then(() => {
    impressCharactes(character)
  })
  .catch(error => {
    console.error(error)
  })