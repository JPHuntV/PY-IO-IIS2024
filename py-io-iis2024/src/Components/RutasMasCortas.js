import React, { act } from "react";
import { useState, useEffect } from "react";
import GraphComponent from "./GraphComponent";

function RutasMasCortas() {
    const [rutas, setRutas] = useState([]);
    const [tablaP, setTablaP] = useState([]);
    const [tablasDResultados, setTablasDResultados] = useState([]);
    const [tablasPResultados, setTablasPResultados] = useState([]);
    const [mostrarRutaMasCorta, setMostrarRutaMasCorta] = useState("");
    const [nodos, setNodos] = useState([]);
    const [cantidadNodos, setCantidadNodos] = useState(2);
    const [errores, setErrores] = useState({});
    const [nombresPorDefecto, setNombresPorDefecto] = useState([
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"
    ]);
    const [archivo, setArchivo] = useState(null);

    const [tablasD, setTablasD] = useState([]);
    const [tablasP, setTablasP] = useState([]);

    useEffect(() => {
        inicializarNodos();
        inicializarRutas();
    }, []);

    useEffect(() => {
        inicializarNodos();
        if (archivo === null) {
            inicializarRutas();
        }else{
            actualizarRutas(archivo);
        }
    }, [cantidadNodos]);

    useEffect(() => {
        console.log("rutas", rutas);
    }, [rutas]);

    useEffect(() => {
        console.log("tablasD", tablasD);
        console.log("tablasP", tablasP);
        setTablasDResultados(renderizarTablasD());
    }, [tablasD]);

    useEffect(() => {
        console.log("tablasP", tablasP);
        setTablasPResultados(renderizarTablasP());
    }, [tablasP]);

    const handleCantidadNodosChange = (event) => {
        if (event.target.value === "") {
            setCantidadNodos("");
            setErrores({});
        } else if (event.target.value < 2) {
            setCantidadNodos(2);
            setErrores({ cantidadNodos: "La cantidad de nodos debe ser mayor o igual a 2" });
        } else if (event.target.value > 10) {
            setCantidadNodos(10);
            setErrores({ cantidadNodos: "La cantidad de nodos debe ser menor o igual a 10" });
        } else {
            setCantidadNodos(event.target.value);
        }
    }

    const inicializarNodos = () => {
        let nodos = [];
        for (let i = 1; i <= cantidadNodos; i++) {
            nodos.push(i);
        }
        setNodos(nodos);
    }


    const guardarArchivo = () => {
        //save cantidadNodos, rutas as JSON to txt file
        const contenido = JSON.stringify(rutas);
        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rutas_mas_cortas.txt";
        a.click();

    }

    const cargarArchivo = (e) => {
        e.preventDefault();
        const file = document.createElement("input");
        file.setAttribute("type", "file");
        file.setAttribute("accept", ".txt");
        file.onchange = (e) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const contenido = e.target.result;
                const rutas = JSON.parse(contenido);
                const cantidadNodos = rutas.length;
                setCantidadNodos(cantidadNodos);
                setRutas(rutas);
                setArchivo(rutas);
            }
            reader.readAsText(e.target.files[0]);
        }
        file.click();
    }

    const inicializarRutas = () => {
        let rutas = [];
        for (let i = 1; i <= cantidadNodos; i++) {
            let ruta = [];
            for (let j = 1; j <= cantidadNodos; j++) {
                if (i === j) {
                    ruta.push(0);
                } else {
                    ruta.push("X");
                }
            }
            rutas.push(ruta);
        }
        setRutas(rutas);

    }

    const actualizarRutas = (rutas) => {
        //añadir rutas a la matriz ya existente que tiene cantidadNodos
        let rutasNuevas = [];
        for (let i = 1; i <= cantidadNodos; i++) {
            let ruta = [];
            for (let j = 1; j <= cantidadNodos; j++) {
                if (i === j) {
                    ruta.push(0);
                } else if (i <= rutas.length && j <= rutas.length) {
                    ruta.push(rutas[i - 1][j - 1]);
                } else {
                    ruta.push("X");
                }
            }
            rutasNuevas.push(ruta);
        }
        setRutas(rutasNuevas);
    }

    const limpiar = () => {
        setTablasD([]);
        setTablasP([]);
        setTablasDResultados([]);
        setTablasPResultados([]);
        setMostrarRutaMasCorta("");
    }

    const handleInputChange = (row, col, value) => {
        setRutas((prev) => {
            const newRutas = [...prev];
            newRutas[row - 1][col - 1] = parseInt(value, 10);
            return newRutas;
        });

    };

    const handleCheckboxChange = (row, col) => {
        setRutas((prev) => {
            const newRutas = [...prev];
            newRutas[row - 1][col - 1] = newRutas[row - 1][col - 1] === "X" ? 0 : "X";
            return newRutas;
        });
    };


    const calcularRutasMasCortas = () => {
        let tablasD = [];
        let tablasP = [];

        let tablaD0 = [];
        let tablaP0 = [];
        for (let i = 0; i < cantidadNodos; i++) {
            let filaD = [];
            let filaP = [];
            for (let j = 0; j < cantidadNodos; j++) {
                if (i === j) {
                    filaD.push(0);
                    filaP.push(0);
                } else {
                    filaD.push(rutas[i][j]);
                    filaP.push(0);
                }
            }
            tablaD0.push(filaD);
            tablaP0.push(filaP);
        }
        tablasD.push(tablaD0);
        tablasP.push(tablaP0);




        for (let k = 1; k <= cantidadNodos; k++) {
            let tablaD = [];
            let tablaP = [];
            for (let i = 0; i < cantidadNodos; i++) {
                let filaD = [];
                let filaP = [];
                for (let j = 0; j < cantidadNodos; j++) {
                    let d1 = tablasD[k - 1][i][j] === "X" ? Infinity : parseInt(tablasD[k - 1][i][j], 10);
                    let d2 = tablasD[k - 1][i][k - 1] === "X" || tablasD[k - 1][k - 1][j] === "X"
                        ? Infinity
                        : parseInt(tablasD[k - 1][i][k - 1], 10) + parseInt(tablasD[k - 1][k - 1][j], 10);

                    if (d1 === Infinity && d2 === Infinity) {
                        filaD.push("∞");
                        filaP.push("∞");
                    } else if (d1 === Infinity) {
                        filaD.push(d2);
                        filaP.push(k);
                    } else if (d2 === Infinity) {
                        filaD.push(d1);
                        filaP.push(tablasP[k - 1][i][j]);
                    } else {
                        if (d1 <= d2) {
                            filaD.push(d1);
                            filaP.push(tablasP[k - 1][i][j]);
                        } else {
                            filaD.push(d2);
                            filaP.push(k);
                        }
                    }
                }
                tablaD.push(filaD);
                tablaP.push(filaP);
            }
            tablasD.push(tablaD);
            tablasP.push(tablaP);
        }

        setTablasD(tablasD);
        setTablasP(tablasP);
        console.log("tablasD", tablasD);
        console.log("tablasP", tablasP);
    };

    const renderizarTablasD = () => {
        return (
            tablasD.map((tablaD, index) => (
                <div key={index} className="table-container">
                    <h3>K = {index}</h3>
                    <table className="table">
                        <thead className="thead">
                            <tr>
                                <th></th>
                                {nodos.map((nodo) => (
                                    <th key={nodo}>
                                        <p>{nombresPorDefecto[nodo - 1]}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {nodos.map((nodo) => (
                                <tr key={nodo}>
                                    <td>
                                        <p>{nombresPorDefecto[nodo - 1]}</p>
                                    </td>
                                    {nodos.map((nodo2) => {
                                        const esInfinito = tablaD[nodo - 1][nodo2 - 1] === "X";
                                        return (
                                            <td key={nodo2}>
                                                <p>
                                                    {esInfinito ? "∞" : tablaD[nodo - 1][nodo2 - 1]}
                                                </p>

                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))
        )
    }

    const renderizarTablasP = () => {
        return (
            tablasP.map((tablaP, index) => (
                <div key={index} className="table-container">
                    <h3>P = {index}</h3>
                    <table className="table">
                        <thead className="thead">
                            <tr>
                                <th></th>
                                {nodos.map((nodo) => (
                                    <th key={nodo}>
                                        <p>{nombresPorDefecto[nodo - 1]}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {nodos.map((nodo) => (
                                <tr key={nodo}>
                                    <td>
                                        <p>{nombresPorDefecto[nodo - 1]}</p>
                                    </td>
                                    {nodos.map((nodo2) => {
                                        const esInfinito = tablaP[nodo - 1][nodo2 - 1] === "X";
                                        return (
                                            <td key={nodo2}>
                                                <p>
                                                    {esInfinito ? "∞" : tablaP[nodo - 1][nodo2 - 1]}
                                                </p>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))
        )
    }

    const handleNombreNodoChange = (index, value) => {
        setNombresPorDefecto((prev) => {
            const newNombres = [...prev];
            newNombres[index] = value;
            return newNombres;
        });
    };

    const generarTablaD0 = () => {
        return (
            <table className="table tablaD0">
                <thead className="thead">
                    <tr>
                        <th></th>
                        {nodos.map((nodo) => (
                            <th key={nodo}>
                                <input
                                    className="input-table"
                                    type="text" value={nombresPorDefecto[nodo - 1]}
                                    onChange={(e) => handleNombreNodoChange(nodo - 1, e.target.value)}

                                />

                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {nodos.map((nodo) => (
                        <tr key={nodo}>
                            <td>
                                <input
                                    className="input-table"
                                    type="text" value={nombresPorDefecto[nodo - 1]}
                                    onChange={(e) => handleNombreNodoChange(nodo - 1, e.target.value)}
                                />
                            </td>
                            {nodos.map((nodo2) => {
                                const esInfinito = rutas[nodo - 1][nodo2 - 1] === "X";
                                return (
                                    <td key={nodo2}>
                                        <input
                                            className="input-table"
                                            type="number"
                                            value={esInfinito ? "" : rutas[nodo - 1][nodo2 - 1]}
                                            disabled={esInfinito}
                                            onChange={(e) => handleInputChange(nodo, nodo2, e.target.value)}
                                        />
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={esInfinito || false}
                                                onChange={() => handleCheckboxChange(nodo, nodo2)}
                                            />
                                            Infinito
                                        </label>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    const calcularRutaMasCorta = (e) => {
        e.preventDefault();
        const nodoOrigen = parseInt(document.getElementById("nodoOrigen").value, 10);
        const nodoDestino = parseInt(document.getElementById("nodoDestino").value, 10);
        let rutaMasCorta = "";
        let k = tablasP.length - 1;
        if (tablasP.length === 0) {
            return;
        } else {
            if (nodoOrigen === nodoDestino) {
                rutaMasCorta = "No hay ruta";
            } else if (tablasP[k][nodoOrigen - 1][nodoDestino - 1] === "X") {
                rutaMasCorta = "No hay ruta";
            } else {
                rutaMasCorta = nodoOrigen;
                let nodoIntermedio = tablasP[k][nodoOrigen - 1][nodoDestino - 1];
                while (nodoIntermedio !== 0) {
                    rutaMasCorta += ` -> ${nodoIntermedio}`;
                    nodoIntermedio = tablasP[k][nodoIntermedio - 1][nodoDestino - 1];
                }
                rutaMasCorta += ` -> ${nodoDestino}`;
            }
        }
        console.log("rutaMasCorta", rutaMasCorta);
        setMostrarRutaMasCorta(rutaMasCorta);
    }


    const renderRutaMasCorta = () => {
        let ruta = mostrarRutaMasCorta.split(" -> ");
        console.log("ruta", ruta);
        let rutaRenderizada = [];
        for (let i = 0; i < ruta.length; i++) {

            if (i === 0) {
                if (ruta[i] === "No hay ruta") {
                    rutaRenderizada.push(<span className="flecha" key={i}>{ruta[i]}</span>);
                } else {
                    rutaRenderizada.push(<span className="nodo-ruta" key={i}>{nombresPorDefecto[ruta[i] - 1]}</span>);
                }
            } else {
                rutaRenderizada.push(<span className="flecha" key={i}> {"->"} </span>);
                rutaRenderizada.push(<span className="nodo-ruta" key={i}>  {nombresPorDefecto[ruta[i] - 1]}</span>);
            }
        }
        return rutaRenderizada;
    }


    

    return (
        <div className="rutas-mas-cortas">
            <h1>Rutas más cortas</h1>
            <p className='descripcion-problema'> 
                Dada una red de transporte con n nodos, se desea encontrar la ruta más corta entre dos nodos. 
                Para ello, se debe calcular la matriz de rutas más cortas D</p>
                <div className="form-group">
                <label htmlFor="cantidadNodos">Cantidad de nodos</label>
                <input
                    type="number"
                    id="cantidadNodos"
                    value={cantidadNodos} onChange={handleCantidadNodosChange}
                    min={2}
                    max={10}

                />
                {errores.cantidadNodos && <p className="error" >*{errores.cantidadNodos}</p>}
            </div>
            
            <div className="table-container">
                {generarTablaD0()}
            </div>
            <div className="grafico-rutas">
                {console.log("rutas", rutas)}
                <GraphComponent 
                    matrix={rutas}
                    nodeNames={nombresPorDefecto} 
                />
            </div>
            <div className="button-group-rutas">
                <button className="primary-button" onClick={cargarArchivo}>Cargar archivo</button>
                <button className="primary-button" onClick={guardarArchivo}>Guardar archivo</button>

                <button className="primary-button" onClick={limpiar}>Limpiar</button>
                <button
                style={{marginLeft: 'auto'}}
                className="primary-button" 
                    onClick={calcularRutasMasCortas}
                >Calcular</button>
            </div>
            <div className="tablas-resultados">
                <div className="tablasD">
                    {tablasDResultados.length > 0 && <h2>Tablas D</h2>}

                    {tablasDResultados}
                </div>
                <div className="tablasP">
                    {tablasDResultados.length > 0 && <h2>Tablas P</h2>}
                    {tablasPResultados}
                </div>
            </div>
            <div className="calcularRutasCortas">
                <h2>Calcular rutas más cortas entre 2 nodos</h2>
                <div className="row">
                    <div className="form-group">
                        <label htmlFor="nodoOrigen">Nodo origen</label>
                        <select name="nodoOrigen" id="nodoOrigen">
                            {nodos.map((nodo) => (
                                <option key={nodo} value={nodo}>{nombresPorDefecto[nodo - 1]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">

                        <label htmlFor="nodoDestino">Nodo destino</label>
                        <select name="nodoDestino" id="nodoDestino">
                            {nodos.map((nodo) => (
                                <option key={nodo} value={nodo}>{nombresPorDefecto[nodo - 1]}</option>
                            ))}
                        </select>
                    </div>
                    <button className="primary-button" onClick={calcularRutaMasCorta} >Calcular</button>
                </div>
                {mostrarRutaMasCorta.length > 0 &&
                    <div className="ruta-mas-corta">
                        <label>Ruta más corta:</label>
                        {renderRutaMasCorta()}
                    </div>}



            </div>


        </div>

    );

}

export default RutasMasCortas;
