import Component from './component.js';

class Point extends Component {
  constructor(data) {
    super();
    this._type = data.type;
    this._city = data.city;
    this._offers = data.offers;
    this._startDate = new Date(data.startDate);
    this._endDate = new Date(data.endDate);
    this._price = data.price;

    this._millisecondsInMinute = 60000;
    this._minutesInHour = 60;
    this._durationInMinutes = Math.round((data.endDate - data.startDate) / this._millisecondsInMinute);

    this._onClick = null;
    this._clickListenerBind = null;
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
        ${this._startDate.toLocaleString(`en-gb`, {hour: `numeric`, minute: `numeric`})}&nbsp;&mdash; 
        ${this._endDate.toLocaleString(`en-gb`, {hour: `numeric`, minute: `numeric`})}
      </span>
      <span class="trip-point__duration">
        ${Math.floor(this._durationInMinutes / this._minutesInHour)}h ${this._durationInMinutes % this._minutesInHour}m
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

  createListeners() {
    this._clickListenerBind = this._onPointClick.bind(this);
    this._element.addEventListener(`click`, this._clickListenerBind);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._clickListenerBind);
    this._clickListenerBind = null;
  }
}

export default Point;
