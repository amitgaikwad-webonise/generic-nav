import _ from 'lodash';
import React from 'react';
import WageringCard from './WageringCard';
import AppConstant from '../appConstants';

const { DEAD_LINK } = AppConstant;
export default class WagerringTrackListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpand: props.isExpand,
    };
    this.getWagerCard = this.getWagerCard.bind(this);
  }

  getWagerCard(tracks) {
    return _.map(tracks, (track, i) => (
      <WageringCard
        key={i}
        trackListName={this.props.trackListName}
        makeFavOrUnFav={this.props.makeFavOrUnFav}
        track={track}
        isAuthUser={this.props.isAuthUser}
        isFavorite={_.findIndex(this.props.favoriteTracks, { trackId: track.trackId }) >= 0}
        />
    ));
  }

  render() {
    const { trackListName, tracks } = this.props;
    const { isExpand } = this.state;

    return (
      <ul className="wageringAccordion">
        {!_.isEmpty(tracks) &&
          <li>
            <a
              href={DEAD_LINK}
              className="d-flex"
              onClick={() => { this.setState({ isExpand: !isExpand }); }}
              >
              <span>{trackListName}</span>
              {this.state.isExpand ?
                 <span className="collapseIcon collapseActive" />
                 :
                 <span className="collapseIcon" />
              }
            </a>
            <ul>
              <li className={isExpand ? '' : 'hide'}>
                {this.getWagerCard(tracks)}
              </li>
            </ul>
          </li>}
      </ul>
    );
  }
}
