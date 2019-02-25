export default (icon, title, startTime, endTime, totalTime, price, offers = []) => {
  const offersHtml = [];

  if (offers) {
    offers.forEach((offer) => {
      offersHtml.push(`
      <li>
        <button class="trip-point__offer">${offer.title} +&euro;&nbsp;${offer.price}</button>
      </li>
    `);
    });
  }

  return `<article class="trip-point">
    <i class="trip-icon">${icon}</i>
    <h3 class="trip-point__title">${title}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${startTime}&nbsp;&mdash; ${endTime}</span>
      <span class="trip-point__duration">${totalTime}</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${price}</p>
    <ul class="trip-point__offers">
      ${offersHtml.join(``)}
    </ul>
  </article>`;
};
