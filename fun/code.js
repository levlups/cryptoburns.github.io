console.log("life is beautiful")
let url="https://galacticau.fun/postLuna.php/?nplayer=fud"


async function getUsers() {
fetch(url, {
      mode:'no-cors',
      credentials: 'include',
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded', },
      body: "nplayer=fud",

      }).then(result => console.log('success====:', result))
        .catch(error => console.log('error============:', error));
}

getUsers()
