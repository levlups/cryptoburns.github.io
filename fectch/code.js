
 fetch('https://galacticau.fun/postLuna.php/?nplayer=michael')
.then(data => {
return data.text();
})
.then(post => {
//console.log(post.title);
});
