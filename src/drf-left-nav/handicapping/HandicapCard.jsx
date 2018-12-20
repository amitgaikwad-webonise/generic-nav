import React from 'react';
import _ from 'lodash';
import { FavouriteStar } from '../iconsComponent';
import CardComponent from './cardComponent';
import sessionProvider from '../config/sessionProvider';

export default class HandicapCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: sessionProvider.isUserAuthenticated(),
      favoriteTracks: props.favoriteTracks,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      isLoggedIn: sessionProvider.isUserAuthenticated(),
      favoriteTracks: props.favoriteTracks
    });
  }

  render() {
    let { track, makeFavOrUnFav } = this.props;
    const isFavorite = _.findIndex(this.state.favoriteTracks, { trackId: track.trackId }) >= 0;
    const datewithtime = new Date();
    const todaydate = new Date(datewithtime.getFullYear(), datewithtime.getMonth(), datewithtime.getDate());
    track.cards =track.cards || [];
    const upcomming_cards = track.cards.filter(
      (card)=>(new Date(card.raceCardDate) >= todaydate.getTime()));
    if(!upcomming_cards.length){
      return null;
    }
    return (
      <li className='d-flex trackCalenderItem' key={track.trackId}>
        <div className='d-flex calenderLeft'>
          <span onClick={() => makeFavOrUnFav(track.trackId)} >
            <FavouriteStar className={`favoriteStar ${isFavorite ? '' : 'unFavoriteStar'}`} />
          </span>
          <div className='calenderCell calenderTrackName'>
            <span className='trackAbbriName'>{track.trackId}</span>
            <span className='trackFullName'>{track.trackName}</span>
          </div>
        </div>
        <div className='d-flex calenderRight'>
          {_.map(upcomming_cards, card => (
            <CardComponent
              key={card.raceCardDate}
              card={card}
              trackListName={this.props.trackListName}
              track={this.props.track}
            />
          ))
          }
        </div>
      </li>
    );
  }
}
