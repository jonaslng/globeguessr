// This file contains utility functions for the game
var panorama = require('google-panorama-by-location/node')


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

export function calculatePoints(distanceKm) {
  const maxPoints = 1000;
  const scale = 0.0015; // je größer, desto schneller fällt die Punktzahl ab

  const points = Math.round(maxPoints * Math.exp(-scale * distanceKm));
  return points;
}

export async function generateCoordsFromMap(mapId) {
  try {
    const response = await fetch("/maps/" + mapId + ".json");
    const data = await response.json();

    const array = data.customCoordinates.map((item) => {
      if (!item.lat || !item.lng) {
        console.error("Invalid coordinates:", item);
        return null;
      }

      const lat = item.lat;
      const lng = item.lng;
      const url = `https://www.google.com/maps/embed/v1/streetview?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&location=${lat},${lng}&heading=210&pitch=10&fov=100&pitch=10&language=de`;
      return { url, lat, lng };
    });

    array.sort(() => Math.random() - 0.5);

    console.log("Verfügbare Panoramen: ", array.length);

    return array;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "error";
  }
}


export function getAccuracyLabel(accuracyPercent) {
  if (accuracyPercent >= 95) return "Perfekt";
  if (accuracyPercent >= 80) return "Sehr gut";
  if (accuracyPercent >= 60) return "Gut";
  if (accuracyPercent >= 40) return "Okay";
  if (accuracyPercent >= 20) return "Schlecht";
  return "Sehr schlecht";
}

export function calculateStatistics(userCoords, solutionCoords, statistics){
  if(statistics == null || statistics == undefined) return;

  let cstatistics = statistics;

  let distance = Math.round(getDistanceInKm([userCoords.lat, userCoords.lng], [solutionCoords.lat, solutionCoords.lng]));
  const accuracy = Math.round(1000 / calculatePoints(distance));

  cstatistics.score += calculatePoints(distance);

  cstatistics.steps.push({
    distance: distance,
    points: calculatePoints(distance),
    accuracy: accuracy,
  });

  cstatistics.accuracy = Math.round(statistics.accuracy / accuracy * 100);

  return cstatistics;
}