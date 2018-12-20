import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { RadioSelected, RadioDefault } from '../iconsComponent';
import appConstants from '../appConstants';

const CLASSIC_PP_SINGLE_PLAN_PRODUCT_ID = '63043';
const CLASSIC_PP_UNLIMITED_PLAN_PRODUCT_ID = '63038';
const {
  LEARN_MORE, ALL_CARD_PACKS_CLASSIC_PPS, CLASSIC_PP_SINGLE_PLAN_URL, CLASSIC_PP_UNLIMITED_CARD_PLAN_URL,
} = appConstants;


export default class UpgradeSubscriptionPopUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      planOptionValue: CLASSIC_PP_SINGLE_PLAN_PRODUCT_ID,
    };
    this.handlePlanChange = this.handlePlanChange.bind(this);
    this.onUpgradeClick = this.onUpgradeClick.bind(this);
  }
  onUpgradeClick() {
    const { planOptionValue } = this.state;
    if (planOptionValue === CLASSIC_PP_SINGLE_PLAN_PRODUCT_ID) {
      window.location = CLASSIC_PP_SINGLE_PLAN_URL;
    } else if (planOptionValue === CLASSIC_PP_UNLIMITED_PLAN_PRODUCT_ID) {
      window.location = CLASSIC_PP_UNLIMITED_CARD_PLAN_URL;
    }
  }

  handlePlanChange(e) {
    this.setState({
      planOptionValue: e.target.value,
    });
  }


  render() {
    const planOption1Selected = (this.state.planOptionValue === CLASSIC_PP_SINGLE_PLAN_PRODUCT_ID);
    const planOption2Selected = (this.state.planOptionValue === CLASSIC_PP_UNLIMITED_PLAN_PRODUCT_ID);
    return (
      <Modal
        show={this.props.shouldShowUpgradePopup}
        onHide={this.props.handleClose}
        className="raceCardPopUp"
      > 
        <Modal.Header closeButton>
          <Modal.Title>Upgrade Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="popUpCnt">
            <div className="planActivateTitle">
              Your account does not have an active Classic PP Plan.
            </div>
            <div className="planOptionsWrap">
              <div className="planOptionFormWrap">
                <div className="planOptionsTitle">
                  Please select one of the options below
                </div>
                <div className="planOptionsForm">
                  <div className={`planOptionsfield clearfix  ${(planOption1Selected) ? 'active' : ''}`}>
                    <div className="radiowrap pull-left">
                      <input
                        type="radio"
                        name="planOption"
                        className="planOptionsRadio"
                        checked={planOption1Selected}
                        value={CLASSIC_PP_SINGLE_PLAN_PRODUCT_ID}
                        onChange={this.handlePlanChange}
                        id="planOption-1"
                      />
                      <RadioDefault />
                      <RadioSelected />
                    </div>
                    <div className="labelWrap pull-left">
                      <label
                        htmlFor="planOption-1"
                        className="planOptionsLabel"
                      >
                        <span className="labelText">Single Card Classic PPs</span>
                        <span className="planPrice">$3.50</span>
                      </label>
                    </div>
                  </div>

                  <div className={`planOptionsfield clearfix  ${(planOption2Selected) ? 'active' : ''}`}>
                    <div className="radiowrap pull-left">
                      <input
                        type="radio"
                        name="planOption"
                        className="planOptionsRadio"
                        checked={planOption2Selected}
                        value={CLASSIC_PP_UNLIMITED_PLAN_PRODUCT_ID}
                        onChange={this.handlePlanChange}
                        id="planOption-2"
                      />
                      <RadioDefault />
                      <RadioSelected />
                    </div>
                    <div className="labelWrap pull-left">
                      <label
                        htmlFor="planOption-2"
                        className="planOptionsLabel"
                      >
                        <span className="labelText">Classic PPs 5-card Plan</span>
                        <span className="planPrice">$3.19/card<span> [BEST DEAL!] SAVE 55¢ a card and get free DRF+!</span></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="offerLink">
                <a
                  title="Explore more card packs to select and save upto 90%"
                  href={ALL_CARD_PACKS_CLASSIC_PPS}
                >Explore more card packs to select and save upto 90%
                </a>
              </div>

              <div className="planOffers">
                <div className="planOffersTitle">SPECIAL OFFERS:</div>
                <p>
                  When you wager with DRF Bets you’ll get all Classic PPs free, plus a $200 bonus when you bet just $20, with code <strong>MONEY</strong>.
                  <span className="show">
                    <a
                      href={LEARN_MORE}
                      title="Learn More"
                      className="signUp"
                    >Learn More
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="raceCardBtns">
            <button
              title="Proceed To  Checkout"
              className="primaryBtn"
              onClick={this.onUpgradeClick}
            >Proceed To  Checkout
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

UpgradeSubscriptionPopUp.propTypes = {
  shouldShowUpgradePopup: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

UpgradeSubscriptionPopUp.defaultProps = {
  shoudShowUpgradePopup: false,
};
