const ICONS = new Map([[`Taxi`, `🚕`], [`Bus`, `🚌`], [`Train`, `🚂`], [`Ship`, `🛳️`], [`Transport`, `🚊`], [`Drive`, `🚗`], [`Flight`, `✈️`], [`Check-in`, `🏨`], [`Sightseeing`, `🏛️`], [`Restaurant`, `🍴`]]);
const MILLISECONDS_IN_MINUTE = 60000;
const MINUTES_IN_HOUR = 60;

export default (pointData) => {
  const startDate = new Date(pointData.startDate);
  const endDate = new Date(pointData.endDate);
  const durationInMinutes = Math.round((pointData.endDate - pointData.startDate) / MILLISECONDS_IN_MINUTE);
  let offersHtml = [];

  if (pointData.offers) {
    pointData.offers.forEach((offer) => {
      offersHtml.push(`
      <li>
        <button class="trip-point__offer">${offer.title} +&euro;&nbsp;${offer.price}</button>
      </li>
    `);
    });
  }

  return `<article class="trip-point">
    <i class="trip-icon">${ICONS.get(pointData.type)}</i>
    <h3 class="trip-point__title">${pointData.type} in ${pointData.city}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${startDate.toLocaleString(`en-gb`, {hour: `numeric`, minute: `numeric`})}&nbsp;&mdash; ${endDate.toLocaleString(`en-gb`, {hour: `numeric`, minute: `numeric`})}</span>
      <span class="trip-point__duration">${Math.floor(durationInMinutes / MINUTES_IN_HOUR)}h ${durationInMinutes % MINUTES_IN_HOUR}m</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${pointData.price}</p>
    <ul class="trip-point__offers">
      ${offersHtml.join(``)}
    </ul>
  </article>`;
};
