import fetch from 'isomorphic-fetch';
import HamburgerMenu from './hamburgerMenu';
import BetsLogin from './betsLogin';
import session from './session-storage';
import React from "react";
import ApiEndPoints from './api-endpoints'
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import BalanceComponent from './balanceComponent';
import navMappings from './navMappings';
import '../polyfill';

const browserHistory = require('react-router').browserHistory;

require('./drfnav.css');

const SUBTITLE = ['Top Headlines', 'Track News', 'Betting', 'Replay Center', 'PP Credits', 'NFL', 'CFB', 'CBB', 'NBA'];
export default class MainNavigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      selectedMenu: {},
      selectedSubMenu: {},
      showHamburgerMenus: false,
      showLoginPop: false,
      isLoggedIn: false,
      isBetsApp: false,
      marketings: [],
      redirect: false,
      redirectUrl: '',
      extendUserDetails: false,
      balance: '',
      isLeftNavOpen: false, //used only for toggling leftNav
      showBetsLoginPop: false,
      betsLoginCallback: props.betsLoginCallback,
      customRegistrationUrl: undefined,
      ppCredits: 0,
      balance: '',
    }
    this.hostname = _.trim(window.location.href, "/");
    this.pathname = window.location.pathname;
    this.failedMenu = this.failedMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleLoginOutsideClick = this.handleLoginOutsideClick.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.openLeftNav = this.openLeftNav.bind(this);
    this.handleBetsLoginClick = this.handleBetsLoginClick.bind(this);
    this.getPPCredits = this.getPPCredits.bind(this);
    this.selectMenu = this.selectMenu.bind(this);
    this.subMenuNext = this.subMenuNext.bind(this);

    if (props.customBrowserRouter) {
      this.browserHistory = props.customBrowserRouter;
    } else {
      this.browserHistory = browserHistory;
    }
  }

  getBalance() {
    let sessionObj = session.getSession();
    const url = ApiEndPoints.BALANCE;
    let headers = { 'cache-control': 'no-cache', 'pragma': 'no-cache', 'Content-Type': 'application/json', 'x-auth-token': sessionObj && sessionObj.xpbUser && sessionObj.xpbUser.xAuthToken };
    var params = {
      method: 'GET',
      dataType: 'JSON',
      headers: headers
    };
    fetch(url, params)
      .then(response => response.json())
      .then((data) => {
        this.setState({ balance: data.AccountBalance })
      })
      .catch(err => {
        console.error('err')
      })
  }

  renderRedirect() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirectUrl} />
    }
  }

  refreshBalance() {
    if (session.isBetsUserAuthenticated()) {
      this.getBalance();
    }
  }

  refreshPPCredits() {
    if (session.isBetsUserAuthenticated()) {
      this.getPPCredits();
    }
  }

  handleClick() {
    this.setState({
      showHamburgerMenus: true,
    }, () => {
      document.body.classList.add('openPopUp');
    });
  }

  handleBetsLoginClick(betsLoginCallback) {
    if (!this.state.showBetsLoginPop) {
      // attach/remove event handler
      if (_.isFunction(betsLoginCallback)) {
        this.setState({ betsLoginCallback });
      }
      document.addEventListener('click', this.handleLoginOutsideClick, false);
    } else {
      // reset to the prop passed
      this.setState({ betsLoginCallback: this.props.betsLoginCallback });
      document.removeEventListener('click', this.handleLoginOutsideClick, false);
    }

    this.setState(prevState => ({
      showBetsLoginPop: !prevState.showBetsLoginPop,
    }));
  }

  handleLoginClick(customRegistrationUrl) {
    if (!this.state.showLoginPop) {
      // attach/remove event handler
      document.addEventListener('click', this.handleLoginOutsideClick, false);
      document.body.classList.add('openPopUp')
    } else {
      document.removeEventListener('click', this.handleLoginOutsideClick, false);
      document.body.classList.remove('openPopUp')
    }

    this.setState(prevState => ({
      showLoginPop: !prevState.showLoginPop,
      customRegistrationUrl: _.isString(customRegistrationUrl) ? customRegistrationUrl : undefined,
    }));
  }

  handleLoginOutsideClick(e) {
    // ignore clicks on the component itself
    if (this.loginNode && this.loginNode.contains(e.target)) {
      return;
    }
    if (e.target.classList.contains("drfNavMenuClose")) {
      this.setState({
        showLoginPop: false,
        showBetsLoginPop: false,
      }, () => {
        document.removeEventListener('click', this.handleLoginOutsideClick, false);
      });
    } else {
      if (this.state.showLoginPop) {
        this.handleLoginClick();
      } else if (this.state.showBetsLoginPop) {
        this.handleBetsLoginClick();
      }
    }
  }

  componentWillMount() {
    var url = ApiEndPoints.NAVIGATION_API;
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        this.buildMenu(data)
      })
      .catch(err => {
        this.failedMenu();
      })
    var marketinURL = ApiEndPoints.MARKETING_API;
    fetch(marketinURL)
      .then(response => response.json())
      .then((data) => {
        this.setState({ marketings: data })
      })
    const isBetsApp = _.includes(window.location.href, 'bets') || _.includes(window.location.href, 'funding');
    this.setState({ isBetsApp }, () => {
      let isLoggedIn = false;
      if (isBetsApp) {
        isLoggedIn = session.isBetsUserAuthenticated();
        if (isLoggedIn) {
          this.getPPCredits();
        }
      } else {
        isLoggedIn = session.getSession();
      }
      this.setState({ isLoggedIn });
    });

    const isLoggedIn = session.isBetsUserAuthenticated();
    if (isLoggedIn) {
      this.getBalance();
    }

  }

  getPPCredits() {
    let sessionObj = session.getSession();
    const url = ApiEndPoints.PPCREDITS;
    let headers = { 'cache-control': 'no-cache', 'pragma': 'no-cache', 'Content-Type': 'application/json', 'x-auth-token': sessionObj && sessionObj.xpbUser && sessionObj.xpbUser.xAuthToken };
    var params = {
      method: 'GET',
      dataType: 'JSON',
      headers: headers
    };
    fetch(url, params)
      .then(response => response.json())
      .then((data) => {
        if (data.status && data.status === 401) {
          this.setState({ ppCredits: 0 })
        } else {
          this.setState({ ppCredits: data })
        }
      })
      .catch(err => {
        this.setState({ ppCredits: 0 })
        console.error('err in fetching pp credits')
      })
  }

  buildMenu(menus) {
    const pathName = navMappings.pathnames.find(nav =>
      _.includes(window.location.pathname, nav));
    let selectedMenu = menus.find(menu => (_.includes(menu.topLink, window.location.host) && pathName)) || {};
    selectedMenu.subLinks = selectedMenu.subLinks || [];
    let selectedSubMenu = {};
    if (_.includes(ApiEndPoints.ENTRIES, window.location.href)) {
      selectedMenu = menus.find(menu => (menu.topTitle === 'Entries'));
    } else if (ApiEndPoints.RESULTS === window.location.href) {
      selectedMenu = menus.find(menu => (menu.topTitle === 'Results & Replays'));
    }
    if (ApiEndPoints.HOME_PAGE === this.hostname) {
      selectedMenu = {};
    } else {
      if (this.hostname === ApiEndPoints.SUPER_BETS_APP) {
        selectedSubMenu = selectedMenu.subLinks[0];
      } else {
        selectedMenu.subLinks
        selectedSubMenu = selectedMenu.subLinks.find(sub => {
          if (_.trim(new URL(sub.subLink).pathname, "/") == "") {
            return false;
          }
          return _.includes(_.trim(window.location.pathname, "/"), _.trim(new URL(sub.subLink).pathname, "/"))
        });
      }
    }
    this.setState({ menus, selectedMenu, selectedSubMenu }, () => {
      if (_.isEmpty(this.state.selectedMenu.subLinks)) {
        document.body.classList.remove('subMenuPresent');
      } else {
        document.body.classList.add('subMenuPresent');
      }
    });
  }

  failedMenu(data) {

  }

  onMenuClick(selectedMenu) {
    let suburl = new URL(selectedMenu.topLink);
    if(suburl.hostname !== window.location.hostname){
      window.location.href = selectedMenu.topLink;
    } else{
      let selectedSubMenu = selectedMenu.subLinks.find((sub) => (sub.subLink == (selectedMenu.topLink)))
      // sstf-start
      if (session.getSession() && selectedMenu.topTitle == "News & Info") {
        suburl.pathname = '/track-news';
        selectedSubMenu = selectedMenu.subLinks.find((sub) => (_.includes(sub.subLink, suburl.pathname)))
      }
      // sstf-end
      this.setState({ selectedMenu, selectedSubMenu }, () => {
        if (this.browserHistory) {
          this.browserHistory.push(suburl.pathname);
        } else {
          location.pathname = suburl.pathname;
        }
        !_.isEmpty(this.state.selectedMenu.subLinks) && document.querySelector('body').classList.remove('noSubMenu');
      });
    }
  }

  subMenuNext(selectedSubMenu) {
    const subTitle = selectedSubMenu.subTitle;
    const target = !_.isUndefined(selectedSubMenu.newTab) && selectedSubMenu.newTab === 'N' ? '_self' : '_blank';
    const suburl = new URL(selectedSubMenu.subLink);
    if (!_.isUndefined(selectedSubMenu.newTab) && selectedSubMenu.newTab === 'Y') {
      window.open(suburl.href, target);
      return;
    }
    if (!_.includes(window.location.hostname, suburl.hostname)) {
      window.open(suburl.href, target);
      return;
    }
    this.setState({ selectedSubMenu });
    if (this.browserHistory) {
      this.browserHistory.push(suburl.pathname);
    } else if (_.includes(SUBTITLE, subTitle)) {
      location.pathname = suburl.pathname;
    } else {
      window.location.href = suburl.href;
    }
  }

  onSubMenuClick(selectedSubMenu) {
    if (this.props.subMenuClickCallback) {
      this.props.subMenuClickCallback(this.state.selectedMenu, selectedSubMenu, this.subMenuNext);
    } else {
      this.subMenuNext(selectedSubMenu);
    }
  }

  onMenuClose() {
    document.body.classList.remove('openPopUp');
    this.setState({ showHamburgerMenus: false });
  }

  toggleHamburgerMenu() {
    this.setState(prevState => ({
      showHamburgerMenus: !prevState.showHamburgerMenus,
    }));
    !this.state.showHamburgerMenus ? document.body.classList.add('openPopUp') : document.body.classList.remove('openPopUp');
  }

  onLoginClick() {
    this.setState({ showLoginPop: true });
  }

  onLoginPopClose() {
    this.setState({
      showLoginPop: false,
      showBetsLoginPop: false,
    });
    document.body.classList.remove('openPopUp');
  }

  onBetsLoginSuccess() {
    this.setState({ isLoggedIn: true, showLoginPop: false }, () => {
      document.removeEventListener('click', this.handleLoginOutsideClick, false);
      this.getPPCredits();
      this.getBalance();
    });
    if (this.state.betsLoginCallback) {
      this.state.betsLoginCallback();
    }
  }

  onLoggedOut() {
    session.deleteSession();
    this.setState({ isLoggedIn: false }, () => {
      if (window.location.href.includes('pp-details')) {
        window.location.href = ApiEndPoints.HOME_PAGE;
        return;
      }
      window.location.reload();
    });
  }

  getBetsMenus() {
    let sessionObj = session.getSession();
    let emailId = sessionObj.email;
    let accountId = sessionObj.accountId;
    return (<li className="drfNavBetsProfileMenu">
      <ul>
        <li className="drfNavAccountInfo">
          <a href="javascript: void(0);">
            <span>{emailId}</span>
            <span>Accout #: {accountId} </span>
          </a>
        </li>
        <li>
          <a href={ApiEndPoints.DEPOSIT}>
            Deposit
              </a>
        </li>
        <li>
          <a href='/myWagers'>
            My Wagers
              </a>
        </li>
        <li>
          <a href={ApiEndPoints.WITHDRAW}>
            Withdraw
              </a>
        </li>
        <li>
          <a href={ApiEndPoints.TICKET_MAKER} target='_blank'>
            DRF TicketMaker
              </a>
        </li>
      </ul>
    </li>
    )
  }

  showDetails() {
    this.setState({ extendUserDetails: !this.state.extendUserDetails })
  }

  renderBetsPopup() {
    return (
      <div className="drfNavLoginRegWrap">
        <div ref={node => { this.loginNode = node; }} className="drfNavLoginRegCnt"  >
          <i className="drfNavMenuClose" onClick={this.onLoginPopClose.bind(this)} />
          <div className="drfNavRegWrap pull-left">
            <h4>New to DRF.com?</h4>
            <p>DRF.com presents a fully integrated handicapping and wagering experience, the only site of its kind in horse racing.</p>
            <ul>
              {
                this.state.marketings.map((market, index) => (
                  <li key={index} >{market.itemLine}</li>
                ))
              }
            </ul>
            <a href={ApiEndPoints.REGISTER} className="btn drfNavHeaderBtn">Register</a>
          </div>
          <BetsLogin betsLoginUrl={ApiEndPoints.BETS_LOGIN} onLoginSuccess={this.onBetsLoginSuccess.bind(this)} />
        </div>
      </div>
    );
  }

  renderDRFLoginPopup() {
    return (
      <div className="drfNavLoginRegWrap">
        <div ref={node => { this.loginNode = node; }} className="drfNavLoginRegCnt"  >
          <i className="drfNavMenuClose" onClick={this.onLoginPopClose.bind(this)} />
          <div className="drfNavRegWrap pull-left">
            <h4>New to DRF?</h4>
            <p>Everything you could possibly need in one place</p>
            <ul>
              {
                this.state.marketings.map((market, index) => (
                  <li key={index} >{market.itemLine}</li>
                ))
              }
            </ul>
            <a href={ApiEndPoints.REGISTER} className="btn drfNavHeaderBtn">Register</a>
          </div>
          <div className="drfNavLoginWrap pull-left drfNavGeneralLogin">
            <iframe width="100%" height="400px" frameBorder="0" src={!this.state.customRegistrationUrl ? this.props.drfLoginUrl : this.state.customRegistrationUrl}></iframe>
            {
              this.props.customRegistrationOptions && (
                <p className="drfNavRegLink">
                  Don't have an account?{" "}
                  <a onClick={this.props.customRegistrationOptions.callback}>Register Here</a>
                </p>
              )
            }
          </div>
        </div>
      </div>
    );
  }

  renderPopups() {
    if (this.state.showBetsLoginPop) {
      return this.renderBetsPopup();
    } else if (this.state.showLoginPop) {
      return this.renderDRFLoginPopup();
    }
  }

  selectMenu(selectedMenu, selectedSubMenu) {
    this.setState({ selectedMenu, selectedSubMenu });
  }

  openLeftNav() {
    this.props.onLeftNavToggle(!this.state.isLeftNavOpen);
    if (!this.state.isLeftNavOpen) {
      window.mainLeftNavBar.addClass();
      $('body').addClass('drf-nav-leftNavOpened');
    } else {
      window.mainLeftNavBar.removeClass();
      $('body').removeClass('drf-nav-leftNavOpened');
    }
    this.setState({
      isLeftNavOpen: !this.state.isLeftNavOpen
    })
  }

  renderLeftNavTogglers() {
    return (!this.state.isLeftNavOpen) ? <i onClick={this.openLeftNav.bind(this)} className="drfNavleftSectionIcon" /> : <a onClick={this.openLeftNav.bind(this)} className="leftNavClose"></a>;
  }

  render() {
    const selectedSubMenu = this.state.selectedSubMenu || {};
    const selectedMenu = this.state.selectedMenu || {};
    selectedMenu.subLinks = selectedMenu.subLinks || [];
    const menus = _.assign([], this.state.menus);

    const isPopupVisible = this.state.showLoginPop || this.state.showBetsLoginPop;
    return (
      <div>
        <div className={(this.state.showHamburgerMenus || isPopupVisible) ?
          'drfNavMenuOpen drfNavigationWrap' : 'drfNavigationWrap'}>
          {this.renderRedirect()}
          {(this.state.showHamburgerMenus || isPopupVisible) &&
            <div className="drfNavOverlay"></div>
          }
          <div className={(isPopupVisible) ? 'drfNavPrimaryNavWrap drfNavLoginPopupOpen' : 'drfNavPrimaryNavWrap'}>
            <div className="drfNavHamburgerWrap drfNavMobile" onClick={this.toggleHamburgerMenu.bind(this)}>
              <span className={(this.state.showHamburgerMenus) ? 'drfNavMenuClose' : 'drfNavHamburger'}></span>
            </div>
            {this.props.hasLeftNavInHeader && this.renderLeftNavTogglers()}
            <h1>
              <a href={ApiEndPoints.HOME_PAGE} className="drfNavDesktop">
                <img src="https://ik.imagekit.io/h1gntnbx4/drf-logo_rJUQm14yN_SklR7c4WeV.svg" alt=" DRF Logo" />
              </a>
              <a href={ApiEndPoints.HOME_PAGE} className="drfNavMobile">
                <img src="https://ik.imagekit.io/h1gntnbx4/drf-logo-mobile_BJ3mXkV1N_S1WRX5NZeE.svg" alt=" DRF Logo" />
              </a>
            </h1>
            <ul className="drfNavMainNavigation">
              {
                menus.map((menu, index) => (
                  menu.topLevel < 99 &&
                  <li key={index}
                    className={(selectedMenu.topLink == menu.topLink) ? 'active' : ''}
                  >
                    <a
                      onClick={() => { this.onMenuClick(menu) }}>
                      {menu.topTitle}
                    </a>
                  </li>
                ))
              }
            </ul>

            <div className={(this.state.isLoggedIn ? 'drfNavRightSection drfNavLoggedIn' : 'drfNavRightSection')}>

              <div className="drfNavHamburgerWrap drfNavDesktop" onClick={this.handleClick.bind(this)}>
                <span className="drfNavHamburger"></span>
              </div>
              <span className="divider"></span>
              {
                (this.props.showBalanceInHeader && this.state.isLoggedIn && session.isBetsUserAuthenticated()) &&
                (<BalanceComponent
                  balance={this.state.balance}
                  ref={(node) => { this.betsBalanceNode = node }}
                  getBalance={this.getBalance.bind(this)}

                />)
              }
              {
                !this.state.isLoggedIn ?
                  <div className="drfNavRightCnt">
                    <a
                      href="javascript: void(0);"
                      className="btn drfNavHeaderBtn drfNavMobile"
                      onClick={() => {
                        if (this.state.isBetsApp) {
                          this.handleBetsLoginClick();
                        } else {
                          this.handleLoginClick();
                        }
                      }}
                    >
                      Log in / Register
                    </a>
                    {
                      this.state.isBetsApp ?
                        <a href="javascript: void(0);" className="btn drfNavHeaderBtn drfNavDesktop"
                          onClick={this.handleBetsLoginClick}>Log in to DRF BETS / Register </a>
                        : <a href="javascript: void(0);" className="btn drfNavHeaderBtn drfNavDesktop"
                          onClick={this.handleLoginClick}>Log in / Register</a>
                    }
                  </div> :
                  (
                    <div className="drfNavUserProfileWrap">
                      <div className={(this.state.extendUserDetails ? "drfNavUserInitial active" : "drfNavUserInitial")} onClick={this.showDetails.bind(this)}>
                        {this.renderUsernameInitials()}
                        <div>
                          <i />
                        </div>
                      </div>
                      {this.state.extendUserDetails && <ul className="drfNavUserProfileList">
                      {(this.state.isBetsApp || this.props.showBalanceInProfileSection) &&
                          <li>
                            <BalanceComponent
                              balance={this.state.balance}
                              balanceApiUrl={this.props.balanceApiUrl}
                              menuType
                              getBalance={this.getBalance.bind(this)}
                            />
                          </li>
                        }
                        {
                          this.state.isBetsApp &&
                          this.getBetsMenus()
                        }
                        <li>
                          <a href={ApiEndPoints.MEMBER_CENTER}>
                            Member Center
                        </a>
                        </li>
                        <li>
                          <a href={ApiEndPoints.ACCOUNT_SETTINGS}>
                            Account Settings
                          </a>
                        </li>
                        <li>
                          <a href="javascript: void(0);" onClick={this.onLoggedOut.bind(this)}>
                            Logout
                          </a>
                        </li>
                      </ul>}
                    </div>
                  )
              }
            </div>
          </div>
          <div className="drfNavSecondaryNavWrap">
            {
              selectedMenu.topTitle &&
              <h2 className="drfNavSubHeader" style={{ color: selectedMenu.topColor }}>
                {selectedMenu.topTitle}
              </h2>
            }
            {
              selectedMenu.subLinks.length ?
                <div className="drfNavSecondaryNav" style={{ background: selectedMenu.topColor }}>
                  <div className="drfNavSecondaryNavCnt">
                    <div>
                      <i></i>
                    </div>
                    <ul>
                      {
                        selectedMenu.subLinks.map((sub, index) => (
                          <li
                            key={index}
                            className={selectedSubMenu.subLink == sub.subLink ? 'active' : ''}>
                            <a href="javascript:void(0)"
                              onClick={() => { this.onSubMenuClick(sub) }}>
                              {sub.subTitle}
                              {this.state.isLoggedIn ? _.toLower(sub.subTitle) === 'pp credits' && ` (${this.state.ppCredits})` : ''}
                            </a>
                          </li>
                        ))
                      }
                    </ul >
                    <div>
                      <i></i>
                    </div>
                  </div>
                </div>
                :
                null
            }
          </div>
        </div>
        <div className="popUps">
          {
            this.state.showHamburgerMenus &&
            <div ref={node => { this.node = node; }} className="drfNavHamburgerMenuWrap">
              <HamburgerMenu router={this.browserHistory} subMenuClickCallback={this.props.subMenuClickCallback} selectedMenu={this.state.selectedMenu} selectMenu={(selectedMenu, selectedSubMenu) => { this.selectMenu(selectedMenu, selectedSubMenu) }} menus={menus} onClose={(event) => { this.onMenuClose(event) }}></HamburgerMenu>
            </div>
          }
          {
            this.renderPopups()
          }
        </div>
      </div>
    );
  }

  renderUsernameInitials() {
    const obj = session.getSession();
    if (!obj) {
      return;
    }
    if (this.props.showBetsUserProfile && session.isBetsUserAuthenticated()) {
      const name = (obj.xpbUser && obj.xpbUser.givenName && obj.xpbUser.sn) ? `${_.first(obj.xpbUser.givenName)}${_.first(obj.xpbUser.sn)}` : '';
      return <span>{name.toUpperCase()}</span>;
    } else {
      const name = (obj.firstName && obj.lastName) ? `${_.first(obj.firstName)}${_.first(obj.lastName)}` : '';
      return <span>{name.toUpperCase()}</span>;
    }
  }
}

