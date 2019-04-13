export default () => {
  return {
    type: `Drive`,
    city: `New destination`,
    pictures: [],
    offers: [],
    description: `Select destination to get description`,
    startDateTime: Date.now(),
    endDateTime: Date.now(),
    basePrice: 0,
    isFavorite: false
  };
};
