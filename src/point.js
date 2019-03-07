import makePoint from './make-point.js';

const ICONS = new Map([
  [`Taxi`, `🚕`],
  [`Bus`, `🚌`],
  [`Train`, `🚂`],
  [`Ship`, `🛳️`],
  [`Transport`, `🚊`],
  [`Drive`, `🚗`],
  [`Flight`, `✈️`],
  [`Check-in`, `🏨`],
  [`Sightseeing`, `🏛️`],
  [`Restaurant`, `🍴`]
]);
const MILLISECONDS_IN_MINUTE = 60000;
const MINUTES_IN_HOUR = 60;

class Point {
  constructor(data) {
    this._type = data.type;
    this._city = data.city;
    this._offers = data.offers;
    this._startDate = new Date(data.startDate);
    this._endDate = new Date(data.endDate);
    this._price = data.price;
    this._durationInMinutes = Math.round((data.endDate - data.startDate) / MILLISECONDS_IN_MINUTE);

    this._element = null;
    this._onClick = null;
    this._clickListenerBind = null;
  }

  _onPointClick() {
    return typeof this._onClick === `function` && this._onClick();
  }

  get element() {
    return this._element;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  get template() {
    return `<article class="trip-point">
    <i class="trip-icon">${ICONS.get(this._type)}</i>
    <h3 class="trip-point__title">${this._type} in ${this._city}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">
        ${this._startDate.toLocaleString(`en-gb`, {hour: `numeric`, minute: `numeric`})}&nbsp;&mdash; 
        ${this._endDate.toLocaleString(`en-gb`, {hour: `numeric`, minute: `numeric`})}
      </span>
      <span class="trip-point__duration">
        ${Math.floor(this._durationInMinutes / MINUTES_IN_HOUR)}h ${this._durationInMinutes % MINUTES_IN_HOUR}m
      </span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
    <ul class="trip-point__offers">
      ${this._offers.map((offer) => {
    return `
          <li>
            <button class="trip-point__offer">${offer.title} +&euro;&nbsp;${offer.price}</button>
          </li>`;
  }).join(``)
}
    </ul>
  </article>`.trim();
  }

  bind() {
    this._clickListenerBind = this._onPointClick.bind(this);
    this._element.addEventListener(`click`, this._clickListenerBind);
  }

  render() {
    this._element = makePoint(this.template);
    this.bind();
    return this._element;
  }

  unbind() {
    this._element.removeEventListener(`click`, this._clickListenerBind);
    this._clickListenerBind = null;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}

export default Point;
