import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import React from 'react';
import AppConstant from '../appConstants';
import Settings from '../config/leftnav-app-settings';
import WagerringTrackListing from './WagerringTrackListing';

require('../leftSidebarFixed.css');

const { USA, CANADA } = AppConstant;
export default class Wagering extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthUser: props.isAuthUser,
      favoriteTracks: props.favoriteTracks,
      recentTracks: props.recentTracks,
      allTracks: [],
    };
    this.getNorthAmericanTracks = this.getNorthAmericanTracks.bind(this);
    this.getSuperbetTrackEntries = this.getSuperbetTrackEntries.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      isAuthUser: props.isAuthUser,
      favoriteTracks: props.favoriteTracks,
      recentTracks: props.recentTracks,
    });
  }

  componentWillMount() {
    this.getSuperbetTrackEntries();
  }

  componentDidUpdate() {
    if ($('#LeftNavHandicapping').length) {
      $('#LeftNavHandicapping').mCustomScrollbar({
        theme: 'dark',
      });
    }
  }

  getSuperbetTrackEntries() {
    const url = `${Settings.API_END_POINT_URL.PROSERVICE}/superBets/entries`;
    fetch(url)
      .then(response => response.json())
      .then((response) => {
        const tracks = _.filter(response.data.trackList, track => !track.isHarness && !track.cardOver && !track.currentRaceCancelled);
        this.setState({
          allTracks: tracks,
        });
        this.props.fetchFavoriteRecent();
      })
      .catch((err) => {
        console.error('Error in fetching Tracks from proservice');
      });
  }

  getNorthAmericanTracks() {
    const { allTracks } = this.state;
    return _.filter(allTracks, (track) => {
      if (track.country === USA || track.country === CANADA) {
        return track;
      }
    });
  }

  getFavoriteTracks() {
    const { allTracks, favoriteTracks } = this.state;
    return _.chain(favoriteTracks)
      .orderBy(['priority'], ['desc'])
      .map(favoriteTrack => _.find(allTracks, { trackId: favoriteTrack.trackId }))
      .filter(favoriteTrack => !!favoriteTrack)
      .value();
  }

  getRecentTracks() {
    const { allTracks, recentTracks, favoriteTracks } = this.state;
    return _.chain(recentTracks)
      .filter(recentTrack => !_.find(favoriteTracks, { trackId: recentTrack.trackId }))
      .map(recentTrack => _.find(allTracks, { trackId: recentTrack.trackId }))
      .filter(recentTrack => !!recentTrack)
      .value();
  }

  render() {
    const { allTracks } = this.state;
    const featuredTracks = _.filter(allTracks, { isFeatured: true });
    const northAmericaTracks = this.getNorthAmericanTracks();
    const internationalTracks = _.difference(allTracks, northAmericaTracks);
    $('#LeftNavHandicapping').mCustomScrollbar('destroy').removeClass('mCustomScrollbar _mCS_1 mCS_no_scrollbar');

    if (!this.state.allTracks.length) {
      return (
        <div>
          <div className='loaderBackground' />
          <div className='loader' />
        </div>
      )
    }

    return (
      <div
        className='LeftNavHandicapping'
        id='LeftNavHandicapping'
      >
        {this.state.isAuthUser &&
          <WagerringTrackListing
            isExpand
            isAuthUser={this.state.isAuthUser}
            trackListName='Favorite Tracks'
            tracks={this.getFavoriteTracks()}
            favoriteTracks={this.props.favoriteTracks}
            makeFavOrUnFav={this.props.makeFavOrUnFav}
          />
        }

        {this.state.isAuthUser &&
          <WagerringTrackListing
            isExpand
            isAuthUser={this.state.isAuthUser}
            trackListName='Recent Tracks'
            tracks={this.getRecentTracks()}
            favoriteTracks={this.props.favoriteTracks}
            makeFavOrUnFav={this.props.makeFavOrUnFav}
          />
        }

        <WagerringTrackListing
          isExpand
          isAuthUser={this.state.isAuthUser}
          trackListName='Featured Tracks'
          tracks={featuredTracks}
          favoriteTracks={this.props.favoriteTracks}
          makeFavOrUnFav={this.props.makeFavOrUnFav}
        />

        <WagerringTrackListing
          isExpand
          isAuthUser={this.state.isAuthUser}
          trackListName='North American Tracks'
          tracks={northAmericaTracks}
          favoriteTracks={this.props.favoriteTracks}
          makeFavOrUnFav={this.props.makeFavOrUnFav}
        />

        <WagerringTrackListing
          isAuthUser={this.state.isAuthUser}
          trackListName='International Tracks'
          tracks={internationalTracks}
          favoriteTracks={this.props.favoriteTracks}
          makeFavOrUnFav={this.props.makeFavOrUnFav}
        />
      </div>
    );
  }
}
