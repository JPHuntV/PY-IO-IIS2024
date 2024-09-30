import React, {useState} from 'react';
import SeriesDeportivas from './Components/SeriesDeportivas.js';
import Mochila from './Components/Mochila.js';
import ArbolesBinariosBusqueda from './Components/ArbolesBinariosBusqueda.js';
import RutasMasCortas from './Components/RutasMasCortas.js';
function Home() {
    const [selectedTab, setSelectedTab] = useState('seriesDeportivas');
    const rederTab = () => {
        switch(selectedTab) {
            case 'seriesDeportivas':
                return <SeriesDeportivas />;
            case 'mochila':
                return <Mochila />;
            case 'arbolesBinariosBusqueda':
                return <ArbolesBinariosBusqueda />;
            case 'rutasMasCortas':
                return <RutasMasCortas />;
            default:
                return <SeriesDeportivas />;
        }
    }
    return (
        <div>
            <div>
                <button onClick={() => setSelectedTab('seriesDeportivas')}>Series Deportivas</button>
                <button onClick={() => setSelectedTab('mochila')}>Mochila</button>
                <button onClick={() => setSelectedTab('arbolesBinariosBusqueda')}>Arboles Binarios Busqueda</button>
                <button onClick={() => setSelectedTab('rutasMasCortas')}>Rutas Mas Cortas</button>
            </div>
            {rederTab()}
        </div>
    );
}

export default Home;