var streetview = require('awesome-streetview')


export function createMapURL() {

  //THIS IS TO BE EDITED LATER
  let place = streetview();

  let APIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  let lat = place[0];
  let lng = place[1];

  let url = `https://www.google.com/maps/embed/v1/streetview?key=${APIKEY}&location=${lat},${lng}&heading=210&pitch=10&fov=100&pitch=10&language=de`;
  return {url: url, lat: lat, lng: lng};
}

export function getDistanceInKm([lat1, lng1], [lat2, lng2]) {
  const R = 6371; // Erdradius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}