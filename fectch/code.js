

fetch('https://galacticau.fun/postLuna.php/?nplayer=michael')
  .then(response => response.text())
  .then(data => console.log(data));

