import React from "react";
import { useState, useEffect } from "react";

function SeriesDeportivas() {

    const [matrizPartidos, setMatrizPartidos] = useState([]);
    const [formValues, setFormValues] = useState({
        probabilidadGanarCasaA: '',
        probabilidadGanarVisitaA: '',
        numeroMaximoPartidos: '',
        distribucionPartidos: []
    });
    const [valoresOperacion, setValoresOperacion] = useState({});
    const [errores, setErrores] = useState({});



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
                    if (formValues.distribucionPartidos[j - 2 + i] === 'A') {
                        matriz[i][j] = (valoresOperacion.Ph * matriz[i - 1][j] + valoresOperacion.qr * matriz[i][j - 1]).toFixed(4);
                    }
                    else {
                        matriz[i][j] = (valoresOperacion.pr * matriz[i - 1][j] + valoresOperacion.qh * matriz[i][j - 1]).toFixed(4);
                    }
                }
            }
        }
        console.log(matriz);
        setMatrizPartidos(matriz);
    }


    const handleChageForm = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });
    }

    const handleDistribucionPartidos = (index) => {
        setFormValues((prevValues) => {
            const distribucionNueva = [...prevValues.distribucionPartidos];
            distribucionNueva[index] = distribucionNueva[index] === 'A' ? 'B' : 'A';
            return { ...prevValues, distribucionPartidos: distribucionNueva };
        });
    };

    const renderDistribucionPartidos = () => {
        return Array.from({ length: formValues.numeroMaximoPartidos }, (_, index) => (
            <button
                key={index}
                type="button"
                className={formValues.distribucionPartidos[index] === 'A' ? 'juegaLocal' : 'juegaVisita'}
                onClick={() => handleDistribucionPartidos(index)}
            >
                {formValues.distribucionPartidos[index] || 'B'}

            </button>
        ));
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formValues);

        if (validateForm()) {
            setValoresOperacion({
                Ph: formValues.probabilidadGanarCasaA,
                qr: 1 - formValues.probabilidadGanarCasaA,
                pr: formValues.probabilidadGanarVisitaA,
                qh: 1 - formValues.probabilidadGanarVisitaA,
                n: Math.ceil(formValues.numeroMaximoPartidos / 2) + 1,
                distribucion: formValues.distribucionPartidos
            });


        } else {
            return;
        }

    }


    useEffect(() => {
        if (Object.keys(valoresOperacion).length > 0) {
            obtenerMatriz();
        }
    }, [valoresOperacion]);

    const test = () => {
        console.log("test");
    }

    const guardar = () => {
        //guarda el estado actual en un archivo txt
        const textoDatosFormulario = JSON.stringify(formValues);
        const textoMatrizPartidos = JSON.stringify(matrizPartidos);
        
        const documento = document.createElement("a");
        const file = new Blob([textoDatosFormulario + '\n' + textoMatrizPartidos ], { type: 'text/plain' });
        documento.href = URL.createObjectURL(file);
        documento.download = "seriesDeportivas.txt";
        document.body.appendChild(documento); // Required for this to work in FireFox
        documento.click();
    }

    const cargarDatos = () => {
        //carga el estado guardado de un archivo txt
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = readerEvent => {
                const content = readerEvent.target.result;
                const datos = content.split('\n');
                setFormValues(JSON.parse(datos[0]));
                setMatrizPartidos(JSON.parse(datos[1]));
            }
        }
        input.click();

    }

    const validateForm = () => {
        let valido = true;
        let errores = {};
        if (formValues.probabilidadGanarCasaA === '' || formValues.probabilidadGanarVisitaA === '' || formValues.numeroMaximoPartidos === '') {
            errores.general = 'Todos los campos son obligatorios';
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
        <div>
            <h1>Series Deportivas</h1>

            <div>
                <form className="form-a" onSubmit={handleSubmit}>
                    <div>

                        <label>
                            Probabilidad de ganar en casa A:
                        </label>
                        <input
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
                    <div>
                        <label>
                            Probabilidad de ganar en casa B:
                        </label>
                        <input
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
                    <div>
                        <label>
                            Número máximo de partidos:
                        </label>
                        <input
                            type="number"
                            value={formValues.numeroMaximoPartidos}
                            onChange={handleChageForm}
                            name="numeroMaximoPartidos"
                            min={1}
                            max={11}
                            step={1}
                        />
                        <div className="error">{errores.numeroMaximoPartidos}</div>
                    </div>
                    <div>
                        <label>Distribución de partidos:</label>
                        {renderDistribucionPartidos()}
                    </div>
                    <div>
                        <div className="error">{errores.general}</div>
                    </div>

                    <button type="submit">Generar</button>




                </form>
                <div>
                    <button onClick={guardar}>guardar</button>
                    <button onClick={cargarDatos}>cargar</button>
                </div>
                <table>
                    <thead>
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
                                <th

                                >{rowIndex}</th>
                                {row.map((cell, cellIndex) => (
                                    console.log(cellIndex),
                                    <td
                                        className={
                                            cellIndex === 0 || rowIndex == 0 ? 'celdaIndice' :
                                                formValues.distribucionPartidos[cellIndex - 2 + rowIndex] === 'A' ? 'juegaLocal' : 'juegaVisita'}

                                        key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SeriesDeportivas;