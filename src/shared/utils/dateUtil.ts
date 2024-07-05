import moment from 'moment'

export class DateUtil {
  static getTodayFormatted(format: string = 'YYYY-MM-DD'): string {
    return moment().format(format)
  }
}
