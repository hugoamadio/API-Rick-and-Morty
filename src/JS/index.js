const urlParams = new URLSearchParams(window.location.search)
let limit = parseInt(urlParams.get("limit")) || 6
let page = parseInt(urlParams.get("page")) || 1

var character = []

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

const pageCharacters = (page, limit) => {
  let characterPaginado = character.slice()
  let offset = 0 //(page - 1) * limit
  characterPaginado = characterPaginado.slice(offset, (offset + limit))
  return characterPaginado
}

const impressCharactes = (character) => {
  character.forEach(personagem => {
    const novaDiv = document.createElement("div")
    novaDiv.innerHTML =      
                              `
                              <div id="cardPersonagem" class="card-personagem row mb-3">
                                <div class="col-12 col-md-6 d-flex align-items-center justify-content-center custom-h13">
                                  <section class="profile bg-color-custom-green custom-w80 d-flex rounded custom-h13">
                                    <div class="image-profile">
                                      <img class="custom-h13" src="${personagem.image}" alt="">
                                    </div>
                                    <div class="info-profile p-2">
                                      <h6 class="color-w m-0">${personagem.name}</h6>
                                      <p class="font-s color-w mb-2">${personagem.status} - ${personagem.species}</p>
                                      <p class="font-s mb-0 color-gray">Última localização conhecida</p>
                                      <p class="color-w font-s mb-2">${personagem.location.name}</p>
                                      <p class="font-s m-0 color-gray">Visto a última vez em:</p>
                                      <p class="color-w font-s" id="episode-name">Episódio ${personagem.episode.length}</p>
                                    </div>
                                  </section>
                                </div>
                              </div>
                            `
    characterCards.appendChild(novaDiv)
  })
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
