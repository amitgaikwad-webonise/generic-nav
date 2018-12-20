import storageProvider from './storageProvider';
import commonMethods from './common-methods';
class Session {

  getSessionVal() {
    let obj = storageProvider.get('DRF_SSO_AUTH');
    if (obj) {
      return obj;
    } else {
      return null;
    }
  }

  isUserAuthenticated() {
    if (commonMethods.isBetsUser()) {
      return this.isAuthenticated() && this.getSessionVal();
    }
    return this.getSessionVal();
  }

  isAuthenticated() {
    let obj = storageProvider.get('DRF_SSO_AUTH');
    if (obj && obj.xpbUser && obj.xpbUser.xAuthToken) {
      return obj.xpbUser.xAuthToken;
    } else {
      return false;
    }
  }

  getAccessToken() {
    return storageProvider.get('accessToken') || null;
  }

}

var session = new Session();

export default session;
