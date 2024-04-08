api.get('/character')
  .then(function (response) {
    // manipula o sucesso da requisição
    console.log("Deu Certo")
    console.log(response);
  })
  .catch(function (error) {
    // manipula erros da requisição
    console.log("Deu Erro")
    console.error(error);
  })
  .finally(function () {
    // sempre será executado
  });