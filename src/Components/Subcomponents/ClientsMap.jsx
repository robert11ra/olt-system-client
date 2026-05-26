import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Importar el ícono de marcador por defecto de Leaflet
// Es común que los iconos no se muestren correctamente sin esta configuración
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useContext } from 'react';
import Contexts from '../../Sources/Contexts';
import { format } from 'date-fns';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


export default function ClientsMap({ clients, titleKey }) {

  const initialCenter = [8.0, -66.0];
  const initialZoom = 6;

  const { t } = useContext(Contexts.globalContext);

  const clientsWithLatAndLong = clients.filter(c => c.lat !== null && c.long !== null);

  if (clientsWithLatAndLong.length === 0) {
    return <p className='text-center'>{t('no_clients_with_lat_and_long')}</p>;
  }

  return (<div>
    <h1 className='text-center my-4 text-lg'>{ t(titleKey) }</h1>
    <div className='h-[600px] shadow-md w-full rounded-2xl overflow-clip'>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className='rounded-2xl z-10'
      >
        <TileLayer
          attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
          url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />

        {clientsWithLatAndLong.map((client) => (
          <Marker
            key={client.id}

            position={[client.lat, client.long]} // [lat, long]
          >
            <Tooltip permanent={false} direction="top">
              <strong>{t('name')}:</strong> {client.name || client.client_name}
              <br />
              <strong>{t('document')}:</strong> {client.document || client.client_document || client.client_code}
              <br className={client.seller_name ? '' : 'hidden'} />
              <strong className={client.seller_name ? '' : 'hidden'}>{t('seller')}:</strong> {client.seller_name}
              <br className={(client.datetime || client.creation_date || client.date) ? '' : 'hidden'} />
              <strong className={(client.datetime || client.creation_date || client.date) ? '' : 'hidden'}>{t('date')}:</strong> {(client.datetime || client.creation_date || client.date) && format(new Date((client.datetime || client.creation_date || client.date)), 'dd/MM/yyyy HH:mm')}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  </div>
  );
};