
var generateRoomCode=()=>{
  var string='abcdefghijklmnopqrstuvwxyz';//string used to generate the code
  let room='';//empty string to store the generated room code
  //find length of string
  var len=string.length;
  for(let i=1;i<=9;i++){
    room+=string[Math.floor(Math.random()*len)];
    if(i%3===0 && i<9) room+='-';//this condn adds a hyphen after evry three third character
  }
  return room;
}
module.exports={generateRoomCode}