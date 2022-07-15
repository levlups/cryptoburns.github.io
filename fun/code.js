console.log("life is beautiful")
let url="https://galacticau.fun/postLuna.php/?nplayer=fud"


async function fetchMovies() {
  const response = await fetch(url{
                              mode: 'cors',
        credentials: 'include',
        method: 'POST'
                               });
  // waits until the request completes...
  console.log(response);
}

fetchMovies()

