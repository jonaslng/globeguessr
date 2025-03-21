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

const MapWithStreetView = ({ setGuessed, pro = false }) => {
  const [map, setMap] = useState(null);
  const [coords, setCoords] = useState(null);
  const markerRef = useRef(null); // Verwenden Sie ein Ref für den Marker
  const mapRef = useRef(null);

  const handleGuessed = () => {
    if (markerRef.current !== null) {
      map.removeLayer(markerRef.current);
      setGuessed(true);
    }
  }


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
            zoomControl: false,
            worldCopyJump: true,
          }).setView([20, 0], 2);

          L.gridLayer.googleMutant({ type: "hybrid", disableDefaultUI: true, zoomControl: false }).addTo(newMap);

          setMap(newMap);
        }
      });
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;

        // Entferne den alten Marker, falls er existiert
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        // Setze einen neuen Marker an die angeklickte Stelle
        const markerIcon = new L.Icon({
          iconUrl: "/leaflet/marker_2.png",
          iconSize: (pro ? [30, 38] : [35, 41]),
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const newMarker = L.marker([lat, lng], { icon: markerIcon })
          .addTo(map)

        // Speichere den neuen Marker im Ref
        markerRef.current = newMarker;

        // Aktualisiere die Koordinaten
        setCoords({ lat, lng });
      });
    }
  }, [map, setGuessed]);


  console.log("Coords update:", coords);

  // Überwache die Größe des Containers und passe die Karte an
  useEffect(() => {
    const handleResize = () => {
      if (map) {
        map.invalidateSize(); // Aktualisiere die Kartengröße
      }
    };

    // Füge einen Resize-Observer hinzu
    const observer = new ResizeObserver(handleResize);
    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        observer.unobserve(mapRef.current);
      }
    };
  }, [map]);

  return (
    <div className="flex flex-col items-end justify-around group rounded-md">
      <div
        ref={mapRef}
        id="map"
        className={`h-[35vh] w-[35vw] opacity-75 transition-all ${pro ? `duration-100`: `duration-300`} group-hover:h-[55vh] group-hover:w-[70vw] group-hover:opacity-100 border-none focus:border-none`}
      ></div>
      {markerRef.current !== null ? <BTN onClick={() => handleGuessed()} /> : null}
      
    </div>
  );
};

const BTN = ({ onClick }) => {
  return (
    <button onClick={onClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full h-[6vh]">
      Guess
    </button>
  );
}

export default MapWithStreetView;