import Api from './api.js';
import Adapter from './point-data-adapter.js';

import TripCost from './trip-cost.js';
import Filter from './filter.js';
import Sorting from './sorting.js';
import utilityData from './utility-data.js';
import Statistic from './statistic.js';

import newPointData from './new-point-data.js';
import TripDay from './trip-day.js';
import Point from './point.js';
import PointEdit from './point-edit.js';

const AUTHORIZATION = `Basic DXN0ajbwYXNzd29yZAoDickKickem`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const mainContainer = document.querySelector(`.main`);
const viewTableBtn = document.querySelector(`.view-switch__item[href="#table"]`);
const viewStatsBtn = document.querySelector(`.view-switch__item[href="#stats"]`);
const newEventBtn = document.querySelector(`.new-event`);
const costContainer = document.querySelector(`.trip`);
const filterContainer = document.querySelector(`.trip-filter`);
const sortingContainer = document.querySelector(`.trip-sorting`);
const pointsContainer = document.querySelector(`.trip-points`);
const api = new Api(END_POINT, AUTHORIZATION);
const cost = new TripCost(`###`);
let activeFilter = `Everything`;
let activeSorting = `Event`;
let pointDatas = null;
let statistic = null;
let statisticContainer = null;
let availOffers = null;
let availDests = null;
let availCities = null;

const switchVisibleTab = (evt, show, hide) => {
  evt.preventDefault();

  const Class = {
    ACTIVE: `view-switch__item--active`,
    HIDDEN: `visually-hidden`
  };

  if (!evt.target.classList.contains(Class.ACTIVE)) {
    evt.target.parentNode.querySelector(`.${Class.ACTIVE}`).classList.remove(Class.ACTIVE);
    evt.target.classList.add(Class.ACTIVE);

    for (let elem of show) {
      elem.classList.remove(Class.HIDDEN);
    }

    for (let elem of hide) {
      elem.classList.add(Class.HIDDEN);
    }
  }
};

viewTableBtn.addEventListener(`click`, (evt) => {
  switchVisibleTab(evt, [mainContainer, filterContainer], [statisticContainer]);
});

viewStatsBtn.addEventListener(`click`, (evt) => {
  switchVisibleTab(evt, [statisticContainer], [mainContainer, filterContainer]);
  statistic.update();
});

const findinArray = (data, name) => data.find((elem) => elem.name === name);

const calculateTripCost = (points) => {
  return points.map((point) => {
    return point.basePrice + point.offersPrice;
  }).reduce((acc, val) => {
    return acc + val;
  });
};

const updatePoints = (points) => {
  pointDatas = sortPointsByDate(points);
};

const generateFilters = (fragment, data) => {
  const filters = {
    filterEverything: new Filter(findinArray(data, `Everything`)),
    filterFuture: new Filter(findinArray(data, `Future`)),
    filterPast: new Filter(findinArray(data, `Past`))
  };

  for (let filter in filters) {
    if (filters.hasOwnProperty(filter)) {
      fragment.appendChild(filters[filter].render());
    }
  }

  filters.filterEverything.onFilter = () => {
    renderSortedPoints(activeSorting, filterPoints(`Everything`));
  };

  filters.filterFuture.onFilter = () => {
    renderSortedPoints(activeSorting, filterPoints(`Future`));
  };

  filters.filterPast.onFilter = () => {
    renderSortedPoints(activeSorting, filterPoints(`Past`));
  };
};

const filterPoints = (filter = activeFilter) => {
  activeFilter = filter;

  switch (activeFilter) {
    case `Everything`:
      return pointDatas;
    case `Future`:
      return pointDatas.map((pointData) => {
        return pointData.startDateTime && pointData.startDateTime > Date.now() ? pointData : null;
      });
    case `Past`:
      return pointDatas.map((pointData) => {
        return pointData.endDateTime && pointData.endDateTime < Date.now() ? pointData : null;
      });
  }

  return false;
};

const generateSortings = (fragment, data) => {
  const sortings = {
    sortingEvent: new Sorting(findinArray(data, `Event`)),
    sortingTime: new Sorting(findinArray(data, `Time`)),
    sortingPrice: new Sorting(findinArray(data, `Price`)),
    sortingOffers: new Sorting(findinArray(data, `Offers`))
  };

  for (let sorting in sortings) {
    if (sortings.hasOwnProperty(sorting)) {
      fragment.appendChild(sortings[sorting].render());
    }
  }

  sortings.sortingEvent.onSorting = () => {
    renderSortedPoints(`Event`, filterPoints());
  };

  sortings.sortingTime.onSorting = () => {
    renderSortedPoints(`Time`, filterPoints());
  };

  sortings.sortingPrice.onSorting = () => {
    renderSortedPoints(`Price`, filterPoints());
  };
};

const renderSortedPoints = (sorting = activeSorting, points = pointDatas) => {
  activeSorting = sorting;
  points = points.filter((elem) => elem);

  switch (activeSorting) {
    case `Event`:
      renderPoints(groupPointsByDate(points));
      break;
    case `Time`:
      renderPoints([
        {
          day: {
            number: `#`,
            date: ``,
          },
          points: sortPointsBySpendTime(points)
        }
      ]);
      break;
    case `Price`:
      renderPoints([
        {
          day: {
            number: `#`,
            date: ``,
          },
          points: sortPointsByPrice(points)
        }
      ]);
      break;
  }
};

const getPointFormParts = (point) => {
  return {
    inputs: point.element.querySelectorAll(`.point__form input`),
    saveBtn: point.element.querySelector(`.point__button--save`),
    deleteBtn: point.element.querySelector(`.point__button--delete`)
  };
};

