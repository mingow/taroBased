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
      'pages/webview/index'
    ],
    tabBar: {
      // custom: true,
      color: '#7A7E83',
      selectedColor: '#f66e62',
      borderStyle: 'black',
      backgroundColor: '#242a38',
      list: [
        {
          pagePath: 'pages/index/index',
          iconPath: "assets/images/shop.png",
          selectedIconPath: "assets/images/shop-fill.png",
          text: "首页"
        },
        {
          pagePath: "pages/index/index",
          iconPath: "assets/images/bell.png",
          selectedIconPath: "assets/images/bell-fill.png",
          text: "通知"
        },
        {
          pagePath: "pages/index/index",
          iconPath: "assets/images/message.png",
          selectedIconPath: "assets/images/message-fill.png",
          text: "留言"
        },
        {
          pagePath: "pages/index/index",
          iconPath: "assets/images/user.png",
          selectedIconPath: "assets/images/user-fill.png",
          text: "会员"
        }
      ]
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#242a38',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'white'
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
