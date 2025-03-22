"use client";  // 💡 Next.js: Code wird nur im Client ausgeführt

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { getDistanceInKm } from "../_utilities";

// ✅ Leaflet wird nur im Client geladen
const L = typeof window !== "undefined" ? require("leaflet") : null;

if (L) {
  require("leaflet.gridlayer.googlemutant"); // Importieren des Plugins
}

const Solution = ({ pro = false, userCoords, solutionCoords }) => {
  const mapRef = useRef(null); // Referenz für den Container
  const leafletMapRef = useRef(null); // Referenz für die Leaflet-Karte
  const distance = getDistanceInKm([userCoords.lat, userCoords.lng], [solutionCoords.lat, solutionCoords.lng]);

  console.log(distance);

  useEffect(() => {
    if (typeof window !== "undefined" && L) {
      if (!leafletMapRef.current) {
        // Initialisiere die Karte nur, wenn sie noch nicht existiert
        const newMap = L.map(mapRef.current, {
          dragging: true,
          doubleClickZoom: true,
          keyboard: true,
          zoom: 2,
          attributionControl: false,
          zoomControl: false,
          worldCopyJump: true,
        });
        setMapView(distance, newMap, userCoords, solutionCoords);

        L.gridLayer.googleMutant({ type: "hybrid", disableDefaultUI: true, zoomControl: false }).addTo(newMap);

        leafletMapRef.current = newMap; // Speichere die Karte in der Referenz
        
      } else {
        const map = leafletMapRef.current;

        // Entferne alle bestehenden Marker
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });

        // Marker für die Benutzerkoordinaten hinzufügen
        if (userCoords) {
          const userMarkerIcon = new L.Icon({
            iconUrl: "/leaflet/marker_2.png",
            iconSize: (pro ? [30, 38] : [35, 41]),
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          L.marker([userCoords.lat, userCoords.lng], { icon: userMarkerIcon }).addTo(map);
        }

        // Marker für die Lösung hinzufügen
        if (solutionCoords) {
          const solutionMarkerIcon = new L.Icon({
            iconUrl: "/leaflet/marker_2.png",
            iconSize: (pro ? [30, 38] : [35, 41]),
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          L.marker([solutionCoords.lat, solutionCoords.lng], { icon: solutionMarkerIcon }).addTo(map);
        }

        setMapView(distance, map, userCoords, solutionCoords);
      }
    }
  }, [userCoords, solutionCoords, pro]);

  return (
    <div className="flex h-[100vh] w-full items-center justify-center bg-[rgba(20,20,20,0.9)]">
      <div
        ref={mapRef}
        id="map"
        className={`w-[80vw] h-[70vh] border-none focus:border-none`}
      ></div>
    </div>
  );
};

function setMapView(distance, map, userCoords, solutionCoords) {
    const animationType = distance < 30 ? "point" : distance < 100 ? "near" : "far";

    if(animationType === "point") {
        map.setView([solutionCoords.lat, solutionCoords.lng], 14);
    } else {
        map.setView([userCoords.lat, userCoords.lng], 12);
        map.flyTo([solutionCoords.lat, solutionCoords.lng], 6, { duration: 3.5 });
    }

}

export default Solution;