MainNavigation.propTypes = {
  betsLoginCallback: PropTypes.func, // if you need a callback, pass it as prop OR do it the ref's way
  hasLeftNavInHeader: PropTypes.bool, // clock/cross icons will be shown only if this is true
  showBalanceInHeader: PropTypes.bool, // use this to hide or show balance in header
  showBetsUserProfile: PropTypes.bool, // use this to display only bets initials/data
  showBalanceInProfileSection: PropTypes.bool, // use this to hide or show balance in profile section menu
  onLeftNavToggle: PropTypes.func,
  drfLoginUrl: PropTypes.string,
  betsLoginUrl: PropTypes.string,
  // we might need more options later on
  customRegistrationOptions: PropTypes.shape({
    callback: PropTypes.func.isRequired,
  }),
  subMenuClickCallback: PropTypes.func, // parameters passed to the function -> selectedMainMenu, selectedSubMenu, next(selectedSubMenu)
  customBrowserRouter: PropTypes.shape({}),
};

MainNavigation.defaultProps = {
  betsLoginCallback: undefined,
  hasLeftNavInHeader: true,
  showBalanceInHeader: false,
  showBetsUserProfile: false,
  onLeftNavToggle: () => { },
  drfLoginUrl: ApiEndPoints.REGISTRATION_IFRAME_API,
  betsLoginUrl: ApiEndPoints.BETS_LOGIN,
  customRegistrationOptions: undefined,
  subMenuClickCallback: undefined,
  customBrowserRouter: undefined,
};
