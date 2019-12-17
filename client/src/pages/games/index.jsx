import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtBadge,AtCard } from 'taro-ui'

import CContent from '../../components/contents/index'


export default class Index extends Component {

  config = {
    navigationBarTitleText: '轰趴游戏',
    backgroundColorTop:'#fff',
    backgroundColorBottom:'#fff',
  }

  constructor (props) {
    super(props);
    this.state = {
      list:[]
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <View className='title'><Text className='primary'>精彩游戏</Text><Text className='second'>精彩活动，嗨翻全场</Text></View>
        <CContent title="喝酒游戏" second="指尖光圈&左轮手枪&快闪模式" cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/photos/games/table.jpg' miniProgram='wx3bc2967f275c82b0'>

        </CContent>
        <CContent title="狼人杀面杀助手" second="天黑请闭眼" cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/photos/games/wolf.jpg' miniProgram='wxf9d3fcee6eda88de'>

        </CContent>
      </View>
    )
  }
}
