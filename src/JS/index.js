const urlParams = new URLSearchParams(window.location.search)
let limit = parseInt(urlParams.get("limit")) || 6
let page = parseInt(urlParams.get("page")) || 0
let character = []
let characterCards = document.getElementById('characterCards')
let divBtnNav = document.getElementById('btn-nav')
let btnNext = document.getElementById('proxima')
let btnLast = document.getElementById('anterior')
var capituloIndex = []
var count = 0

//Pegar informações e colocar no footer
api.get('/character')
  .then(function (response) {
    const characterSpan = document.getElementById('character-span')
    const numberCharacter = response.data.info.count
    characterSpan.innerHTML = numberCharacter
  })
  .catch(function (error) {
    console.error(error);
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



//Pegar informações dos personagems e paginar
const getCharacter = async (character, page, limit) => {
  await api.get('/character')
    .then(function (response) {
      character = response.data.results
      let characterPaginado = character
      let offset = page * limit
      if (character.length >= offset) {
        characterPaginado = characterPaginado.slice(offset, (offset + limit))

        characterPaginado.forEach(async (personagem) => {
          const novaDiv = document.createElement("div")
          novaDiv.innerHTML = `
                                              <div id="cardPersonagem" class="row mb-3">
                                                    <div class="col-12 col-md-6 d-flex align-items-center justify-content-center custom-h13">
                                                        <section class="profile bg-color-custom-green custom-w80 d-flex rounded custom-h13">
                                                            <div class="image-profile">
                                                                <img class="custom-h13" src="${personagem.image}" alt="">
                                                            </div>
                                                            <div class="info-profile p-2">
                                                                <h6 class="color-w m-0">${personagem.name}</h6>
                                                                <!-- AQUI VAI A BOLINHA VERDE OU VERMELHA--> <p class="font-s color-w mb-2">${personagem.status} - ${personagem.species}</p>

                                                                <p class="font-s mb-0 color-gray">Última localização conhecida</p>
                                                                <p class="color-w font-s mb-2">${personagem.location.name}</p>

                                                                <p class="font-s m-0 color-gray">Visto a última vez em:</p>
                                                                <p class="color-w font-s" id="episode-name"></p>
                                                            </div>
                                                        </section>
                                                    </div>
                                                </div>
        ` 
          characterCards.appendChild(novaDiv)
          
        });
      }
    })
    .catch(function (error) {
      console.error(error);
    })
}

//Botões de navegação das paginas
btnNext.addEventListener('click', function (event) {
  page++
  characterCards.innerHTML = ""
  getCharacter(character, page, limit)

  if (page > 0) {
    btnLast.disabled = false
  }
})

btnLast.addEventListener('click', function (event) {
  page--
  characterCards.innerHTML = ""
  getCharacter(character, page, limit)

  if (page <= 0) {
    btnLast.disabled = true
  }
})


//chamada de funções
getCharacter(character, page, limit)
