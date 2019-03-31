import Filter from './filter.js';
import filtersData from './filters-data.js';

import newPointData from './generate-point-data.js';

import Api from './api.js';
import Point from './point.js';
import PointEdit from './point-edit.js';
import Statistic from './statistic.js';

const AUTHORIZATION = `Basic dXN0ckbwYXNzd29yZAoDickKickem`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const controls = document.querySelector(`.trip-controls`);
const controlsBtnTable = controls.querySelector(`.view-switch__item[href="#table"]`);
const controlsBtnStats = controls.querySelector(`.view-switch__item[href="#stats"]`);
const mainContainer = document.querySelector(`.main`);
const newPoint = document.querySelector(`.new-event`);
const filterContainer = document.querySelector(`.trip-filter`);
const pointsContainer = document.querySelector(`.trip-day__items`);
const api = new Api(END_POINT, AUTHORIZATION);
let pointDatas = null;
let statistic = null;
let statsContainer = null;
let availOffers = null;
let availDests = null;

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

const generatePoints = (fragment, data) => {
  if (data) {
    let pointData = data;
    let point = new Point(pointData);
    let pointEdit = new PointEdit(pointData, availDests, availOffers);

    fragment.appendChild(point.render());
    point.onClick = () => {
      pointEdit.render();
      pointsContainer.replaceChild(pointEdit.element, point.element);
      point.unrender();
    };

    pointEdit.onSubmit = (obj) => {
      const element = pointEdit.element;
      const form = element.querySelector(`.point__form`);
      const saveBtn = element.querySelector(`.point__button--save`);

      pointData.type = obj.type;
      pointData.city = obj.city;
      pointData.offers = obj.offers;
      pointData.startDateTime = obj.startDateTime;
      pointData.endDateTime = obj.endDateTime;
      pointData.basePrice = obj.basePrice;
      pointData.offersPrice = obj.offersPrice;
      pointData.isFavorite = obj.isFavorite;

      form.setAttribute(`disabled`, `disabled`);
      saveBtn.textContent = `Saving...`;

      api.updatePoint({id: pointData.id, data: pointData.toRAW()})
        .then((editedpointData) => {
          point.update(editedpointData);
          point.render();
          pointsContainer.replaceChild(point.element, pointEdit.element);
          pointEdit.unrender();
        })
        .catch(() => {
          form.removeAttribute(`disabled`);
          saveBtn.textContent = `Save`;
          element.style.border = `2px solid red`;
          element.classList.add(`shake`);
        });

      statistic.update();
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
          pointDatas = points;
        })
        .then(update)
        .catch(() => {
          form.removeAttribute(`disabled`);
          element.style.border = `2px solid red`;
          element.classList.add(`shake`);
          deleteBtn.textContent = `Delete`;
        });
    };
  }
};

const renderPoints = (data) => {
  pointsContainer.innerHTML = ``;
  let points = document.createDocumentFragment();
  for (let dataPart of data) {
    generatePoints(points, dataPart);
  }
  pointsContainer.appendChild(points);
};

const init = () => {
  pointsContainer.textContent = ``;
  renderPoints(pointDatas);
  statistic = new Statistic(pointDatas); mainContainer.parentNode.appendChild(statistic.render());
  statsContainer = document.querySelector(`.statistic`);
  statistic.drawCharts();
};

const update = () => {
  renderPoints(pointDatas);
  statistic.update(pointDatas);
};

let filters = document.createDocumentFragment();
generateFilters(filters, filtersData);
filterContainer.appendChild(filters);

pointsContainer.textContent = `Loading route...`;

api.getPoints()
  .catch(() => {
    pointsContainer.textContent = `Something went wrong while loading your route info. Check your connection or try again later`;
  })
  .then((points) => {
    pointDatas = points;
  })
  .then(() => {
    api.getOffers()
      .then((offers) => {
        availOffers = offers;
      })
      .then(() => {
        api.getDestinations()
          .then((dests) => {
            availDests = dests;
          })
          .then(init);
      });
  });

newPoint.addEventListener(`click`, () => {
  api.createPoint({point: newPointData})
    .then(() => api.getPoints())
    .then((points) => {
      pointDatas = points;
    })
    .then(update);
});


