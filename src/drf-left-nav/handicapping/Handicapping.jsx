import fetch from 'isomorphic-fetch';
import React from 'react';
import _ from 'lodash';
import AppConstant from '../appConstants';
import HandicapTrackListing from './HandicapTrackListing';
import Settings from '../config/leftnav-app-settings';

const { USA, CANADA } = AppConstant;
export default class Handicapping extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isAuthUser: props.isAuthUser,
			isLoader: false,
			allTracks: [],
			topTracks: [],
			recentTracks: props.recentTracks,
			favoriteTracks: props.favoriteTracks,
		};
		this.getNorthAmericanTracks = this.getNorthAmericanTracks.bind(this);
		this.getRaceTypes = this.getRaceTypes.bind(this);
	}

	componentWillReceiveProps(props) {
		this.setState({
			isAuthUser: props.isAuthUser,
			favoriteTracks: props.favoriteTracks,
			recentTracks: props.recentTracks,
		});
	}

	componentDidUpdate() {
		if ($('#LeftNavHandicapping').length) {
			$('#LeftNavHandicapping').mCustomScrollbar({
				theme: 'dark',
			});
		}
	}

	componentWillMount() {
		this.getRaceTypes();
	}

	getRaceTypes() {
		const url = `${Settings.API_END_POINT_URL.FORMULATOR_SERVICE}/api/raceTracks`;
		fetch(url)
			.then(response => response.json())
			.then((data) => {
				this.setState({
					allTracks: data.allTracks,
					topTracks: data.topTracks,
					isLoader: true
				});
				this.props.fetchFavoriteRecent();
			})
			.catch((err) => {
				this.setState({ isLoader: false });
				console.error('Error in fetch ract types formulator service');
			});
	}

	getNorthAmericanTracks(allTracks) {
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
		const { allTracks, topTracks } = this.state;
		const northAmericaTracks = this.getNorthAmericanTracks(allTracks);
		const internationalTracks = _.difference(allTracks, northAmericaTracks);
		$('#LeftNavHandicapping').mCustomScrollbar('destroy').removeClass('mCustomScrollbar _mCS_1 mCS_no_scrollbar');


		return (
			<div
				className="handicappingNavContainer LeftNavHandicapping"
				id="LeftNavHandicapping"
				>
				{!this.state.isLoader && <div>
					<div className="loaderBackground" />
					<div className="loader" />
				</div>
				}
				{
					this.state.isAuthUser &&
					<HandicapTrackListing
						isExpand
						trackListName="Favorite Tracks"
						trackListClass="favoriteTrack"
						tracks={this.getFavoriteTracks()}
						favoriteTracks={this.state.favoriteTracks}
						makeFavOrUnFav={this.props.makeFavOrUnFav}
					/>
				}
				{
					this.state.isAuthUser &&
					<HandicapTrackListing
						isExpand
						trackListName="Recent Tracks"
						trackListClass="recentTracks"
						tracks={this.getRecentTracks()}
						noOfTracks={5}
						favoriteTracks={this.state.favoriteTracks}
						makeFavOrUnFav={this.props.makeFavOrUnFav}
					/>
				}

				<HandicapTrackListing
					isExpand
					trackListName="Featured Tracks"
					trackListClass="topTracks"
					tracks={topTracks}
					favoriteTracks={this.state.favoriteTracks}
					makeFavOrUnFav={this.props.makeFavOrUnFav}
				/>

				<HandicapTrackListing
					isExpand
					trackListName="North American Tracks"
					trackListClass="allTracks northAmericanTracks"
					tracks={northAmericaTracks}
					favoriteTracks={this.state.favoriteTracks}
					makeFavOrUnFav={this.props.makeFavOrUnFav}
				/>

				<HandicapTrackListing
					trackListName="International Tracks"
					trackListClass="allTracks internationalTracks clearfix"
					tracks={internationalTracks}
					maxHeight={450}
					favoriteTracks={this.state.favoriteTracks}
					makeFavOrUnFav={this.props.makeFavOrUnFav}
				/>
			</div>
		);
	}
}
