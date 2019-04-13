import component from './component.js';
import templates from './templates.js';

class TripCost extends component {
  constructor(cost) {
    super();
    this._cost = cost;
  }

  get template() {
    return templates.tripCost(this);
  }

  _partialUpdate() {
    this._elementCopy = this._element;
    this._element = this.createNode(this.template);
    this._elementCopy.parentNode.replaceChild(this._element, this._elementCopy);
  }

  update(cost) {
    this._cost = cost;
    this._partialUpdate();
  }
}

export default TripCost;
