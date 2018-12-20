import React,{Component} from 'react';
import MainNavigation from '../src/drf-nav/mainNavigation';
import LeftNavBarMain from '../src/drf-left-nav/leftNavBarMain';
import PropTypes from 'prop-types';

export default class DRFNavigation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <MainNavigation
          // for showing login from anywhere
          // handleLoginClick you can pass a custom registration url as property to this function.
          // you can access handleLoginClick and handleBetsLoginClick using window.mainNavigation (To show respective props)
          ref={(mainNavigation) => { window.mainNavigation = mainNavigation }}
          betsLoginCallback={() => {this.props.betsLoginCallback.bind(this)}} // for testing.
          hasLeftNavInHeader={this.props.hasLeftNavInHeader}
          showBalanceInHeader={this.props.showBalanceInHeader}
          onLeftNavToggle={this.props.onLeftNavToggle.bind(this)}
          showBalanceInProfileSection={this.props.showBalanceInProfileSection}
          customRegistrationOptions={this.props.customRegistrationOptions}
          subMenuClickCallback= {this.props.subMenuClickCallback}
          customBrowserRouter={this.props.customBrowserRouter}
        />
        {
          this.props.hasLeftNav &&    
          <LeftNavBarMain
          // for showing login from anywhere
          // handleLoginClick you can pass a custom registration url as property to this function.
          // you can access handleLoginClick and handleBetsLoginClick using window.mainNavigation (To show respective props)
            ref={(mainLeftNavBar) => { window.mainLeftNavBar = mainLeftNavBar }}
            setFavoriteCallback={this.props.setFavoriteCallback.bind(this)}
          />         
        }
        </div>
    )
  }
}

DRFNavigation.propTypes = {
  isOpen: PropTypes.bool,
  extraClasses: PropTypes.string,
  setFavoriteCallback: PropTypes.func,
  betsLoginCallback: PropTypes.func, // if you need a callback, pass it as prop OR do it the ref's way
  hasLeftNav: PropTypes.bool, // clock/cross icons will be shown only if this is true
  showBalanceInHeader: PropTypes.bool, // use this to hide or show balance in header
  showBalanceInProfileSection: PropTypes.bool, // use this to hide or show balance in profile section menu
  showBetsUserProfile: PropTypes.bool, // use this to display only bets initials/data
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

DRFNavigation.defaultProps = {
  isOpen: true,
  extraClasses: '',
  betsLoginCallback: undefined,
  hasLeftNav: true,
  showBalanceInHeader: false,
  showBetsUserProfile: false,
  showBalanceInProfileSection: false,
  onLeftNavToggle: () => { },
  betsLoginCallback: () => { },
  setFavoriteCallback: () => { },
  customRegistrationOptions: undefined,
  subMenuClickCallback: undefined,
  customBrowserRouter: undefined,
};
