import _ from 'lodash';
export default class CookieStorage {
  static get(key) {
    if (!key || !_.isString(key)) {
      return null;
    }

    const allCookies = document.cookie.split(';');
    const resultCookies = _.chain(allCookies).map((cookie) => {
      const split = _.map(cookie.split('='), data => data.trim());
      if (_.first(split) === key) {
        return JSON.parse(decodeURIComponent(split[1]) || '');
      }
      return false;
    }).compact().value();

    return resultCookies.length ? _.first(resultCookies) : null;
  }

  static set(key, value) {
    const expiryTime = CookieStorage.getExpiryTime();
    const keyString = key.toString();
    const valueString = JSON.stringify(value);
    const domain = 'domain=drf.com';
    const cookie = `${keyString}=${valueString};${expiryTime};Path=/;${domain};'`;
    document.cookie = cookie;
  }

  static removeItem(key) {
    if (!key) {
      return false;
    }
    // setting previous time to expires will delete cookie.
    document.cookie = `${key}=;Path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=drf.com;`;
    return true;
  }

  static getExpiryTime() {
    const d = new Date();
    const oneHour = 60 * 60 * 1000;
    d.setTime(d.getTime() + oneHour);
    return `expires=${d.toUTCString()};`;
  }
}
