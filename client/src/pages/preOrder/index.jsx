import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtToast,AtList, AtListItem,AtRadio } from 'taro-ui'

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
      reserve:1000,
      isLoading:true,
      currentPrice:0,
      isFullPayment:false,
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
        if(res.result.status!=0){
          //订单状态发生变化，返回上层
          Taro.eventCenter.trigger('refreshOrder');
          Taro.navigateBack({ delta:1});
        }
        me.setState({
          isLoading:false,
          data:res.result,
          currentPrice:res.result.price
        });
      },
      fail:function(){
        Taro.navigateBack({ delta:1});
      }
    })
  }

  payment() {
    wx.showLoading({
      title: '正在下单',
    });
    const config = {
      $url: "pay",
      price:this.state.isFullPayment?this.state.currentPrice:this.state.reserve,
      title:this.state.isFullPayment?'支付全款':'支付定金',
      full:this.state.isFullPayment,
      id:this.state.data.id
    }
    console.log(config);

    wx.cloud.callFunction({
      name:'payment',
      data:config,
      success: function(res){
        wx.hideLoading();
        console.log(res.result);
        wx.requestPayment({
          timeStamp:res.result.timeStamp,
          nonceStr:res.result.nonceStr,
          package:res.result.package,
          signType: 'MD5',
          paySign:res.result.paySign,
          success:function(res){
            console.log(res);
          },
          fail:function(res){
            console.log(res);
          }
        })
      },
      fail: function(e){
        wx.hideLoading();
        wx.showToast({
          title: '支付失败，请及时反馈或稍后再试',
          icon:'none'
        });
      }
    });
  }

  componentDidMount () { }

  componentWillUnmount () {
    Taro.eventCenter.trigger('refreshOrder');
  }

  changePaymentPolicy () {
    this.setState({isFullPayment:!this.state.isFullPayment})
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
            <AtList>
              <AtListItem title={this.state.data.pricingNote} extraText={'￥'+parseFloat(this.state.data.price).toFixed(2)} />
              <AtListItem title='优惠券' extraText={'￥'+parseFloat('0').toFixed(2)} arrow='right' />
              <AtListItem title='总价' extraText={'￥'+parseFloat(this.state.currentPrice).toFixed(2)} />
            </AtList>
          </View>
        </View>
        <View className='session' style={this.state.data.id?'':'display:none'}>
          <View className='header'><Text>支付方式</Text></View>
          <View className='body'>
            <AtList>
              <AtListItem title='微信支付' extraText={'￥'+parseFloat(this.state.isFullPayment?this.state.currentPrice:this.state.reserve).toFixed(2)} />
              <AtListItem
                title='支付全款？'
                isSwitch
                onSwitchChange={this.changePaymentPolicy.bind(this)}
              />
            </AtList>

          </View>
          <View className='footer'>
            <Text>说明：场次预定仅需支付定金，剩余部分到场后支付。如场次预定成功，定金不可退回，但如无法如约到场，可提前3天联系管家调整时间。</Text>
            <Text>说明：场次预定结果以系统通知信息为准，如预定失败支付费用将原路退回。</Text>
            <Text>特别说明：当日特惠场次不可改期，定金支付后不可退换，还请见谅！</Text>

          </View>
        </View>
        <View className='safeArea blank'></View>
        <View className='bottom safeArea'>
          <View className='margin'><AtButton onClick={this.payment.bind(this)} type='primary' >{this.state.isFullPayment?'支付全款￥'+this.state.currentPrice:'支付定金￥'+this.state.reserve}</AtButton></View>

        </View>
        <AtToast hasMask={true} duration={0} isOpened={this.state.isLoading} text='加载中' status='loading'></AtToast>
      </View>
    )
  }
}
