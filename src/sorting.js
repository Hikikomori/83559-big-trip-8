import component from './component.js';
import templates from './templates.js';

class Sorting extends component {
  constructor(data) {
    super();
    this._name = data.name;
    this._isChecked = data.isChecked;

    this._onSorting = null;
    this._onSortingClick = this._onSortingClick.bind(this);
  }

  get template() {
    return templates.sorting(this);
  }

  _onSortingClick() {
    return typeof this._onSorting === `function` && this._onSorting();
  }

  set onSorting(fn) {
    this._onSorting = fn;
  }

  createListeners() {
    this._element.querySelector(`.trip-sorting__input`)
      .addEventListener(`click`, this._onSortingClick);
  }

  removeListeners() {
    this._element.querySelector(`.trip-sorting__input`)
      .removeEventListener(`click`, this._onSortingClick);
  }
}

export default Sorting;
