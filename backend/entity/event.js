import { uuid } from "../util/util"
import { dateFormat } from "../constant/date";
import moment from "moment"

class Event {
  constructor (obj) {
    this.id = uuid();
    this.title = obj.title;
    this.start = obj.start;
    this.end = obj.end;
    this.createdAt = moment().format(dateFormat.DATE_TIME);
  }
}

export {
  Event
}
