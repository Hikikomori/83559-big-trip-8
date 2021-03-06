import Component from './component.js';
import templates from './templates.js';

class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._isChecked = data.isChecked;

    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  get template() {
    return templates.filter(this);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onFilterClick() {
    return typeof this._onFilter === `function` && this._onFilter();
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
