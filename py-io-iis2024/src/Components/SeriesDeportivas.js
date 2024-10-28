import React from "react";
import { useState, useEffect } from "react";

function SeriesDeportivas() {
    //Estado para guardar la matriz de partidos
    const [matrizPartidos, setMatrizPartidos] = useState([]);
    const [formValues, setFormValues] = useState({//Estado para guardar los valores del formulario, se inicializa con valores por defecto
        probabilidadGanarCasaA: '0.5',
        probabilidadGanarVisitaA: '0.5',
        numeroMaximoPartidos: '1',
        distribucionPartidos: []
    });

    const [valoresOperacion, setValoresOperacion] = useState({}); //Estado para guardar los valores de la operación
    const [errores, setErrores] = useState({});


    //Función para obtener la matriz de partidos
    //Se calcula la probabilidad de ganar la serie en función del número de partidos jugados
    const obtenerMatriz = () => {
        if (valoresOperacion.numeroMaximoPartidos > 11) {
            setErrores({ ...errores, numeroMaximoPartidos: "El número máximo de partidos no puede ser mayor a 11." });
            return;
        }
        let matriz = [];
        console.log(valoresOperacion.distribucion);
        for (let i = 0; i < (valoresOperacion.n); i++) {
            matriz[i] = [];
            for (let j = 0; j < valoresOperacion.n; j++) {
                if (j === 0) {
                    matriz[i][j] = 0.0000;
                } else if (i === 0) {
                    matriz[i][j] = 1.0000;
                } else {
                    console.log(formValues.distribucionPartidos[j]);
                    if (formValues.distribucionPartidos[j - 2 + i] === 'A') { //Si el partido lo juega A en casa
                        matriz[i][j] = (valoresOperacion.Ph * matriz[i - 1][j] + valoresOperacion.qr * matriz[i][j - 1]).toFixed(4);
                    }
                    else { //Si el partido lo juega A de visita
                        matriz[i][j] = (valoresOperacion.pr * matriz[i - 1][j] + valoresOperacion.qh * matriz[i][j - 1]).toFixed(4);
                    }
                }
            }
        }
        setMatrizPartidos(matriz);
    }


    //Función para manejar el cambio en los valores del formulario
    const handleChageForm = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });
    }

    //Función para manejar la distribución de partidos
    //Se cambia la distribución de partidos de A a B y viceversa al hacer click en el botón
    const handleDistribucionPartidos = (index) => {
        setFormValues((prevValues) => {
            const distribucionNueva = [...prevValues.distribucionPartidos];
            distribucionNueva[index] = distribucionNueva[index] === 'A' ? 'B' : 'A';
            return { ...prevValues, distribucionPartidos: distribucionNueva };
        });
    };

    //Función para renderizar los botones de la distribución de partidos
    const renderDistribucionPartidos = () => {
        if (formValues.numeroMaximoPartidos === '') return null;
        if (formValues.numeroMaximoPartidos < 1) return null;
        if (formValues.numeroMaximoPartidos > 11) return null;
        return Array.from({ length: formValues.numeroMaximoPartidos }, (_, index) => (
            <button

                key={index}
                type="button"
                className={formValues.distribucionPartidos[index] === 'A' ? 'juegaLocal' : 'juegaVisita'} //Se cambia el color del botón según el equipo que juega
                onClick={() => handleDistribucionPartidos(index)}
            >
                {formValues.distribucionPartidos[index] || 'B'}

            </button>
        ));
    };


    //Al enviar el formulario se almacenan los valores en el estado y se calcula la matriz de partidos
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            setValoresOperacion({
                Ph: formValues.probabilidadGanarCasaA,
                qr: 1 - formValues.probabilidadGanarCasaA,
                pr: formValues.probabilidadGanarVisitaA,
                qh: 1 - formValues.probabilidadGanarVisitaA,
                n: Math.ceil(formValues.numeroMaximoPartidos / 2) + 1,
                distribucion: formValues.distribucionPartidos,
                distribucionPartidosCalc: formValues.distribucionPartidos
            });


        } else {
            return;
        }

    }

    //Se calcula la matriz de partidos cada vez que cambian los valores de la operación
    useEffect(() => {
        if (Object.keys(valoresOperacion).length > 0) {
            obtenerMatriz();
        }
    }, [valoresOperacion]);

    //Guarda el estado actual en un archivo txt
    const guardar = () => {
        const textoDatosFormulario = JSON.stringify(formValues);
        const textoMatrizPartidos = JSON.stringify(matrizPartidos);

        const documento = document.createElement("a");
        const file = new Blob([textoDatosFormulario + '\n' + textoMatrizPartidos], { type: 'text/plain' });
        documento.href = URL.createObjectURL(file);
        documento.download = "seriesDeportivas.txt";
        document.body.appendChild(documento);
        documento.click();
    }

    //Carga los datos de un archivo txt
    const cargarDatos = (e) => {
        e.preventDefault();
        errores.cargarDatos = null;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';

        input.onchange = e => {
            const file = e.target.files[0];
            if (file && file.type === 'text/plain') {
                const reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = readerEvent => {
                    try {
                        const content = readerEvent.target.result;
                        const datos = content.split('\n');
                        if (datos.length >= 2) {
                            const formValues = JSON.parse(datos[0]);
                            const matrizPartidos = JSON.parse(datos[1]);
                            if (validateFormValues(formValues) && validateMatrizPartidos(matrizPartidos)) {
                                setFormValues(formValues);
                                //setMatrizPartidos(matrizPartidos);
                            } else {
                                errores.cargarDatos = 'El archivo no contiene los datos esperados.';
                            }
                        } else {
                            errores.cargarDatos = 'El archivo no contiene los datos esperados.';
                        }
                    } catch (error) {
                        errores.cargarDatos = 'El archivo no contiene los datos esperados.';
                    }
                };
            } else {
                errores.cargarDatos = 'El archivo no es válido.';
            }
        };
        setErrores(errores);
        input.click();

    };

    //Valida que los valores del formulario sean un objeto y que no sean nulos
    const validateFormValues = (formValues) => {
        return typeof formValues === 'object' && formValues !== null;
    };

    //Valida que la matriz de partidos sea un arreglo
    const validateMatrizPartidos = (matrizPartidos) => {
        return Array.isArray(matrizPartidos);
    };

    //Valida que los valores del formulario sean correctos
    const validateForm = () => {
        let valido = true;
        let errores = {};
        if (formValues.probabilidadGanarCasaA === '' || formValues.probabilidadGanarVisitaA === '' || formValues.numeroMaximoPartidos === '') {
            errores.general = '*Todos los campos son obligatorios';
            valido = false;
        }
        if (formValues.probabilidadGanarCasaA < 0 || formValues.probabilidadGanarCasaA > 1) {
            errores.probabilidadGanarCasaA = 'La probabilidad de ganar de casa A debe ser un número entre 0 y 1';
            valido = false;
        }
        if (formValues.probabilidadGanarVisitaA < 0 || formValues.probabilidadGanarVisitaA > 1) {
            errores.probabilidadGanarVisitaA = 'La probabilidad de ganar de visita A debe ser un número entre 0 y 1';
            valido = false;
        }
        if (formValues.numeroMaximoPartidos < 1 && formValues.numeroMaximoPartidos !== '') {
            errores.numeroMaximoPartidos = 'El número máximo de partidos debe ser mayor a 0';
            valido = false;
        }
        if (formValues.numeroMaximoPartidos > 11) {
            errores.numeroMaximoPartidos = 'El número máximo de partidos debe ser menor o igual a 11';
            valido = false;
        }

        setErrores(errores);
        return valido;

    }




    return (
        <div className="seriesDeportivas">
            <h1>Series Deportivas</h1>
            <p className="descripcion-problema" >Este programa resuelve el problema de las series deportivas,
                en el cual se busca determinar la probabilidad de que un equipo A
                gane una serie de partidos contra un equipo B.
                El programa mostrará una tabla con la probabilidad de que el
                equipo A gane la serie en función del número de partidos jugados.</p>
            <div className="container">
                <form className="form-a" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="form-group">
                            <label className="label">
                                Probabilidad de ganar en casa A:
                            </label>
                            <input
                                className="input"
                                type="number"
                                value={formValues.probabilidadGanarCasaA}
                                onChange={handleChageForm}
                                name="probabilidadGanarCasaA"
                                min={0}
                                max={1}
                                step={0.0001}
                            />
                            <div className="error">{errores.probabilidadGanarCasaA}</div>
                        </div>
                        <div className="form-group">
                            <label className="label">
                                Probabilidad de ganar de visita A:
                            </label>
                            <input
                                className="input"
                                type="number"
                                value={formValues.probabilidadGanarVisitaA}
                                onChange={handleChageForm}
                                name="probabilidadGanarVisitaA"
                                min={0}
                                max={1}
                                step={0.0001}
                            />
                            <div className="error">{errores.probabilidadGanarVisitaA}</div>
                        </div>
                        <div className="form-group">
                            <label className="label">
                                Número máximo de partidos:
                            </label>
                            <input
                                className="input"
                                type="number"
                                value={formValues.numeroMaximoPartidos}
                                onChange={handleChageForm}
                                name="numeroMaximoPartidos"
                                min={1}
                                max={11}
                                step={1}
                                placeholder="Ingrese un número entre 1 y 11"
                                aria-describedby="errorNumeroMaximoPartidos"
                            />
                            <div id="errorNumeroMaximoPartidos" className="error">{errores.numeroMaximoPartidos}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group">
                            <label>Distribución de partidos:</label>
                            <div className="distribucionPartidos">
                                {renderDistribucionPartidos()}
                            </div>
                        </div>
                    </div>
                    <div className="error">{errores.general}</div>

                    <div className="button-group-sd">
                        <button className="primary-button" onClick={guardar}>Guardar configuración</button>
                        <button className="primary-button" onClick={cargarDatos}>Cargar desde archivo</button>
                        <button
                            style={{marginLeft: 'auto'}}
                            className="primary-button" type="submit">Calcular solución</button>
                    </div>
                        {errores.cargarDatos && <div className="error">*{errores.cargarDatos}</div>}
                </form>

                {matrizPartidos.length > 0 && (
                    <div className="resultados">
                        <table className="table">
                            <thead className="thead">
                                <tr>
                                    <th></th>
                                    {Array.from({ length: valoresOperacion.n }, (_, i) => (
                                        <th key={i}>{i}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {matrizPartidos.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <th>{rowIndex}</th>
                                        {row.map((cell, cellIndex) => (
                                            console.log(cellIndex),
                                            <td
                                                className={
                                                    cellIndex === 0 || rowIndex == 0 ? 'celdaIndice' :
                                                        valoresOperacion.distribucionPartidosCalc[cellIndex - 2 + rowIndex] === 'A' ? 'celdaVerde' : 'celdaRoja'}

                                                key={cellIndex}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h3>Probabilidad de ganar la serie: {matrizPartidos[valoresOperacion.n - 1][valoresOperacion.n - 1]}</h3>
                    </div>

                )}
            </div>
        </div>
    );
}

export default SeriesDeportivas;