import moment from 'moment';
export default class DateUtils {

  static getFormatedDate(date, dateFormat) {
    //  TODO: Take time stamp and return formated date
    return (_.isDate(date)) ? moment(date.getTime()).format(dateFormat) : '';
  }


  static getNoOfDaysRemainingFromCurrentDate(date) {
    // get remaining no of days set time to 12:00 am
    const [START_OF_DAY, DIFF_BY_DAYS] = ['day', 'days'];
    return moment(date).startOf(START_OF_DAY).diff(moment(Date.now()).startOf(START_OF_DAY), DIFF_BY_DAYS);
  }
}
