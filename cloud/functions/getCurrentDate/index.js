const cloud = require('wx-server-sdk')

cloud.init()


exports.main = async (event) => {
  const date = new Date();


  return {
    date:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
    time:date.getHours()+':'+date.getMinutes()+':'+date.getSeconds(),
    parse:Number(date)
  }
}
