import PointDataAdapter from './point-data-adapter.js';

class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._method = {
      get: `GET`,
      post: `POST`,
      put: `PUT`,
      delete: `DELETE`
    };
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  _toJSON(response) {
    return response.json();
  }

  getPoints() {
    return this._load({url: `points`})
      .then(this._toJSON)
      .then(PointDataAdapter.parsePoints);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(this._toJSON);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(this._toJSON);
  }

  createPoint({point}) {
    return this._load({
      url: `points`,
      method: this._method.post,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(this._toJSON)
      .then(PointDataAdapter.parsePoint);
  }

  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: this._method.put,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(this._toJSON)
      .then(PointDataAdapter.parsePoint);
  }

  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: this._method.delete});
  }

  _load({url, method = this._method.get, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
            .then(this._checkStatus)
            .catch((err) => {
              throw err;
            });
  }
}

export default Api;
