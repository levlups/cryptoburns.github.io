console.log("life is beautiful")
let url="https://galacticau.fun/postLuna.php/?nplayer=fud"


async function fetchMovies() {
  const response = await fetch(url,{
                              mode: 'no-cors',
        credentials: 'include',
        method: 'POST',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  }
                               });
  // waits until the request completes...
  console.log(response);
}

fetchMovies()

