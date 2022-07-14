/*function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}






const dateStr = '2022-04-27';

const date = new Date(dateStr);

// 👇️ timestamp in milliseconds
const timestampInMs = date.getTime();

// 👇️ timestamp in seconds (Unix timestamp)
//const timestampInSeconds = Math.floor(date.getTime() / 1000);
//console.log(timestampInSeconds);

const timestampInSeconds = Math.floor(date.getTime() / 1000);
document.getElementById("go").innerHTML=timeConverter(timestampInSeconds)*/

           var today=new Date()
           
           console.log(today)
console.log(today.toLocaleDateString("en-US"))
console.log(today)


