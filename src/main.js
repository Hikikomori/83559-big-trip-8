import makeFilter from './make-filter.js';
import makePoint from './make-point.js';
import pointData from './generate-point-data.js';

const INITIAL_POINT_COUNT = 7;
const MIN_RANDOM_POINT_COUNT = 1;
const MAX_RANDOM_POINT_COUNT = 13;

const filterContainer = document.querySelector(`.trip-filter`);
const pointsContainer = document.querySelector(`.trip-day__items`);
const getRandomPointsValue = () => Math.round(Math.random() * MAX_RANDOM_POINT_COUNT + MIN_RANDOM_POINT_COUNT);
const filtersData = [{name: `Everything`, isChecked: true}, {name: `Future`, isChecked: false}, {name: `Past`, isChecked: false}];

const generatePoint = () => makePoint(pointData());

const filters = filtersData.map((filter) => {
  return makeFilter(filter.name, filter.isChecked);
});

filterContainer.insertAdjacentHTML(`beforeend`, filters.join(``));

const filterElements = filterContainer.querySelectorAll(`.trip-filter__item`);

for (let filter of filterElements) {
  filter.addEventListener(`click`, () => {
    pointsContainer.innerHTML = ``;
    let points = [];
    for (let i = 1; i <= getRandomPointsValue(); i++) {
      points.push(generatePoint());
    }
    pointsContainer.insertAdjacentHTML(`beforeend`, points.join(``));
  });
}

let points = [];
for (let i = 1; i <= INITIAL_POINT_COUNT; i++) {
  points.push(generatePoint());
}
pointsContainer.insertAdjacentHTML(`beforeend`, points.join(``));


