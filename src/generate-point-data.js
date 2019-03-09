const TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
const CITIES = [`Amsterdam`, `Geneva`, `Chamonix`];
const OFFERS = [{value: `add-luggage`, title: `Add luggage`, price: 30}, {value: `switch-to-comfort-class`, title: `Switch to comfort class`, price: 100}, {value: `add-meal`, title: `Add meal`, price: 15}, {value: `choose-seats`, title: `Choose seats`, price: 5}, {value: `travel-by-train`, title: `Travel by train`, price: 40}];
const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];
const MILLISECONDS_IN_DAY = 86400000;
const MAX_OFFERS_VALUE = 3;
const MAX_PICTURES_COUNT = 5;
const MIN_DESCRIPTION_SENTENCES = 1;
const MAX_DESCRIPTION_SENTENCES = 3;
const MIN_PRICE = 20;
const MAX_PRICE = 600;

const getRandomArrElem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const arrayToSet = (arr, size = arr.length) => {
  let set = new Set();

  while (set.size < size) {
    set.add(getRandomArrElem(arr));
  }

  return set;
};

const arrayRandomJoin = (arr, length = arr.length) => {
  let newArr = [];

  while (newArr.length < length) {
    newArr.push(getRandomArrElem(arr));
  }

  return newArr.join(` `);
};

const generatePictures = () => {
  let pictures = [];

  for (let i = Math.floor(Math.random() * MAX_PICTURES_COUNT); i < MAX_PICTURES_COUNT; i++) {
    pictures.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }

  return pictures;
};

export default () => ({
  type: getRandomArrElem(TYPES),
  city: getRandomArrElem(CITIES),
  pictures: generatePictures(),
  offers: Array.from(arrayToSet(OFFERS, Math.floor(Math.random() * MAX_OFFERS_VALUE))),
  description: arrayRandomJoin(DESCRIPTIONS, Math.floor(Math.random() * MAX_DESCRIPTION_SENTENCES) + MIN_DESCRIPTION_SENTENCES),
  startDate: Date.now(),
  endDate: Date.now() + Math.floor(Math.random() * MILLISECONDS_IN_DAY),
  price: Math.floor(Math.random() * MAX_PRICE) + MIN_PRICE,
});
