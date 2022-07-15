console.log("life is beautiful")



function reqListener () {
  console.log(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "https://lcd.terra.dev/txs?message.action=send&message.sender=terra1rvxcszyfecrt2v3a7md8p30hvu39kj6xf48w9e&page=1&limit=10&tx.minheight=8509911&tx.maxheight=8509912");
oReq.send();
