import Component from './component.js';
import moment from "moment";

class Point extends Component {
  constructor(data) {
    super();
    this._type = data.type;
    this._city = data.city;
    this._offers = data.offers;
    this._activeOffers = data.activeOffers;
    this._startDate = data.startDate;
    this._endDate = data.endDate;
    this._price = data.price;

    this._onClick = null;
    this._onPointClick = this._onPointClick.bind(this);
  }

  _getDuration() {
    return moment.duration(moment(this._endDate).diff(moment(this._startDate)));
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
    <h3 class="trip-point__title">${this._type} in ${this._city}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">
        ${moment(this._startDate).format(`H:mm`)}&nbsp;&mdash; 
        ${moment(this._endDate).format(`H:mm`)}
      </span>
      <span class="trip-point__duration">
        ${this._getDuration().hours()}h ${this._getDuration().minutes()}m
      </span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
    <ul class="trip-point__offers">
      ${Array.from(this._offers).map((offer) => {
    if (this._activeOffers.has(offer.value)) {
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
    this._activeOffers = data.activeOffers;
    this._startDate = data.startDate;
    this._endDate = data.endDate;
    this._price = data.price;
  }
}

export default Point;
