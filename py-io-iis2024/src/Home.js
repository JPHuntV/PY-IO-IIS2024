import React, { useState } from 'react';
import './Styles/py-io-iis2024.css';
import SeriesDeportivas from './Components/SeriesDeportivas.js';
import Mochila from './Components/Mochila.js';
import ArbolesBinariosBusqueda from './Components/ArbolesBinariosBusqueda.js';
import RutasMasCortas from './Components/RutasMasCortas.js';

const Home = () => {
    const [selectedTab, setSelectedTab] = useState('seriesDeportivas');

    const renderTab = () => {
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
        <div className='home'>
            <header className="header">
                <h1>DP Solver</h1>
            </header>
            <div className="main-container">
                <nav className="button-group">
                    <button 
                        className={selectedTab === 'seriesDeportivas' ? 'active' : ''} 
                        onClick={() => setSelectedTab('seriesDeportivas')}
                    >
                        Series Deportivas
                    </button>
                    <button 
                        className={selectedTab === 'mochila' ? 'active' : ''} 
                        onClick={() => setSelectedTab('mochila')}
                    >
                        Mochila
                    </button>
                    <button 
                        className={selectedTab === 'arbolesBinariosBusqueda' ? 'active' : ''} 
                        onClick={() => setSelectedTab('arbolesBinariosBusqueda')}
                    >
                        Arboles Binarios Busqueda
                    </button>
                    <button 
                        className={selectedTab === 'rutasMasCortas' ? 'active' : ''} 
                        onClick={() => setSelectedTab('rutasMasCortas')}
                    >
                        Rutas Mas Cortas
                    </button>
                </nav>
                <main className='main-content'>
                    {renderTab()}
                </main>
            </div>
        </div>
    );
}

export default Home;