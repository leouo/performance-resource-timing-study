import './styles.css'
import axios from 'axios'

const FAKE_SERVER_ADDRESS = 'http://localhost:3001'
let REQUEST_COUNTER = 0

document.querySelector('#root').innerHTML = `
  <div>
    <button id="get-data-axios">Get Data With Axios (XMLHTTPRequest)</button>
    <button id="get-data-fetch">Get Data With fetch</button>
    <button id="display-fetch-data">Display Fetch Performance</button>
    <div id="fetch-performance-data"></div>
  </div>
`;

const formatTime = ms =>
  ms < 1000
  ? `${ms.toFixed(2)} ms`
  : `${(ms / 1000).toFixed(2)} s`

const displayFetchPerformance = () => {
  const performanceEntries = performance.getEntriesByType('resource');
  const fetchEntries = performanceEntries
    .filter(({ initiatorType }) => ['fetch', 'xmlhttprequest'].includes(initiatorType))
    .map(({ name, duration, requestStart, responseEnd, responseStart, responseStatus, startTime, initiatorType }) => {
      return {
        url: name,
        requestAPI: initiatorType,
        status: responseStatus,
        timestampStart: new Date(performance.timeOrigin + startTime).toISOString(),
        timestampEnd: new Date(performance.timeOrigin + responseEnd).toISOString(),
        totalTime: formatTime(duration),
        pendingTime: formatTime(requestStart - startTime),
        responseTime: formatTime(responseStart - requestStart),
      }
    })

  const columns = Object.keys(fetchEntries[0]);

  const header = `<tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr>`;

  const rows = fetchEntries
    .map(row => `<tr>${columns.map(cell => `<td>${row[cell]}</td>`).join('')}</tr>`)
    .join('');

  const table = `<table>${header}${rows}</table>`;

  document.getElementById('fetch-performance-data').innerHTML = table
}

const getRouteWithAxios = () =>
  axios.get(`${FAKE_SERVER_ADDRESS}/route-with-delay?counter=${REQUEST_COUNTER++}`)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error:', error)
    })

const getRouteWithFetch = () => 
  fetch(`${FAKE_SERVER_ADDRESS}/route-with-delay?counter=${REQUEST_COUNTER++}`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
    .catch(error => {
      console.error('Error:', error)
    })

const getWithAxiosButton = document.querySelector('#get-data-axios')
const getWithFetchButton = document.querySelector('#get-data-fetch')
const displayButton = document.querySelector('#display-fetch-data')

displayButton.addEventListener('click', displayFetchPerformance)
getWithAxiosButton.addEventListener('click', getRouteWithAxios)
getWithFetchButton.addEventListener('click', getRouteWithFetch)
