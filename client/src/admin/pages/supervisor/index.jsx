import Taro, { Component } from '@tarojs/taro'
import { View, Text,Picker } from '@tarojs/components'
import './index.scss'
import Util from '../../../utils/utils'

import {AtTabs,AtTabsPane,AtToast,AtSearchBar,AtCalendar,AtList,AtListItem,AtSwipeAction,AtActionSheet,AtActionSheetItem,AtFloatLayout,AtTag,AtButton,AtIndexes,AtMessage } from 'taro-ui'

import CloudImage from '../../../components/imageFromCloud/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '管理员页面',
    navigationBarBackgroundColor: '#ffcf00',
    navigationBarTextStyle: 'black',
    backgroundColor:'#ffcf00',
    backgroundColorTop:'#ffcf00',
    backgroundColorBottom:'#f5f5f6',
    enablePullDownRefresh: false,
    onReachBottomDistance:50,
  }

  constructor (props) {
    super(props);
    this.state = {
      dateSel:null,
      current:0,
      searchBtn:'扫一扫',
      searchValue:'',
      isLoading:false,
      currentLst:[],
      rawLst:[],
      marks:[],
      target:'',
      showModal:false,
      currentDate:new Date(),
      shopId:'a9f7ef91-0fd7-4928-beef-ac19dd8742bd',
      occupyLayerOpened:false,
      stateLst:[],
      actionOpened:false,
      longTapDate:null,
      occupySession:'',
      undoneLst:[]
    }
  }

  componentWillMount () {
    var currentDate = new Date();
    this.setState({
      dateSel:Util.Date.toShortDate(currentDate)
    })
  }

  componentDidMount () {
    this.getUndoneOrder()
  }

  componentWillUnmount () { }

  componentWillUpdate() {
    console.log(arguments);
  }

  componentDidShow () { }

  componentDidHide () { }

  handleClick (value) {
    this.setState({
      current: value
    })
    if(value==1){
      this.getSessionLst(new Date())
    }
    else if (value==0) {
      this.getUndoneOrder()
    }
  }



  getUndoneOrder(){
    this.setState({
      isLoading:true
    })
    const me = this;
    if(typeof date=='string'){
      date = new Date(date);
    }
    wx.cloud.callFunction({
      name:'getOrderInfo',
      data:{
        $url:'getUndoneOrder'
      },
      success:function(res){
        me.setState({isLoading:false})
        if(res.errMsg.indexOf('ok')!=-1){
          //返回数据，开始标记
          const arr = res.result;
          me.setState({
            rawLst:arr
          })
          var today=[],tomorrow=[],expired=[],future=[];
          console.log(arr);
          arr.map((item,index)=>{
            //formatting data
            var time = Util.sessionTime(item.time.start,item.time.duration);
            var i = {
              val:item._id,
              phone:item.phone,
              tag:[
                {
                  value:item.date.substring(0,item.date.indexOf('T')),
                  cls:'orderInfoTagDate'
                },{
                  value:item.time.name,
                  cls:'orderInfoTagSession'
                },
                {
                  value:time.start.substring(0,time.start.lastIndexOf(':'))+'-'+time.end.substring(0,time.end.lastIndexOf(':')),
                  cls:'orderInfoTagTime'
                }
              ],
              actions:[
                {
                  text: '电话',
                  val:'makePhoneCall',
                  style: {
                    backgroundColor: '#6190E8'
                  }
                },
                {
                  text: '详情',
                  val:'detail',
                  style: {
                    backgroundColor: '#FF4949'
                  }
                }
              ]
            }
            if(new Date(item.date)-new Date()>-24*60*60*1000&&new Date(item.date)-new Date()<=0){
              today.push(i)
            }
            else if (new Date(item.date)-new Date()<0){
              expired.push(i)
            }
            else if (new Date(item.date)-new Date()>0&&new Date(item.date)-new Date()<24*60*60*1000){
              tomorrow.push(i)
            }
            else{
              future.push(i)
            }

          })
          var arr = [];
          arr.push({title:'今日',items:today});
          arr.push({title:'明日',items:tomorrow});
          arr.push({title:'过期',items:expired});
          arr.push({title:'未来',items:future});

          me.setState({
            undoneLst:arr
          })
        }
      },
      fail:function(){
        me.setState({isLoading:false})
      }
    })
  }

  changeSessionTag(e) {
    this.setState({session:e.name});
  }

  onDateChange(e) {
    this.setState({
      dateSel: e.detail.value
    })
  }

  clearSearch() {
    this.setState({
      searchValue:'',
      searchBtn:'扫一扫'
    })
  }

  changeSearchValue(val){
    if(val){
      this.setState({
        searchValue:val,
        searchBtn:'搜索'
      })
    }

  }

  getSessionLst(date){
    this.setState({
      isLoading:true
    })
    const me = this;
    if(typeof date=='string'){
      date = new Date(date);
    }
    wx.cloud.callFunction({
      name:'getOrderInfo',
      data:{
        $url:'getSessionStatus',
        currentMonth:date,
        shopId:me.state.shopId
      },
      success:function(res){
        if(res.errMsg.indexOf('ok')!=-1){
          //返回数据，开始标记
          const arr = res.result;
          me.setState({
            rawLst:arr
          })
          var dic = {}
          arr.map(function(i){
            let date = Util.Date.toShortDate(i.date,'/');
            switch (i.session) {
              case 'all':
                dic[date]=3
                break;
              case 'day':
                dic[date]=dic[date]?dic[date]+1:1;
                break;
              case 'night':
                dic[date]=dic[date]?dic[date]+2:2;
                break;
              default:
            }
          })
          var marks=[]
          for(var i in dic){
            marks.push({value:i,len:dic[i]})
          }
          console.log(marks)
          me.setState({marks:marks,isLoading:false})
        }
      },
      fail:function(){
        me.setState({isLoading:false})
      }
    })
  }

  scanQRcode(){
    const me = this;
    if(this.state.searchValue==''){
      wx.scanCode({
        success (res) {
          if(res.errMsg.indexOf('ok')!=-1){
            me.setState({
              searchValue:res.result,
              searchBtn:'搜索'
            })
          }
        }
      })
    }else{
      console.log('search')
    }
  }

  selectDate(val){
    var current = new Date(val.value);

    var arr = this.state.rawLst.filter((i)=>{
      if(Util.Date.toShortDate(current,'/')==Util.Date.toShortDate(new Date(i.date),'/')){
        return i;
      }
    });
    this.setState({currentDate:current,stateLst:arr});
  }
  //订单右划按钮点击事件
  orderActions (item,action){
    if(action.val=='makePhoneCall'){
      //选中为电话按钮
      if(item.phone){
        Taro.makePhoneCall({
          phoneNumber: item.phone,
          fail:function(){
            Taro.atMessage({
              message: '拨号失败',
              type: 'error',
            })
          }
        })
      }
      else{
        Taro.atMessage({
          message: '用户未预留电话号码',
          type: 'error',
        })
      }
    }
    else if(action.val=='detail'){
      //选中为详情

    }
  }

  actionSheet(val){
    if(val){
      this.setState({
        longTapDate:new Date(val.value),
        actionOpened:true
      })
      return;
    }
    this.setState({actionOpened:false})
  }

  sessionOccupy(){
    this.setState({
      occupyLayerOpened:true,
      actionOpened:false
    })
  }

  handleLayerClose(){
    this.setState({
      occupyLayerOpened:false
    })
  }

  render () {
    var me = this;
    var session={
      all:'全天场',
      day:'白天场',
      night:'通宵场',
    };
    const list = this.state.stateLst.map((item,index)=>{
      return (
        <AtSwipeAction
          key={index}
          options={[
            {text:'改期',style: {backgroundColor: '#2da0ff'}},
            {text:'退款',style: {backgroundColor: '#ff4c2d'}},
            {text:'详情',style: {backgroundColor: '#444'}},
          ]}
        >
          <AtListItem title={session[item.session]} />
        </AtSwipeAction>
      )
    })

    return (
      <View className='index'>
        <AtMessage />
        <AtTabs
          animated={false}
          current={this.state.current}
          swipeable={false}
          tabList={[
            { title: '有效订单' },
            { title: '场次信息' }
          ]}
          onClick={this.handleClick.bind(this)}
          >
          <AtTabsPane current={this.state.current} index={0} >
            <View>
            <AtSearchBar
              showActionButton
              actionName={this.state.searchBtn}
              value={this.state.searchValue}
              onChange={this.changeSearchValue.bind(this)}
              onActionClick={this.scanQRcode.bind(this)}
              onClear={this.clearSearch.bind(this)}
            />
              <View style='top: 50px;bottom: 0px;'>
                <AtIndexes list={this.state.undoneLst} handleActions={this.orderActions.bind(this)} >
                  <View>自定义内容</View>
                </AtIndexes>
              </View>
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View>
              <View className='notice'><Text className=''>红点代表当日不可预定，黄点代表当日不可预定白天场，蓝点代表当日不可预订通宵场</Text></View>
              <AtCalendar onDayLongClick={this.actionSheet.bind(this)} onDayClick = {this.selectDate.bind(this)} className='cal' onMonthChange={this.getSessionLst.bind(this)} marks={this.state.marks} />
              <AtList>
                {list}
              </AtList>
          </View>
          </AtTabsPane>
        </AtTabs>
        <AtToast hasMask={true} duration={0} isOpened={this.state.isLoading} text='加载中' status='loading'></AtToast>
        <AtActionSheet
          isOpened={this.state.actionOpened}
          onClose={this.actionSheet.bind(this)}

          cancelText='取消' title={Util.Date.toShortDate(this.state.longTapDate,'/')+' 临时占位锁定场次30分钟'}>
          <AtActionSheetItem onClick={ this.sessionOccupy.bind(this) }>
            临时占位
          </AtActionSheetItem>
          <AtActionSheetItem>
            预约
          </AtActionSheetItem>
        </AtActionSheet>
        <AtFloatLayout onClose={this.handleLayerClose.bind(this)} isOpened={this.state.occupyLayerOpened}>
          <View className='at-row'>
            <AtTag type='primary' className='at-col--auto tag' name='day' onClick={this.changeSessionTag.bind(this)}  active={this.state.session=='day'}>白天场</AtTag>
            <AtTag type='primary' className='at-col--auto tag' name='night' onClick={this.changeSessionTag.bind(this)}  active={this.state.session=='night'}>通宵场</AtTag>
            <AtTag type='primary' className='at-col--auto tag' name='all' onClick={this.changeSessionTag.bind(this)}  active={this.state.session=='all'}>全天场</AtTag>
          </View>
          <View  className='margin20'>
            <AtButton type='primary'>生成二维码付费订单</AtButton>
            <AtButton type='secondary'>生成已支付订单</AtButton>
          </View>
        </AtFloatLayout>
      </View>
    )
  }
}
