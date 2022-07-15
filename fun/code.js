console.log("life is beautiful")



function reqListener () {
  console.log(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "https://lcd.terra.dev/blocks/latest");
oReq.send();
