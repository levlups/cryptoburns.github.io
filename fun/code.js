console.log("life is beautiful")
let url="https://galacticau.fun/postLuna.php"


async function getUsers() {
  let res = await fetch(url,{
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache'
})
    .then(response => {
  console.log(response.text());
        // handle the response
    })
    .catch(error => {
   console.log(error);
        // handle the error
    });

console.log(res)
}

getUsers()
