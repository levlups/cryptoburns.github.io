
  /*  function lol() {

         var xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.terrarity.io/wallets/lunaburn", true);
//Send the proper header information along with the request
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

    document.getElementById("p").innerHTML=xhr.response
      var num =JSON.parse(xhr.response).luna[0].burned/1000000
       console.log(JSON.parse(xhr.response).luna[0].burned/1000000);
        
      var yo=num.toString().split(".");
       var commas = yo[0].toLocaleString("en-US");
      var commat = commas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      console.log(commat.concat("."+yo[1]));
        // Request finished. Do processing here.
    }

   if ( this.status === 0){
         document.getElementById("p").innerHTML = "welcome " +xhr.response;
  
   }
}
           var today=new Date()
xhr.send();
              
             }*/
      
      
      
      
       function lol() {
console.log("yoooo")
         var xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.terrarity.io/wallets/lunaburn", true);
//Send the proper header information along with the request
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

   // document.getElementById("p").innerHTML=xhr.response *** check this out
     

      
      var transactions=JSON.parse(xhr.response).txs
      
      for (items in transactions){
        
        if(transactions[items].sender == "terra1hq2yvwr6m39hafsnyqsuj5h4swtuxqr8m5c4k0"){
       console.log(items+":"+transactions[items].qty/1000000 +":"+transactions[items].ts.split(",")[0]) 
          
             console.log(transactions[items])
        }
      }
   
    }

   if ( this.status === 0){
         document.getElementById("p").innerHTML = "welcome " +xhr.response;
  
   }
}
           var today=new Date()
xhr.send();
              
             }
      
    //  lol();
          
