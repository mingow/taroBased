import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtBadge,AtCard } from 'taro-ui'

import Login from '../../components/login/index'
import CCard from '../../components/imageCard/index'
import CScrollArea from '../../components/scrollArea/index'
import CAvatar from '../../components/avatar/index'
import CContent from '../../components/contents/index'
import Cbutton from '../../components/button/index'
import CloudImage from '../../components/imageFromCloud/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: 'Homiez欢乐轰趴',
    backgroundColor:'#ffffff',
    backgroundColorTop:'#ffffff',
    backgroundColorBottom:'#ffffff'
  }

  componentWillMount () {

  }

  componentDidMount () {
    wx.showModal({
      title: '提示',
      content: '小程序试运行上线，相关订单以客服确认信息为准'
    })
    const version = wx.getSystemInfoSync().SDKVersion
    if (this.compareVersion(version, '2.6.0') >= 0) {
      wx.openBluetoothAdapter()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用完整功能，请升级到最新微信版本后重试。'
      })
    }

  }
  compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  booking(){
    wx.switchTab({
      url:'/pages/booking/index'
    })
  }

  render () {
    return (
      <View className='index'>
        <View className='1px'></View>
        <View className='header margin'>
          <Text>Homie欢迎你</Text>
          <Cbutton circle onClick={this.booking.bind(this)} type='secondary'>立即预定</Cbutton>
        </View>
        <View className='title'><Text className='primary'>主推项目</Text><Text className='second'>精致推荐，给你最好的体验</Text></View>
        <CScrollArea>
          <CCard title='Game' className='item' cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/e35328563ec1a76207e7ffd0340db7ba.png'>
            <View className='avatar'><Text>桌游</Text></View>
          </CCard>
          <CCard title='Game' className='item' cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/61f78111c558b48dd6a624fe408d4a54.jpg'>
            <View className='avatar'><Text>KTV</Text></View>
          </CCard>
          <CCard title='Game' className='item' cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/88d8be1ea8369f9276c3e400a466823e.jpg'>
            <View className='avatar'><Text>麻将</Text></View>
          </CCard>
          <CCard title='Game' className='item' cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/98aebf4eba20f898330e3b109a4d4d8f.jpg'>
            <View className='avatar'><Text>电竞</Text></View>
          </CCard>
          <CCard title='Game' className='item' cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/6ea73555dbd407472ccd3762fe6019d6.jpeg'>
            <View className='avatar'><Text>射箭</Text></View>
          </CCard>
          <CCard title='Game' className='item' cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/60e67392224b03e76993802cf423da2d.jpeg'>
            <View className='avatar'><Text>电影</Text></View>
          </CCard>
        </CScrollArea>
        <View className='title'><Text className='primary'>优惠</Text><Text className='second'>疯狂折扣，回血双十一</Text></View>
        <Swiper
          className='test-h'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          autoplay>
          <SwiperItem>
            <CloudImage cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/banners/sales00.jpg' ></CloudImage>
          </SwiperItem>
          <SwiperItem>
            <CloudImage cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/banners/sales01.jpg' ></CloudImage>
          </SwiperItem>
          <SwiperItem>
            <CloudImage cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/banners/sales02.jpg' ></CloudImage>
          </SwiperItem>
        </Swiper>
        <View className='title'><Text className='primary'>活动</Text><Text className='second'>精彩活动，嗨翻全场</Text></View>
        <CContent title="欢迎光临" second="轰趴馆">
          开业大酬宾活动火热进行中，详情请联系管家
        </CContent>
        <CContent title="周末还宅在家里吗？" second="轰趴馆" src='https://mp.weixin.qq.com/s/IkmaHpNddqf12YeLP4iB4g' cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy/resources/images/IMG_0213.JPG'>
          快邀上好友来龙岸嗨翻天吧
        </CContent>
        <CContent title="周末还宅在家里吗？" second="轰趴馆" cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy/resources/images/IMG_0213.JPG'>
          快邀上好友来龙岸嗨翻天吧
        </CContent>
        <View className='margin'>
          <AtButton circle type='primary' openType='contact'>联系客服</AtButton>
        </View>
        <View className='margin'>
          <OfficialAccount></OfficialAccount>
        </View>

      </View>
    )
  }
}
