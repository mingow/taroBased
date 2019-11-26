import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtBadge,AtCard,AtToast } from 'taro-ui'

import Login from '../../components/login/index'
import CCard from '../../components/imageCard/index'
import CScrollArea from '../../components/scrollArea/index'
import CAvatar from '../../components/avatar/index'
import ItemCard from '../../components/itemCard/index'
import CloudImage from '../../components/imageFromCloud/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '确认订单',

    backgroundColorTop:'#fff',
    backgroundColorBottom:'#fff',
  }

  constructor (props) {
    super(props);
    this.state = {
      isLoading:true
    }
  }

  componentWillMount () {
    const me = this;
    console.log(this.$router.params)
    wx.cloud.callFunction({
      name:'getOrderInfo',
      data:this.$router.params,
      success:function(res){
        console.log(res);
        me.setState({isLoading:false});
      },
      fail:function(){
        Taro.navigateBack({ delta:1});
      }
    })
  }

  componentDidMount () { }

  componentWillUnmount () {

  }

  getPhoneNum (res) {
    console.log(res.result.cloudID)
  }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <View className='info'>
          <Text>订单联系人</Text>
          <Text>订单联系人</Text>
          <Text>订单联系人</Text>
          
        </View>
        <View className='footer'>
          <Text>更多分店即将到来，敬请期待...</Text>
        </View>
        <AtToast hasMask={true} duration={0} isOpened={this.state.isLoading} text='加载中' status='loading'></AtToast>
      </View>
    )
  }
}
