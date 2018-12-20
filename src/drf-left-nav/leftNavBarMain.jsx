
require('./leftSidebarFixed.css');
import React from 'react';
import fetch from 'isomorphic-fetch';
import AppConstant from './appConstants';
import Wagering from './wagerring/Wagering';
import Handicapping from './handicapping/Handicapping';
import sessionProvider from './config/sessionProvider';
import Settings from './config/leftnav-app-settings';
import { saveCookieTrackId } from './utility';
import EventConstant from './config/eventTrackingConstants';
import CommonMethods from './config/common-methods';
import PropTypes from 'prop-types';

const { DEAD_LINK } = AppConstant;
const { WAGERING_TAB, HANDICAPPING_TAB } = AppConstant.DRF_LEFT_NAV;
let USER_PREFERENCES_BASIC_AUTH = 'Basic dXNlci1wcmVmZXJlbmNlLWFwaTpUM243aEY4VHhFWjh6RkVa';
export default class LeftNavBarMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthUser: sessionProvider.isUserAuthenticated(),
      activeTab: WAGERING_TAB,
      favoriteTracks: [],
      recentTracks: [],
      showLoginPop: false,
      showLeftNav: false,
    };
    this._tabClicked = this._tabClicked.bind(this);
    this.makeFavOrUnFav = this.makeFavOrUnFav.bind(this);
    this.fetchFavoriteRecent = this.fetchFavoriteRecent.bind(this);
  }

  _tabClicked(tabName) {
    const gtmEvent = {
      action: tabName === WAGERING_TAB ? EventConstant.TRACKING_EVENT.CLICK_WAGERING_TAB : EventConstant.TRACKING_EVENT.CLICK_HANDICAPPING_TAB,
      actionValue: {},
    };
    CommonMethods.setGTMDataLayer(gtmEvent);
    this.setState({
      activeTab: tabName,
    });
  }

  componentWillReceiveProps(props) {
    if (sessionProvider.getSessionVal()) {
      this.setState({
        isAuthUser: true,
      }, () => { });
    } else {
      this.setState({
        isAuthUser: false,
      }, () => { });
    }
  }

  fetchFavoriteRecent() {
    let { isAuthUser } = this.state;
    if (isAuthUser) {
      let authUser = sessionProvider.getSessionVal();
      var headers = { 'cache-control': 'no-cache', 'pragma': 'no-cache', 'Content-Type': 'application/json', 'Authorization': USER_PREFERENCES_BASIC_AUTH };
      var params = {
        method: 'GET',
        dataType: 'JSON',
        headers: headers
      };
      var url = `${Settings.API_END_POINT_URL.USER_PREFERENCES}/user/${authUser.userId}/tracks/favorite-recent/15`;
      fetch(url, params)
        .then(response => response.json())
        .then((data) => {
          this.setState({
            recentTracks: data.recentTrackDTOS,
            favoriteTracks: data.favoriteTrackDTOS
          })
        })
        .catch((error) => {
          console.error('Error In Fetching favorice recent API')
        })
    } else {
      if (!_.isEmpty(this.state.recentTracks)) {
        this.setState({
          recentTracks: []
        })
      } if (!_.isEmpty(this.state.favoriteTracks)) {
        this.setState({
          favoriteTracks: []
        })
      }
    }
  }

  makeFavOrUnFav(trackId) {
    let { isAuthUser } = this.state;
    let authUser = sessionProvider.getSessionVal();
    if (isAuthUser && authUser) {
      var headers = { 'cache-control': 'no-cache', 'pragma': 'no-cache', 'Content-Type': 'application/json', 'Authorization': USER_PREFERENCES_BASIC_AUTH };
      var params = {
        method: 'PUT',
        dataType: 'JSON',
        headers: headers
      };
      var url = `${Settings.API_END_POINT_URL.USER_PREFERENCES}/user/${authUser.userId}/tracks/favorite/${trackId}`;
      fetch(url, params)
        .then(response => response.json())
        .then((favoriteTracks) => {
          this.fetchFavoriteRecent();
          this.props.setFavoriteCallback(trackId);
        })
        .catch((error) => {
          console.error('Error Make Favorite Track ID')
        })
    } else {
      if (window.mainNavigation) {
        const isBetsApp = _.includes(window.location.href, 'bets') || _.includes(window.location.href, 'funding');
        if (isBetsApp) {
          window.mainNavigation.handleBetsLoginClick();
        } else {
          window.mainNavigation.handleLoginClick();
        }
      }
      saveCookieTrackId(trackId);
    }
  }

  addClass() {
    this.setState({ showLeftNav: true });
  }

  removeClass() {
    this.setState({ showLeftNav: false });
  }

  render() {
    let leftNavClasses = 'wagerAndHandicappingWrapper';
    if (this.props.isOpen) {
      leftNavClasses = `${leftNavClasses} ${this.props.extraClasses}`;
    }
    if (this.state.showLeftNav) {
      leftNavClasses += `${leftNavClasses} showLeftNav`;
    }
    return (
      <div className={leftNavClasses}>
        <div className="leftNavFixed">
          <ul className="d-flex wageringAndInfoTabs">
            <li
              data-event-type={EventConstant.TRACKING_EVENT.CLICK_WAGERING_TAB}
              data-application-name={AppConstant.APPLICATION_NAME}
              data-source={EventConstant.DATA_SOURCE.LEFT_RAIL}
              className="pixelTracker"
            >
              <a
                href={DEAD_LINK}
                className={`d-block ${this.state.activeTab === WAGERING_TAB ? 'active' : ''}`}
                onClick={() => this._tabClicked(WAGERING_TAB)}
              >
                Wagering
              </a>
            </li>
            <li
              data-event-type={EventConstant.TRACKING_EVENT.CLICK_HANDICAPPING_TAB}
              data-application-name={AppConstant.APPLICATION_NAME}
              data-source={EventConstant.DATA_SOURCE.LEFT_RAIL}
              className="pixelTracker"
            >
              <a
                href={DEAD_LINK}
                className={`d-block ${this.state.activeTab === HANDICAPPING_TAB ? 'active' : ''}`}
                onClick={() => this._tabClicked(HANDICAPPING_TAB)}
              >
                Handicapping
              </a>
            </li>
          </ul>
          <div
            className="leftNavWageringContainer"
            id="LeftNavWageringContainer"
          >
            {this.state.activeTab === WAGERING_TAB ?
              <Wagering
                recentTracks={this.state.recentTracks}
                favoriteTracks={this.state.favoriteTracks}
                makeFavOrUnFav={this.makeFavOrUnFav.bind(this)}
                fetchFavoriteRecent={this.fetchFavoriteRecent.bind(this)}
                isAuthUser={this.state.isAuthUser}
              />
              :
              <Handicapping
                recentTracks={this.state.recentTracks}
                favoriteTracks={this.state.favoriteTracks}
                makeFavOrUnFav={this.makeFavOrUnFav.bind(this)}
                fetchFavoriteRecent={this.fetchFavoriteRecent.bind(this)}
                isAuthUser={this.state.isAuthUser}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

LeftNavBarMain.propTypes = {
  isOpen: PropTypes.bool,
  extraClasses: PropTypes.string,
  setFavoriteCallback: PropTypes.func.isRequired,
};

LeftNavBarMain.defaultProps = {
  isOpen: true,
  extraClasses: '',
};
