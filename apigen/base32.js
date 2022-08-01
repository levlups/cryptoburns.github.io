// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex (dec) {
  return dec.toString(16).padStart(2, "0")
}

// generateId :: Integer -> String
function generateId (len) {
  var arr = new Uint8Array((len || 40) / 2)
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}

console.log(generateId())
// "82defcf324571e70b0521d79cce2bf3fffccd69"
 var creds = {
        nplayer: 'binny',
        pass: 'lol',
        api_key:generateId(),
        command:'change-apikey'
    }

fetch('https://galacticau.fun/postLuna.php/?nnplayer=nabil',{
  method:'POST',
   headers: {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
    body: Object.entries(creds).map(([k,v])=>{return k+'='+v}).join('&')
})
  .then((response) => response.text())
  .then((data) => console.log(data));
