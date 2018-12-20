import settings from './config/leftnav-app-settings'

const appConstants = {
    APPLICATION_NAME: 'SUPERBETS',
    viewAnalysisLink: "/wagers/{0}/{1}/{2}/{3}/",
    apiConst: {
        statusOk: 200,
        statusMultiChoice: 300,
        statusError: 400,
        internalServerError : 500,
        notFound: 404,
        unauthorized : 401
    },
    USA: 'USA',
    CANADA: 'CAN',
    RECENT_TRACKS_DAYS: 15, //Recentracks From One Day,
    COOKIE_FAVORITE_TRACK_ID: 'favorite_track_id',
    DRF_LEFT_NAV: {
        WAGERING_TAB: 1,
        HANDICAPPING_TAB: 2,
    },
    DEAD_LINK: 'javascript:void(0)',
    DATE_FORMATS: {
        MM_DD_YYYY: 'MM-DD-YYYY',
    },
    NO_TRACK_ERROR_MESSAGE: 'Sorry, there are no tracks available',
    PP_DETAILS: 'pp-details',
    ALL_CARD_PACKS_CLASSIC_PPS: `${settings.API_END_POINT_URL.DRF_BASE_URL}/store/classic-past-performances?utm_source=storepopup&utm_medium=popup&utm_campain=classicpps`,
    CLASSIC_PP_SINGLE_PLAN_URL: `${settings.API_END_POINT_URL.SHOP_BASE_URL}/cart/add/?productId=63043&skuId=64457&quantity=1&refferUrl=${window.location.href}`,
    CLASSIC_PP_UNLIMITED_CARD_PLAN_URL: `${settings.API_END_POINT_URL.SHOP_BASE_URL}/cart/add/?productId=63038&skuId=64452&quantity=1&refferUrl=${window.location.href}`,
    LEARN_MORE: 'https://www.drf.com/200-bonus',
    formatUrl: (url, ...args) => url.replace(/{(\d+)}/g, (match, number) => (args[number] ? args[number] : match)),
}

export default appConstants
