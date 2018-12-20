import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import DateUtils from '../dateUtils';
import { getEventTrackerAttributes, generatePPDetailsUrl, isMobileDevice, getNextRaceIfCurrentRaceIsOver, isPPDetailsPage } from '../utility';
import EVENT_TRACKING_CONST from '../config/eventTrackingConstants';
import EventConstant from '../config/eventTrackingConstants';
import CommonSSTFMethods from '../config/common-methods';
import sessionProvider from '../config/sessionProvider';
import settings from '../config/leftnav-app-settings';
import appConstants from '../appConstants';
import UpgradeSubscriptionPopUp from '../handicapping/upgrade-subscription-pop-up'

const { EVENT_KEY } = EVENT_TRACKING_CONST;
export default class CardComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      shouldShowUpgradePopup: false
    }
    this.onDateClick = this.onDateClick.bind(this);
    this.callEntitlement = this.callEntitlement.bind(this);
    this.getPdfUrl = this.getPdfUrl.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ shouldShowUpgradePopup: false })
  }

  callEntitlement(raceObj, raceNumber, card, track) {
    const url = `${settings.API_END_POINT_URL.FORMULATOR_SERVICE}/api/entitlements/validate`;
    var headers = { 'cache-control': 'no-cache', 'pragma': 'no-cache', 'Content-Type': 'application/json', 'x-auth-token': sessionProvider.getAccessToken() };
    var params = {
      method: 'PUT',
      dataType: 'JSON',
      headers: headers,
      body: JSON.stringify(raceObj)
    };
    fetch(url, params)
      .then((response) => {
        if (response.status === appConstants.apiConst.unauthorized) {
          this.setState({ shouldShowUpgradePopup: true });
        }
        if (response.status === appConstants.apiConst.statusOk) {
          this.getPdfUrl(raceObj.raceDate, raceNumber, card, track);
        }
      })
      .catch((err) => {
        console.error('Error in fetch entitlement service');
      });
  }

  getPdfUrl(raceDate, raceNumber, card, track) {
    const raceDateDto = card.raceDate;
    const trackId = track.trackId;
    const country = track.country;
    const url = `${settings.API_END_POINT_URL.FORMULATOR_SERVICE}/api/raceTracks/${trackId}/date/${raceDate}`;
    var headers = { 'cache-control': 'no-cache', 'pragma': 'no-cache', 'Content-Type': 'application/json', 'x-auth-token': sessionProvider.getAccessToken() };
    var params = {
      method: 'GET',
      dataType: 'JSON',
      headers: headers
    };
    fetch(url, params)
      .then(response => response.json())
      .then((response) => {
        raceNumber = getNextRaceIfCurrentRaceIsOver(response.track.trackRacesInfo, _.toInteger(raceNumber));
        let date =  moment(raceDateDto.date).date();
        let url = appConstants.formatUrl(`${settings.API_END_POINT_URL.WWW_ONE_DRF_BASE_URL}/drfDownloadPastPerformance.do?TRK={0}&CY={1}&DATE={2}&RACE={3}`, trackId, country, date, 99);
        window.open(url, '_blank');
      })
      .catch((err) => {
        console.error('Error in fetch ract types formulator service');
      });
  }

  onDateClick(e, card, track) {
    e.preventDefault();
    let url = generatePPDetailsUrl(card, track);
    const isBetsApp = _.includes(window.location.href, 'bets') || _.includes(window.location.href, 'funding');
    let isAuth = isBetsApp ? sessionProvider.isAuthenticated() : sessionProvider.getSessionVal();
    if (!isAuth) {
      //non logged in user handicapping calender click
      if (window.mainNavigation) {
        if (isBetsApp) {
          window.mainNavigation.handleBetsLoginClick();
          return;
        }
        if (isMobileDevice()) {
          let date = moment(card.raceCardDate).format(appConstants.DATE_FORMATS.MM_DD_YYYY);
          let mobileUrl = `${window.location.origin}/${appConstants.PP_DETAILS}/mobile/${track.trackId}/${99}/${date}/${track.country}/${card.dayEvening}`;
          window.mainNavigation.handleLoginClick(`${settings.API_END_POINT_URL.REGISTER_TO_BETS}/iframe?retUrl=${mobileUrl}`);
          return;
        }
        window.mainNavigation.handleLoginClick(`${settings.API_END_POINT_URL.REGISTER_TO_BETS}/iframe?retUrl=${url}`);
        return
      }
    }
    const gtmEvent = {
      trackName: track.trackName,
      raceNumber: !_.isEmpty(card.raceList) ? _.first(card.raceList) : '',
      raceDate: card.raceDate,
    };
    CommonSSTFMethods.setMenuGtmEvent(EventConstant.TRACKING_EVENT.CLICK_TO_HANDICAPP_ON_TRACK, true, gtmEvent);

    // logged in user handicapping calender click
    if (isMobileDevice()) {
      if (!_.isEmpty(track) && !_.isEmpty(card)) {
        const raceDateDto = card.raceDate;
        const raceDate = moment(raceDateDto).format(appConstants.DATE_FORMATS.MM_DD_YYYY);
        const { trackId, country } = track;
        let raceNumber = !_.isEmpty(card.raceList) ? _.first(this.props.card.raceList) : '';
        const requestObj = {
          trackId, country, raceDate, dayEvening: card.dayEvening,
        };
        this.callEntitlement(requestObj, raceNumber, card, track);
      }
    } else {
      if (window.location.href.includes('pp-details')) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    }
  }

  render() {
    const { card, track } = this.props;
    const raceDateDto = card.raceDate;
    const cardUrl = generatePPDetailsUrl(card, track);

    const isPPDetails = isPPDetailsPage();
    const getCalenderClass = () => {
      if (DateUtils.getNoOfDaysRemainingFromCurrentDate(raceDateDto) === 0) {
        return 'today';
      } else if (card.final) {
        return 'final';
      }
      return 'early';
    };

    const calenderEventTrackAttributes = getEventTrackerAttributes(
      EventConstant.TRACKING_EVENT.CLICK_TO_HANDICAPP_ON_TRACK, `calenderCell calenderDate ${getCalenderClass()}`,
      { [EVENT_KEY.trackId]: track.trackId, [EVENT_KEY.trackName]: track.trackName, 'data-application-name': 'SSTF' },
    );
    return (
      <div>
        {(isPPDetails) ?
          <a
            {...calenderEventTrackAttributes}
            target="_blank"
            rel="noopener noreferrer"
            href={cardUrl}
          >
            <span className="dateNo">{raceDateDto.day}</span>
            <span className="day">{moment(raceDateDto).format('ddd')}</span>
          </a>
          :
          <span
            {...calenderEventTrackAttributes}
            onClick={(e) => this.onDateClick(e, card, track)}
          >
            <span className="dateNo">{raceDateDto.day}</span>
            <span className="day">{moment(raceDateDto).format('ddd')}</span>
          </span>
        }
        {this.state.shouldShowUpgradePopup &&
          <UpgradeSubscriptionPopUp
            shouldShowUpgradePopup={this.state.shouldShowUpgradePopup}
            handleClose={this.handleClose.bind(this)}
          />
        }
      </div>
    );
  }
}
