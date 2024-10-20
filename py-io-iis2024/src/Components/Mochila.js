import React, { useEffect, useState } from 'react';

const Mochila = () => {
    const [objetos, setObjetos] = useState([]);
    const [capacidad, setCapacidad] = useState(0);
    const [matrizSolucion, setMatrizSolucion] = useState([]);
    const [matrizCantidades, setMatrizCantidades] = useState([]);
    const [tipo, setTipo] = useState("bounded");
    const [componentesSolucion, setComponentesSolucion] = useState([]);
    const [cantidadesSolucion, setCantidadesSolucion] = useState([]);
    const [nombresPorDefecto, setNombresPorDefecto] = useState([
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"
    ]);

    const handleAddObjeto = () => {
        if (objetos.length < 10) {
            setObjetos([...objetos, { nombre: nombresPorDefecto[objetos.length], costo: 0, valor: 0, cantidad: 1 }]);
        } else {
            alert("No se pueden agregar más de 10 objetos.");
        }
    };

    const handleDeleteObjeto = (index) => {
        if (objetos.length > 1) {
            setObjetos(objetos.filter((obj, i) => i !== index));
        } else {
            alert("No se pueden eliminar más objetos.");
        }
    };

    const generarMatrizSolucion = () => {


        // matriz capacidad x objetos
        const dp = Array.from({ length: Number(capacidad) + 1 }, () => Array(objetos.length).fill(0));
        const matrizCantidades = Array.from({ length: Number(capacidad) + 1 }, () => Array(objetos.length).fill(0));
        if (tipo === "bounded") {
            // cantidad limitada de cada objeto. puedo tomar como máximo la cantidad indicada de cada objeto.
            for (let i = 0; i < Number(capacidad) + 1; i++) {
                for (let j = 0; j < objetos.length; j++) {
                    if (i === 0) {
                        dp[i][j] = 0;
                        matrizCantidades[i][j] = 0;
                    } else if (j === 0) {
                        if (Number(objetos[j].costo) <= i) {
                            dp[i][j] = Math.min(Math.floor(i / Number(objetos[j].costo)), Number(objetos[j].cantidad)) * Number(objetos[j].valor);
                            matrizCantidades[i][j] = Math.min(Math.floor(i / Number(objetos[j].costo)), Number(objetos[j].cantidad));
                        }
                    } else {
                        dp[i][j] = dp[i][j - 1];
                        for (let k = 1; k <= Number(objetos[j].cantidad) && k * Number(objetos[j].costo) <= i; k++) {
                            dp[i][j] = Math.max(dp[i][j], k * Number(objetos[j].valor) + dp[i - k * Number(objetos[j].costo)][j - 1]);
                            if (dp[i][j] === k * Number(objetos[j].valor) + dp[i - k * Number(objetos[j].costo)][j - 1]) {
                                matrizCantidades[i][j] = k;
                            }
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
                        matrizCantidades[i][j] = 0;
                    } else if (j === 0) {
                        if (Number(objetos[j].costo) <= i) {
                            dp[i][j] = Math.floor(i / Number(objetos[j].costo)) * Number(objetos[j].valor);
                            matrizCantidades[i][j] = Math.floor(i / Number(objetos[j].costo));
                        }
                    } else {
                        dp[i][j] = dp[i][j - 1];
                        if (Number(objetos[j].costo) <= i) {
                            dp[i][j] = Math.max(dp[i][j], Number(objetos[j].valor) + dp[i - Number(objetos[j].costo)][j]);
                            if (dp[i][j] === Number(objetos[j].valor) + dp[i - Number(objetos[j].costo)][j]) {
                                matrizCantidades[i][j] = matrizCantidades[i - Number(objetos[j].costo)][j] + 1;
                            } else {
                                matrizCantidades[i][j] = 0;
                            }
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
        console.log(matrizCantidades);
        setMatrizCantidades(matrizCantidades);
        setMatrizSolucion(dp);


    };

    useEffect(() => {
        if (matrizSolucion.length > 0) {
            console.log(encontrarComponentesSolucion(matrizSolucion));
        }
    }, [matrizSolucion]);

    useEffect(() => {
        setObjetos([
            { nombre: 'A', costo: 2, valor: 3, cantidad: 2 }
        ]);
    }, []);

    const encontrarComponentesSolucion = () => {
        const componentes = [];
        const cantidades = [];
        let i = Number(capacidad);
        let j = objetos.length - 1;
        while (i > 0 && j > 0) {
            if (matrizSolucion[i][j] !== matrizSolucion[i][j - 1]) {
                componentes.push(objetos[j].nombre);
                cantidades.push(matrizCantidades[i][j]);
                i -= Number(objetos[j].costo);
                j -= 1;
            } else {
                j -= 1;
            }
        }
        if (j === 0 && matrizSolucion[i][j] !== 0) {
            componentes.push(objetos[j].nombre);
            cantidades.push(matrizCantidades[i][j]);
        }
        console.log(cantidades);
        setCantidadesSolucion(cantidades);
        setComponentesSolucion(componentes);
    };




    const cargarArchivo = () => {
        limpiar();
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
        const data = { objetos, capacidad, matrizSolucion, tipo };
        const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = 'mochila.json';
        a.click();
    }

    const limpiar = () => {
        setObjetos([
            { nombre: 'A', costo: 2, valor: 3, cantidad: 2 }
        ]);
        setCapacidad(0);
        setMatrizSolucion([]);
        setComponentesSolucion([]);
    }

    const generarFormaMatematica = () => {
        //generar forma matemática del problema para los valores ingresados
        let formaMatematica = "";
        if (tipo === "bounded") {
            formaMatematica += "Maximizar:<br>";
            for (let i = 0; i < objetos.length; i++) {
                formaMatematica += `${objetos[i].valor}${objetos[i].nombre} + `;
            }
            formaMatematica = formaMatematica.slice(0, -2);
            formaMatematica +="<br>Sujeto a:<br>    ";
            for (let i = 0; i < objetos.length; i++) {
                formaMatematica += `${objetos[i].costo}x${objetos[i].nombre} + `;
            }
            formaMatematica = formaMatematica.slice(0, -2);
            formaMatematica += ` <= ${capacidad}`;
        } else if (tipo === "unbounded") {
            formaMatematica += "Maximizar:<br>  ";
            for (let i = 0; i < objetos.length; i++) {
                formaMatematica += `${objetos[i].valor}${objetos[i].nombre} + `;
            }
            formaMatematica = formaMatematica.slice(0, -2);
            formaMatematica += "<br>Sujeto a:<br>   ";
            for (let i = 0; i < objetos.length; i++) {
                formaMatematica += `${objetos[i].costo}${objetos[i].nombre} + `;
            }
            formaMatematica = formaMatematica.slice(0, -2);
            formaMatematica += ` <= ${capacidad}`;
        }else if (tipo === "0/1") {
            formaMatematica += "Maximizar:<br>  ";
            for (let i = 0; i < objetos.length; i++) {
                formaMatematica += `${objetos[i].valor}${objetos[i].nombre} + `;
            }
            formaMatematica = formaMatematica.slice(0, -2);
            formaMatematica += "<br>Sujeto a:<br>   ";
            for (let i = 0; i < objetos.length; i++) {
                formaMatematica += `${objetos[i].costo}${objetos[i].nombre} + `;
            }
            formaMatematica = formaMatematica.slice(0, -2);
            formaMatematica += ` <= ${capacidad}`;
        }
        return formaMatematica;
    }

    return (
        <div className="mochila">
            <h1>Problema de la mochila</h1>
            <p className='descripcion-problema'> Dado un conjunto de objetos, cada uno con un costo y un valor,
                     y una capacidad máxima de la mochila, determinar cuál es la combinación de objetos que 
                     maximiza el valor total sin exceder la capacidad de la mochila.</p>
            <div className='container'>

                <div className="row">
                    <div className="form-group">
                        <label>Ingrese la capacidad de la mochila:</label>
                        <input
                            className='input'
                            type="number"
                            value={capacidad}
                            onChange={(e) => e.target.value > 20 ? setCapacidad(20) : e.target.value < 0 ? setCapacidad(0) : setCapacidad(e.target.value)}
                            min={0}
                            max={20}
                        />
                    </div>
                    <div className="form-group">
                        <label>Versión de la mochila:</label>
                        <div className='row'>
                        <select style={{flex: 1, marginRight: '10px'}} 
                            value={tipo} onChange={(e) => setTipo(e.target.value)}>
                            <option value="bounded">Bounded</option>
                            <option value="unbounded">Unbounded</option>
                            <option value="0/1">0/1</option>
                        </select>
                        <label 
                            title=' Bounded: cantidad limitada de cada objeto.
                            Unbounded: cantidad ilimitada de cada objeto.
                            0/1: solo puedo tomar el objeto completo o no tomarlo.'>
                            <i className="fas fa-question-circle"></i>
                        </label>
                        </div>
                    </div>
                </div>
                <p>Ingrese los objetos:</p>
                <table className="table">
                    <thead className="thead">
                        <tr>
                            <th>Nombre</th>
                            <th>Costo</th>
                            <th>Valor</th>
                            {tipo === "bounded" && <th>Cantidad</th>}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {objetos.map((objeto, index) => (
                            <tr key={index}>
                                <td><input className='input-table' 
                                    type="text" value={objeto.nombre} onChange={(e) => {
                                    const newNombre = e.target.value;
                                    setObjetos(objetos.map((obj, i) => i === index ? { ...obj, nombre: newNombre } : obj));
                                }} /></td>
                                <td><input className='input-table' 
                                    type="number" value={objeto.costo} onChange={(e) => {
                                    const newCosto = e.target.value;
                                    setObjetos(objetos.map((obj, i) => i === index ? { ...obj, costo: newCosto } : obj));
                                }} /></td>
                                <td><input className='input-table' 
                                    type="number" value={objeto.valor} onChange={(e) => {
                                    const newValor = e.target.value;
                                    setObjetos(objetos.map((obj, i) => i === index ? { ...obj, valor: newValor } : obj));
                                }} /></td>
                                {tipo === "bounded" && (
                                <td>
                                    <div className='row'>
                                        <input
                                            style={{flex: 1, marginRight: '10px'}}
                                            className='input-table' 
                                            type="number"
                                            value={objeto.cantidad === "Infinity" ? "" : objeto.cantidad}
                                            disabled={objeto.cantidad === "Infinity"}
                                            onChange={(e) => {
                                                let newCantidad = e.target.value;
                                                if (newCantidad > 10) {
                                                    newCantidad = 10;
                                                }else if (newCantidad <0) {
                                                    newCantidad = 1;
                                                }

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
                                            Infinita
                                        </label>
                                    </div>
                                </td>
                                )}
                                <td>
                                    <button onClick={() => handleDeleteObjeto(index)} className="delete-button">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='button-group-mo'>
                    <button className='primary-button' onClick={handleAddObjeto}>Agregar objeto</button>
                    <button className="primary-button" onClick={() => cargarArchivo()}>Cargar desde archivo</button>
                    <button className="primary-button" onClick={() => guardarArchivo()}>Guardar configuración</button>
                    <button className="primary-button" onClick={() => limpiar()}>Limpiar</button>
                    <button 
                        style={{marginLeft: 'auto'}}
                        className='primary-button' 
                        onClick={generarMatrizSolucion}
                    >
                        Calcular solución
                    </button>
                </div>
                {matrizSolucion.length > 0 && (
                    <div className='solucion'>
                <div className='forma-matematica'>
                    <h3>Forma matemática:</h3>
                    <div dangerouslySetInnerHTML={{ __html: generarFormaMatematica() }}></div>

                </div>
                        <h3>Solución:</h3>
                        <table className="table">
                            <thead className="thead">
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
                                        <td className='celdaIndice' >{i}</td>
                                        
                                        {
                                        fila.map((valor, j) => {
                                            const isItemUsed = valor !== matrizSolucion[i][j - 1] && valor !== 0;
                                            
                                            return (
                                                <td key={j} className={isItemUsed ? 'celdaVerde' : 'celdaRoja'}>
                                                    {valor}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {componentesSolucion.length > 0 && (
                            <div className='componentes-solucion'>
                                <h3>Componentes de la solución:</h3>
                                <ul>
                                    {tipo === "bounded" || tipo === "unbounded" ? componentesSolucion.map((componente, index) => (
                                        <li key={index}>
                                            {componente} x {cantidadesSolucion[index]}
                                        </li>
                                    )) : componentesSolucion.map((componente, index) => (
                                        <li key={index}>
                                            {componente}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        )}
                       
                    </div>
                )}
            </div>
        </div>
    );
};
 
export default Mochila;