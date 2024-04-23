const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api/',
    timeout: 3000,
    headers: {'X-Custom-Header': 'foobar'}
  });