const disableForm = (point, mode) => {
  const {inputs, saveBtn, deleteBtn} = getPointFormParts(point);

  for (let item of [...inputs, saveBtn, deleteBtn]) {
    item.setAttribute(`disabled`, `disabled`);
  }

  point.removeListeners();

  switch (mode) {
    case `save`:
      saveBtn.textContent = `Saving...`;
      break;
    case `delete`:
      deleteBtn.textContent = `Deleting...`;
      break;
  }
};

const enableForm = (point, mode) => {
  const element = point.element;
  const {inputs, saveBtn, deleteBtn} = getPointFormParts(point);

  for (let item of [...inputs, saveBtn, deleteBtn]) {
    item.removeAttribute(`disabled`);
  }

  point.createListeners();

  switch (mode) {
    case `save`:
      saveBtn.textContent = `Save`;
      break;
    case `delete`:
      deleteBtn.textContent = `Delete`;
      break;
  }

  element.style.border = `2px solid red`;
  element.classList.add(`shake`);
};

const generatePoint = (container, data, isNew) => {
  if (data) {
    let pointData = data;
    const point = new Point(pointData);
    const pointEdit = new PointEdit(pointData, availDests, availOffers);

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
      const editedPointData = Object.assign({}, pointData);
      Object.assign(editedPointData, obj);

      if (availCities.includes(editedPointData.city)) {
        disableForm(pointEdit, `save`);

        if (!isNew) {
          api.updatePoint({id: editedPointData.id, data: Adapter.toRAW(editedPointData)})
            .then((receivedPointData) => {
              pointData = receivedPointData;
              pointEdit.update(pointData);
              point.update(pointData);
            })
            .then(() => api.getPoints())
            .then((points) => {
              point.render();
              pointEdit.element.parentNode.replaceChild(point.element, pointEdit.element);
              pointEdit.unrender();
              cost.update(calculateTripCost(points));
              return points;
            })
            .then(updatePoints)
            .then(update)
            .catch(() => {
              enableForm(pointEdit, `save`);
            });

          pointEdit.update(pointData);
        } else {
          api.createPoint({point: Adapter.toRAW(editedPointData)})
            .then((receivedPointData) => {
              pointDatas.push(receivedPointData);
              return pointDatas;
            })
            .then(updatePoints)
            .then(() => pointEdit.unrender())
            .then(update)
            .catch(() => {
              enableForm(pointEdit, `save`);
            });
        }
      } else {
        pointEdit.element.querySelector(`.point__destination-input`).setCustomValidity(`Please select destination from list`);
      }
    };

    pointEdit.onDelete = ({id}) => {
      disableForm(pointEdit, `delete`);

      api.deletePoint({id})
        .then(() => api.getPoints())
        .then(updatePoints)
        .then(update)
        .catch(() => {
          enableForm(pointEdit, `delete`);
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
  return points.sort((a, b) => {
    return a.startDateTime > b.startDateTime ? 1 : -1;
  });
};

const sortPointsBySpendTime = (points) => {
  return points.sort((a, b) => {
    return (a.endDateTime - a.startDateTime) < (b.endDateTime - b.startDateTime) ? 1 : -1;
  });
};

const sortPointsByPrice = (points) => {
  return points.sort((a, b) => {
    return (a.basePrice + a.offersPrice) < (b.basePrice + b.offersPrice) ? 1 : -1;
  });
};

const groupPointsByDate = (points) => {
  points = points.filter((elem) => elem);
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
  const points = document.createDocumentFragment();
  for (let dataPart of data) {
    if (dataPart) {
      const day = new TripDay(dataPart.day);
      points.appendChild(day.render());

      const dayItems = document.createDocumentFragment();
      for (let point of dataPart.points) {
        generatePoint(dayItems, point);
      }

      day.element.querySelector(`.trip-day__items`).appendChild(dayItems);
    }
  }

  pointsContainer.appendChild(points);
};

const load = () => {
  pointsContainer.textContent = ``;
  renderSortedPoints(activeSorting, filterPoints());
  cost.update(calculateTripCost(pointDatas));
  statistic = new Statistic(pointDatas);
  mainContainer.parentNode.appendChild(statistic.render());
  statisticContainer = document.querySelector(`.statistic`);
  statistic.drawCharts();
};

const update = () => {
  renderSortedPoints(activeSorting, filterPoints());
  cost.update(calculateTripCost(pointDatas));
};

const init = () => {
  costContainer.appendChild(cost.render());

  const filters = document.createDocumentFragment();
  generateFilters(filters, utilityData.filters);
  filterContainer.appendChild(filters);

  const sortings = document.createDocumentFragment();
  generateSortings(sortings, utilityData.sortings);
  sortingContainer.appendChild(sortings);

  pointsContainer.textContent = `Loading route...`;

  Promise.all([
    api.getPoints()
      .then((points) => {
        pointDatas = sortPointsByDate(points);
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
  ]).then(load, () => {
    pointsContainer.textContent = `Something went wrong while loading your route info. Check your connection or try again later`;
  });

  newEventBtn.addEventListener(`click`, () => {
    const fragment = document.createDocumentFragment();
    generatePoint(fragment, newPointData(), true);
    const tripDay = pointsContainer.querySelector(`.trip-day`);
    if (!tripDay.previousElementSibling) {
      pointsContainer.insertBefore(fragment, pointsContainer.firstChild);
    }
  });
};

init();

