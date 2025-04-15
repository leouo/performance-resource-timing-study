import axios from 'axios'

document.querySelector('#root').innerHTML = `
  <div>
    <button id="fetch-data">Fetch Data</button>
    <button id="display-fetch-data">Display Fetch Performance</button>
    <div id="fetch-performance-data"></div>
  </div>
`;

let clickCounter = 0
const FAKE_SERVER_ADDRESS = 'http://localhost:3000'

const formatTime = ms =>
  ms < 1000
  ? `${ms.toFixed(2)} ms`
  : `${(ms / 1000).toFixed(2)} s`

const displayFetchPerformance = () => {
  const performanceEntries = performance.getEntriesByType('resource');
  const fetchEntries = performanceEntries
    .filter(({ initiatorType }) => ['fetch', 'xmlhttprequest'].includes(initiatorType))
    .map(({ name, duration, requestStart, responseEnd, responseStart, responseStatus, startTime }) => {
      return {
        url: name,
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

const fetchRouteWithDealayWithAxios = requestId =>
  axios.get(`${FAKE_SERVER_ADDRESS}/route-with-delay?counter=${requestId}`)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error:', error)
    })

const fetchRouteWithDelay = requestId => 
  fetch(`${FAKE_SERVER_ADDRESS}/route-with-delay?counter=${requestId}`)
  .then(response => {
    return response.json()
  })
  .then(data => {
    return data
  })
  .catch(error => {
    console.error('Error:', error)
  })

const fetchButton = document.querySelector('#fetch-data')
const displayButton = document.querySelector('#display-fetch-data')

displayButton.addEventListener('click', displayFetchPerformance)

fetchButton.addEventListener('click', () => {
  for (let requestCounter = 0; requestCounter < 10; requestCounter++) {
    fetchRouteWithDealayWithAxios(`${clickCounter++}-${requestCounter}`)
  }
})
