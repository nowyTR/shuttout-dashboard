// @flow

import React, { Component } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import { Header, Loader } from 'semantic-ui-react';
import TopMenu from './TopMenu';
import DisplayPanel from './DisplayPanel';

class App extends Component {
  state = {
    apiLoaded: false,
    data: {}
  };

  componentDidMount() {
    this.apiInit();
  }

  apiInit() {
    const CLIENT_ID = '1071518246281-2peqeloqqtr11hq6t5jk79eheue5ba82.apps.googleusercontent.com';

    /* global gapi */
    // $FlowFixMe
    gapi.analytics.ready(() => {
      gapi.analytics.auth.authorize({
        container: 'embed-api-auth-container',
        clientid: CLIENT_ID,
        scopes: 'https://www.googleapis.com/auth/analytics.readonly'
      });

      gapi.analytics.auth.on('signIn', () => {
        const authButton = document.getElementById('embed-api-auth-container');

        if (authButton) {
          authButton.innerHTML = '';
        }

        this.apiCall();
      });
    });
  }

  apiCall() {
    /**
     * Make api call and update state
     */
    const TABLE_ID = 'ga:101878164';
    const responseData = {
      apiLoaded: false,
      browsers: {},
      pageViewsMonth: '',
      pageViewsDay: '',
      activeUsersMonthly: [],
      userDevice: {},
      newUsers: {},
      registeredUsers: {},
      exitRate: '',
      bounceRate: '',
      uniquePageviews: ''
    };
    const now = moment();

    /**
     * Extend the Embed APIs `gapi.analytics.report.Data` component to
     * return a promise the is fulfilled with the value returned by the API.
     * @param {Object} params The request parameters.
     * @return {Promise} A promise.
     */
    function apiQuery(params) {
      return new Promise((resolve, reject) => {
        // $FlowFixMe
        const data = new gapi.analytics.report.Data({ query: params });
        data
          .once('success', response => {
            resolve(response);
          })
          .once('error', response => {
            reject(response);
          })
          .execute();
      });
    }

    Promise.all([
      apiQuery({
        ids: TABLE_ID,
        dimensions: 'ga:browser',
        metrics: 'ga:pageviews',
        sort: '-ga:pageviews',
        'max-results': 5
      }) // Browser popularity
        .then(response => {
          responseData.browsers = {
            labels: [],
            datasets: [
              {
                label: 'Browser popularity',
                data: [],
                backgroundColor: []
              }
            ]
          };
          const colors = [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ];

          response.rows.forEach((row, i) => {
            responseData.browsers.datasets[0].data.push(+row[1]);
            responseData.browsers.datasets[0].backgroundColor.push(colors[i]);
            responseData.browsers.labels.push(row[0]);
          });
        }),
      apiQuery({
        ids: TABLE_ID,
        metrics: 'ga:newUsers',
        'start-date': moment(now).subtract(1, 'day').subtract(1, 'month').format('YYYY-MM-DD'),
        'end-date': moment(now).subtract(1, 'day').format('YYYY-MM-DD')
      }) // New Users Last Month
        .then(response => {
          responseData.pageViewsMonth = response.rows[0];
        }),
      apiQuery({
        ids: TABLE_ID,
        metrics: 'ga:newUsers',
        'start-date': moment(now).subtract(1, 'day').format('YYYY-MM-DD'),
        'end-date': moment(now).format('YYYY-MM-DD')
      }) // New Users Last Day
        .then(response => {
          responseData.pageViewsDay = response.rows[0];
        }),
      apiQuery({
        ids: TABLE_ID,
        metrics: 'ga:30dayUsers',
        dimensions: 'ga:date',
        'max-results': 5,
        sort: '-ga:date',
        'start-date': moment(now).subtract(1, 'day').subtract(1, 'month').format('YYYY-MM-DD'),
        'end-date': moment(now).subtract(1, 'day').format('YYYY-MM-DD')
      }) // Active Users Monthly
        .then(response => {
          response.rows.forEach(row => {
            responseData.activeUsersMonthly.push({ date: row[0], amount: row[1] });
          });
        }),
      apiQuery({
        ids: TABLE_ID,
        metrics: 'ga:users',
        dimensions: 'ga:deviceCategory',
        sort: 'ga:deviceCategory',
        'start-date': moment(now).subtract(1, 'day').subtract(1, 'month').format('YYYY-MM-DD'),
        'end-date': moment(now).subtract(1, 'day').format('YYYY-MM-DD')
      }) // Device Popularity
        .then(response => {
          responseData.userDevice = {
            labels: [],
            datasets: [
              {
                label: 'Device popularity',
                data: [],
                backgroundColor: []
              }
            ]
          };
          const colors = ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'];

          response.rows.forEach((row, i) => {
            responseData.userDevice.datasets[0].data.push(+row[1]);
            responseData.userDevice.datasets[0].backgroundColor.push(colors[i]);
            responseData.userDevice.labels.push(row[0]);
          });
        }),
      apiQuery({
        ids: TABLE_ID,
        metrics: 'ga:newUsers',
        dimensions: 'ga:day',
        'start-date': moment(now).subtract(1, 'day').subtract(1, 'month').format('YYYY-MM-DD'),
        'end-date': moment(now).subtract(1, 'day').format('YYYY-MM-DD')
      }) // New Users Monthly ( Daily info )
        .then(response => {
          responseData.newUsers = {
            labels: [],
            datasets: [
              {
                label: 'New user visits',
                data: [],
                backgroundColor: `transparent`,
                borderColor: 'rgba(54, 162, 235, 0.95)',
                borderWidth: 2
              }
            ]
          };

          response.rows.forEach(row => {
            responseData.newUsers.datasets[0].data.push(+row[1]);
            responseData.newUsers.labels.push(`day ${row[0]}`);
          });
        }),
      apiQuery({
        ids: TABLE_ID,
        metrics: 'ga:goal3Completions',
        dimensions: 'ga:month',
        'start-date': moment(now).subtract(1, 'day').subtract(6, 'month').format('YYYY-MM-DD'),
        'end-date': moment(now).subtract(1, 'day').format('YYYY-MM-DD')
      }) // Registrations Per Month
        .then(response => {
          responseData.registeredUsers = {
            labels: [],
            datasets: [
              {
                label: 'Registered Users',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                borderWidth: 1,
                borderColor: 'rgba(255, 99, 132, 0.95)'
              }
            ]
          };

          const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ];

          response.rows.forEach(row => {
            responseData.registeredUsers.datasets[0].data.push(+row[1]);
            responseData.registeredUsers.labels.push(months[parseInt(row[0], 10) - 1]);
          });
        }),
      apiQuery({
        ids: TABLE_ID,
        metrics: 'ga:exitRate',
        'start-date': moment(now).subtract(1, 'day').format('YYYY-MM-DD'),
        'end-date': moment(now).format('YYYY-MM-DD')
      }) // Exit Rate
        .then(response => {
          responseData.exitRate = response.rows[0];
        }),
      apiQuery({
        ids: TABLE_ID,
        metrics: 'ga:bounceRate',
        'start-date': moment(now).subtract(1, 'day').format('YYYY-MM-DD'),
        'end-date': moment(now).format('YYYY-MM-DD')
      }) // Bounce Rate
        .then(response => {
          responseData.bounceRate = response.rows[0];
        }),
      apiQuery({
        ids: TABLE_ID,
        metrics: 'ga:uniquePageviews',
        'start-date': moment(now).subtract(3, 'year').format('YYYY-MM-DD'),
        'end-date': moment(now).format('YYYY-MM-DD')
      }) // Total Pageviews
        .then(response => {
          responseData.uniquePageviews = response.rows[0];
        })
    ]).then(() => {
      this.setState({
        apiLoaded: true,
        data: responseData
      });
    });
  }

  render() {
    if (this.state.apiLoaded === true) {
      return (
        <div>
          <TopMenu />
          <DisplayPanel data={this.state.data} />
        </div>
      );
    }
    return (
      <Header as="h2" textAlign="center" style={{ marginTop: '7em' }}>
        <Header.Content style={{ marginBottom: '1em' }}>Loading data...</Header.Content>
        <Loader active inline="centered" />
      </Header>
    );
  }
}

render(<App />, document.getElementById('app'));
