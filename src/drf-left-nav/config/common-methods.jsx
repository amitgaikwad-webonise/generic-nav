import _ from 'lodash';
import StorageProvider from './storageProvider';
export default class CommonMethods {
  static isBetsUser() {
    if (!_.isUndefined($.cookie('DRF_SSO_AUTH'))) {
      const drfSsoAuthObj = JSON.parse($.cookie('DRF_SSO_AUTH'));
      if (_.isEmpty(drfSsoAuthObj)) {
        StorageProvider.removeItem('DRF_SSO_AUTH');
        return false;
      }
      if (drfSsoAuthObj.xpbUser) {
        const betsId = drfSsoAuthObj.xpbUser.uid;
        if (betsId != null) {
          return true;
        }
      }
    }
    return false;
  }

  static adPush() {
    const { googletag, googletag: { cmd } } = window;
    if (googletag.apiReady && cmd) {
      cmd.push(() => this.setState({ GPTHasLoaded: true, isBetsUser: CommonMethods.isBetsUser() }, () => {
        this.addAdvertisement();
        CommonMethods.refreshAds();
      }));
    }
  }

  static refreshAds() {
    const { googletag } = window;
    if (googletag.apiReady) {
      googletag.pubads().refresh();
    }
  }

  static setGTMDataLayer(data) {
    const gtmEvent = {
      event: 'gtm.click',
      action: data.action,
      actionValue: data.actionValue,
    };

    const gtmClearEvent = {
      event: undefined,
      action: undefined,
      actionValue: undefined,
    };

    window.dataLayer.push(gtmEvent);

    setTimeout(() => {
      window.dataLayer.push(gtmClearEvent);
    }, 300);
  }

  static setMenuGtmEvent(action, auth, extraParam) {
    let drfSsoAuthObj = null;
    if (!_.isUndefined($.cookie('DRF_SSO_AUTH'))) {
      drfSsoAuthObj = JSON.parse($.cookie('DRF_SSO_AUTH'));
    }
    let actionValue = {};
    if (auth) {
      actionValue = !_.isEmpty(drfSsoAuthObj) ?
        {
          userType: CommonMethods.isBetsUser() ? 'Authenticated Bets User' : 'Authenticated DRF User',
        } : {
          userType: 'Anonymous User',
        };
    }
    if (extraParam) {
      actionValue = _.assign(actionValue, extraParam);
    }
    const gtmEvent = {
      action,
      actionValue,
    };
    CommonMethods.setGTMDataLayer(gtmEvent);
  }
  static isVideoStreamPage() {
    return !!window.location.href.includes('video');
  }
}
