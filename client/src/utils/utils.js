var Util;

Util = function(){

}

Util.Date = function(){

}

Util.Date.toShortDate = function(date,char){
  const d = new Date(date);
  let year = d.getFullYear();
  let month = (d.getMonth()+1)<10?'0'+(d.getMonth()+1):(d.getMonth()+1);
  let day = d.getDate()<10?'0'+d.getDate():d.getDate();
  return year+char+month+char+day;
}

Util.sessionTime = function(start,duration){
  let begin = new Date((start-8*3600)*1000);
  let end = new Date((start-8*3600+duration%(24*3600))*1000);
  let day = parseInt(duration/24/3600);
  if(begin.getDate()!=end.getDate()){day++;}
  return {
    start:begin.toTimeString().split(' ')[0],
    end:end.toTimeString().split(' ')[0],
    day:day
  }
}
Util.getWeekDay = function(arg){
  var arr = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
  return arr[new Date(arg).getDay()];
}

module.exports = Util;
