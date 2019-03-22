import Component from './component.js';

class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._isChecked = data.isChecked;

    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  get template() {
    return `<span class="filter-wrap">
  <input type="radio" class="trip-filter__input" id="filter-${this._name.toLowerCase()}" name="filter" value="${this._name.toLowerCase()}" ${this._isChecked ? `checked` : ``}>
    <label class="trip-filter__item" for="filter-${this._name.toLowerCase()}">${this._name}</label></span>`.trim();
  }

  _onFilterClick() {
    return typeof this._onFilter === `function` && this._onFilter();
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  createListeners() {
    this._element.querySelector(`.trip-filter__input`)
      .addEventListener(`click`, this._onFilterClick);
  }

  removeListeners() {
    this._element.querySelector(`.trip-filter__input`)
      .removeEventListener(`click`, this._onFilterClick);
  }
}

export default Filter;
