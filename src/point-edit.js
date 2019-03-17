import Component from './component.js';
import moment from "moment";
import flatpickr from "flatpickr";

class PointEdit extends Component {
  constructor(data) {
    super();
    this._type = data.type;
    this._city = data.city;
    this._pictures = data.pictures;
    this._offers = data.offers;
    this._activeOffers = data.activeOffers;
    this._description = data.description;
    this._startDate = data.startDate;
    this._endDate = data.endDate;
    this._price = data.price;
    this._isFavorite = data.isFavorite;

    this._onSubmit = null;
    this._onReset = null;
    this._onChangeType = this._onChangeType.bind(this);
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onResetButtonClick = this._onResetButtonClick.bind(this);
  }

  _onChangeType(evt) {
    if (evt.target.tagName.toLowerCase() === `input`) {
      this._type = evt.target.value;
      this.removeListeners();
      this._partialUpdate();
      this.createListeners();
    }
  }

  _partialUpdate() {
    this._elementCopy = this._element;
    this._element = this.createNode(this.template);
    this._elementCopy.parentNode.replaceChild(this._element, this._elementCopy);
  }

  _processForm(formData) {
    const entry = {
      type: ``,
      city: ``,
      activeOffers: new Set(),
      startDate: ``,
      endDate: ``,
      price: ``,
      isFavorite: false
    };

    const taskEditMapper = PointEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (taskEditMapper[property]) {
        taskEditMapper[property](value);
      }
    }

    return entry;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.point__form`));
    const newData = this._processForm(formData);
    this.update(newData);
    return typeof this._onSubmit === `function` && this._onSubmit(newData);
  }

  _onResetButtonClick(evt) {
    evt.preventDefault();
    return typeof this._onReset === `function` && this._onReset();
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onReset(fn) {
    this._onReset = fn;
  }

  get template() {
    return `<article class="point">
  <form class="point__form" action="" method="get">
    <header class="point__header">
      <label class="point__date">
        choose day
        <input class="point__input" type="text" placeholder="MAR 18" name="day">
      </label>

      <div class="travel-way">
        <label class="travel-way__label" for="travel-way__toggle">${this._icons.get(this._type)}</label>

        <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

        <div class="travel-way__select">
          <div class="travel-way__select-group">
            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travelWay" value="Taxi" ${this._type === `Taxi` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>
  
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travelWay" value="Bus" ${this._type === `Bus` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>
  
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travelWay" value="Train" ${this._type === `Train` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>
              
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-ship" name="travelWay" value="Ship" ${this._type === `Ship` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-ship">🛳️ ship</label>
                
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-transport" name="travelWay" value="Transport" ${this._type === `Transport` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-transport">🚊 transport</label>
              
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-drive" name="travelWay" value="Drive" ${this._type === `Drive` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-drive">🚗 drive</label>
      
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travelWay" value="Flight" ${this._type === `Flight` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
            </div>
  
            <div class="travel-way__select-group">
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travelWay" value="Check-in" ${this._type === `Check-in` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>
  
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travelWay" value="Sightseeing" ${this._type === `Sightseeing` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
              
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-restaurant" name="travelWay" value="Restaurant" ${this._type === `Restaurant` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-sightseeing">🍴 restaurant</label>
              </div>
            </div>
          </div>
    
          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">${this._type} in</label>
        <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
        <datalist id="destination-select">
          <option value="airport"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
          <option value="hotel"></option>
        </datalist>
      </div>

      <label class="point__time">
        choose time
        <input class="point__input" type="text" value="" name="startTime" placeholder="12:00">
        <span class="point__time-dash">—</span>
        <input class="point__input" type="text" value="" name="endTime" placeholder="12:00">
        </label>
  
        <label class="point__price">
          write price
          <span class="point__price-currency">€</span>
          <input class="point__input" type="text" value="${this._price}" name="price">
      </label>

