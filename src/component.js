class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._element = null;
    this._icons = new Map([
      [`Taxi`, `🚕`],
      [`Bus`, `🚌`],
      [`Train`, `🚂`],
      [`Ship`, `🛳️`],
      [`Transport`, `🚊`],
      [`Drive`, `🚗`],
      [`Flight`, `✈️`],
      [`Check-in`, `🏨`],
      [`Sightseeing`, `🏛️`],
      [`Restaurant`, `🍴`]
    ]);
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  createListeners() {}

  removeListeners() {}

  render() {
    this._element = Component.createNode(this.template);
    this.createListeners();
    return this._element;
  }

  unrender() {
    this.removeListeners();
    this._element.remove();
    this._element = null;
  }

  static createNode(template) {
    const container = document.createElement(`div`);
    container.insertAdjacentHTML(`beforeend`, template);
    return container.firstChild;
  }
}

export default Component;
