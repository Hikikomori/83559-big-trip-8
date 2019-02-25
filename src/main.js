import makeFilter from './make-filter.js';
import makePoint from './make-point.js';

const INITIAL_POINT_COUNT = 7;
const MIN_RANDOM_POINT_COUNT = 1;
const MAX_RANDOM_POINT_COUNT = 13;

const filterContainer = document.querySelector(`.trip-filter`);
const pointsContainer = document.querySelector(`.trip-day__items`);
const getRandomPointsValue = () => Math.round(Math.random() * MAX_RANDOM_POINT_COUNT + MIN_RANDOM_POINT_COUNT);
const filtersData = [{name: `Everything`, isChecked: true}, {name: `Future`, isChecked: false}, {name: `Past`, isChecked: false}];

const filters = filtersData.map((filter) => {
  return makeFilter(filter.name, filter.isChecked);
});

filterContainer.insertAdjacentHTML(`beforeend`, filters.join(``));

const filterElements = filterContainer.querySelectorAll(`.trip-filter__item`);

for (let i = 0; i < filterElements.length; i++) {
  filterElements[i].addEventListener(`click`, () => {
    pointsContainer.innerHTML = ``;
    let points = [];
    for (let j = 1; j <= getRandomPointsValue(); j++) {
      points.push(makePoint(`🚕`, `Taxi to Airport`, `10:00`, `11:00`, `1h 30m`, `20`, [{title: `Order UBER`, price: `20`}, {title: `Upgrade to business`, price: `20`}]));
    }
    pointsContainer.insertAdjacentHTML(`beforeend`, points.join(``));
  });
}

let points = [];
for (let i = 1; i <= INITIAL_POINT_COUNT; i++) {
  points.push(makePoint(`🚕`, `Taxi to Airport`, `10:00`, `11:00`, `1h 30m`, `20`, [{title: `Order UBER`, price: `20`}, {title: `Upgrade to business`, price: `20`}]));
}
pointsContainer.insertAdjacentHTML(`beforeend`, points.join(``));


