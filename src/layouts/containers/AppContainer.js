import { connect } from 'react-redux'

import { getMe, logout, signed, updateCode, zhimaLogin } from 'reducers/user'
import App from '../components/App'

const mapActionCreators = {
  getMe,
  logout,
  signed,
  updateCode,
  zhimaLogin
}

const mapStateToProps = (state) => ({
  user: state.user,
  common: state.common
})

export default connect(mapStateToProps, mapActionCreators)(App)
