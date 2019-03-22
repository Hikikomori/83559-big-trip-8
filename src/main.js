import Filter from './filter.js';
import filtersData from './filters-data.js';

import makePointData from './generate-point-data.js';

import Point from './point.js';
import PointEdit from './point-edit.js';
import Statistic from './statistic.js';

const INITIAL_POINT_COUNT = 7;

const controls = document.querySelector(`.trip-controls`);
const controlsBtnTable = controls.querySelector(`.view-switch__item[href="#table"]`);
const controlsBtnStats = controls.querySelector(`.view-switch__item[href="#stats"]`);
const mainContainer = document.querySelector(`.main`);
const filterContainer = document.querySelector(`.trip-filter`);
const pointsContainer = document.querySelector(`.trip-day__items`);

const createDataArr = (length) => {
  let base = new Array(length).fill(null);
  return base.map(() => makePointData());
};

const initialPointDatas = createDataArr(INITIAL_POINT_COUNT);

controlsBtnTable.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (!evt.target.classList.contains(`view-switch__item--active`)) {
    evt.target.classList.add(`view-switch__item--active`);
    controlsBtnStats.classList.remove(`view-switch__item--active`);
    mainContainer.classList.remove(`visually-hidden`);
    statsContainer.classList.add(`visually-hidden`);
  }

  return false;
});

controlsBtnStats.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (!evt.target.classList.contains(`view-switch__item--active`)) {
    evt.target.classList.add(`view-switch__item--active`);
    controlsBtnTable.classList.remove(`view-switch__item--active`);
    mainContainer.classList.add(`visually-hidden`);
    statsContainer.classList.remove(`visually-hidden`);
    statistic.update();
  }

  return false;
});

const generateFilters = (fragment, data) => {
  const findFilter = (name) => data.find((elem) => elem.name === name);

  const filterEverything = new Filter(findFilter(`Everything`));
  const filterFuture = new Filter(findFilter(`Future`));
  const filterPast = new Filter(findFilter(`Past`));

  fragment.appendChild(filterEverything.render());
  fragment.appendChild(filterFuture.render());
  fragment.appendChild(filterPast.render());

  filterEverything.onFilter = () => {
    renderPoints(initialPointDatas);
  };

  filterFuture.onFilter = () => {
    let pointDatas = initialPointDatas.map((pointData) => {
      if (pointData.startDate && pointData.endDate && (pointData.startDate + pointData.endDate) / 2 > Date.now()) {
        return pointData;
      }
      return null;
    });

    renderPoints(pointDatas);
  };

  filterPast.onFilter = () => {
    let pointDatas = initialPointDatas.map((pointData) => {
      if (pointData.startDate && pointData.endDate && (pointData.startDate + pointData.endDate) / 2 < Date.now()) {
        return pointData;
      }
      return null;
    });

    renderPoints(pointDatas);
  };
};

const generatePoints = (fragment, data, i) => {
  if (data[i]) {
    let pointData = data[i];
    let point = new Point(pointData);
    let pointEdit = new PointEdit(pointData);

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

    pointEdit.onDelete = () => {
      pointEdit.unrender();
      data[i] = null;
      statistic.update();
    };
  }
};

const renderPoints = (data) => {
  pointsContainer.innerHTML = ``;
  let points = document.createDocumentFragment();
  for (let i = 0; i < data.length; i++) {
    generatePoints(points, data, i);
  }
  pointsContainer.appendChild(points);
};

let filters = document.createDocumentFragment();
generateFilters(filters, filtersData);
filterContainer.appendChild(filters);

renderPoints(initialPointDatas);

const statistic = new Statistic(initialPointDatas);
mainContainer.parentNode.appendChild(statistic.render());
const statsContainer = document.querySelector(`.statistic`);
statistic.drawCharts();


