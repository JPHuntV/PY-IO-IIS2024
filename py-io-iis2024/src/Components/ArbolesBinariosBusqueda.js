import React, { useState, useEffect } from 'react';

function ArbolesBinariosBusqueda() {

    const [n, setN] = useState(0);
    const [nodos, setNodos] = useState([]); // [{llave: 'a', peso: 1}, {llave: 'b', peso: 2}]
    const [matrizPesos, setMatrizPesos] = useState([]); // [[0, 1, 2], [1, 0, 3], [2, 3, 0]]
    const [matrizR, setMatrizR] = useState([]); 

    useEffect(() => {
        generarNodos();
    }, [n]);

    const guardarArchivo = () => {
        let data = {
            n: n,
            nodos: nodos,
            matrizPesos: matrizPesos
        }
        
        let texto = JSON.stringify(data);
        let element = document.createElement('a');
        let file = new Blob([texto], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = 'arboles.json';
        element.click();
    }

    const cargarArchivo = () => {
        let element = document.createElement('input');
        element.type = 'file';
        element.onchange = () => {
            let file = element.files[0];
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                let data = JSON.parse(reader.result);
                setN(data.n);
                setNodos(data.nodos);
                setMatrizPesos(data.matrizPesos);
            }
        }
        element.click();
    }


    const calcularMatrizPesos = () => {

        let matrizR = [];
        for (let i = 0; i <= n; i++) {
            matrizR[i] = [];
            for (let j = 0; j <= n; j++) {
                matrizR[i][j] = 0;
            }
        }

        let matrizPesos = [];
        for (let i = 0; i <= n; i++) {
            matrizPesos[i] = [];
            for (let j = 0; j <= n; j++) {
                if (i === j) {
                    matrizPesos[i][j] = 0;
                } else if (i === j - 1) {
                    matrizPesos[i][j] = nodos[j - 1].peso;
                } else {
                    matrizPesos[i][j] = 0;
                }
            }
        }

        for (let j = 1; j <= n; j++) {
            for (let i = j - 1; i >= 0; i--) {
                let min = Number.MAX_VALUE;
                let sumatoriaPesos = 0;
                for (let k = i + 1; k <= j; k++) {
                    let peso = matrizPesos[i][k - 1] + matrizPesos[k][j];
                    if (peso < min) {
                        min = peso;
                        matrizR[i][j] = k;
                    }
                    sumatoriaPesos += nodos[k - 1].peso;
                }
                matrizPesos[i][j] = min + sumatoriaPesos;
            }
        }

        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= n; j++) {
                matrizPesos[i][j] = parseFloat(matrizPesos[i][j].toFixed(4));
            }
        }

        console.log(matrizPesos);
        console.log(matrizR);
        setMatrizR(matrizR);
        setMatrizPesos(matrizPesos);


    }


    





    

    const generarNodos = () => {
        let nodos = [];
        for (let i = 0; i < n; i++) {
            nodos.push({llave: '', peso: 0});
        }
        setNodos(nodos);
    }

    const limpiar = () => {
        setN(0);
        setNodos([]);
        setMatrizPesos([]);
    }


    return (
        <div>
            <h1>Arboles Binarios de Busqueda</h1>
            <input type="number" value={n} onChange={(e) => setN(e.target.value)}  disabled={matrizPesos.length > 0} />
            <button onClick={() => limpiar()}>Limpiar</button>
            <button onClick={() => cargarArchivo()}>Cargar archivo</button>
            <button onClick={() => guardarArchivo()}>Guardar archivo</button>
            <div>
             <p>Ingrese las llaves:</p>
            <table>
                <thead>
                    <tr>
                        <th>Llave</th>
                        <th>Peso</th>
                    </tr>
                </thead>
                <tbody>
                    {nodos.map((nodo, index) => (
                        <tr key={index}>
                            <td><input type="text" value={nodo.llave} onChange={(e) => {
                                let newNodos = [...nodos];
                                newNodos[index].llave = e.target.value;
                                setNodos(newNodos);
                            }} /></td>
                            <td><input type="number" value={nodo.peso} onChange={(e) => {
                                let newNodos = [...nodos];
                                newNodos[index].peso = parseFloat(e.target.value);
                                setNodos(newNodos);
                            }} /></td>

                        </tr>
                    ))}
                </tbody>
            </table>
            
            </div>
            <button onClick={() => calcularMatrizPesos()}>Generar </button>
            {matrizPesos.length > 0 && (
                <div>
                    <p>Matriz de pesos:</p>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                {nodos.map((nodo, index) => (
                                    <th key={index}>{nodo.llave}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrizPesos.map((fila, index) => (
                                <tr key={index}>
                                    <td>{index === 0 ? '': nodos[index-1].llave}</td>
                                    {fila.map((peso, index2) => (
                                        <td key={index2}>
                                            <input type="number" value={peso} onChange={(e) => {
                                                let newMatriz = [...matrizPesos];
                                                newMatriz[index][index2] = e.target.value;
                                                setMatrizPesos(newMatriz);
                                            }} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {matrizR.length > 0 && (
                <div>
                    <p>Matriz R:</p>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                {nodos.map((nodo, index) => (
                                    <th key={index}>{nodo.llave}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrizR.map((fila, index) => (
                                <tr key={index}>
                                    <td>{index === 0 ? '': nodos[index-1].llave}</td>
                                    {fila.map((r, index2) => (
                                        <td key={index2}>
                                            <input type="number" value={r} onChange={(e) => {
                                                let newMatriz = [...matrizR];
                                                newMatriz[index][index2] = e.target.value;
                                                setMatrizR(newMatriz);
                                            }} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
            )}



        </div>
    );
    }

export default ArbolesBinariosBusqueda;