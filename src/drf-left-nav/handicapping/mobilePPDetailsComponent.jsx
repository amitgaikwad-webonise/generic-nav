import React from 'react';
import moment from 'moment';
import settings from '../config/leftnav-app-settings';
import Authentication from '../config/sessionProvider';
import appConstants from '../appConstants';
import UpgradeSubscriptionPopUp from './upgrade-subscription-pop-up';
import { getNextRaceIfCurrentRaceIsOver } from '../utility';

export default class MobileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: Authentication.getAccessToken(),
      shouldShowUpgradePopup: false
    }
    this.callEntitlement = this.callEntitlement.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidUpdate() {
    if (this.state.accessToken !== Authentication.getAccessToken()) {
      this.setState({
        accessToken: Authentication.getAccessToken()
      })
      const urlParams = this.props.match.params;
      this.callEntitlement(urlParams.trackId, urlParams.country, urlParams.date, urlParams.dayEve);
    }
  }

  callEntitlement(trackId, country, raceDate, dayEvening) {
    const raceObj = {
      trackId, country, raceDate, dayEvening,
    };
    let accessToken = Authentication.getAccessToken();
    const url = `${settings.API_END_POINT_URL.FORMULATOR_SERVICE}/api/entitlements/validate`;
    var headers = { 'cache-control': 'no-cache', 'pragma': 'no-cache', 'Content-Type': 'application/json', 'x-auth-token': accessToken };
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
          this.getPdfUrl();
        }
      })
      .catch((err) => {
        console.error('Error in fetch entitlement service');
      });
  }

  handleClose() {
    this.setState({ shouldShowUpgradePopup: false });
    window.location.href = window.location.origin;
  }

  getPdfUrl() {
    const urlParams = this.props.match.params;
    const raceDateDto = urlParams.date;
    const trackId = urlParams.trackId;
    const country = urlParams.country;
    let raceNumber = urlParams.raceNumber;
    const url = `${settings.API_END_POINT_URL.FORMULATOR_SERVICE}/api/raceTracks/${trackId}/date/${raceDateDto}`;
    var headers = { 'cache-control': 'no-cache', 'pragma': 'no-cache', 'Content-Type': 'application/json', 'x-auth-token': Authentication.getAccessToken() };
    var params = {
      method: 'GET',
      dataType: 'JSON',
      headers: headers
    };
    fetch(url, params)
      .then(response => response.json())
      .then((response) => {
        raceNumber = getNextRaceIfCurrentRaceIsOver(response.track.trackRacesInfo, _.toInteger(raceNumber));
        let date = moment(raceDateDto, appConstants.DATE_FORMATS.MM_DD_YYYY).format('DD');
        let url = appConstants.formatUrl(`${settings.API_END_POINT_URL.WWW_ONE_DRF_BASE_URL}/drfDownloadPastPerformance.do?TRK={0}&CY={1}&DATE={2}&RACE={3}`, trackId, country, date, 99);
        window.open(url, "_blank");
      })
      .catch((err) => {
        console.error('Error in fetch ract types formulator service');
      });
  }

  render() {
    return <div>
      {this.state.shouldShowUpgradePopup &&
        <UpgradeSubscriptionPopUp
          shouldShowUpgradePopup={this.state.shouldShowUpgradePopup}
          handleClose={this.handleClose.bind(this)}
        />
      }
    </div>
  }
}
