import React from "react";
import { useState, useEffect } from "react";

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


        const cargarArchivo = () => {
        limpiar();
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => {
            setArchivo(e.target.files[0]);
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const tablasArchivo = e.target.result.split('\n\n').map(tabla => tabla.trim());
                console.log("tablas", tablasArchivo);
                const tablasD = tablasArchivo[0].split('\n\n').map(tabla => tabla.trim());
                const tablaD0 = tablasD[0].split('\n').map(fila => fila.split(',').map(valor => valor.trim()));
        
                tablaD0.shift();
                setCantidadNodos(tablaD0.length);
                setRutas(tablaD0);
            
                console.log("tablaD0", tablaD0);

                
            };
            reader.readAsText(file);
        }
        input.click();
    }

    const guardarArchivo = () => {
        const tablasDString = tablasD.map((tablaD, index) => {
            let tablaDString = `k = ${index}\n`;
            for (let i = 0; i < cantidadNodos; i++) {
                for (let j = 0; j < cantidadNodos; j++) {
                    tablaDString += `${tablasD[index][i][j]},`;
                }
                tablaDString = tablaDString.slice(0, -1);
                tablaDString += "\n";
            }
            return tablaDString;
        }).join("\n");
        const tablasPString = tablasP.map((tablaP, index) => {
            let tablaPString = `p = ${index}\n`;
            for (let i = 0; i < cantidadNodos; i++) {
                for (let j = 0; j < cantidadNodos; j++) {
                    tablaPString += `${tablasP[index][i][j]},`;
                }
                tablaPString = tablaPString.slice(0, -1);
                tablaPString += "\n";
            }
            return tablaPString;
        }
        ).join("\n");
        const contenido = `${tablasDString}\n${tablasPString}`;
        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rutas_mas_cortas.txt';
        a.click();



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

    const limpiar = () => {
        inicializarRutas();
        setTablasD([]);
        setTablasP([]);
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
                        filaD.push("X");
                        filaP.push("X");
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
            <div key={index}>
                <h3>k = {index}</h3>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {nodos.map((nodo) => (
                                <th key={nodo}>
                                    <input type="text" value={nombresPorDefecto[nodo - 1]} disabled />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {nodos.map((nodo) => (
                            <tr key={nodo}>
                                <td>
                                    <input type="text" value={nombresPorDefecto[nodo - 1]} disabled />
                                </td>
                                {nodos.map((nodo2) => {
                                    const esInfinito = tablaD[nodo - 1][nodo2 - 1] === "X";
                                    return (
                                        <td key={nodo2}>
                                            <input
                                                type="text"
                                                value={esInfinito ? "X" : tablaD[nodo - 1][nodo2 - 1]}
                                                disabled
                                            />
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
            <div key={index}>
                <h3>k = {index}</h3>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {nodos.map((nodo) => (
                                <th key={nodo}>
                                    <input type="text" value={nombresPorDefecto[nodo - 1]} disabled />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {nodos.map((nodo) => (
                            <tr key={nodo}>
                                <td>
                                    <input type="text" value={nombresPorDefecto[nodo - 1]} disabled />
                                </td>
                                {nodos.map((nodo2) => {
                                    const esInfinito = tablaP[nodo - 1][nodo2 - 1] === "X";
                                    return (
                                        <td key={nodo2}>
                                            <input
                                                type="text"
                                                value={esInfinito ? "X" : tablaP[nodo - 1][nodo2 - 1]}
                                                disabled
                                            />
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


    const generarTablaD0 = () => {
        return (
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {nodos.map((nodo) => (
                            <th key={nodo}>
                                <input type="text" value={nombresPorDefecto[nodo - 1]} disabled />

                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {nodos.map((nodo) => (
                        <tr key={nodo}>
                            <td>
                                <input type="text" value={nombresPorDefecto[nodo - 1]} disabled />
                            </td>
                            {nodos.map((nodo2) => {
                                const esInfinito = rutas[nodo - 1][nodo2 - 1] === "X";
                                return (
                                    <td key={nodo2}>
                                        <input
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
                                            Infinite
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

    const calcularRutaMasCorta = () => {
        const nodoOrigen = parseInt(document.getElementById("nodoOrigen").value, 10);
        const nodoDestino = parseInt(document.getElementById("nodoDestino").value, 10);
        let rutaMasCorta = "";
        let k = tablasP.length - 1;
        if (tablasP.length === 0) {
            return;
        } else {
            if(nodoOrigen === nodoDestino) {
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

    return (
        <div>
            <h1>Rutas más cortas</h1>
            <div>
                <label htmlFor="cantidadNodos">Cantidad de nodos</label>
                <input
                    type="number"
                    id="cantidadNodos"
                    value={cantidadNodos} onChange={handleCantidadNodosChange}
                    min={2}
                    max={10}

                />
                {errores.cantidadNodos && <p>{errores.cantidadNodos}</p>}
            </div>
            <div>
                <button onClick={cargarArchivo}>Cargar archivo</button>
                <button onClick={limpiar}>Limpiar</button>
                <button
                    onClick={calcularRutasMasCortas}
                >Calcular</button>
            </div>
            <div>
                {generarTablaD0()}
            </div>
            <div className="tablasResultados">
                <h2>Tablas D</h2>
                {tablasDResultados}
                <h2>Tablas P</h2>
                {tablasPResultados}
                </div>
                <div className="calcularRutasCortas">
                    <h2>Calcular rutas más cortas entre 2 nodos</h2>
                    <div>
                        <label htmlFor="nodoOrigen">Nodo origen</label>
                        <select name="nodoOrigen" id="nodoOrigen">
                            {nodos.map((nodo) => (
                                <option key={nodo} value={nodo}>{nombresPorDefecto[nodo - 1]}</option>
                            ))}
                        </select>

                        <label htmlFor="nodoDestino">Nodo destino</label>
                        <select name="nodoDestino" id="nodoDestino">
                            {nodos.map((nodo) => (
                                <option key={nodo} value={nodo}>{nombresPorDefecto[nodo - 1]}</option>
                            ))}
                        </select>

                        <button onClick={calcularRutaMasCorta} >Calcular</button>
                        {mostrarRutaMasCorta && <p>Ruta más corta: {mostrarRutaMasCorta}</p>}
                        </div>


                

        </div>
        <div>
            <button onClick={guardarArchivo}>Guardar archivo</button>
            </div>
                
        </div>
        
    );

}

export default RutasMasCortas;
