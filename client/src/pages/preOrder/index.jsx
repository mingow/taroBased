import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtBadge,AtCard,AtToast } from 'taro-ui'

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
      isLoading:true,
      data:{
        id:'',
        shopInfo:{
          thumb:'',
          name:''
        }
      }
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
        var session={
          all:'全天场',
          day:'白天场',
          night:'通宵场',
        };
        res.result.sessionT=session[res.result.session];
        me.setState({
          isLoading:false,
          data:res.result
        });
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
        <View className='session' style={this.state.data.id?'':'display:none'}>
          <View className='header'><Text>场次信息</Text></View>
          <View className='body'>
            <View className='at-row'>
              <View className='thumb at-col--auto'><CloudImage cloudId={this.state.data.shopInfo.thumb} ></CloudImage></View>
              <View className='at-col contents'><Text>{this.state.data.shopInfo.name}</Text><Text>{this.state.data.date}</Text><Text>{this.state.data.sessionT}</Text></View>
            </View>
          </View>
          <View className='header'><Text>金额</Text></View>
          <View className='body'>
            <View className='at-row'>
              <Text></Text>
            </View>
          </View>
          <View className='footer'>
            <Text>说明：场次预定成功以最终的通知信息为准，如预定失败支付定金将原路退回。如场次预定成功，定金不可退回，但如无法如约到场，可提前3天联系管家调整时间。</Text>

          </View>
        </View>
        <View className='footer'>
          <Text>更多分店即将到来，敬请期待...</Text>
        </View>
        <AtToast hasMask={true} duration={0} isOpened={this.state.isLoading} text='加载中' status='loading'></AtToast>
      </View>
    )
  }
}
