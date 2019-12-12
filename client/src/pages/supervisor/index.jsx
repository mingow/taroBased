import Taro, { Component } from '@tarojs/taro'
import { View, Text,Picker } from '@tarojs/components'
import './index.scss'
import Util from '../../utils/utils'

import { AtButton,AtIcon,AtTabs,AtTabsPane,AtToast,AtModal,AtForm,AtSearchBar,AtCalendar } from 'taro-ui'

import CloudImage from '../../components/imageFromCloud/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '我的订单',
    navigationBarBackgroundColor: '#2CD18A',
    navigationBarTextStyle: 'white',
    backgroundColor:'#2CD18A',
    backgroundColorTop:'#2CD18A',
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
      shopId:'a9f7ef91-0fd7-4928-beef-ac19dd8742bd'
    }
  }

  componentWillMount () {
    var currentDate = new Date();
    this.setState({
      dateSel:Util.Date.toString(currentDate)
    })
  }

  componentDidMount () {

  }

  componentWillUnmount () {
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
          console.log(arr);
          var dic = {}
          arr.map(function(i){
            let date = Util.Date.toString(i.date,'/');
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

  render () {
    var me = this;

    return (
      <View className='index'>
      <AtTabs
        animated={false}
        current={this.state.current}
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
          </View>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1}>
          <View>
            <View className='notice'><Text className=''>红点代表当日不可预定，黄点代表当日不可预定白天场，蓝点代表当日不可预订通宵场</Text></View>
            <AtCalendar className='cal' onMonthChange={this.getSessionLst.bind(this)} marks={this.state.marks} />
          </View>
        </AtTabsPane>
      </AtTabs>
      <AtToast hasMask={true} duration={0} isOpened={this.state.isLoading} text='加载中' status='loading'></AtToast>

      </View>
    )
  }
}
