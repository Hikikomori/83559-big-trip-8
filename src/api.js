import adapter from './point-data-adapter.js';

const HTTP_CODES = {
  success: 200,
  redirect: 300
};

class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  static _checkStatus(response) {
    if (response.status >= HTTP_CODES.success && response.status < HTTP_CODES.redirect) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static _toJSON(response) {
    return response.json();
  }

  static _method() {
    return {
      get: `GET`,
      post: `POST`,
      put: `PUT`,
      delete: `DELETE`
    };
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
      method: Api._method().post,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(Api._toJSON);
  }

  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Api._method().put,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(Api._toJSON)
      .then(adapter.parsePoint);
  }

  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: Api._method().delete});
  }

  _load({url, method = Api._method().get, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
            .then(Api._checkStatus)
            .catch((err) => {
              throw err;
            });
  }
}

export default Api;
