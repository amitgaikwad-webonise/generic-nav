const eventConstant = {
  TRACKING_EVENT: {
    CLICK_WAGERING_TAB: 'CLICK_WAGERING_TAB',
    CLICK_HANDICAPPING_TAB: 'CLICK_HANDICAPPING_TAB',
    CLICK_TO_WAGER_ON_TRACK: 'CLICK_ON_WAGER',
    CLICK_TO_HANDICAPP_ON_TRACK: 'CLICK_ON_PP',
  },

  DATA_SOURCE: {
    LEFT_RAIL: 'Left Rail',
  },

  UI_CLASS_NAME: 'pixelTracker',
  APPLICATION_NAME: 'Superbets',

  EVENT_TYPES: {
    CLICK_ON_PP_VIEW: 'CLICK_ON_PP_VIEW',
    CLICK_ON_PAST_BUTTON: 'CLICK_ON_PAST_BUTTON',
    CLICK_ON_UPCOMING_BUTTON: 'CLICK_ON_UPCOMING_BUTTON',
  },

  EVENT_KEY: {
    raceNumber: 'race-number',
    trackId: 'track-id',
    trackName: 'track-name',
    section: 'section',
    articleCategory: 'article-category',
    articleTitle: 'article-title',
  },
};

export default eventConstant;
