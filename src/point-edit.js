import component from './component.js';
import templates from './templates.js';
import moment from "moment";
import flatpickr from "flatpickr";

class PointEdit extends component {
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
    this._onEsc = null;
    this._onFormClick = this._onFormClick.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
    this._onChangeDest = this._onChangeDest.bind(this);
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onEscPress = this._onEscPress.bind(this);
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  set onEsc(fn) {
    this._onEsc = fn;
  }

  get template() {
    return templates.pointEdit(this);
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

    this._element.querySelector(`.point__destination-input`).setCustomValidity(``);
  }

  _partialUpdate() {
    this._elementCopy = this._element;
    this._element = component.createNode(this.template);
    this._elementCopy.parentNode.replaceChild(this._element, this._elementCopy);
  }

  _processForm(formData) {
    const entry = {
      type: ``,
      city: ``,
      pictures: this._pictures,
      offers: this._offers.map((offer) => {
        return {
          title: offer.title,
          price: offer.price,
          accepted: false,
        };
      }),
      description: this._description,
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
    return typeof this._onSubmit === `function` && this._onSubmit(newData);
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete({id: this._id});
    }
  }

  _onEscPress(evt) {
    if (typeof this._onEsc === `function`) {
      if (evt.key === `Escape`) {
        this._onEsc();
      }
    }
  }

  _onFormClick() {
    this._element.style.border = ``;
    this._element.classList.remove(`shake`);
  }

  _setupPickers() {
    const date = this._element.querySelector(`.point__date input`);
    const times = this._element.querySelectorAll(`.point__time input`);
    const datePicker = flatpickr(date, {
      altInput: true,
      altFormat: `M j`,
      dateFormat: `Z`,
      defaultDate: moment(this._startDateTime).format(),
      onChange: (selectedDates) => {
        startTimePicker.setDate(selectedDates[0]);
        endTimePicker.setDate(selectedDates[0]);
      }
    });

    const startTimePicker = flatpickr(times[0], {
      enableTime: true,
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `Z`,
      [`time_24hr`]: true,
      minuteIncrement: 1,
      defaultDate: moment(this._startDateTime).format(),
      onChange: (selectedDates) => {
        endTimePicker.set(`minDate`, selectedDates[0]);
        datePicker.setDate(selectedDates[0]);
      },
      onClose: (selectedDates) => {
        if (moment.duration(moment(endTimePicker.selectedDates[0]).diff(moment(selectedDates[0]))).asMilliseconds() < 0) {
          setTimeout(() => {
            endTimePicker.open();
          }, 1);
        }
      }
    });

    const endTimePicker = flatpickr(times[1], {
      enableTime: true,
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `Z`,
      [`time_24hr`]: true,
      minuteIncrement: 1,
      defaultDate: moment(this._endDateTime).format(),
      onChange: (selectedDates) => {
        startTimePicker.set(`maxDate`, selectedDates[0]);
      },
      onClose: (selectedDates) => {
        if (moment.duration(moment(selectedDates[0]).diff(moment(startTimePicker.selectedDates[0]))).asMilliseconds() < 0) {
          setTimeout(() => {
            startTimePicker.open();
          }, 1);
        }
      }
    });
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
    document.addEventListener(`keydown`, this._onEscPress);
    this._setupPickers();
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
    document.removeEventListener(`keydown`, this._onEscPress);
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
