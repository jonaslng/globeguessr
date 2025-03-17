"use client";  // 💡 Next.js: Code wird nur im Client ausgeführt

import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";

// ✅ Leaflet wird nur im Client geladen
const L = typeof window !== "undefined" ? require("leaflet") : null;

if (L) {
  require("leaflet.gridlayer.googlemutant"); // Importieren des Plugins
}
const loadGoogleMapsScript = (callback) => {
  const existingScript = document.getElementById('googleMaps');

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    script.id = 'googleMaps';
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};



const MapWithStreetView = ({ setGuessed }) => {
  const [map, setMap] = useState(null);
  const [coords, setCoords] = useState(null);
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);


  useEffect(() => {
    if (typeof window !== "undefined" && L) {  // ✅ Sicherstellen, dass window existiert
      loadGoogleMapsScript(() => {
        if (!map) {
            const newMap = L.map(mapRef.current, {
            dragging: true,
            doubleClickZoom: true,
            keyboard: true,
            zoom: 2,
            attributionControl: false,
            }).setView([20, 0], 1);

          L.gridLayer.googleMutant({type: "hybrid", disableDefaultUI: true, zoomControl: false}).addTo(newMap);

          setTimeout(() => {
            newMap.invalidateSize(); // 🛠️ Korrekturen für das Rendering
          }, 500);

          // ZUR NOT L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(newMap);

          setMap(newMap);
        }
      });
    }
  }, [map]);

  if (map !== null) {
    map.on("click", (e) => {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });

      // Setze einen neuen Marker an die angeklickte Stelle
      const markerIcon = new L.Icon({
        iconUrl: "/leaflet/marker_2.png",
        iconSize: [32, 40],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      const newMarker = L.marker([e.latlng.lat, e.latlng.lng], {icon: markerIcon}).addTo(map);
      setMarker(newMarker);
      setGuessed(true);
    });
  }

  //HOVER ÄNDERUNG

  useEffect(() => {
    const handleResize = () => {
      if (map) {
        setTimeout(() => {
          map.invalidateSize();
        }, 100); // ⏳ Kleine Verzögerung für das Re-Rendering
      }
    };

    const container = mapRef.current;
    if (container) {
      container.addEventListener("mouseenter", handleResize);
      container.addEventListener("mouseleave", handleResize);
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleResize);
        container.removeEventListener("mouseleave", handleResize);
      }
    };
  }, [map]);


  return (
    <div>
      {coords && marker ? <></> : <div ref={mapRef} id="map" className="h-[30vh] w-[30vw] rounded-lg shadow-md transition-all hover:h-[35vh] hover:w-[60vw] border-none focus:border-none"></div>}
    </div>
  );
};

export default MapWithStreetView;