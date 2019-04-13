import component from './component.js';
import templates from './templates.js';
import moment from "moment";

class Point extends component {
  constructor(data) {
    super();
    this._type = data.type;
    this._city = data.city;
    this._offers = data.offers;
    this._startDateTime = data.startDateTime;
    this._endDateTime = data.endDateTime;
    this._basePrice = data.basePrice;
    this._offersPrice = data.offersPrice;

    this._onClick = null;
    this._onPointClick = this._onPointClick.bind(this);
  }

  _getDuration() {
    return moment.duration(moment(this._endDateTime).diff(moment(this._startDateTime)));
  }

  _onPointClick() {
    return typeof this._onClick === `function` && this._onClick();
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  get template() {
    return templates.point(this);
  }

  createListeners() {
    this._element.addEventListener(`click`, this._onPointClick);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._onPointClick);
  }

  update(data) {
    this._type = data.type;
    this._city = data.city;
    this._offers = data.offers;
    this._startDateTime = data.startDateTime;
    this._endDateTime = data.endDateTime;
    this._basePrice = data.basePrice;
    this._offersPrice = data.offersPrice;
  }
}

export default Point;
