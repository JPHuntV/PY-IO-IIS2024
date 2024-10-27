import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree'; //Librería para visualizar árboles

function ArbolesBinariosBusqueda() {

    const [n, setN] = useState(0);
    const [nodos, setNodos] = useState([]); // [{llave: 'a', peso: 1}, {llave: 'b', peso: 2}]
    const [matrizPesos, setMatrizPesos] = useState([]); // [[0, 1, 2], [1, 0, 3], [2, 3, 0]]
    const [matrizR, setMatrizR] = useState([]);
    const [cargando, setCargando] = useState(false); // Se está cargando un archivo
    const [bloquear, setBloquear] = useState(false); // Bloquear inputs
    const [orgChart, setOrgChart] = useState({}); // Estructura para visualizar el árbol, ver documentación de react-d3-tree

    //Cada vez que se cambie el valor de n, se generan los nodos
    useEffect(() => {
        if (!cargando) {
            generarNodos(); //excepto cuando se está cargando un archivo
        }
        setCargando(false);
    }, [n]);

    // Función para guardar archivo
    // Se guarda un archivo con la información de los nodos, la matriz de pesos y la matriz R
    const guardarArchivo = () => {
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

    // Función para cargar archivo
    // Se carga un archivo con la información de los nodos, la matriz de pesos y la matriz R
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
                //Establecer los valores de los estados
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

    //Calcular matriz de pesos y matriz R
    const calcularMatrizPesos = () => {
        //La matriz R se inicializa con 0
        let matrizR = [];
        for (let i = 0; i <= n; i++) {
            matrizR[i] = [];
            for (let j = 0; j <= n; j++) {
                matrizR[i][j] = 0;
            }
        }

        //La matriz de pesos se inicializa con 0
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

        //Se calcula la matriz de pesos y la matriz R
        //Haciendo uso de la fórmula de la programación dinámica
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

        //Redondear a 4 decimales
        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= n; j++) {
                matrizPesos[i][j] = parseFloat(matrizPesos[i][j].toFixed(4));
            }
        }

        //Establecer los estados
        setBloquear(true);
        setMatrizR(matrizR);
        setMatrizPesos(matrizPesos);
    }


    //Genera los nodos con llave vacía y peso 0
    //Esto se hace para que se pueda ingresar la cantidad de nodos
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
                nodosT.push(nodos[i]);//mantener los nodos que ya existen
            }
        }

        setNodos(nodosT);
    }


    //Limpiar los estados
    const limpiar = () => {
        setN(0);
        setNodos([]);
        setMatrizPesos([]);
        setMatrizR([]);
        setBloquear(false);
    }

    //Grafiar el árbol
    //Se hace uso de la librería react-d3-tree
    useEffect(() => {
        if (matrizR.length > 0) {
            let orgChart = matrizToArbol(0, n); //Se convierte la matriz R a un árbol
            setOrgChart(orgChart);
        }
    }, [matrizR]);

    //Convertir la matriz R a un árbol
    const matrizToArbol = (i, j) => {
        if (i === j) {
            return null;
        }
        let k = matrizR[i][j];
        let nodo = nodos[k - 1];
        let left = matrizToArbol(i, k - 1);//Se hace recursión para el lado izquierdo
        let right = matrizToArbol(k, j); //Se hace recursión para el lado derecho
        let children = []; //Hijos del nodo
        if (left !== null) { //Si el nodo tiene hijo izquierdo
            children.push(left);
        }
        if (right !== null) { //Si el nodo tiene hijo derecho
            children.push(right);
        }
        return { //Se retorna el nodo
            name: nodo.llave,
            children: children
        };
    }



    //Renderizar el componente
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
                    {/* Se visualiza el árbol */}
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
