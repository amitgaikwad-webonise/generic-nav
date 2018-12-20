import _ from 'lodash';

const devSettings = {
  API_END_POINT_URL: {
    REGISTER_TO_BETS: 'https://registrationstage.drf.com/',
    FORMULATOR_SERVICE: 'https://formulatorstage.drf.com/formulator-service',
    PROSERVICE: 'https://proservicedev.drf.com',
    USER_PREFERENCES: 'https://ticketmakerdev.drf.com/user-preferences',
    SUPER_BETS_APP: 'https://superbetsdev.drf.com',
    SHOP_BASE_URL: 'https://shopstage.drf.com',
    HOME_PAGE: 'https://sstfdev.drf.com',
    WWW_ONE_DRF_BASE_URL: 'https://www1stage.drf.com',
    DRF_BASE_URL: 'https://stage.drf.com',
  }
};

const stageSettings = {
  API_END_POINT_URL: {
    REGISTER_TO_BETS: 'https://registrationstage.drf.com/',
    FORMULATOR_SERVICE: 'https://formulatorstage.drf.com/formulator-service',
    PROSERVICE: 'https://proservice-apistage.drf.com/proservice',
    USER_PREFERENCES: 'https://user-preferencestage.drf.com',
    SUPER_BETS_APP: 'https://superbetsstage.drf.com',
    SHOP_BASE_URL: 'https://shopstage.drf.com',
    HOME_PAGE: 'https://stage.drf.com',
    WWW_ONE_DRF_BASE_URL: 'https://www1stage.drf.com',
    DRF_BASE_URL: 'https://stage.drf.com',
  }
};


const prodSettings = {
  API_END_POINT_URL: {
    REGISTER_TO_BETS: 'https://registrationstage.drf.com/',
    FORMULATOR_SERVICE: 'https://formulator.drf.com/formulator-service',
    PROSERVICE: 'https://proservice.drf.com/proservice',
    USER_PREFERENCES: 'https://user-preference.drf.com',
    SUPER_BETS_APP: 'https://bets.drf.com',
    SHOP_BASE_URL: 'https://shop.drf.com',
    HOME_PAGE : 'https://www.drf.com',
    WWW_ONE_DRF_BASE_URL: 'https://www1.drf.com',
    DRF_BASE_URL: 'https://www.drf.com',
  }
};

const prepareSettings = () => {
  let settings;
  switch (document.location.hostname) {
    case 'superbets.drf.com':
    case 'betsbeta.drf.com':
    case 'bets.drf.com':
    case 'play.drf.com':
      settings = prodSettings;
      break;
  }
  if (_.includes(document.location.hostname, 'stage')) {
    settings = stageSettings;
  } else if (_.includes(document.location.hostname, 'dev')) {
    settings = devSettings;
  } else if (_.includes(document.location.hostname, 'local')) {
    settings = devSettings;
  }
  return settings;
};

export default prepareSettings();
