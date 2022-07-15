console.log("life is beautiful")
let url="https://galacticau.fun/postLuna.php"


async function getUsers() {
fetch(url, {
      credentials: 'include',
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded', },
      body: "nplayer=fud",

      }).then(result => console.log('success====:', result))
        .catch(error => console.log('error============:', error));
}

getUsers()
