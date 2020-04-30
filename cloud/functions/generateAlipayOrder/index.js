const cloud = require('wx-server-sdk')
const AlipaySdk = require('alipay-sdk').default;

cloud.init()

exports.main = async (event, context) => {
  try {
    var alipaySdk = new AlipaySdk({
      appId:
    })


    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
