import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'
import Util from '../../../utils/utils'


import { AtSteps,AtDivider,AtTag,AtButton,AtIcon,AtToast,AtList, AtListItem,AtRadio,AtNoticebar,AtModal,AtMessage,AtBadge,AtSlider } from 'taro-ui'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '订单后台',
  }

  constructor (props) {
    super(props);
    this.state = {
      data:{},
      isLoading:false,
      currentPrice:0,
    }
  }

  componentWillMount() {
    const me = this;
    me.setState({isLoading:true})
    const ID = this.$router.params.id;
    wx.cloud.callFunction({
      name:'getOrderInfo',
      data:{
        $url:'getOrderById',
        id:ID,
        override:true
      },
      success:function(res){
        var session={
          all:'全天场',
          day:'白天场',
          night:'通宵场',
        };
        res.result.sessionT=session[res.result.session];
        me.setState({data:res.result,isLoading:false,currentPrice:res.result.price})

      },
      fail:function(e){
        console.log(e);
      }
    })
  }

  call() {
    Taro.makePhoneCall({
      phoneNumber: this.state.data.phone,
      fail:function(){
        Taro.atMessage({
          message: '拨号失败',
          type: 'error',
        })
      }
    })
  }

  changePrice(val){
    this.setState({currentPrice:val.value})
  }

  render () {

    var list = null;
    var payment = null;
    if (Object.keys(this.__state.data).length){
      var props = ['id','createTime','phone','price','pricingNote','userId','name','date','sessionT','status'];
      var description = ['id','创建时间','电话','总价','定价策略','用户id','店铺','日期','场次','状态'];
      list = props.map((item,i) => (
        <View className='at-row'><View className='at-col at-col-3 field'>{description[i]}</View><View className='at-col val'>{this.state.data[item]}</View></View>
      ))
      payment = this.state.data.payment.map((item,i)=>(
        <View className='at-row'><View className='at-col at-col-3 field'>{item.order_type_description}</View><View className='at-col val'>{parseInt(item.total_fee)/100}</View></View>
      ))
    }

    const clsObj = {
      'primary':!(this.state.currentPrice==this.state.data.price)
    }

    return (
      <View className='index'>
        <AtMessage/>
        <AtToast hasMask={true} duration={0} isOpened={this.state.isLoading} text='加载中' status='loading'></AtToast>
        <View className='info'>
          {list}
          <View className='at-row'>支付信息</View>
          {payment}
        </View>
        <View className='actions'>
          <AtButton onClick={this.call.bind(this)}>拨打电话</AtButton>
          {this.state.currentPrice}
          <AtSlider step={100} onChanging={this.changePrice.bind(this)} value={this.state.currentPrice} min={this.state.data?this.state.data.paid:0} max={this.state.data?this.state.data.price:0}></AtSlider>
          <AtButton className={classNames(clsObj,'test')}>修改价格</AtButton>
          <AtButton className='primary'>发起退款</AtButton>
          <AtButton>改期</AtButton>
        </View>
      </View>
    )

  }


}
