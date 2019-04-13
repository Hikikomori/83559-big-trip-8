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

const AUTHORIZATION = `Basic DXN0akbwYXNzd29yZAoDickKickem`;
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
let activeSorting = `Event`;
let pointDatasByDate = null;
let pointDatas = null;
let statistic = null;
let statisticContainer = null;
let availOffers = null;
let availDests = null;
let availCities = null;

viewTableBtn.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (!evt.target.classList.contains(`view-switch__item--active`)) {
    evt.target.classList.add(`view-switch__item--active`);
    viewStatsBtn.classList.remove(`view-switch__item--active`);
    mainContainer.classList.remove(`visually-hidden`);
    filterContainer.classList.remove(`visually-hidden`);
    statisticContainer.classList.add(`visually-hidden`);
  }

  return false;
});

viewStatsBtn.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (!evt.target.classList.contains(`view-switch__item--active`)) {
    evt.target.classList.add(`view-switch__item--active`);
    viewTableBtn.classList.remove(`view-switch__item--active`);
    mainContainer.classList.add(`visually-hidden`);
    filterContainer.classList.add(`visually-hidden`);
    statisticContainer.classList.remove(`visually-hidden`);
    statistic.update();
  }

  return false;
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
  pointDatas = points;
  pointDatasByDate = groupPointsByDate(sortPointsByDate(points));
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
    renderPoints(pointDatasByDate);
  };

  filters.filterFuture.onFilter = () => {
    let filteredPointDatas = groupPointsByDate(pointDatas.map((pointData) => {
      if (pointData.startDateTime && pointData.startDateTime > Date.now()) {
        return pointData;
      }
      return null;
    }));

    renderPoints(filteredPointDatas);
  };

  filters.filterPast.onFilter = () => {
    let filteredPointDatas = groupPointsByDate(pointDatas.map((pointData) => {
      if (pointData.endDateTime && pointData.endDateTime < Date.now()) {
        return pointData;
      }
      return null;
    }));

    renderPoints(filteredPointDatas);
  };
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
    activeSorting = `Event`;
    renderSortedPoints();
  };

  sortings.sortingTime.onSorting = () => {
    activeSorting = `Time`;
    renderSortedPoints();
  };

  sortings.sortingPrice.onSorting = () => {
    activeSorting = `Price`;
    renderSortedPoints();
  };
};

const renderSortedPoints = () => {
  switch (activeSorting) {
    case `Event`:
      renderPoints(pointDatasByDate);
      break;
    case `Time`:
      renderPoints([
        {
          day: {
            number: `#`,
            date: ``,
          },
          points: sortPointsBySpendTime(pointDatas)
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
          points: sortPointsByPrice(pointDatas)
        }
      ]);
      break;
  }
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
            .then(updatePoints)
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
        .then(updatePoints)
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
  return points.sort((a, b) => {
    let result = 0;
    if (a.startDateTime > b.startDateTime) {
      result = 1;
    } else {
      result = -1;
    }

    return result;
  });
};

const sortPointsBySpendTime = (points) => {
  return points.sort((a, b) => {
    let result = 0;
    if ((a.endDateTime - a.startDateTime) < (b.endDateTime - b.startDateTime)) {
      result = 1;
    } else {
      result = -1;
    }

    return result;
  });
};

const sortPointsByPrice = (points) => {
  return points.sort((a, b) => {
    let result = 0;
    if ((a.basePrice + a.offersPrice) < (b.basePrice + b.offersPrice)) {
      result = 1;
    } else {
      result = -1;
    }

    return result;
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
  let points = document.createDocumentFragment();
  for (let dataPart of data) {
    if (dataPart) {
      const day = new TripDay(dataPart.day);
      points.appendChild(day.render());

      let dayItems = document.createDocumentFragment();
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
  renderSortedPoints();
  cost.update(calculateTripCost(pointDatas));
  statistic = new Statistic(pointDatas);
  mainContainer.parentNode.appendChild(statistic.render());
  statisticContainer = document.querySelector(`.statistic`);
  statistic.drawCharts();
};

const update = () => {
  renderSortedPoints();
  cost.update(calculateTripCost(pointDatas));
};

const init = () => {
  costContainer.appendChild(cost.render());

  let filters = document.createDocumentFragment();
  generateFilters(filters, utilityData.filters);
  filterContainer.appendChild(filters);

  let sortings = document.createDocumentFragment();
  generateSortings(sortings, utilityData.sortings);
  sortingContainer.appendChild(sortings);

  pointsContainer.textContent = `Loading route...`;

  Promise.all([
    api.getPoints()
      .then((points) => {
        pointDatasByDate = groupPointsByDate(sortPointsByDate(points));
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

