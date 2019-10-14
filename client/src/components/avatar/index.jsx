import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './index.scss'


export default class CAvatar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      context: {}
    }
  }


  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {

    const {
      size = 'normal',
      type = '',
      circle,
      full,
      loading,
      disabled,
      customStyle
    } = this.props


    return (
      <View className='border normal' style={customStyle}>
        <View className='inner'>

        </View>
      </View>
    )
  }
}

CAvatar.defaultProps = {
  size: 'normal',
  type: '',
  circle: false,
  full: false,
  loading: false,
  disabled: false,
  customStyle: {},
  onClick: () => {}
}

CAvatar.propTypes = {
  size: PropTypes.oneOf(['normal', 'small']),
  type: PropTypes.oneOf(['primary', 'secondary', '']),
  circle: PropTypes.bool,
  full: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
}
