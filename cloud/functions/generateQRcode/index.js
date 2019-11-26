const cloud = require('wx-server-sdk')

cloud.init()


exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.createQRCode({
        path: 'page/index/index',
        width: 430
      })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
