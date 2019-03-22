import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Component from './component.js';

class Statistic extends Component {
  constructor(data) {
    super();
    this._barHeight = 55;
    this._fullData = data;
    this._data = null;
    this._moneyCtx = null;
    this._transportCtx = null;
    this._moneyChart = null;
    this._transportChart = null;
    this._types = null;
    this._typesTitles = null;
    this._transportTitles = null;
    this._formattedTypesTitles = null;
    this._formattedTransportTitles = null;
    this._typesCosts = null;
    this._transportCounts = null;
  }

  _generateChartData() {
    this._data = this._fullData.filter((elem) => elem);
    this._types = this._data.map((pointData) => {
      if (pointData) {
        return pointData.type;
      }
      return ``;
    });

    this._typesTitles = Array.from(new Set(this._types));
    this._formattedTypesTitles = this._typesTitles.map((title) => {
      return `${this._icons.get(title)} ${title.toUpperCase()}`;
    });

    this._transportTitles = this._typesTitles.map((type) => {
      if (type !== `Check-in` && type !== `Sightseeing` && type !== `Restaurant`) {
        return type;
      }
      return ``;
    }).filter((elem) => elem);
    this._formattedTransportTitles = this._transportTitles.map((title) => {
      return `${this._icons.get(title)} ${title.toUpperCase()}`;
    });

    this._typesCosts = this._typesTitles.map((type) => {
      return this._data.filter((elem) => {
        return elem.type === type;
      }).map((elem) => {
        return elem.price;
      }).reduce((acc, val) => {
        return acc + val;
      });
    });

    this._transportCounts = this._transportTitles.map((transport) => {
      return this._types.filter((type) => {
        return type === transport;
      }).length;
    });
  }

  get template() {
    return `<section class="statistic content-wrap visually-hidden" id="stats">
  <div class="statistic__item statistic__item--money">
    <canvas class="statistic__money" width="900"></canvas>
  </div>

  <div class="statistic__item statistic__item--transport">
    <canvas class="statistic__transport" width="900"></canvas>
  </div>

  <div class="statistic__item statistic__item--time-spend">
    <canvas class="statistic__time-spend" width="900"></canvas>
  </div>
</section>`;
  }

  drawCharts() {
    this._moneyCtx = this._element.querySelector(`.statistic__money`);
    this._transportCtx = this._element.querySelector(`.statistic__transport`);
    this._generateChartData();

    this._moneyCtx.height = this._barHeight * this._typesTitles.length;
    this._transportCtx.height = this._barHeight * this._transportTitles.length;

    this._moneyChart = new Chart(this._moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._formattedTypesTitles,
        datasets: [{
          data: this._typesCosts,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
    this._transportChart = new Chart(this._transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._formattedTransportTitles,
        datasets: [{
          data: this._transportCounts,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`
          }
        },
        title: {
          display: true,
          text: `TRANSPORT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  update() {
    this._generateChartData();
    this._moneyChart.data.labels = this._formattedTypesTitles;
    this._moneyChart.data.datasets[0].data = this._typesCosts;
    this._transportChart.data.labels = this._formattedTransportTitles;
    this._transportChart.data.datasets[0].data = this._transportCounts;
    this._moneyChart.update();
    this._transportChart.update();
  }
}

export default Statistic;

