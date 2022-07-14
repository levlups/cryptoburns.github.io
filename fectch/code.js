// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
mode: 'no-cors', // no-cors
    headers: {
    //  'Content-Type': 'application/json'
       'Content-Type': 'application/x-www-form-urlencoded',
    },
  
    body: "nplayer=michael" // body data type must match "Content-Type" header
  });
  return response.text(); // parses JSON response into native JavaScript objects
}

postData('https://galacticau.fun/postLuna.php', { answer: 42 })
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
  });
