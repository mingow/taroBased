var Util;

Util = function(){

}

Util.Date = function(){

}

Util.Date.toString = function(date,char){
  const d = new Date(date);
  let year = d.getFullYear();
  let month = (d.getMonth()+1).length==1?'0'+(d.getMonth()+1):(d.getMonth()+1);
  let day = d.getDate().length==1?'0'+d.getDate():d.getDate();
  return year+char+month+char+day;
}

module.exports = Util;