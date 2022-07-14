// Example POST method implementation:
async frunction go(){
  // Default options are marked with *
  const response = await fetch('https://galacticau.fun/postLuna.php/?nplayer=michael', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
//mode: 'no-cors', // no-cors
    headers: {
    //  'Content-Type': 'application/json'
       'Content-Type': 'application/x-www-form-urlencoded',
    }
  
  //  body: "nplayer=michael" // body data type must match "Content-Type" header
  });
  return response.text(); // parses JSON response into native JavaScript objects
}

go();



