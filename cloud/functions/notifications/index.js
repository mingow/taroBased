const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command;


exports.main = async (event, context) => {
  var currentDate = new Date();
  var date = currentDate.getFullYear()+'-'+(currentDate.getMonth()+1)+'-'+(currentDate.getDate())
  //获取所有未使用订单信息
  let rec = await db.collection('orderLst')
  .where({
    status:1,
    date:date
  })
  .get()
  console.log(rec)
  rec.data.map(async(i) =>{
    try {
      await cloud.openapi.subscribeMessage.send({
          touser: i.userId,
          page: 'index',
          data: {
            phrase8: {
              value: '已预约成功'
            },
            date7: {
              value: i.date
            },
            thing6: {
              value: i.shopInfo.name
            },
            time2: {
              value: i.date
            },
            thing9:{
              value:'详情点击->下方进入小程序查看'
            }
          },
          templateId: 'mYzVgOdG7q4kXRKY39qqQOMyr7-qGB8v9_3wHaQqLsk'
        })
    } catch (err) {
      console.log(err)
      return err
    }
  })

}
