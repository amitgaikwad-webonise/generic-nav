import React from 'react';
import { FavouriteStar } from '../iconsComponent';
import { generateWagerPadUrl } from '../utility';
import EventConstant from '../config/eventTrackingConstants';
import CommonMethods from '../config/common-methods';
import appConstants from '../appConstants';
export default class WageringCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favoriteTracks: props.favoriteTracks,
    };
    this.openWagerView = this.openWagerView.bind(this);
  }

  openWagerView(e = { preventDefault() { } }) {
    e.preventDefault();
    const { track, trackListName } = this.props;
    const gtmEvent = {
      trackName: track.trackName,
      raceNumber: track.currentRace,
      trackType: trackListName,
    };
    CommonMethods.setMenuGtmEvent(EventConstant.TRACKING_EVENT.CLICK_TO_WAGER_ON_TRACK, true, gtmEvent);
    if (_.isNull(e.target.closest('.favSpan'))) {
      const url = generateWagerPadUrl(track);
      if (_.includes(document.location.hostname, 'bets')) {
        window.location.replace(url);
      } else {
        window.open(url, '_blank');
      }
    } else {
      this.props.makeFavOrUnFav(track.trackId);
    }
  }

  render() {
    const { track, makeFavOrUnFav, isFavorite } = this.props;
    const purseDisplay = track.purseDisplay ? track.purseDisplay : '';
    const raceTypeDescription = track.raceTypeDescription ? track.raceTypeDescription : '';

    return (
      <div
        className='wagerCard pixelTracker'
        data-event-type={EventConstant.TRACKING_EVENT.CLICK_TO_WAGER_ON_TRACK}
        data-track-name={track.trackName}
        data-race-number={track.currentRace}
        data-application-name={appConstants.APPLICATION_NAME}
        data-source={EventConstant.DATA_SOURCE.LEFT_RAIL}
        data-track-type={this.props.trackListName}
        onClick={event => this.openWagerView(event)}
      >
        <div className='d-flex trackMtpAndTrackName'>
          <div className='d-flex trackNameAndStarWrappper'>
            <span
              onClick={event => makeFavOrUnFav.bind(event, track.trackId)}
              className={this.props.isAuthUser ? 'favSpan makeFavUnFav' : 'favSpan'}
            >
              <FavouriteStar className={`favoriteStar ${isFavorite ? '' : 'unFavoriteStar'}`} />
            </span>
            <div className='d-flex trackNameWrapper'>
              <span className='trackName alignBets'><span className='firstWord'>{track.trackId ? track.trackId : ''}</span> {track.currentRace ? `R${track.currentRace}` : ''}</span>
              <span className='fullTrackName'>{track.trackName ? track.trackName : ''}</span>
            </div>
          </div>
          <div className={`d-flex trackMtpWrapper ${track.mtpDisplay <= 60 ? 'timeLeft' : ''}`}>
            {track.mtpDisplay <= 60 ?
              <span className='trackMtp'>
                <span className='firstLetter'>{`${track.mtpDisplay === '' ? 0 : track.mtpDisplay}`}</span>
                <span>MTP</span>
              </span>
              :
              <span className='trackMtp'>
                <span className='firstLetter'>{track.postTime.replace('PM', '').trim()}</span>
                <span>PM</span>
              </span>
            }
          </div>
        </div>
        <div className='wagerInfo'>
          <p className='trackLoc'>
            {track.distanceDescription ? <span>{`${track.distanceDescription} | `}</span> : ''}
            <span>{purseDisplay ? `${raceTypeDescription} | Purse: $${purseDisplay}` : raceTypeDescription}</span>
            {track.surface ? <span>{` | ${track.surface}`}</span> : ''}
          </p>
          {/* TODO */}
          {/* <p className='trackFave'><span className='firstWord'>Current Fave:</span> Kreesie 8/5</p> */}
        </div>
      </div>
    );
  }
}
