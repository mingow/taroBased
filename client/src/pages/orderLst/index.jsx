import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtTabs, AtTabsPane,AtToast,AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

import CloudImage from '../../components/imageFromCloud/index'
import Util from '../../utils/utils'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '我的订单',
    navigationBarBackgroundColor: '#2CD18A',
    navigationBarTextStyle: 'white',
    backgroundColor:'#2CD18A',
    backgroundColorTop:'#2CD18A',
    backgroundColorBottom:'#f5f5f6',
    enablePullDownRefresh: true,
    onReachBottomDistance:50,
  }

  constructor (props) {
    super(props);
    this.state = {
      current:3,
      isLoading:true,
      currentLst:[],
      rawLst:[],
      target:'',
      showModal:false,
    }
  }

  componentWillMount () {
    if(this.$router.params){
      this.setState({current:Number(this.$router.params.index)})
    }
    Taro.eventCenter.off('refreshOrder');
    Taro.eventCenter.on('refreshOrder', this.updateRawData.bind(this));
  }

  componentDidShow() {
    console.log('show');
  }

  onPullDownRefresh(){
    this.updateRawData()
  }

  handleClick(index) {
    const me = this;
    this.setState({current:index},me.updateCurrentLst.bind(this,me));
  }

  updateCurrentLst(me) {
    var arr = [];
    const LST = me.state.rawLst;
    switch (me.state.current) {
      case 0:
        LST.map((i) => {
          if(i.status==0){
            i.date = Util.Date.toString(i.date,'-')
            arr.push(i);
          }
        })
        break;
      case 1:
        LST.map((i) => {
          if(i.status==1){
            i.date = Util.Date.toString(i.date,'-')
            arr.push(i);
          }
        })
        break;
      case 2:
        LST.map((i) => {
          if(i.status==-1){
            i.date = Util.Date.toString(i.date,'-')
            arr.push(i);
          }
        })
        break;
      default:
        LST.map((i) => {i.date = Util.Date.toString(i.date,'-');arr.push(i);})  //全部显示
    }

    //处理列表格式
    var session={
      all:'全天场',
      day:'白天场',
      night:'通宵场',
    };
    var orderStatus={
      '0':'待支付',
      '1':'待使用',
      '2':'已使用',
      '-1':'已取消',
    }
    arr.map((i) =>{
      i.statusT=orderStatus[i.status];
      i.sessionT= session[i.session];
      var date = new Date(i.createTime);
      i.create = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getMinutes();
    })
    me.setState({currentLst:arr},function(){
      console.log(me.state.currentLst);
    });
  }

  componentDidMount () {
    this.updateRawData();
  }

  updateRawData(){
    const me = this;
    this.setState({isLoading:true});
    wx.cloud.callFunction({
      data:{
        $url:'getOrderByUserId'
      },
      name:'getOrderInfo',
      success:function(res){
        me.setState({isLoading:false,rawLst:res.result},me.updateCurrentLst.bind(this,me));
        Taro.stopPullDownRefresh();
      },
      fail:function(){
        Taro.stopPullDownRefresh();
        Taro.navigateBack({ delta:1});
      }
    })
  }

  componentWillUnmount () {
  }

  componentDidShow () { }

  componentDidHide () { }

  cancelOrder() {
    var me = this;
    wx.cloud.callFunction({
      name:'unpayOrderTrigger',
      data:{
        id:me.state.target
      },
      success:function(res){
        me.setState({showModal:false});
        me.updateRawData();
      }
    })
  }

  showModal(id){
    console.log(id);
    this.setState({
      target:id,
      showModal:true
    })
  }

  closeModal(){
    this.setState({
      showModal:false
    })
  }

  showDetail(id,page){
    var me = this;
    Taro.navigateTo({
      url:'/pages/'+page+'/index?id='+id,
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        console.log(res);
      }
    })
  }

  doNothing() {}

  render () {
    var me = this;
    const List = this.state.currentLst.map((i,index) => {
      return <View key={index} className='itemPanel'>
        <View className='header'><Text>{i.create}</Text><Text className='right'>{i.statusT}</Text></View>
        <View className='body'>
          <View className='at-row'>
            <View className='thumb at-col--auto'><CloudImage cloudId={i.shopInfo.thumb} ></CloudImage></View>
            <View className='at-col contents'><Text>{i.shopInfo.name}</Text><Text>{i.date}</Text><Text>{i.sessionT}</Text></View>
          </View>
        </View>
        <View className='at-row at-row__justify--end footer'>
          <View style={i.status==0?'':'display:none'} className='at-col--auto grid'><AtButton onClick={this.showModal.bind(this,i._id)} className='gray' size='small'>取消</AtButton></View>
          <View style={i.status>0?'':'display:none'} className='at-col--auto grid'><AtButton onClick={this.showDetail.bind(this,i._id,'order')} className='gray' size='small'>查看</AtButton></View>
          <View style={i.status==0?'':'display:none'} className='at-col--auto grid'><AtButton onClick={this.showDetail.bind(this,i._id,'preOrder')} type='primary' size='small'>去支付</AtButton></View>

        </View>
      </View>
    })

    return (
      <View className='index'>
      <AtTabs
        animated={false}
        current={this.state.current}
        tabList={[
          { title: '待支付' },
          { title: '待使用' },
          { title: '已取消' },
          { title: '全部' },
        ]}
        onClick={this.handleClick.bind(this)}>

      </AtTabs>
      <View>
        {List}
      </View>
      <View className='empty' style={this.state.currentLst.length==0?'':'display:none'} >订单空空如也，赶紧下一单吧</View>
      <AtToast hasMask={true} duration={0} isOpened={this.state.isLoading} text='加载中' status='loading'></AtToast>
      <AtModal
        isOpened={this.state.showModal}
        title='取消订单'
        cancelText='再想想'
        confirmText='确认取消'
        onConfirm={ this.cancelOrder.bind(this)}
        onCancel={this.closeModal.bind(this)}
        onClose={this.closeModal.bind(this)}
        content='确认要取消所选订单吗？'
      />
      </View>
    )
  }
}
