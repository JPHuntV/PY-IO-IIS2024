import React from "react";
import { useState, useEffect } from "react";

function RutasMasCortas() {
    const [rutas, setRutas] = useState([]);
    const [nodos, setNodos] = useState([]);
    const [cantidadNodos, setCantidadNodos] = useState();
    const [errores, setErrores] = useState({});
    const [nombresPorDefecto, setNombresPorDefecto] = useState([
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"
    ]);

    useEffect(() => {
        inicializarNodos();
        inicializarRutas();
    }, []);

    useEffect(() => {
        inicializarNodos();
        inicializarRutas();
    }, [cantidadNodos]);

    useEffect(() => {
        console.log("rutas", rutas);
    }, [rutas]);

    const handleCantidadNodosChange = (event) => {
        if (event.target.value === "") {
            setCantidadNodos("");
            setErrores({}); 
        } else if (event.target.value <2) {
            setCantidadNodos(2);
            setErrores({cantidadNodos: "La cantidad de nodos debe ser mayor o igual a 2"});
        } else if (event.target.value > 10) {
            setCantidadNodos(10);
            setErrores({cantidadNodos: "La cantidad de nodos debe ser menor o igual a 10"});
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

    const inicializarRutas = () => {
        let rutas = [];
        for (let i = 1; i <= cantidadNodos; i++) {
            let ruta = [];
            for (let j = 1; j <= cantidadNodos; j++) {
                if(i === j) {
                    ruta.push(0);
                } else {
                    ruta.push("X");
                }
            }
            rutas.push(ruta);
        }
        setRutas(rutas);
    }

    const handleInputChange = (row, col, value) => {
        setRutas((prev) => {
            const newRutas = [...prev];
            newRutas[row - 1][col - 1] = value;
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
                <button onClick={inicializarRutas}>Limpiar</button>
                <button>Calcular</button>
            </div>
            <div>
                {generarTablaD0()}
            </div>
        </div>
    );

}

export default RutasMasCortas;
