console.log("life is beautiful")
let url="https://galacticau.fun/postLuna.php/?nplayer=fud"


fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },    
    body: new URLSearchParams({
        'nplayer': 'koola',
        'password': 'Password!',
        'grant_type': 'password'
    })
});

