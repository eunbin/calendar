import { uuid } from "../util/util"
import { dateFormat } from "../constant/date";
import moment from "moment"

class Date {
  constructor({ date, dateTime }) {
    this.date = date
    this.dateTime = dateTime
  }
}
class Event {
  constructor (obj) {
    this.id = uuid();
    this.title = obj.title;
    this.start = new Date(obj.start);
    this.end = new Date(obj.end);
    this.createdAt = moment().format(dateFormat.DATE_TIME);
  }
}

export {
  Event
}
