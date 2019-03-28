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

  toRAW() {
    return {
      'id': this.id,
      'type': this.type.toLowerCase(),
      'destination': {
        'name': this.city,
        'pictures': this.pictures,
        'description': this.description,
      },
      'offers': this.offers,
      'date_from': this.startDateTime,
      'date_to': this.endDateTime,
      'base_price': this.price,
      'is_favorite': this.isFavorite,
    };
  }

  static parsePoint(data) {
    if (data) {
      return new PointDataAdapter(data);
    }

    return false;
  }

  static parsePoints(data) {
    return data.map(PointDataAdapter.parsePoint);
  }
}

export default PointDataAdapter;
