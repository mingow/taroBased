import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem } from '@tarojs/components'
import './index.scss'
import Util from '../../../utils/utils'

import { AtSteps,AtDivider,AtTag,AtButton,AtIcon,AtToast,AtList, AtListItem,AtRadio,AtNoticebar,AtModal,AtMessage,AtBadge } from 'taro-ui'

export default class Index extends Component {

  constructor (props) {
    super(props);
    this.state = {
      data:[],
      isLoading:false,
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
        me.setState({data:res.result,isLoading:false})

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

  render () {

    var list = null;
    if (this.state.data){
      var props = ['id','createTime','phone','price','pricingNote','userId','name','date','sessionT','status'];
      list = props.map((item,i) => (
        <View className='at-row'><View className='at-col at-col-3 field'>{item}</View><View className='at-col val'>{this.state.data[item]}</View></View>
      ))
    }

    return (
      <View className='index'>
        <AtMessage/>
        <AtToast hasMask={true} duration={0} isOpened={this.state.isLoading} text='加载中' status='loading'></AtToast>
        <View className='info'>
          {list}
        </View>
        <View className='actions'>
          <AtButton onClick={this.call.bind(this)}>拨打电话</AtButton>
          <AtButton>更改状态</AtButton>
          <AtButton>修改价格</AtButton>
        </View>
      </View>
    )

  }


}
