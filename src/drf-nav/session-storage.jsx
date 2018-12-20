import cookieStorageProvider from './storage-provider';
import _ from 'lodash';
const CONVERSION_ENUM = {
    DAY: { name: 'DAY', conversionConstant: 24 * 60 },
    HOURS: { name: 'HOURS', conversionConstant: 60 }
};
const hours = CONVERSION_ENUM.HOURS.name;
const expTime = 1;
class Session {

    constructor() {
        this.extendSession = this.extendSession.bind(this)
        this.storage = sessionStorage;
    }

    setDrfCookie(user, token) {
        let drfSessionObj = this.getSession();
        if (drfSessionObj) {
            drfSessionObj.xpbUser = {
                accountState: user.accountstate,
                displayName: user.displayname,
                givenName: user.givenname,
                uid: user.uid,
                sn: user.sn,
                xAuthToken: token,
                accountid: user.accountid,
            }
        } else {
            drfSessionObj = {
                userId: user.drfUserResponse.drfUser.userId,
                userName: user.drfUserResponse.drfUser.userName,
                firstName: user.drfUserResponse.drfUser.firstName,
                lastName: user.drfUserResponse.drfUser.lastName,
                email: user.drfUserResponse.drfUser.email,
                customerId: user.drfUserResponse.drfUser.customerId,
                accountId: user.accountid,
                Domain: ".drf.com",
                xpbUser: {
                    accountState: user.accountstate,
                    displayName: user.displayname,
                    givenName: user.givenname,
                    uid: user.uid,
                    sn: user.sn,
                    xAuthToken: token,
                    accountid: user.accountid,
                }
            }
        }
        this.createDrfUser(drfSessionObj);
        this.createDrfWebCustomerId(user.drfUserResponse.drfUser.userId);
        this.createDrfNewsCustomerId(user.drfUserResponse.drfUser.userId);
        this.createDrfWebSubs(user.drfUserResponse.drfUser.drfWebSubsciptionCookie == null ? "" : user.drfUserResponse.drfUser.drfWebSubsciptionCookie);
        this.createDrfStoreLoginId(user.drfUserResponse.drfStoreLoginId);
        this.createWdacUser(user.drfUserResponse.drfUser.userName);
        return drfSessionObj;
    };
    create(obj) {
        cookieStorageProvider.set('session', obj, expTime, hours);
    }

    createDrfUser(obj) {
        cookieStorageProvider.setDrfCookie('DRF_SSO_AUTH', obj, expTime, hours);
    }

    createDrfWebCustomerId(obj) {
        cookieStorageProvider.set('drf_web_customer_id', obj, expTime, hours);
    }

    createDrfNewsCustomerId(obj) {
        cookieStorageProvider.set('drf_news_customer_id', obj, expTime, hours);
    }

    createDrfWebSubs(obj) {
        cookieStorageProvider.set('drf_web_subs', obj, expTime, hours);
    }

    createDrfStoreLoginId(obj) {
        cookieStorageProvider.set('DRF_STORE_LOGIN_ID', obj, expTime, hours);
    }

    createWdacUser(obj) {
        cookieStorageProvider.set('WDAC_USER', obj, expTime, hours);
    }

    getSessionVal(key) {
        let obj = cookieStorageProvider.get('DRF_SSO_AUTH');
        if (obj) {
            return obj[key];
        } else {
            return null;
        }
    }

    isBetsUserAuthenticated() {
        let obj = cookieStorageProvider.get('DRF_SSO_AUTH');
        if (obj && obj.xpbUser && obj.xpbUser.xAuthToken) {
            return obj.xpbUser.xAuthToken;
        } else {
            localStorage.clear();
            return false;
        }
    }

    getSession() {
        let obj = cookieStorageProvider.get('DRF_SSO_AUTH');
        if (obj) {
            return obj;
        } else {
            return null;
        }
    }

    deleteSession() {
        if (cookieStorageProvider.get('DRF_SSO_AUTH')) {
            cookieStorageProvider.deleteAll();
        }
        localStorage.clear();
    }

    extendSession() {
        let session = cookieStorageProvider.get('DRF_SSO_AUTH')
        cookieStorageProvider.setDrfCookie('DRF_SSO_AUTH', session, expTime, hours)
    }

    setSessionForAnalysis(key, value) {
        this.storage.setItem(key, value);
    }

    getSessionForAnalysis(key) {
        return this.storage.getItem(key);
    }

    removeItem(key) {
        return this.storage.removeItem(key);
    }

    setToSessionStorage(key, value) {
        if (_.isEmpty(key)) {
            throw new Error('Key or value missing while storing to storage');
        }
        sessionStorage.setItem(key, JSON.stringify(value));
    };

    getFromSessionStorage(key) {
        if (_.isEmpty(key)) {
            throw new Error('Key missing while reading from storage');
        }
        return JSON.parse(sessionStorage.getItem(key))
    };

    clearFromSessionStorage() {
        sessionStorage.clear();
    };

    removeItemFromSessionStorage(key) {
        if (_.isEmpty(key)) {
            throw new Error('Key missing while deleting from storage');
        }
        sessionStorage.removeItem(key);
    };
}

var session = new Session();

export default session;
