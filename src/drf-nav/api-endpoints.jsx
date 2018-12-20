import Settings from  './settings';

const apiEndPoint = Settings.API_END_POINT_URL || {};
let isBetsApp = _.includes(window.location.href, 'bets') || _.includes(window.location.href, 'funding');
let marketingApi =  isBetsApp ? apiEndPoint.MARKETING_BETS : apiEndPoint.MARKETING;
export default {
  NAVIGATION_API: apiEndPoint.NAVIGATION,
  MARKETING_API: marketingApi,
  REGISTRATION_IFRAME_API: `${apiEndPoint.REGISTRATION}/iframe`,
  REGISTER: apiEndPoint.REGISTRATION,
  BETS_LOGIN: `${Settings.API_END_POINT_URL.BETS_SERVICE}/login`,
  BALANCE: `${Settings.API_END_POINT_URL.BETS_SERVICE}/balance`,

  SUPER_BETS_APP: Settings.API_END_POINT_URL.SUPER_BETS_APP,
  DEPOSIT: Settings.API_END_POINT_URL.FUNDING,
  WITHDRAW: `${Settings.API_END_POINT_URL.FUNDING}/#/withdraw`,
  TICKET_MAKER: Settings.API_END_POINT_URL.TICKET_MAKER,
  HOME_PAGE : Settings.API_END_POINT_URL.HOME_PAGE,
  ENTRIES: Settings.API_END_POINT_URL.ENTRIES,
  RESULTS: Settings.API_END_POINT_URL.RESULTS,
  SPORTS_APP: Settings.API_END_POINT_URL.SPORTS,


  PPCREDITS: `${Settings.API_END_POINT_URL.PP_STORE}/entitlement/cards-remaining`,
  UPDATE_PASSWORD: 'https://drfbets.xpressbetonline.com/forgotpassword.aspx',
  MEMBER_CENTER: Settings.API_END_POINT_URL.MEMBER_CENTER,
  ACCOUNT_SETTINGS: Settings.API_END_POINT_URL.ACCOUNT_SETTINGS,
}
