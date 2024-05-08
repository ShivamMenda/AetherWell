let currTime=new Date().toLocaleString("en-us",{ timeZone: 'Asia/Kolkata' ,hour12:false},);
let currentHour=currTime.split(" ")[1].split(":")[0];
console.log(currTime);
console.log(currentHour);
