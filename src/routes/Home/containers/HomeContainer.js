import { connect } from 'react-redux'

import { changeRegion, fetchEntrance, fetchRecommondedOffersIfNeeded, fetchConfigureData } from '../modules/home'
import { fetchDestinations, searchDestinations } from 'reducers/destination'
import { offerChangeLike } from 'reducers/offerLike'
import { setTitle } from 'reducers/common'
import { getMe } from 'reducers/user'
import Home from '../components/Home'

const mapActionCreators = {
  changeRegion,
  fetchEntrance,
  fetchRecommondedOffersIfNeeded,
  fetchDestinations,
  searchDestinations,
  offerChangeLike,
  setTitle,
  getMe,
  fetchConfigureData
}

const mapStateToProps = (state) => ({
  home: state.home,
  destination: state.destination,
  user: state.user,
  offerLike: state.offerLike,
  common: state.common
})

export default connect(mapStateToProps, mapActionCreators)(Home)
