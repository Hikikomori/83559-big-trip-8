import Filter from './filter.js';
import filtersData from './filters-data.js';
import newPointData from './new-point-data.js';

import Api from './api.js';
import Adapter from './point-data-adapter.js';
import TripDay from './trip-day.js';
import Point from './point.js';
import PointEdit from './point-edit.js';
import Statistic from './statistic.js';

const AUTHORIZATION = `Basic DXN0fkbwYXNzd29yZAoDickKickem`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const controls = document.querySelector(`.trip-controls`);
const controlsBtnTable = controls.querySelector(`.view-switch__item[href="#table"]`);
const controlsBtnStats = controls.querySelector(`.view-switch__item[href="#stats"]`);
const mainContainer = document.querySelector(`.main`);
const newPoint = document.querySelector(`.new-event`);
const filterContainer = document.querySelector(`.trip-filter`);
const pointsContainer = document.querySelector(`.trip-points`);
const api = new Api(END_POINT, AUTHORIZATION);
let pointDatasByDate = null;
let pointDatas = null;
let statistic = null;
let statsContainer = null;
let availOffers = null;
let availDests = null;
let availCities = null;

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
    renderPoints(pointDatas);
    statistic.update(pointDatas);
  };

  filterFuture.onFilter = () => {
    let filteredPointDatas = pointDatas.map((pointData) => {
      if (pointData.startDateTime && pointData.startDateTime > Date.now()) {
        return pointData;
      }
      return null;
    });

    renderPoints(filteredPointDatas);
    statistic.update(filteredPointDatas);
  };

  filterPast.onFilter = () => {
    let filteredPointDatas = pointDatas.map((pointData) => {
      if (pointData.startDateTime && pointData.startDateTime < Date.now()) {
        return pointData;
      }
      return null;
    });

    renderPoints(filteredPointDatas);
    statistic.update(filteredPointDatas);
  };
};

const generatePoint = (container, data, isNew) => {
  if (data) {
    let pointData = data;
    let point = new Point(pointData);
    let pointEdit = new PointEdit(pointData, availDests, availOffers);

    if (isNew) {
      container.appendChild(pointEdit.render());
    } else {
      container.appendChild(point.render());
    }

    point.onClick = () => {
      pointEdit.render();
      point.element.parentNode.replaceChild(pointEdit.element, point.element);
      point.unrender();
    };

    pointEdit.onSubmit = (obj) => {
      const element = pointEdit.element;
      const form = element.querySelector(`.point__form`);
      const saveBtn = element.querySelector(`.point__button--save`);

      const editedPointData = Object.assign(pointData, obj);

      if (availCities.includes(editedPointData.city)) {
        form.setAttribute(`disabled`, `disabled`);
        saveBtn.textContent = `Saving...`;

        if (!isNew) {
          api.updatePoint({id: editedPointData.id, data: Adapter.toRAW(editedPointData)})
            .then((receivedPointData) => {
              pointData = receivedPointData;
              pointEdit.update(pointData);
              point.update(pointData);
              point.render();
              pointEdit.element.parentNode.replaceChild(point.element, pointEdit.element);
              pointEdit.unrender();
            })
            .catch(() => {
              form.removeAttribute(`disabled`);
              saveBtn.textContent = `Save`;
              element.style.border = `2px solid red`;
              element.classList.add(`shake`);
            });

          pointEdit.update(pointData);
        } else {
          api.createPoint({point: Adapter.toRAW(editedPointData)})
            .then(() => api.getPoints())
            .then((points) => {
              pointDatasByDate = sortPointsByDate(points);
            })
            .then(() => pointEdit.unrender())
            .then(update)
            .catch(() => {
              form.removeAttribute(`disabled`);
              saveBtn.textContent = `Save`;
              element.style.border = `2px solid red`;
              element.classList.add(`shake`);
            });
        }
      } else {
        element.querySelector(`.point__destination-input`).setCustomValidity(`Please select destination from list`);
      }
    };

    pointEdit.onDelete = ({id}) => {
      const element = pointEdit.element;
      const form = element.querySelector(`.point__form`);
      const deleteBtn = element.querySelector(`.point__button--delete`);

      form.setAttribute(`disabled`, `disabled`);
      deleteBtn.textContent = `Deleting...`;

      api.deletePoint({id})
        .then(() => api.getPoints())
        .then((points) => {
          pointDatasByDate = sortPointsByDate(points);
        })
        .then(update)
        .catch(() => {
          form.removeAttribute(`disabled`);
          element.style.border = `2px solid red`;
          element.classList.add(`shake`);
          deleteBtn.textContent = `Delete`;
        });
    };

    pointEdit.onEsc = () => {
      if (pointEdit.element.parentNode.classList.contains(`trip-points`)) {
        pointEdit.unrender();
      } else {
        point.render();
        pointEdit.element.parentNode.replaceChild(point.element, pointEdit.element);
        pointEdit.unrender();
        pointEdit.update(pointData);
      }
    };
  }
};

const sortPointsByDate = (points) => {
  points.sort((a, b) => {
    let result = 0;
    if (a.startDateTime > b.startDateTime) {
      result = 1;
    } else {
      result = -1;
    }

    return result;
  });

  const pointDates = Array.from(new Set(points.map((point) => {
    return point.date;
  })));

  return pointDates.map((pointDate, i) => {
    return {
      day: {
        number: i + 1,
        date: pointDate,
      },
      points: points.filter((point) => point.date === pointDate)
    };
  });
};

const renderPoints = (data) => {
  pointsContainer.innerHTML = ``;

  let points = document.createDocumentFragment();
  for (let dataPart of data) {
    const day = new TripDay(dataPart.day);
    points.appendChild(day.render());

    let dayItems = document.createDocumentFragment();
    for (let point of dataPart.points) {
      generatePoint(dayItems, point);
    }

    day.element.querySelector(`.trip-day__items`).appendChild(dayItems);
  }

  pointsContainer.appendChild(points);
};

const init = () => {
  pointsContainer.textContent = ``;
  renderPoints(pointDatasByDate);
  statistic = new Statistic(pointDatas);
  mainContainer.parentNode.appendChild(statistic.render());
  statsContainer = document.querySelector(`.statistic`);
  statistic.drawCharts();
};

const update = () => {
  renderPoints(pointDatasByDate);
  statistic.update(pointDatas);
};

let filters = document.createDocumentFragment();
generateFilters(filters, filtersData);
filterContainer.appendChild(filters);

pointsContainer.textContent = `Loading route...`;

Promise.all([
  api.getPoints()
    .then((points) => {
      pointDatasByDate = sortPointsByDate(points);
      pointDatas = points;
    }),
  api.getOffers()
    .then((offers) => {
      availOffers = offers;
    }),
  api.getDestinations()
    .then((dests) => {
      availDests = dests;
      availCities = dests.map((dest) => dest.name);
    })
]).then(init, () => {
  pointsContainer.textContent = `Something went wrong while loading your route info. Check your connection or try again later`;
});

newPoint.addEventListener(`click`, () => {
  const fragment = document.createDocumentFragment();
  generatePoint(fragment, newPointData(), true);
  const tripDay = pointsContainer.querySelector(`.trip-day`);
  if (!tripDay.previousElementSibling) {
    pointsContainer.insertBefore(fragment, pointsContainer.firstChild);
  }
});

