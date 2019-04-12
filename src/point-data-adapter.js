import moment from "moment";

class PointDataAdapter {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`].charAt(0).toUpperCase() + data[`type`].slice(1);
    this.city = data[`destination`][`name`];
    this.pictures = data[`destination`][`pictures`];
    this.offers = data[`offers`];
    this.description = data[`destination`][`description`];
    this.startDateTime = data[`date_from`];
    this.endDateTime = data[`date_to`];
    this.date = moment(data[`date_from`]).format(`MMM D`);
    this.basePrice = data[`base_price`];
    this.offersPrice = 0;
    this.isFavorite = data[`is_favorite`];
    if (data[`offers`].length > 0) {
      this.offersPrice = data[`offers`].map((offer) => {
        if (offer.accepted) {
          return offer.price;
        }
        return 0;
      }).reduce((acc, val) => {
        return acc + val;
      });
    }
  }

  static toRAW(data) {
    return {
      'id': data.id,
      'type': data.type.toLowerCase(),
      'destination': {
        'name': data.city,
        'pictures': data.pictures,
        'description': data.description,
      },
      'offers': data.offers,
      'date_from': data.startDateTime,
      'date_to': data.endDateTime,
      'base_price': data.basePrice,
      'is_favorite': data.isFavorite,
    };
  }

  static parsePoint(data) {
    return new PointDataAdapter(data);
  }

  static parsePoints(data) {
    return data.map(PointDataAdapter.parsePoint);
  }
}

export default PointDataAdapter;
