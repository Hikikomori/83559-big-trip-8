import component from './component.js';
import templates from './templates.js';

class TripDay extends component {
  constructor(data) {
    super();
    this._number = data.number;
    this._date = data.date;
  }

  get template() {
    return templates.day(this);
  }
}

export default TripDay;
