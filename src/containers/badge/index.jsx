var _ = require('underscore');
import React from 'react'
import styles from './styles.css'
import {colors} from '../../styles/colors'

class Badge extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const {value, label} = this.props.data

    var badgeStyle = {
      background: colors.fiestared,
      border: '0.2rem solid ' + colors.fiestaredBorder
    }

    if (_.isUndefined(value)) {
      return (
        <span className={styles.badge} style={badgeStyle}>0</span>
      )
    }

    badgeStyle = {
      background: colors.green,
      border: '0.2rem solid ' + colors.greenBorder
    }

    if (value <= 8) {
      badgeStyle = {
        background: colors.tacxblueMuted,
        border: '0.2rem solid ' + colors.tacxblueBorder
      }
    }

    if (value <= 6) {
      badgeStyle = {
        background: colors.yellow,
        border: '0.2rem solid ' + colors.yellowBorder
      }
    }

    if (value <= 5) {
      badgeStyle = {
        background: colors.salmonpink,
        border: '0.2rem solid ' + colors.salmonpinkBorder
      }
    }

    if (value <= 3) {
      badgeStyle = {
        background: colors.fiestared,
        border: '0.2rem solid ' + colors.fiestaredBorder
      }
    }

    return (
      <span className={styles.badge} style={badgeStyle}>{label}</span>
    )

  }
}

export default Badge
