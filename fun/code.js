console.log("life is beautiful")
let url="https://galacticau.fun/postLuna.php/?nplayer=fud"


async function fetchMovies() {
  const response = await fetch(url);
  // waits until the request completes...
  console.log(response);
}

