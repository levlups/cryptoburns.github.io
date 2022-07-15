console.log("life is beautiful")
let url="https://galacticau.fun/postLuna.php"


async function getUsers() {
  let res = await fetch(url,{
 mode:"no-cors"   
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
