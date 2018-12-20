import _ from 'lodash';
const MARQUEE_COOKIE_NAME = "marquee";
const USER_REDIRECTION_EVENT_COOKIE_NAME = "userRedirectionEvent";
const USER_TRACKING_ID_EVENT_COOKIE_NAME = "userTrackingId";

const CONVERSION_ENUM = {
  DAY: { name: 'DAY', conversionConstant: 24 * 60 },
  HOURS: { name: 'HOURS', conversionConstant: 60 }
};

class CookieStorage {

    get(key) {
        if(!key || !_.isString(key)) {
            return;
        }

        var allCookies = document.cookie.split(';');
        var resultCookies = _.chain(allCookies).map(function(cookie) {
            let split = _.map(cookie.split('='), function(data) {
                return decodeURIComponent(data).trim();
            });
            if(_.first(split) === key) {
                return JSON.parse(split[1] || '');
            }
            return false; 
        }).compact().value();

        return resultCookies.length ? _.first(resultCookies) : null;
    }

    getDomainString() {
        return 'domain=drf.com';
    }

    set(key, value, expTime, conversionType) {
        let expiryTime = this.getExpiryTime(expTime, conversionType),
            keyString = key.toString(),
            valueString = JSON.stringify(value),
            domain = this.getDomainString(),
            cookie = `${keyString}=${valueString};${expiryTime};Path=/;${domain}`
        document.cookie = cookie
    }

    setDrfCookie(key, value) {
        let expiryTime = this.getExpiryTime(),
            keyString = key.toString(),
            valueString = encodeURIComponent(JSON.stringify(value)),
            domain = this.getDomainString(),
            cookie = `${keyString}=${valueString};${expiryTime};Path=/;${domain}`
        document.cookie = cookie
    }

    removeItem(key) {
        if(!key) {
            return;
        }
        //setting previous time to expires will delete cookie.
        document.cookie = `${key}=;Path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;${this.getDomainString()}`;
    }

    deleteAll() {
        var cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            let eqPos = cookie.indexOf("=");
            let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            if(!_.includes([MARQUEE_COOKIE_NAME, USER_REDIRECTION_EVENT_COOKIE_NAME, USER_TRACKING_ID_EVENT_COOKIE_NAME], _.trim(name))) {
                this.removeItem(name);
            }
        }
    }

    getExpiryTime(expiryTime, conversionType) {
        let d = new Date()
        let hours = this.getExpiryTimeInHours(expiryTime, conversionType);
        d.setTime(d.getTime() + hours)
        return `expires=${d.toUTCString()};`
    }

    getExpiryTimeInHours(expiryTime, conversionType) {
        let conversionTp = CONVERSION_ENUM[conversionType];
        if(expiryTime && (conversionTp && conversionTp.conversionConstant)) {
            return expiryTime * conversionTp.conversionConstant *60*1000;
        } else {
            return CONVERSION_ENUM.HOURS.conversionConstant *60*1000;
        }
    }
}

var cookieStorageProvider = new CookieStorage();

export default cookieStorageProvider;
