import Component from './component.js';
import moment from "moment";

class Point extends Component {
  constructor(data) {
    super();
    this._id = data.id;
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
    return `<article class="trip-point">
    <i class="trip-icon">${this._icons.get(this._type)}</i>
    <h3 class="trip-point__title">${this._type} ${this._type !== `Check-in` && this._type !== `Sightseeing` && this._type !== `Restaurant` ? `to` : `in`} ${this._city}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">
        ${moment(this._startDateTime).format(`H:mm`)}&nbsp;&mdash; 
        ${moment(this._endDateTime).format(`H:mm`)}
      </span>
      <span class="trip-point__duration">
        ${this._getDuration().days() ? ` ${this._getDuration().days()}d` : ``} ${this._getDuration().hours()}h ${this._getDuration().minutes()}m
      </span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${this._basePrice + this._offersPrice}</p>
    <ul class="trip-point__offers">
      ${Array.from(this._offers).map((offer) => {
    if (offer.accepted) {
      return `
          <li>
            <button class="trip-point__offer">${offer.title} +&euro;&nbsp;${offer.price}</button>
          </li>`;
    }

    return ``;
  }).join(``)}
    </ul>
  </article>`.trim();
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
