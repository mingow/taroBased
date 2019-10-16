import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'
import PropTypes from 'prop-types'

export default class CWebview extends Component {

  constructor (props) {
    super(props);
    this.state = {
      src: ''
    }
  }

  error() {
    //导航返回
  }

  componentWillMount() {
    if(this.$router.params.src){
      this.setState({src:this.$router.params.src})
    }
    else{

    }
  }

  render () {
    return (
      <WebView src = {this.state.src} binderror = {this.error.bind(this)}></WebView>
    )
  }
}
