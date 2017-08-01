import { connect } from 'react-redux'

import { getMe, logout, signed, updateCode } from 'reducers/user'
import Dis from '../components/Dis'

const mapActionCreators = {
  getMe,
  logout,
  signed,
  updateCode
}

const mapStateToProps = (state) => ({
  user: state.user,
  common: state.common
})

export default connect(mapStateToProps, mapActionCreators)(Dis)
