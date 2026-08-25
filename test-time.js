fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC')
  .then(r => r.json())
  .then(d => console.log(d.dateTime))
  .catch(e => console.error(e));
