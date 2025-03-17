var streetview = require('awesome-streetview')


export function createMapURL() {

  //THIS IS TO BE EDITED LATER
  let place = streetview();

  let APIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  let lat = place[0];
  let lon = place[1];

  let url = `https://www.google.com/maps/embed/v1/streetview?key=${APIKEY}&location=${lat},${lon}&heading=210&pitch=10&fov=100&pitch=10&language=de`;
  return {url: url, lat: lat, lon: lon};
}