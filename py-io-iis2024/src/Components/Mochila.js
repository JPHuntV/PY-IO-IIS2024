import React, { useState } from 'react';

const Mochila = () => {
    const [objetos, setObjetos] = useState([]);
    const [capacidad, setCapacidad] = useState(0);
    const [matrizSolucion, setMatrizSolucion] = useState([]);
    const [tipo, setTipo] = useState("bounded");

    const handleAddObjeto = () => {
        if (objetos.length < 10) {
            setObjetos([...objetos, { nombre: '', costo: 0, valor: 0, cantidad: 0 }]);
        } else {
            alert("No se pueden agregar más de 10 objetos.");
        }
    };

    const handleDeleteObjeto = (index) => {
        setObjetos(objetos.filter((_, i) => i !== index));
    };

    const generarMatrizSolucion = () => {


        // matriz capacidad x objetos
        const dp = Array.from({ length: Number(capacidad) + 1 }, () => Array(objetos.length).fill(0));

        if (tipo === "bounded") {
            // cantidad limitada de cada objeto. puedo tomar como máximo la cantidad indicada de cada objeto.
            for (let i = 0; i < Number(capacidad) + 1; i++) {
                for (let j = 0; j < objetos.length; j++) {
                    if (i === 0) {
                        dp[i][j] = 0;
                    } else if (j === 0) {
                        if (Number(objetos[j].costo) <= i) {
                            dp[i][j] = Math.min(Math.floor(i / Number(objetos[j].costo)), Number(objetos[j].cantidad)) * Number(objetos[j].valor);
                        }
                    } else {
                        dp[i][j] = dp[i][j - 1];
                        for (let k = 1; k <= Number(objetos[j].cantidad) && k * Number(objetos[j].costo) <= i; k++) {
                            dp[i][j] = Math.max(dp[i][j], k * Number(objetos[j].valor) + dp[i - k * Number(objetos[j].costo)][j - 1]);
                        }
                    }
                }
            }
        } else if (tipo === "unbounded") {
           // cantidad ilimitada de cada objeto. puedo tomar la cantidad que quiera de cada objeto.
                        for (let i = 0; i < Number(capacidad) + 1; i++) {
                for (let j = 0; j < objetos.length; j++) {
                    if (i === 0) {
                        dp[i][j] = 0;
                    } else if (j === 0) {
                        if (Number(objetos[j].costo) <= i) {
                            dp[i][j] = Math.floor(i / Number(objetos[j].costo)) * Number(objetos[j].valor);
                        }
                    } else {
                        dp[i][j] = dp[i][j - 1];
                        if (Number(objetos[j].costo) <= i) {
                            dp[i][j] = Math.max(dp[i][j], Number(objetos[j].valor) + dp[i - Number(objetos[j].costo)][j]);
                        }
                    }
                }
            }
        } else if (tipo === "0/1") {
            //solo puedo tomar el objeto completo o no tomarlo
            for (let i = 0; i < Number(capacidad) + 1; i++) {
                for (let j = 0; j < objetos.length; j++) {
                    if (i === 0) {
                        dp[i][j] = 0;
                    } else if (j === 0) {
                        if (Number(objetos[j].costo) <= i) {
                            dp[i][j] = Number(objetos[j].valor);
                        }
                    } else {
                        dp[i][j] = dp[i][j - 1];
                        if (Number(objetos[j].costo) <= i) {
                            dp[i][j] = Math.max(dp[i][j], Number(objetos[j].valor) + dp[i - Number(objetos[j].costo)][j - 1]);
                        }
                    }
                }
            }
        }

        console.log(dp);

        setMatrizSolucion(dp);


    };

    const cargarArchivo = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);
                setObjetos(data.objetos);
                setCapacidad(data.capacidad);
                setTipo(data.tipo);
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const guardarArchivo = () => {
        const data = { objetos, capacidad, tipo };
        const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = 'mochila.json';
        a.click();
    }

    const limpiar = () => {
        setObjetos([]);
        setCapacidad(0);
        setMatrizSolucion([]);
    }

    return (
        <div>
            <h1>Problema de la mochila</h1>
            <div>
                <button onClick={() => cargarArchivo()}>Cargar archivo</button>
                <button onClick={() => guardarArchivo()}>Guardar archivo</button>
                <button onClick={() => limpiar()}>Limpiar</button>
            </div>
            <p>Ingrese la capacidad de la mochila:</p>
            <input type="number" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} />
            <p>Versión del Problema</p>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="bounded">Bounded</option>
                <option value="unbounded">Unbounded</option>
                <option value="0/1">0/1</option>
            </select>
            <p>Ingrese los objetos:</p>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Costo</th>
                        <th>Valor</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {objetos.map((objeto, index) => (
                        <tr key={index}>
                            <td><input type="text" value={objeto.nombre} onChange={(e) => {
                                const newNombre = e.target.value;
                                setObjetos(objetos.map((obj, i) => i === index ? { ...obj, nombre: newNombre } : obj));
                            }} /></td>
                            <td><input type="number" value={objeto.costo} onChange={(e) => {
                                const newCosto = e.target.value;
                                setObjetos(objetos.map((obj, i) => i === index ? { ...obj, costo: newCosto } : obj));
                            }} /></td>
                            <td><input type="number" value={objeto.valor} onChange={(e) => {
                                const newValor = e.target.value;
                                setObjetos(objetos.map((obj, i) => i === index ? { ...obj, valor: newValor } : obj));
                            }} /></td>
                            <td>
                                <input
                                    type="number"
                                    value={objeto.cantidad === "Infinity" ? "" : objeto.cantidad}
                                    disabled={objeto.cantidad === "Infinity"}
                                    onChange={(e) => {
                                        const newCantidad = e.target.value;
                                        setObjetos(objetos.map((obj, i) => i === index ? { ...obj, cantidad: newCantidad } : obj));
                                    }}
                                />
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={objeto.cantidad === "Infinity"}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setObjetos(objetos.map((obj, i) => i === index ? { ...obj, cantidad: isChecked ? "Infinity" : 0 } : obj));
                                        }}
                                    />
                                    Infinito
                                </label>
                            </td>
                            <td><button onClick={() => handleDeleteObjeto(index)}>Eliminar</button></td>
                        </tr>
                    ))}
                                </tbody>
                            </table>
                            <button onClick={handleAddObjeto}>Agregar objeto</button>
                            <button onClick={generarMatrizSolucion}>Generar Solución</button>
                            <h2>Solución:</h2>
                                                                <table>
                                            <thead>
                                                <tr>
                                                    <th>Capacidad</th>
                                                    {objetos.map((objeto, index) => (
                                                        <th key={index}>{objeto.nombre}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {matrizSolucion.map((fila, i) => (
                                                    <tr key={i}>
                                                        <td>{i}</td>
                                                        {fila.map((valor, j) => {
                                                            const isItemUsed = j > 0 && valor !== matrizSolucion[i][j - 1];
                                                            return (
                                                                <td key={j} style={{ color: isItemUsed ? 'red' : 'black' }}>
                                                                    {valor}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                        </div>
                    );
};

export default Mochila;