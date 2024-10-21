import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
function ArbolesBinariosBusqueda() {

    const [n, setN] = useState(0);
    const [nodos, setNodos] = useState([]); // [{llave: 'a', peso: 1}, {llave: 'b', peso: 2}]
    const [matrizPesos, setMatrizPesos] = useState([]); // [[0, 1, 2], [1, 0, 3], [2, 3, 0]]
    const [matrizR, setMatrizR] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [bloquear, setBloquear] = useState(false);
    const [orgChart, setOrgChart] = useState({});

    useEffect(() => {

        if (!cargando) {
            generarNodos();
        }
        setCargando(false);
    }, [n]);

    const guardarArchivo = () => {
        //save file as txt with json
        let data = {
            n: n,
            nodos: nodos,
            matrizPesos: matrizPesos,
            matrizR: matrizR
        }
        let jsonData = JSON.stringify(data);
        let blob = new Blob([jsonData], { type: 'text/plain' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'arboles_binarios_busqueda.txt';
        a.click();
    }

    const cargarArchivo = () => {
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = readerEvent => {
                let content = readerEvent.target.result;
                let data = JSON.parse(content);
                setNodos(data.nodos);
                setCargando(true);
                setN(data.n);
                setMatrizPesos(data.matrizPesos);
                setMatrizR(data.matrizR);
                setBloquear(false);
            }
        }
        input.click();
    }

    // Función para ordenar llaves y convertir pesos a probabilidades
    const ordenarYConvertirPesos = (nodos) => {
        // Ordenar nodos por llave en orden lexicográfico
        nodos.sort((a, b) => a.llave.localeCompare(b.llave));

        // Calcular la suma de todos los pesos
        const sumaPesos = nodos.reduce((acc, nodo) => acc + nodo.peso, 0);

        // Convertir cada peso en una probabilidad
        nodos.forEach(nodo => {
            nodo.probabilidad = nodo.peso / sumaPesos;
        });

        return nodos;
    }


    const calcularMatrizPesos = () => {
        //setNodos(ordenarYConvertirPesos(nodos));
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
        setBloquear(true);
        setMatrizR(matrizR);
        setMatrizPesos(matrizPesos);


    }










    const generarNodos = () => {
        //limpiar
        setMatrizPesos([]);
        setMatrizR([]);
        setBloquear(false);

        let nodosT = [];
        for (let i = 0; i < n; i++) {
            if (nodos[i] === undefined) {
                nodosT.push({ llave: '', peso: 0 });
            } else {
                nodosT.push(nodos[i]);
            }
        }

        setNodos(nodosT);
    }

    const limpiar = () => {
        setN(0);
        setNodos([]);
        setMatrizPesos([]);
        setMatrizR([]);
        setBloquear(false);
    }

    useEffect(() => {
        if (matrizR.length > 0) {
            let orgChart = matrizToArbol(0, n);
            setOrgChart(orgChart);
        }
    }, [matrizR]);

    const matrizToArbol = (i, j) => {
        if (i === j) {
            return null;
        }
        let k = matrizR[i][j];
        let nodo = nodos[k - 1];
        let left = matrizToArbol(i, k - 1);
        let right = matrizToArbol(k, j);
        let children = [];
        if (left !== null) {
            children.push(left);
        }
        if (right !== null) {
            children.push(right);
        }
        return {
            name: nodo.llave,
            children: children
        };
    }




    return (
        <div className="arboles-binarios-busqueda">
            <h1>Arboles Binarios de Busqueda</h1>
            <p>Este algoritmo resuelve el problema de los arboles binarios de busqueda.
                Se debe ingresar la cantidad de nodos y luego ingresar la llave y el peso de cada nodo.
            </p>
            <div className='form-group'>
                <label>Cantidad de nodos:</label>
                <input
                    type="number"
                    value={n}
                    onChange={(e) => e.target.value < 0 ? setN(0) : e.target.value > 10 ? setN(10) : setN(parseInt(e.target.value))}
                    min={0}
                    max={10}
                    disabled={bloquear}
                />
            </div>
            <div className='button-group-bst'>
                <button className="primary-button" onClick={() => limpiar()}>Limpiar</button>
                <button className="primary-button" onClick={() => cargarArchivo()}>Cargar archivo</button>
                <button className="primary-button" onClick={() => guardarArchivo()}>Guardar archivo</button>
            </div>
            {n > 0 && (
                <div className='nodos-bst'>
                    <div className='form-group'>

                        <h3>Ingresar nodos:</h3>

                        <table className="table">
                            <thead className="thead">
                                <tr>
                                    <th>Llave</th>
                                    <th>Peso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nodos.map((nodo, index) => (
                                    <tr key={index}>
                                        <td><input
                                            className='input-table'
                                            type="text" value={nodo.llave} onChange={(e) => {
                                                let newNodos = [...nodos];
                                                newNodos[index].llave = e.target.value;
                                                setNodos(newNodos);
                                            }} /></td>
                                        <td><input
                                            className='input-table'
                                            type="number" value={nodo.peso} onChange={(e) => {
                                                let newNodos = [...nodos];
                                                newNodos[index].peso = parseFloat(e.target.value);
                                                setNodos(newNodos);
                                            }} /></td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='button-group-bst'>
                        <button className='primary-button' onClick={() => calcularMatrizPesos()}>Generar </button>
                    </div>
                </div>
            )}

            {matrizPesos.length > 0 && (
                <div className="container">
                    <h3>Matriz de Pesos:</h3>
                    <table className="table">
                        <thead className="thead">
                            <tr>
                                <th></th>
                                <th></th>
                                {nodos.map((nodo, index) => (
                                    <th key={index}>{nodo.llave}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrizPesos.map((fila, index) => (
                                <tr key={index}>
                                    <td>{index === 0 ? '' : nodos[index - 1].llave}</td>
                                    {fila.map((peso, index2) => (
                                        <td key={index2}>
                                            <p>{peso}</p>
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
                    <h3>Matriz R:</h3>
                    <table className="table">
                        <thead className="thead">
                            <tr>
                                <th></th>
                                <th></th>
                                {nodos.map((nodo, index) => (
                                    <th key={index}>{nodo.llave}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrizR.map((fila, index) => (
                                <tr key={index}>
                                    <td>{index === 0 ? '' : nodos[index - 1].llave}</td>
                                    {fila.map((r, index2) => (
                                        <td key={index2}>
                                            <p>{r}</p>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3>Arbol Binario de Busqueda:</h3>
                    <div id="treeWrapper" className='tree-wrapper'>
                        <Tree
                            data={orgChart}
                            orientation='vertical'
                            rootNodeClassName="node__root"
                            branchNodeClassName="node__branch"
                            leafNodeClassName="node__leaf"
                        />
                    </div>

                </div>
            )}



        </div>
    );
}

export default ArbolesBinariosBusqueda;
