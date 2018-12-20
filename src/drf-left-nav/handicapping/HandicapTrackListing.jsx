import React from 'react';
import AppConstant from '../appConstants';
import HandicappingCard from './HandicapCard';
import { getEventTrackerAttributes } from '../utility';
import DateUtils from '../dateUtils';
import EVENT_TRACKING_CONST from '../config/eventTrackingConstants';

const { DEAD_LINK , NO_TRACK_ERROR_MESSAGE} = AppConstant;
const [NUMBER_OF_DAYS_UPCOMMING, NUMBER_OF_DAYS_PAST] = [4, 3];
const { EVENT_KEY, EVENT_TYPES } = EVENT_TRACKING_CONST;
const { CLICK_ON_UPCOMING_BUTTON, CLICK_ON_PAST_BUTTON } = EVENT_TYPES;
export default class HandicapTrackListing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPastShow: false,
      pastTracks: [],
      upcommingTracks: [],
      isExpand: props.isExpand,
    }
    this.getHandicapCard = this.getHandicapCard.bind(this);
    this.getPastCards = this.getPastCards.bind(this);
  }

  componentWillReceiveProps(props) {
    if (_.isEmpty(props.tracks)) {
      this.setState({ pastTracks: [], upcommingTracks: [] })
    }
    const upcommingTracks = HandicapTrackListing.getTracksOnlyHaveUpcommingCards(props.tracks);
    if (!props.enablePast) {
      this.setState({ pastTracks: [], upcommingTracks: upcommingTracks })
    }
    const pastTracks = HandicapTrackListing.getTracksOnlyHavePastCards(props.tracks);
    this.setState({ pastTracks: pastTracks, upcommingTracks: upcommingTracks })
  }

  static getTracksOnlyHaveUpcommingCards(tracks) {
    const upcommingTracks = [];
    _.forEach(tracks, (track) => {
      const {
        cards, country, trackId, trackName, isFavorite,
      } = track;
      const newCards = _.slice(HandicapTrackListing.getUpcommingCards(cards), 0, NUMBER_OF_DAYS_UPCOMMING);
      if (!_.isEmpty(newCards)) {
        upcommingTracks.push({
          cards: newCards, country, trackId, trackName, isFavorite,
        });
      }
    });
    return upcommingTracks;
  }

  static getUpcommingCards(cards) {
    const upcommingCards = cards && _.filter(cards, (card) => {
      if (_.isEmpty(card.raceList)) {
        return false;
      }
      return DateUtils.getNoOfDaysRemainingFromCurrentDate(card.raceDate) >= 0;
    });
    return upcommingCards;
  }

  static getTracksOnlyHavePastCards(tracks) {
    const pastTracks = [];
    _.forEach(tracks, (track) => {
      const {
        cards, country, trackId, trackName, isFavorite,
      } = track;
      const newCards = _.slice(_.reverse(HandicapTrackListing.getPastCards(cards)), 0, NUMBER_OF_DAYS_PAST);
      if (!_.isEmpty(newCards)) {
        pastTracks.push({
          cards: newCards, country, trackId, trackName, isFavorite,
        });
      }
    });
    return pastTracks;
  }

  static getPastCards(cards) {
    /*  Not comparing with milisec beacause all past race date times are 00:00:00
    and only comparing mm and dd beacause race date not exeds more then year */
    const upcommingCards = cards && _.filter(cards, (card) => {
      if (_.isEmpty(card.raceList)) {
        return false;
      }
      return DateUtils.getNoOfDaysRemainingFromCurrentDate(card.raceDate) < 0;
    });
    return upcommingCards;
  }

  getHandicapCard(tracks) {
    const isAllCardsOfTracksEmpty = !_.find(tracks, track => !_.isEmpty(track.cards));
    if (isAllCardsOfTracksEmpty) {
      return <span className='message errorMsg'>{NO_TRACK_ERROR_MESSAGE}</span>;
    }
    return (
      <ul className='trackCalenderList'>
        {_.map(tracks, (track) => (
          <HandicappingCard
            key={track.trackId}
            track={track}
						trackListName={this.props.trackListName}
            favoriteTracks={this.props.favoriteTracks}
            makeFavOrUnFav={this.props.makeFavOrUnFav}
          />
        ))}
      </ul>
    );
  }

  getPastCards(isPastShow) {
    if (isPastShow !== this.state.isPastShow) {
      this.setState({ isPastShow });
    }
  }

  render() {
    let { trackListClass, trackListName } = this.props;
    let { upcommingTracks, pastTracks, isPastShow } = this.state;

    if (_.isEmpty(pastTracks) && _.isEmpty(upcommingTracks)) {
      return null;
    }

    let currentTracks = [];
    if (_.isEmpty(pastTracks)) {
      currentTracks = upcommingTracks;
    } else if (_.isEmpty(upcommingTracks)) {
      currentTracks = pastTracks;
    } else {
      currentTracks = isPastShow ? pastTracks : upcommingTracks;
    }

    if (this.props.noOfTracks > 0) {
      currentTracks = _.slice(currentTracks, 0, this.props.noOfTracks);
    }

    return (
      <div>
        <div className={`calenderWrap clearfix ${trackListClass}`}>
          <div className='calenderHead clearfix' onClick={() => { this.setState({ isExpand: !this.state.isExpand }); }}>
            <a
              href={DEAD_LINK}
              className='d-flex trackHandicappingCategory'
              onClick={() => { this.setState({ isExpand: !this.state.isExpand }); }}
              >
              <span className='calenderTitle pull-left'>{trackListName}</span>
              {
                this.state.isExpand ?
                  <span className="collapseIcon collapseActive" />
                  :
                  <span className="collapseIcon" />
              }
            </a>
          </div>
          <div className={`TrackContentSection ${(this.state.isExpand) ? '' : 'hide'}`}>
            {this.props.enablePast &&
              <div className='clearfix upcommingPastWrap'>
                {!_.isEmpty(upcommingTracks) &&
                  <span {...getEventTrackerAttributes(
                    CLICK_ON_UPCOMING_BUTTON,
                    !isPastShow ? 'active' : '',
                    { [EVENT_KEY.section]: this.props.trackListName },
                  )} onClick={() => this.getPastCards(false)}>UPCOMING </span>}

                {!_.isEmpty(pastTracks) &&
                  <span {...getEventTrackerAttributes(
                    CLICK_ON_PAST_BUTTON,
                    _.isEmpty(upcommingTracks) || isPastShow ? 'active' : '',
                    { [EVENT_KEY.section]: this.props.trackListName },
                  )} onClick={() => this.getPastCards(true)}>PAST </span>}
              </div>}

            {this.getHandicapCard(currentTracks)}
          </div>
        </div>
      </div>
    );
  }
}
