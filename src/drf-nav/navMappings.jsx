import _ from 'lodash';

const sstf = {
  pathnames: ['/top-headlines', '/track-news'],
};

const bets = {
  pathnames: ['/replays', '/ppstore','/rewards', '/'],
};

const entries = {
  pathnames: ['/race-entries', '/live_odds'],
};

const results = {
  pathnames: ['/race-results'],
};

const sports = {
  pathnames: [
    "/",
    "NFL/Pre-Game",
    "CFB/Pre-Game",
    "CBB/Pre-Game",
    "NBA/Pre-Game"
  ]
};

const pickNav = () => {
  if (_.includes(document.location.origin, 'http://sstflocal.drf.com:8080') || _.includes(document.location.origin, 'https://sstfdev.drf.com') || _.includes(document.location.origin, 'https://stage.drf.com') || _.includes(document.location.origin, 'https://www.drf.com')) {
    if (_.includes(document.location.pathname, '/race-entries') || _.includes(document.location.pathname, '/live_odds')) {
      return entries;
    } else if (_.includes(document.location.pathname, '/race-results')) {
      return results;
    }
    return sstf;
  } else if (_.includes(document.location.origin, 'http://superbetslocal.drf.com:3000') || _.includes(document.location.origin, 'https://superbetsdev.drf.com') || _.includes(document.location.origin, 'https://superbetsstage.drf.com') || _.includes(document.location.origin, 'https://bets.drf.com')) {
    return bets;
  } else if (
    _.includes(document.location.origin, "http://sportlocal.drf.com:3000") ||
    _.includes(document.location.origin, "https://sportsdev.drf.com") ||
    _.includes(document.location.origin, "https://sportsstage.drf.com") ||
    _.includes(document.location.origin, "https://sports.drf.com")
  ) {
    return sports;
  }
  return {};
};

export default pickNav();

