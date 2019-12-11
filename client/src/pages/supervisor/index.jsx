import Taro, { Component } from '@tarojs/taro'
import { View, Text,Picker } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtTabs,AtTabsPane,AtToast,AtModal,AtForm,AtSearchBar  } from 'taro-ui'

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
      target:'',
      showModal:false,
    }
  }

  componentWillMount () {
    var currentDate = new Date();
    this.setState({
      dateSel:currentDate.getFullYear()+'-'+(currentDate.getMonth()+1)+'-'+(currentDate.getDate())
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
          <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
        </AtTabsPane>
      </AtTabs>
      <AtToast hasMask={true} duration={0} isOpened={this.state.isLoading} text='加载中' status='loading'></AtToast>

      </View>
    )
  }
}
