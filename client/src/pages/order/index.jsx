import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtToast,AtList, AtListItem,AtRadio,AtNoticebar,AtModal,AtMessage } from 'taro-ui'

import CloudImage from '../../components/imageFromCloud/index'
import QRCode from '../../utils/weapp-qrcode'


export default class Index extends Component {

  config = {
    navigationBarTitleText: '订单详情',

    backgroundColorTop:'#fff',
    backgroundColorBottom:'#fff',
  }

  constructor (props) {
    super(props);
    this.state = {
      isLoading:true,
      currentPrice:0,
      isSubscribe:false,
      paid:0,
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
    const ID = this.$router.params.id;
    console.log(this.$router.params)
    wx.cloud.callFunction({
      name:'getOrderInfo',
      data:this.$router.params,
      success:function(res){
        var session={
          all:'全天场',
          day:'白天场',
          night:'通宵场',
        };
        res.result.sessionT=session[res.result.session];
        if(res.result.status<0){
          //订单状态发生变化，返回上层
          Taro.eventCenter.trigger('refreshOrder');
          Taro.navigateBack({ delta:1});
        }
        //确认订单支付情况
        wx.cloud.callFunction({
          name:'payment',
          data:{
            $url:'getPaymentOrder',
            id:ID,
            out_trade_no:ID
          },
          success:function(res){
            if(res.result.result_code=="SUCCESS"){
              me.setState({
                isLoading:false,
                paid:parseInt(res.result.total_fee)/100
              })
            }
          },
          fail:function(res){
            Taro.navigateBack({ delta:1});
          }
        })
        me.setState({
          data:res.result,
          currentPrice:res.result.price
        });
      },
      fail:function(){
        Taro.navigateBack({ delta:1});
      }
    })
  }

  componentDidMount () {

    var qrcode = new QRCode('canvas', {
      // usingIn: this,
      text: this.$router.params.id,
      width: 150,
      height: 150,
      colorDark: "#2CD18A",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.L,
    });
    console.log(qrcode);
  }

  componentWillUnmount () {
    Taro.eventCenter.trigger('refreshOrder');
  }

  changePaymentPolicy () {
    this.setState({isFullPayment:!this.state.isFullPayment})
  }

  componentDidShow () { }

  componentDidHide () { }

  subscribe() {
    wx.requestSubscribeMessage({
      tmplIds: ['mYzVgOdG7q4kXRKY39qqQOMyr7-qGB8v9_3wHaQqLsk'],
      success (res) {
        if(JSON.stringify(res).indexOf('reject')==-1){
          Taro.atMessage({
            'message': '订阅成功',
            'type': 'success',
          })
        }
      }
    })
  }

  render () {

    return (
      <View className='index'>
        <AtMessage />
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
            <AtList>
              <AtListItem title={this.state.data.pricingNote} extraText={'￥'+parseFloat(this.state.data.price).toFixed(2)} />
              <AtListItem title='优惠券' extraText={'￥'+parseFloat('0').toFixed(2)} arrow='right' />
              <AtListItem title='总价' extraText={'￥'+parseFloat(this.state.currentPrice).toFixed(2)} />
            </AtList>
          </View>
        </View>
        <View className='session' style={this.state.data.id?'':'display:none'}>
          <View className='header'><Text>已支付金额</Text></View>
          <View className='body'>
            <AtList>
              <AtListItem title='微信支付' extraText={'￥'+parseFloat(this.state.paid).toFixed(2)} />
            </AtList>

          </View>
          <View>
            <canvas class='canvas' style="width:150px; height:150px;" canvas-id='canvas' bindlongtap='save'></canvas>
          </View>
          <View className='footer'>
            <Text>说明：场次预定仅需支付定金，剩余部分到场后支付。如场次预定成功，定金不可退回，但如无法如约到场，可提前3天联系管家调整时间。</Text>
            <Text>说明：场次预定结果以系统通知信息为准，如预定失败支付费用将原路退回。</Text>
            <Text>特别说明：当日特惠场次不可改期，定金支付后不可退换，还请见谅！</Text>
            <Text>墙裂建议订阅预约通知提醒，我们将在订单日期到期前发送预约提醒。</Text>
          </View>
          <View className='margin'>
            <View className='btn'><AtButton onClick={this.subscribe.bind(this)} type='primary' >订阅预约通知提醒</AtButton></View>
            <View className='btn'><AtButton >改期</AtButton></View>
          </View>

        </View>
        <View className='safeArea blank'></View>
        <AtToast hasMask={true} duration={0} isOpened={this.state.isLoading} text='加载中' status='loading'></AtToast>
      </View>
    )
  }
}
