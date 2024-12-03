export class PostThreadNode {
  constructor(value) {
    this.value = value;
    this.subnodes = [];
  }
  addSubNode(subNode){
    this.subnodes.push(subNode);
  }
}

export function postThreadDFS(postThreadNode, threadLevel = 0, nodesArray = []){
  if(postThreadNode === null){
      return;
  }
  nodesArray.push({postThreadNode:postThreadNode.value, threadLevel: threadLevel});
  for(const subNode of postThreadNode.subnodes){
      postThreadDFS(subNode, threadLevel + 1, nodesArray);
  }
}

export function displayTime(date){
  date = new Date(date);
  // console.log("\ndate received: ", date, "\n");
// var date = new Date(date1);
var timeNow = new Date();
// if it's the same day
// console.log("\ndate:", date, " month: ", date.getMonth(), "\n");
if(timeNow.getMonth() === date.getMonth() 
  && timeNow.getDate() === date.getDate()
  && timeNow.getFullYear() === date.getFullYear()){
    // created seconds ago
    if(timeNow.getHours() === date.getHours() &&
    timeNow.getMinutes() === date.getMinutes()){
      // console.log("\ntimeNow.getSeconds() - date.getSeconds(): ", timeNow.getSeconds() - date.getSeconds(), "\n");
      return (timeNow.getSeconds() - date.getSeconds()) + 
      " second" + ((timeNow.getSeconds() - date.getSeconds() > 1) ? "s": "") + " ago"
    } 
    // created minutes ago
    else if(timeNow.getHours() === date.getHours()){
      // console.log("\ntimeNow.getMinutes() - date.getMinutes(): ", timeNow.getMinutes() - date.getMinutes(), "\n");
      return (timeNow.getMinutes() - date.getMinutes()) + 
      " minute" + ((timeNow.getMinutes() - date.getMinutes() > 1) ? "s": "") + " ago"
    }
    // created hours ago
    else{
      // console.log("\ntimeNow.getHours() - date.getHours(): ", timeNow.getHours() - date.getHours(), "\n");
      return (timeNow.getHours() - date.getHours()) + 
      " hour" + ((timeNow.getHours() - date.getHours() > 1) ? "s": "") + " ago"
    }
} // if less than a month ago
else if((timeNow.getTime() - date.getTime()) / (24*60*60*1000) < 30){
  var daysNum = parseInt(((timeNow.getTime() - date.getTime()) / (24*60*60*1000)));
  // console.log("\ndaysNum: ", daysNum, "\n");
  return daysNum + " day" + ((daysNum > 1) ? "s": "") + " ago"
} // if more than a month ago
else if((timeNow.getFullYear() - date.getFullYear()) * 12 + 
  (timeNow.getMonth() - date.getMonth()) < 12){
    var monthsNum = ((timeNow.getFullYear() - date.getFullYear()) * 12 + (timeNow.getMonth() - date.getMonth()));
    // console.log("\nmonthsNum: ", monthsNum, "\n");
    return monthsNum + " month" + ((monthsNum > 1) ? "s": "") + " ago"
} // if more than a year ago
else{
  // console.log("\ntimeNow.getFullYear() - date.getFullYear(): ", timeNow.getFullYear() - date.getFullYear(), "\n");
  return (timeNow.getFullYear() - date.getFullYear()) + 
    " year" + ((timeNow.getFullYear() - date.getFullYear() > 1) ? "s": "") + " ago"
}
}