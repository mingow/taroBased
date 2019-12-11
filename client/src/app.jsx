import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'
import './custom-var.scss'
import './custom.scss'
import './assets/font/iconfont.css'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/member/index',
      'pages/booking/index',
      'pages/webview/index',
      'pages/item/index',
      'pages/orderLst/index',
      'pages/order/index',
      'pages/supervisor/index',
      'pages/preOrder/index'
    ],
    tabBar: {
      // custom: true,
      color: '#7A7E83',
      selectedColor: '#2CD18A',
      borderStyle: 'black',
      backgroundColor: '#f5f5f6',
      list: [
        {
          pagePath: 'pages/index/index',
          iconPath: "assets/images/shop.png",
          selectedIconPath: "assets/images/shop-fill.png",
          text: "首页"
        },
        {
          pagePath: "pages/booking/index",
          iconPath: "assets/images/carry out.png",
          selectedIconPath: "assets/images/carry out-fill.png",
          text: "订场"
        },
        {
          pagePath: "pages/index/index",
          iconPath: "assets/images/game.png",
          selectedIconPath: "assets/images/game-fill.png",
          text: "游戏"
        },
        {
          pagePath: "pages/member/index",
          iconPath: "assets/images/user.png",
          selectedIconPath: "assets/images/user-fill.png",
          text: "会员"
        }
      ]
    },
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#f9faf9',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
