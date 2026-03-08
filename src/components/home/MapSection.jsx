import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapSection = ({ businesses }) => {

  return (

    <section className="py-16">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Businesses Near You
      </h2>

      <MapContainer
        center={[20.5937,78.9629]}
        zoom={5}
        style={{height:"400px"}}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {businesses.map(b => (

          <Marker
            key={b._id}
            position={[
              b.location.coordinates[1],
              b.location.coordinates[0]
            ]}
          />

        ))}

      </MapContainer>

    </section>

  );

};

export default MapSection;