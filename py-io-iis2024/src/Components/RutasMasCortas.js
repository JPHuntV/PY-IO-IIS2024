import React, { act } from "react";
import { useState, useEffect } from "react";
import GraphComponent from "./GraphComponent"; //importar componente de grafo

function RutasMasCortas() {
    //
    const [rutas, setRutas] = useState([]); //matriz de rutas
    const [tablaP, setTablaP] = useState([]);
    const [tablasDResultados, setTablasDResultados] = useState([]); //tablas D
    const [tablasPResultados, setTablasPResultados] = useState([]); //tablas P
    const [mostrarRutaMasCorta, setMostrarRutaMasCorta] = useState("");
    const [nodos, setNodos] = useState([]); //nodos
    const [cantidadNodos, setCantidadNodos] = useState(2);
    const [errores, setErrores] = useState({});
    const [nombresPorDefecto, setNombresPorDefecto] = useState([
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"
    ]);
    const [archivo, setArchivo] = useState(null);

    const [tablasD, setTablasD] = useState([]);
    const [tablasP, setTablasP] = useState([]);
    const [bloquearInputs, setBloquearInputs] = useState(false);


    //Inicializar nodos y rutas al cargar el componente
    useEffect(() => {
        inicializarNodos();
        inicializarRutas();
    }, []);

    //Cadavez que cambie la cantidad de nodos, se inicializan los nodos y las rutas
    useEffect(() => {
        inicializarNodos();
        if (archivo === null) {
            inicializarRutas();
        }
    }, [cantidadNodos]);


    //Cada vez que cambiar las tablas D, se renderizan las tablas D
    useEffect(() => {
        setTablasDResultados(renderizarTablasD());
    }, [tablasD]);

    //Cada vez que cambie la s tablas P, se renderizan las tablas P
    useEffect(() => {
        setTablasPResultados(renderizarTablasP());
    }, [tablasP]);


    //Manejar el cambio de la cantidad de nodos
    const handleCantidadNodosChange = (event) => {
        if (event.target.value === "") {
            setCantidadNodos("");
            setErrores({});
        } else if (event.target.value < 2) { //validar que la cantidad de nodos sea mayor o igual a 2
            setCantidadNodos(2);
            setErrores({ cantidadNodos: "La cantidad de nodos debe ser mayor o igual a 2" });
        } else if (event.target.value > 10) { //validar que la cantidad de nodos sea menor o igual a 10
            setCantidadNodos(10);
            setErrores({ cantidadNodos: "La cantidad de nodos debe ser menor o igual a 10" });
        } else {
            setCantidadNodos(event.target.value);
        }
    }

    //Crea un arreglo con los nodos del grafo
    const inicializarNodos = () => {
        let nodos = [];
        for (let i = 1; i <= cantidadNodos; i++) {
            nodos.push(i);
        }
        setNodos(nodos);
    }

    //Guarda el archivo con las rutas más cortas en un archivo .txt
    const guardarArchivo = () => {
        const contenido = JSON.stringify(rutas);
        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rutas_mas_cortas.txt";
        a.click();

    }

    //Carga un archivo con las rutas más cortas
    const cargarArchivo = (e) => {
        e.preventDefault();
        limpiar();
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

    //Inicializa las rutas con valores por defecto
    const inicializarRutas = () => {
        let rutas = [];
        for (let i = 1; i <= cantidadNodos; i++) {
            let ruta = [];
            for (let j = 1; j <= cantidadNodos; j++) {
                if (i === j) { //si el nodo origen es igual al nodo destino, la distancia es 0
                    ruta.push(0);
                } else {
                    ruta.push("X"); //si no, la distancia es infinito (X)
                }
            }
            rutas.push(ruta);
        }
        setRutas(rutas);

    }


    //Limpia los valores de las tablas y los nodos al presionar el botón limpiar
    const limpiar = () => {
        setTablasD([]);
        setTablasP([]);
        setTablasDResultados([]);
        setTablasPResultados([]);
        setMostrarRutaMasCorta("");
        setArchivo(null);
        setErrores({});
        setCantidadNodos(2);
        setBloquearInputs(false);

    }


    //Maneja el cambio de los inputs de la matriz de rutas
    const handleInputChange = (row, col, value) => {
        setRutas((prev) => {
            const newRutas = [...prev];
            newRutas[row - 1][col - 1] = parseInt(value, 10);
            return newRutas;
        });

    };

    //Maneja el cambio de los checkbox de la matriz de rutas (si la distancia es infinito)
    const handleCheckboxChange = (row, col) => {
        setRutas((prev) => {
            const newRutas = [...prev];
            newRutas[row - 1][col - 1] = newRutas[row - 1][col - 1] === "X" ? 0 : "X";
            return newRutas;
        });
    };


    //Función para calcular las rutas más cortas
    const calcularRutasMasCortas = () => {
        setBloquearInputs(true); //bloquear inputs para que no se puedan modificar
        let tablasD = []; //inicializar tablas D
        let tablasP = []; //inicializar tablas P

        let tablaD0 = [];
        let tablaP0 = [];
        for (let i = 0; i < cantidadNodos; i++) {
            let filaD = [];
            let filaP = [];
            for (let j = 0; j < cantidadNodos; j++) {
                if (i === j) { //si el nodo origen es igual al nodo destino, la distancia es 0
                    filaD.push(0);
                    filaP.push(0);
                } else { //si no, la distancia es la distancia de la matriz de rutas
                    filaD.push(rutas[i][j]);
                    filaP.push(0);
                }
            }
            tablaD0.push(filaD);
            tablaP0.push(filaP);
        }
        tablasD.push(tablaD0);
        tablasP.push(tablaP0);




        for (let k = 1; k <= cantidadNodos; k++) { //calcular las tablas D y P
            let tablaD = [];
            let tablaP = [];
            for (let i = 0; i < cantidadNodos; i++) {
                let filaD = [];
                let filaP = [];
                for (let j = 0; j < cantidadNodos; j++) {
                    let d1 = tablasD[k - 1][i][j] === "X" ? Infinity : parseInt(tablasD[k - 1][i][j], 10); //distancia de la tabla D en la posición i,j
                    let d2 = tablasD[k - 1][i][k - 1] === "X" || tablasD[k - 1][k - 1][j] === "X" //distancia de la tabla D en la posición i,k y k,j
                        ? Infinity
                        : parseInt(tablasD[k - 1][i][k - 1], 10) + parseInt(tablasD[k - 1][k - 1][j], 10);

                    if (d1 === Infinity && d2 === Infinity) { //si ambas distancias son infinito, la distancia es infinito
                        filaD.push("∞");
                        filaP.push("∞");
                    } else if (d1 === Infinity) { //si la distancia 1 es infinito, la distancia es la distancia 2
                        filaD.push(d2);
                        filaP.push(k);
                    } else if (d2 === Infinity) { //si la distancia 2 es infinito, la distancia es la distancia 1
                        filaD.push(d1);
                        filaP.push(tablasP[k - 1][i][j]);
                    } else { //si no, la distancia es la menor de las dos distancias
                        console.log("d1", d1, "d2", d2);
                        if (d1 <= d2) { //si la distancia 1 es menor o igual a la distancia 2
                            filaD.push(d1);
                            filaP.push(tablasP[k - 1][i][j]);
                        } else { //si no, la distancia es la distancia 2
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

        setTablasD(tablasD); //guardar tablas D
        setTablasP(tablasP); //guardar tablas P
    };


    //Renderiza las tablas D
    //Crea el HTML de las tablas D
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

    //Renderiza las tablas P
    //Crea el HTML de las tablas P
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


    //Maneja el cambio de los nombres de los nodos
    const handleNombreNodoChange = (index, value) => {
        setNombresPorDefecto((prev) => {
            const newNombres = [...prev];
            newNombres[index] = value;
            return newNombres;
        });
    };

    //Genera la tabla D0
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

    //Función para calcular la ruta más corta entre dos nodos
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
        setMostrarRutaMasCorta(rutaMasCorta);
    }

    //Renderiza la ruta más corta
    //Crea el HTML de la ruta más corta
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




    //Renderizar el componente
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
                    disabled={bloquearInputs}

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
                    style={{ marginLeft: 'auto' }}
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
