import React from 'react';
import PropTypes from 'prop-types';
import ApiEndPoints from './api-endpoints';
import _ from 'lodash';

export default class BalanceComponent extends React.Component {
    static removeCommaFromNumbers(numString) {
        if (typeof numString === 'string' || numString instanceof String) {
            let find = ',';
            let re = new RegExp(find, 'g');
            return _.replace(numString, re, '');
        }
        return numString;
    }
    

    render() {
        const formatOption = {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        };

        const formatter = new Intl.NumberFormat('en-US', formatOption);

        const balance = (this.props.balance != undefined && this.props.balance != null)? this.props.balance + '' : '';
        const formattedMoney = balance? `${formatter.format(BalanceComponent.removeCommaFromNumbers(balance))}` : '-';

        if (this.props.menuType) {
            return (
                <div className="drfNavBalanceInfo">
                    <a href="javascript: void(0);" onClick={() => {window.open(ApiEndPoints.DEPOSIT, '_target')}}>
                        <span className="drfNavBalAmt">{formattedMoney}</span>
                        <span>
                            <span className="drfNavBalCopy">BALANCE</span>
                            <i className="drfNavPlusIcon">+</i>
                        </span>
                    </a>
                    <i className="drfNavRefresh" id="doNotClose" onClick={() => this.props.getBalance()}/>
                </div>
            );
        }

        return (
            <div className="drfNavBalanceWrap">
                <span className="drfNavBalAmt">{formattedMoney}</span>
                <a href="javascript: void(0);" onClick={() => {window.open(ApiEndPoints.DEPOSIT, '_target')}}>
                    <span className="drfNavBalCopy">BALANCE</span>
                    <i className="drfNavPlusIcon">+</i>
                </a>
            </div>
        );
    }
}

BalanceComponent.propType = {
    balance: PropTypes.any,
    menuType: PropTypes.bool,
};

BalanceComponent.defaultProps = {
    balance: '',
    menuType: false,
};