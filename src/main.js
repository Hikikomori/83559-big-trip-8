import makeFilter from './make-filter.js';
import pointData from './generate-point-data.js';

import Point from './point.js';
import PointEdit from './point-edit.js';

const INITIAL_POINT_COUNT = 7;
const MIN_RANDOM_POINT_COUNT = 1;
const MAX_RANDOM_POINT_COUNT = 13;

const filterContainer = document.querySelector(`.trip-filter`);
const pointsContainer = document.querySelector(`.trip-day__items`);
const getRandomPointsValue = () => Math.round(Math.random() * MAX_RANDOM_POINT_COUNT + MIN_RANDOM_POINT_COUNT);
const filtersData = [{name: `Everything`, isChecked: true}, {name: `Future`, isChecked: false}, {name: `Past`, isChecked: false}];

const generatePoints = (fragment) => {
  let data = pointData();
  let point = new Point(data);
  let pointEdit = new PointEdit(data);

  fragment.appendChild(point.render());
  point.onClick = () => {
    pointEdit.render();
    pointsContainer.replaceChild(pointEdit.element, point.element);
    point.unrender();
  };

  pointEdit.onSubmit = (obj) => {
    data.type = obj.type;
    data.city = obj.city;
    data.activeOffers = obj.activeOffers;
    data.startDate = obj.startDate;
    data.endDate = obj.endDate;
    data.price = obj.price;
    data.isFavorite = obj.isFavorite;

    point.update(data);
    point.render();
    pointsContainer.replaceChild(point.element, pointEdit.element);
    pointEdit.unrender();
  };

  pointEdit.onReset = () => {
    point.render();
    pointsContainer.replaceChild(point.element, pointEdit.element);
    pointEdit.unrender();
  };
};

const filters = filtersData.map((filter) => {
  return makeFilter(filter.name, filter.isChecked);
});

filterContainer.insertAdjacentHTML(`beforeend`, filters.join(``));

const filterElements = filterContainer.querySelectorAll(`.trip-filter__item`);

for (let filter of filterElements) {
  filter.addEventListener(`click`, () => {
    pointsContainer.innerHTML = ``;
    let points = document.createDocumentFragment();
    for (let i = 1; i <= getRandomPointsValue(); i++) {
      generatePoints(points);
    }
    pointsContainer.appendChild(points);
  });
}

let points = document.createDocumentFragment();
for (let i = 1; i <= INITIAL_POINT_COUNT; i++) {
  generatePoints(points);
}
pointsContainer.appendChild(points);
