// TODO Change URL for all 4 instance
import _ from "lodash";
const localSettings = {
  API_END_POINT_URL: {
    NAVIGATION: 'http://demo5977040.mockable.io/navigation?ts=' + new Date().getTime(),
    MARKETING: 'https://static.drf.com/sstf/stage/json/marketing.json?ts='+ new Date().getTime(),
    MARKETING_BETS: 'https://static.drf.com/sstf/stage/json/marketingbets.json?ts='+ new Date().getTime(),

    BETS_SERVICE: 'https://betsapidev.drf.com/bets-api',
    PLAY_APP: 'https://playdev.drf.com',
    SUPER_BETS_APP: 'http://superbetslocal.drf.com:3000',
    FUNDING: 'https://fundingdev.drf.com',
    TICKET_MAKER: 'http://ticketmakerdev.drf.com/ticketmaker/',
    PP_STORE: 'https://superbets-ppstoredev.drf.com',
    HOME_PAGE : 'http://sstflocal.drf.com:8080',
    SUPER_BETS: 'http://superbetslocal.drf.com:3000',
    REGISTRATION: 'https://registrationdev.drf.com',
    MEMBER_CENTER: 'https://www1stage.drf.com/MemberCenter.do',
    ACCOUNT_SETTINGS: 'https://www1stage.drf.com/Orders.do',
    ENTRIES: ['http://sstflocal.drf.com:8080/race-entries', 'http://sstflocal.drf.com:8080/live_odds'],
    RESULTS: 'http://sstflocal.drf.com:8080/race-results',
    SPORTS: "http://sportlocal.drf.com:3000"
  },
}

const devSettings = {
  API_END_POINT_URL: {
    NAVIGATION: 'https://demo3358088.mockable.io/sstf/dev1/json/navigation.json?ts=' + new Date().getTime(),
    MARKETING: 'https://static.drf.com/sstf/stage/json/marketing.json?ts=' + new Date().getTime(),
    MARKETING_BETS: 'https://static.drf.com/sstf/stage/json/marketingbets.json?ts='+ new Date().getTime(),

    BETS_SERVICE: 'https://betsapidev.drf.com/bets-api',
    PLAY_APP: 'https://playdev.drf.com',
    SUPER_BETS_APP: 'https://superbetsdev.drf.com',
    FUNDING: 'https://fundingdev.drf.com',
    TICKET_MAKER: 'http://ticketmakerdev.drf.com/ticketmaker/',
    PP_STORE: 'https://superbets-ppstoredev.drf.com',

    HOME_PAGE : 'https://sstfdev.drf.com',
    SUPER_BETS: 'https://superbetsdev.drf.com',
    REGISTRATION: 'https://registrationdev.drf.com',
    MEMBER_CENTER: 'https://www1stage.drf.com/MemberCenter.do',
    ACCOUNT_SETTINGS: 'https://www1stage.drf.com/Orders.do',
    ENTRIES: ['https://sstfdev.drf.com/race-entries', 'https://sstfdev.drf.com/live_odds'],
    RESULTS: 'https://sstfdev.drf.com/race-results',
    SPORTS: "https://sportsdev.drf.com"
  },
};

const stageSettings = {
  API_END_POINT_URL: {
    NAVIGATION: 'https://static.drf.com/sstf/stage/json/navigation.json?ts=' + new Date().getTime(),
    MARKETING: 'https://static.drf.com/sstf/stage/json/marketing.json?ts=' + new Date().getTime(),
    MARKETING_BETS: 'https://static.drf.com/sstf/stage/json/marketingbets.json?ts='+ new Date().getTime(),

    BETS_SERVICE: 'https://betsapistage.drf.com/bets-api',
    SUPER_BETS: 'https://superbetsstage.drf.com',
    PLAY_APP: 'https://playstage.drf.com',
    SUPER_BETS_APP: 'https://superbetsstage.drf.com',
    FUNDING: 'https://fundingstage.drf.com',
    TICKET_MAKER: 'https://ticketmakerstage.drf.com/',
    PP_STORE: 'https://superbets-ppstorestage.drf.com',

    HOME_PAGE : 'https://stage.drf.com',
    REGISTRATION: 'https://registrationstage.drf.com',
    MEMBER_CENTER: 'https://www1stage.drf.com/MemberCenter.do',
    ACCOUNT_SETTINGS: 'https://www1stage.drf.com/Orders.do',
    ENTRIES: ['https://stage.drf.com/race-entries', 'https://stage.drf.com/live_odds'],
    RESULTS: 'https://stage.drf.com/race-results',
    SPORTS: "https://sportsstage.drf.com"
  },
};


const prodSettings = {
  API_END_POINT_URL: {
    NAVIGATION: 'https://static.drf.com/sstf/prod/json/navigation.json?ts=' + new Date().getTime(),
    MARKETING: 'https://static.drf.com/sstf/prod/json/marketing.json?ts=' + new Date().getTime(),
    MARKETING_BETS: 'https://static.drf.com/sstf/prod/json/marketingbets.json?ts='+ new Date().getTime(),

    BETS_SERVICE: 'https://betsapi.drf.com/bets-api',
    USER_PREFERENCES: 'https://user-preference.drf.com',
    PLAY_APP: 'https://play.drf.com',
    SUPER_BETS_APP: 'https://bets.drf.com',
    FUNDING: 'https://funding.drf.com',
    TICKET_MAKER: 'https://ticketmaker.drf.com/',
    PP_STORE: 'https://superbets-ppstore.drf.com',

    HOME_PAGE : 'https://www.drf.com',
    REGISTRATION: 'https://registration.drf.com',
    MEMBER_CENTER: 'https://www1.drf.com/MemberCenter.do',
    ACCOUNT_SETTINGS: 'https://www1.drf.com/Orders.do',
    ENTRIES: ['https://www.drf.com/race-entries', 'https://www.drf.com/live_odds'],
    RESULTS: 'https://www.drf.com/race-results',
    SPORTS: "https://sports.drf.com"
  },
};

const prepareSettings = () => {
  if(_.includes(document.location.hostname, 'local')){
    return stageSettings;
  } else if(_.includes(document.location.hostname, 'dev')){
    return devSettings;
  } else if(_.includes(document.location.hostname, 'stage')){
    return stageSettings;
  } else {
    return prodSettings;
  } 
};

export default prepareSettings();
