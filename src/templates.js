import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment);

export default {
  point(obj) {
    return `<article class="trip-point">
    <i class="trip-icon">${obj._icons.get(obj._type)}</i>
    <h3 class="trip-point__title">${obj._type} ${obj._type !== `Check-in` && obj._type !== `Sightseeing` && obj._type !== `Restaurant` ? `to` : `in`} ${obj._city}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">
        ${moment(obj._startDateTime).format(`H:mm`)}&nbsp;&mdash; 
        ${moment(obj._endDateTime).format(`H:mm`)}
      </span>
      <span class="trip-point__duration">
        ${obj._getDuration().format(`dd[D] hh[H] mm[m]`)}
      </span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${obj._basePrice + obj._offersPrice}</p>
    <ul class="trip-point__offers">
      ${Array.from(obj._offers).map((offer, i) => {
    if (!offer.accepted && i < 3) {
      return `
          <li>
            <button class="trip-point__offer">${offer.title} +&euro;&nbsp;${offer.price}</button>
          </li>`;
    }

    return ``;
  }).join(``)}
    </ul>
  </article>`.trim();
  },
  pointEdit(obj) {
    return `<article class="point">
  <form class="point__form" action="" method="get">
    <header class="point__header">
      <label class="point__date">
        choose day
        <input class="point__input" type="text" placeholder="MAR 18" name="day">
      </label>

      <div class="travel-way">
        <label class="travel-way__label" for="travel-way__toggle">${obj._icons.get(obj._type)}</label>

        <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

        <div class="travel-way__select">
          <div class="travel-way__select-group">
            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travelWay" value="Taxi" ${obj._type === `Taxi` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>
  
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travelWay" value="Bus" ${obj._type === `Bus` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>
  
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travelWay" value="Train" ${obj._type === `Train` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>
              
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-ship" name="travelWay" value="Ship" ${obj._type === `Ship` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-ship">🛳️ ship</label>
                
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-transport" name="travelWay" value="Transport" ${obj._type === `Transport` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-transport">🚊 transport</label>
              
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-drive" name="travelWay" value="Drive" ${obj._type === `Drive` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-drive">🚗 drive</label>
      
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travelWay" value="Flight" ${obj._type === `Flight` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
            </div>
  
            <div class="travel-way__select-group">
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travelWay" value="Check-in" ${obj._type === `Check-in` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>
  
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travelWay" value="Sightseeing" ${obj._type === `Sightseeing` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
              
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-restaurant" name="travelWay" value="Restaurant" ${obj._type === `Restaurant` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-restaurant">🍴 restaurant</label>
              </div>
            </div>
          </div>
    
          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">${obj._type} ${obj._type !== `Check-in` && obj._type !== `Sightseeing` && obj._type !== `Restaurant` ? `to` : `in`}</label>
          <input class="point__destination-input" list="destination-select" id="destination" value="${obj._city}" name="destination">
        <datalist id="destination-select">
          ${obj._allDests.map((dest) => {
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
        <input class="point__input" type="text" value="${obj._basePrice}" name="price">
      </label>

      <div class="point__buttons">
        <button class="point__button point__button--save" type="submit">Save</button>
        <button class="point__button point__button--delete" type="reset">Delete</button>
      </div>

      <div class="paint__favorite-wrap">
        <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${obj._isFavorite ? `checked` : ``}>
          <label class="point__favorite" for="favorite">favorite</label>
        </div>
      </header>
  
      <section class="point__details">
        <section class="point__offers">
          ${obj._offers.length > 0 ? `<h3 class="point__details-title">offers</h3>` : ``}
          <div class="point__offers-wrap">
            ${obj._offers.map((offer) => {
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
        <p class="point__destination-text">${obj._description}</p>
        <div class="point__destination-images">
        ${obj._pictures.map((picture) => {
    return `<img src="${picture.src}" alt="${picture.description}" class="point__destination-image">`;
  }).join(``)
}
        </div>
      </section>
      <input type="hidden" class="point__total-price" name="total-price" value="&euro;&nbsp;${obj._basePrice + obj._offersPrice}">
    </section>
  </form>
</article>`.trim();
  },
  day(obj) {
    return `<section class="trip-day">
      <article class="trip-day__info">
        <span class="trip-day__caption">Day</span>
        <p class="trip-day__number">${obj._number}</p>
        <h2 class="trip-day__title">${obj._date}</h2>
      </article>

      <div class="trip-day__items">
      
      </div>
</section>`.trim();
  }
};
