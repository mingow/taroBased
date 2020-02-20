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

Util.publicKey='-----BEGIN PUBLIC KEY-----MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAM9n0myhmKEPUXww/MZ3c81g4l8cIIKyNUy8I2lfrERhmQTKzORjRrDeDf9gWm5LC7t5mqM1xM+SR6P4q+usCwkCAwEAAQ==-----END PUBLIC KEY-----'
Util.privateKey='-----BEGIN PRIVATE KEY-----MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAz2fSbKGYoQ9RfDD8xndzzWDiXxwggrI1TLwjaV+sRGGZBMrM5GNGsN4N/2BabksLu3maozXEz5JHo/ir66wLCQIDAQABAkAv7SXKxGyoiwmhURCYK/IuezzUDYPVr6hxWugz6U+9XQWP0otj+frOvAAI9JezFrY0aGc+1rOkHZfnN1fAMEShAiEA8IB+NGkTKh0ydpNWVlcLznaejiV3JnPcJc8QymVFndMCIQDcxVhxJz29fpgA0lV3UQTuX8p9BQOuifDkN+kdk8m+MwIgODKuSuzqr4KXEiInoJFCjwIk1q5mgzO7k5IpKEI13EUCIQC5Y9dDHgrQqBAJEJfInHahnjsyBRX0ac2qN/FAbyyI1QIgQtL34XNCjCuKwhHbd7gN8Q/iR+LKeQHB4PzTtkZteXY=-----END PRIVATE KEY-----'
module.exports = Util;