      <div class="point__buttons">
        <button class="point__button point__button--save" type="submit">Save</button>
        <button class="point__button" type="reset">Delete</button>
      </div>

      <div class="paint__favorite-wrap">
        <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
          <label class="point__favorite" for="favorite">favorite</label>
        </div>
      </header>
  
      <section class="point__details">
        <section class="point__offers">
          <h3 class="point__details-title">offers</h3>
  
          <div class="point__offers-wrap">
${Array.from(this._offers).map((offer) => {
    return `<input class="point__offers-input visually-hidden" type="checkbox" id="${offer.value}" name="offer" value="${offer.value}" ${this._activeOffers.has(offer.value) ? `checked` : ``}>
            <label for="${offer.value}" class="point__offers-label">
              <span class="point__offer-service">${offer.title}</span> + €<span class="point__offer-price">${offer.price}</span>
            </label>`;
  }).join(``)
}
        </div>

      </section>
      <section class="point__destination">
        <h3 class="point__details-title">Destination</h3>
        <p class="point__destination-text">${this._description}</p>
        <div class="point__destination-images">
        ${this._pictures.map((picture) => {
    return `<img src="${picture}" alt="picture from place" class="point__destination-image">`;
  }).join(``)
}
        </div>
      </section>
      <input type="hidden" class="point__total-price" name="total-price" value="">
    </section>
  </form>
</article>`.trim();
  }

  createListeners() {
    this._element.querySelector(`.point__form`)
      .addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.point__form`)
      .addEventListener(`reset`, this._onResetButtonClick);
    this._element.querySelector(`.travel-way__select`)
      .addEventListener(`click`, this._onChangeType);

    const times = this._element.querySelectorAll(`.point__time input`);
    const startTime = flatpickr(times[0], {
      enableTime: true,
      noCalendar: true,
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `Z`,
      minuteIncrement: 1,
      defaultDate: moment(this._startDate).format(),
      onChange: (selectedDates) => {
        endTime.set(`minDate`, selectedDates[0]);
      },
      onClose: (selectedDates) => {
        if (moment.duration(moment(endTime.selectedDates[0]).diff(moment(selectedDates[0]))).asMilliseconds() < 0) {
          setTimeout(() => {
            endTime.open();
          }, 1);
        }
      }
    });

    const endTime = flatpickr(times[1], {
      enableTime: true,
      noCalendar: true,
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `Z`,
      minuteIncrement: 1,
      defaultDate: moment(this._endDate).format(),
      onChange: (selectedDates) => {
        startTime.set(`maxDate`, selectedDates[0]);
      },
      onClose: (selectedDates) => {
        if (moment.duration(moment(selectedDates[0]).diff(moment(startTime.selectedDates[0]))).asMilliseconds() < 0) {
          setTimeout(() => {
            startTime.open();
          }, 1);
        }
      }
    });
  }

  removeListeners() {
    this._element.querySelector(`.point__form`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.point__form`)
      .removeEventListener(`reset`, this._onResetButtonClick);
    this._element.querySelector(`.travel-way__select`)
      .removeEventListener(`click`, this._onChangeType);
  }

  update(data) {
    this._type = data.type;
    this._city = data.city;
    this._activeOffers = data.activeOffers;
    this._startDate = data.startDate;
    this._endDate = data.endDate;
    this._price = data.price;
    this._isFavorite = data.isFavorite;
  }

  static createMapper(target) {
    return {
      travelWay(value) {
        target.type = value;
      },
      destination(value) {
        target.city = value;
      },
      offer(value) {
        target.activeOffers.add(value);
      },
      startTime(value) {
        target.startDate = Date.parse(value);
      },
      endTime(value) {
        target.endDate = Date.parse(value);
      },
      price(value) {
        target.price = value;
      },
      favorite(value) {
        target.isFavorite = Boolean(value);
      }
    };
  }
}

export default PointEdit;
