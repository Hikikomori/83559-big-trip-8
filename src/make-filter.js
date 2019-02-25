export default (caption, isChecked = false) => {
  return `<input type="radio" id="filter-${caption.toLowerCase()}" name="filter" value="${caption.toLowerCase()}" ${isChecked ? `checked` : ``}>
    <label class="trip-filter__item" for="filter-${caption.toLowerCase()}">${caption}</label>`;
};
