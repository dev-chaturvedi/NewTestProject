var date1 = new Date("06/30/2019"); 
var date2 = new Date("07/30/2020");
function diff_weeks(date2, date1) 
 {
  var diff =(date2.getTime() - date1.getTime()) / 1000;
  diff /= (60 * 60 * 24 * 7);
  return Math.abs(Math.round(diff));
 }
 var a =[],b=[]
var Time = date2.getTime() - date1.getTime(); 
console.log(Time)
var Days = Time / (1000 * 3600 * 24);
console.log(Days)
var myWeeks = [];
for(var i=1;i<=Days;i++){
 myWeeks[i]=i;
}

// console.log(myWeeks)
var arn =myWeeks.reduce(function(p,q,r,s){
    if(r % 7 ===0)
    p.push(s.slice(r,r+7));
    return p;

}, [])
console.log(arn)
if(Days <= 7){
    console.log(Days)
}

else{
    var week = diff_weeks(date1, date2)
    console.log(week);
}
var b =(a.push(week))
console.log(b)
console.log(...a)
