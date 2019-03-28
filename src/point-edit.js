import Component from './component.js';
import moment from "moment";
import flatpickr from "flatpickr";

class PointEdit extends Component {
  constructor(data, allDests, allOffers) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._city = data.city;
    this._pictures = data.pictures;
    this._offers = data.offers;
    this._description = data.description;
    this._startDateTime = data.startDateTime;
    this._endDateTime = data.endDateTime;
    this._basePrice = data.basePrice;
    this._isFavorite = data.isFavorite;

    this._allOffers = allOffers;
    this._allDests = allDests;

    this._onSubmit = null;
    this._onDelete = null;
    this._onFormClick = this._onFormClick.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
    this._onChangeDest = this._onChangeDest.bind(this);
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
  }

  _onChangeType(evt) {
    if (evt.target.tagName.toLowerCase() === `input`) {
      this._type = evt.target.value;
      if (this._allOffers) {
        this._offers = [];
        this._allOffers.map((offersPack) => {
          if (offersPack.type === this._type.toLowerCase()) {
            this._offers = offersPack.offers.map((offer) => {
              return {
                title: offer.name,
                price: offer.price,
                accepted: false
              };
            });
          }
        });

        this.removeListeners();
        this._partialUpdate();
        this.createListeners();
      }
    }
  }

  _onChangeDest(evt) {
    if (this._allDests) {
      this._allDests.map((dest) => {
        if (dest.name === evt.target.value) {
          this._city = dest.name;
          this._description = dest.description;
          this._pictures = dest.pictures;

          this.removeListeners();
          this._partialUpdate();
          this.createListeners();
        }
      });
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
      offers: this._offers.map((offer) => {
        return {
          title: offer.title,
          price: offer.price,
          accepted: false,
        };
      }),
      startDateTime: ``,
      endDateTime: ``,
      basePrice: 0,
      offersPrice: 0,
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

  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete({id: this._id});
    }
  }

  _onFormClick() {
    this._element.style.border = ``;
    this._element.classList.remove(`shake`);
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
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
              <label class="travel-way__select-label" for="travel-way-restaurant">🍴 restaurant</label>
              </div>
            </div>
          </div>
    
          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">${this._type} ${this._type !== `Check-in` && this._type !== `Sightseeing` && this._type !== `Restaurant` ? `to` : `in`}</label>
          <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
        <datalist id="destination-select">
          ${this._allDests.map((dest) => {
    return `<option value="${dest.name}"></option>`;
  })}
        </datalist>
      </div>

      <div class="point__time">
        choose time
        <input class="point__input" type="text" value="" name="startDateTime" placeholder="12:00">
        <span class="point__time-dash">—</span>
        <input class="point__input" type="text" value="" name="endDateTime" placeholder="12:00">
      </div>
  
      <label class="point__price">
        write price
        <span class="point__price-currency">€</span>
        <input class="point__input" type="text" value="${this._basePrice}" name="price">
      </label>

      <div class="point__buttons">
        <button class="point__button point__button--save" type="submit">Save</button>
        <button class="point__button point__button--delete" type="reset">Delete</button>
      </div>

      <div class="paint__favorite-wrap">
        <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
          <label class="point__favorite" for="favorite">favorite</label>
        </div>
      </header>
  
      <section class="point__details">
        <section class="point__offers">
          ${this._offers.length > 0 ? `<h3 class="point__details-title">offers</h3>` : ``}
          <div class="point__offers-wrap">
            ${this._offers.map((offer) => {
    return `<input class="point__offers-input visually-hidden" type="checkbox" id="${offer.title.replace(/\s/g, `_`)}" name="offer" value="${offer.title.replace(/\s/g, `_`)}" ${offer.accepted ? `checked` : ``}>
            <label for="${offer.title.replace(/\s/g, `_`)}" class="point__offers-label">
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
    return `<img src="${picture.src}" alt="${picture.description}" class="point__destination-image">`;
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
      .addEventListener(`reset`, this._onDeleteButtonClick);
    this._element.querySelector(`.point__form`)
      .addEventListener(`click`, this._onFormClick);
    this._element.querySelector(`.travel-way__select`)
      .addEventListener(`click`, this._onChangeType);
    this._element.querySelector(`.point__destination-input`)
      .addEventListener(`change`, this._onChangeDest);

    const times = this._element.querySelectorAll(`.point__time input`);
    const startTime = flatpickr(times[0], {
      enableTime: true,
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `Z`,
      minuteIncrement: 1,
      defaultDate: moment(this._startDateTime).format(),
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
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `Z`,
      minuteIncrement: 1,
      defaultDate: moment(this._endDateTime).format(),
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
      .removeEventListener(`reset`, this._onDeleteButtonClick);
    this._element.querySelector(`.point__form`)
      .removeEventListener(`click`, this._onFormClick);
    this._element.querySelector(`.travel-way__select`)
      .removeEventListener(`click`, this._onChangeType);
    this._element.querySelector(`.point__destination-input`)
      .removeEventListener(`change`, this._onChangeDest);
  }

  update(data) {
    this._type = data.type;
    this._city = data.city;
    this._offers = data.offers;
    this._startDateTime = data.startDateTime;
    this._endDateTime = data.endDateTime;
    this._basePrice = data.basePrice;
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
        for (let offer of target.offers) {
          if (value.replace(/_/g, ` `) === offer.title) {
            offer.accepted = true;
            target.offersPrice += offer.price;
          }
        }
      },
      startDateTime(value) {
        target.startDateTime = Date.parse(value);
      },
      endDateTime(value) {
        target.endDateTime = Date.parse(value);
      },
      price(value) {
        target.basePrice = parseInt(value, 10);
      },
      favorite(value) {
        target.isFavorite = Boolean(value);
      }
    };
  }
}

export default PointEdit;
