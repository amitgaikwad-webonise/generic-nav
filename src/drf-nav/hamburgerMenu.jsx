import { Redirect } from 'react-router-dom';
import React from "react";
import _ from 'lodash';
import navMappings from './navMappings';
import '../polyfill';

const NUMBER_OF_MENUS_ON_LINE = 4;
export default class HamburgerMenu extends React.Component{

  constructor(props){
    super(props);
    this.state={
      menu_status: new Array(props.menus.length)
    }
    this.onMenuClick = this.onMenuClick.bind(this);
    this.onSubMenuClick = this.onSubMenuClick.bind(this);
    this.pathname = window.location.pathname;
    this.onSubMenuClickNext = this.onSubMenuClickNext.bind(this);
    this.browserHistory = this.props.router;
  }

  renderRedirect() {
    if (this.state.redirect) {
      this.props.onClose();
      return <Redirect to={this.state.redirectUrl} />
    }
  }

  getSectionWiseMenus(){
    const menus = this.props.menus || [];
    const sectionWiseMenus = [];
    for(let i=0; i< menus.length; i += NUMBER_OF_MENUS_ON_LINE){
      sectionWiseMenus.push(menus.slice(i, i + NUMBER_OF_MENUS_ON_LINE));
    }
    return sectionWiseMenus;
  }

  onMenuClick(selectedMenu){
    if(window.location.hostname != selectedMenu.topLink){
      this.props.onClose();
      window.location.href = selectedMenu.topLink;
    }
  }

  onSubMenuClickNext(selectedSubMenu, selectedMenu) {
    const target = !_.isUndefined(selectedSubMenu.newTab) && selectedSubMenu.newTab === 'N' ? '_self' : '_blank';
    const suburl = new URL(selectedSubMenu.subLink);
    if (!_.includes(window.location.hostname, suburl.hostname)) {
      window.open(suburl.href, target);
      return;
    }

    if (_.includes(selectedMenu.topLink, window.location.host) && _.includes(navMappings.pathnames, window.location.pathname)) {
      const suburl = new URL(selectedSubMenu.subLink);
      this.props.selectMenu(selectedMenu, selectedSubMenu);
      if (this.browserHistory) {
        this.browserHistory.push(suburl.pathname);
        this.props.onClose();
      } else {
        location.pathname = suburl.pathname
      }
    } else {
      window.location.href = selectedSubMenu.subLink;
    }
  }

  onSubMenuClick(selectedSubMenu, selectedMenu) {
    if (this.props.subMenuClickCallback) {
      this.props.subMenuClickCallback(selectedMenu, selectedSubMenu, (subMenu) => {
        this.onSubMenuClickNext(subMenu, selectedMenu)
      });
    } else {
      this.onSubMenuClickNext(selectedSubMenu, selectedMenu);
    }
  }


  toggleView(selectedIndex){
      const oldStatus = this.state.menu_status[selectedIndex];
      const menu_status = new Array(this.state.menu_status.length);
      menu_status[selectedIndex] = !oldStatus;
      this.setState({menu_status});
  }


  render(){
    const sectionWiseMenus = this.getSectionWiseMenus();
    return (
        <div className="drfNavHamburgerMenu">
          <div className="drfNavHamburgerMenuHead">
          {this.renderRedirect()}
            <a href="/">
              <img src="https://ik.imagekit.io/h1gntnbx4/drf-logo_rJUQm14yN_SklR7c4WeV.svg" alt=" DRF Logo"/>
            </a>
            <i className="drfNavMenuClose" onClick={(e)=>{this.props.onClose(e)}}></i>
          </div>
          <ul className="drfNavHamburgerMenuCnt">
          {
            sectionWiseMenus.map((menus, index1)=>(
              <li key={index1} className="drfNavMenuCntList">
                {
                  menus.map((menu, index)=>{
                    const selectedMenu = this.props.selectedMenu || {};
                    let hamburgerTitleClasses = (selectedMenu.topLink == menu.topLink)? 'selected ': '';
                    hamburgerTitleClasses += this.state.menu_status[(index1 * 4 + index)] ? 'drfNavSubMenuListing active' : 'drfNavSubMenuListing';
                    return (
                      <div
                        className={hamburgerTitleClasses}
                        key={index}>
                        <div
                          onClick={()=>{this.toggleView(index1 * 4 + index)}}
                          className="drfNavSubMenuListInfo clearfix"
                          >
                          <h3>{menu.topTitle}</h3>
                          <i className="drfNavArrow"></i>
                        </div>
                        <ul className="drfNavHamburgerMenuList">
                          {
                            menu.subLinks.map((sub, index)=>(
                              <li key={index}>
                              <a onClick={() => { this.onSubMenuClick(sub, menu) }}>{sub.subTitle}</a>
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    )
                  })
                }
              </li>
            ))
          }
          </ul>
        </div>
  )
  }
}
