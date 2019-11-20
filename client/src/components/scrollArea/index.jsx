import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"
import classNames from 'classnames'
import PropTypes from 'prop-types'
import _isFunction from 'lodash/isFunction'
import './index.scss'
import { AtButton } from 'taro-ui'

const SIZE_CLASS = {
  normal: 'normal',
  small: 'small',
}

const TYPE_CLASS = {
  primary: 'primary',
  secondary: 'secondary',
}

export default class CScrollArea extends Component {
  constructor (props) {
    super(props)
    this.state = {
      context: {},
      src:''
    }
  }

  handleClick = (...args) => {
    if (_isFunction(this.props.onClick)) {
      this.props.onClick(...args)
    }
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onClick () {
    if (!this.props.disabled) {
      this.props.onClick && this.props.onClick(...arguments)
    }
  }

  render() {
    const { title, note, extra, thumb, isFull, icon } = this.props

    var own = this;
    const rootClass = classNames(
      'grid',
      this.props.className
    )
    return (
      <View className='area' >
        <View className='content'>{this.props.children}</View>

      </View>
    )
  }
}

CScrollArea.defaultProps = {
  size: 'normal',
  title:'',
  type: '',
  circle: false,
  full: false,
  loading: false,
  cloudId:'',
  disabled: false,
  customStyle: {},
  onClick: () => {}
}

CScrollArea.propTypes = {
  title: PropTypes.string,
  cloudId: PropTypes.string,
  size: PropTypes.oneOf(['normal', 'small']),
  type: PropTypes.oneOf(['primary', 'secondary', '']),
  circle: PropTypes.bool,
  full: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
}
