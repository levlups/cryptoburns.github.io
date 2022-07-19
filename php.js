
   function lol() {
              var today=new Date()
              document.getElementById("p").innerHTML=today.toLocaleDateString("en-US");
         
                if (document.getElementById("mcname").value !== "") {
                    document.getElementById("p").innerHTML = "welcome " +document.getElementById("mcname").value;
                } else {
                    document.getElementById("p").innerHTML = "enter a minecraft username and your luna classic address";
                }

                if ((document.getElementById("mcname").value !== "") & (document.getElementById("lunaadd").value !== "")) {
                    document.getElementById("p").innerHTML = "you are registered for the tournament";
                }
                
                
                       var xhr = new XMLHttpRequest();
xhr.open("POST", "https://galacticau.fun/postLuna.php", true);

//Send the proper header information along with the request
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    
   
      console.log(xhr.response);
    document.getElementById("p").innerHTML=xhr.response
        // Request finished. Do processing here.
    }
console.log(this.status);
   if ( this.status === 0){
     
     
     // document.getElementById("p").innerHTML="failed friend"
   }
}
           var today=new Date()
xhr.send("nplayer=Eddie66667755555&nlune=starboy&ndate="+today.toLocaleDateString("en-US"));
                //moved xhr request 
                
                
            }
          
          
  document.getElementById("btn").onclick = function(){lol();};

document.getElementById("caddress").onclick = function(){SelfCopy(document.getElementById("taddress").value);};

function SelfCopy(copyText)
  {
      navigator.clipboard.writeText(copyText);
      alert("You just copied this: (" + copyText + ").");
  }
