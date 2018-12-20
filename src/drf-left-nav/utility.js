import EVENT_TRACKING_CONST from './config/eventTrackingConstants';
import DateUtils from './dateUtils';
import AppConstants from './appConstants';
import Settings from './config/leftnav-app-settings';
import StorageProvider from './config/storageProvider';

const PP_DETAILS = `${Settings.API_END_POINT_URL.HOME_PAGE}/pp-details`;
const WAGER_PAD_VIEW = `${Settings.API_END_POINT_URL.SUPER_BETS_APP}/wagers`;
const MTP_FOR_RACE_OVER = -10;

const { MM_DD_YYYY } = AppConstants.DATE_FORMATS;

export function saveCookieTrackId(trackId) {
  StorageProvider.set(AppConstants.COOKIE_FAVORITE_TRACK_ID, trackId);
}

export function getEventTrackerAttributes(eventType, className = '', atributes) {
  const { UI_CLASS_NAME, APPLICATION_NAME } = EVENT_TRACKING_CONST;
  if (!eventType) {
    return '';
  }
  const defaultAttributes = {
    className: `${UI_CLASS_NAME} ${className}`,
    'data-event-type': eventType,
    'data-application-name': APPLICATION_NAME,
  };
  const dataAtributes = _.map(atributes, (value, key) => ({ [`data-${key}`]: value }));
  return _.assign({}, defaultAttributes, ...dataAtributes);
}

export function generatePPDetailsUrl(card, track) {
  const raceDateDto = card.raceDate;
  const date = DateUtils.getFormatedDate(new Date(raceDateDto.year, raceDateDto.month, raceDateDto.day), MM_DD_YYYY);
  const dayEve = card.dayEvening;
  const raceNumber = !_.isEmpty(card.raceList) ? _.first(card.raceList) : '';
  return `${PP_DETAILS}/${date}/${track.trackId}/${raceNumber}/${dayEve}/${track.country}`;
}

export function generateWagerPadUrl(track) {
  return `${WAGER_PAD_VIEW}/${track.trackId}/${track.currentRace}/${track.country}/${track.dayEvening}?view=basicAnalysis`
}

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

function isRaceOver(mtp) {
  return (_.toInteger(mtp) < MTP_FOR_RACE_OVER);
}

export function getNextRaceIfCurrentRaceIsOver(races, raceNumber) {
  const lastRace = _.last(races);
  if (isRaceOver(lastRace.mtp)) {
    return raceNumber;
  }
  return _.first(_.filter(races, race => !isRaceOver(race.mtp))).raceNumber;
}

export function isPPDetailsPage() {
  return !!window.location.href.includes('pp-details');
}

