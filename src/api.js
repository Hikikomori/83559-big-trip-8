import adapter from './point-data-adapter.js';

const HttpCode = {
  SUCCESS: 200,
  REDIRECT: 300
};

class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(Api._toJSON)
      .then(adapter.parsePoints);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(Api._toJSON);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(Api._toJSON);
  }

  createPoint({point}) {
    return this._load({
      url: `points`,
      method: Api._method().POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(Api._toJSON)
      .then(adapter.parsePoint);
  }

  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Api._method().PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(Api._toJSON)
      .then(adapter.parsePoint);
  }

  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: Api._method().DELETE});
  }

  _load({url, method = Api._method().GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(Api._checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  static _checkStatus(response) {
    if (response.status >= HttpCode.SUCCESS && response.status < HttpCode.REDIRECT) {
      return response;
    }

    throw new Error(`${response.status}: ${response.statusText}`);
  }

  static _toJSON(response) {
    return response.json();
  }

  static _method() {
    return {
      GET: `GET`,
      POST: `POST`,
      PUT: `PUT`,
      DELETE: `DELETE`
    };
  }
}

export default Api;
