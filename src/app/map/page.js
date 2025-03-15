var streetview = require('awesome-streetview')


export default function Map() {


  return (
    <div>
      <div>
        <iframe
           loading="lazy"
           referrerPolicy="no-referrer-when-downgrade"
           src={createURL()}
           
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
           style={{
            width: "100vw",
            height: "calc(100vh + 310px)",
            zIndex: 100,
            transform: "translateY(-295px)",
          }}

        ></iframe>
      </div>

    </div>
  );
}




let createURL = () => {
  
  //THIS IS TO BE EDITED LATER
  let place = streetview();

  let APIKEY = process.env.GOOGLE_MAPS_API_KEY;
  let lat = place[0];
  let lon = place[1];

  let url = `https://www.google.com/maps/embed/v1/streetview?key=${APIKEY}&location=${lat},${lon}&heading=210&pitch=10&fov=100&pitch=10&language=en`;
  return url;
}