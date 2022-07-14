
const myHeaders = new Headers();

const myRequest = new Request('https://galacticau.fun/postLuna.php/?nplayer=michael', {
  method: 'POST',
  headers: myHeaders,
  mode: 'cors',
  cache: 'default',
});
fetch('myRequest')
  .then(response => response.text())
  .then(data => console.log(data));

