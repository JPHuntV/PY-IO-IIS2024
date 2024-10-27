import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone/esm/vis-network'; //Se importa la librería vis-network para visualizar el grafo

// Convertir la tabla d0 en formato de nodos y aristas (edges)
const createGraphData = (matrix, nodeNames) => {
  
  const nodes = matrix.map((_, index) => ({ id: index, label: nodeNames[index] }));
  const edges = [];

  matrix.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val !== 'X' && val !== 0) {
        edges.push({ from: i,
                      to: j, 
                      label: val.toString() , 
                      font: { align: 'middle' },
                      smooth: { type: 'curvedCCW', roundness: 0.25 } });
      }
    });
  });

  return { nodes, edges };
};

const GraphComponent = ({ matrix, nodeNames }) => {

  const networkContainer = useRef(null);

  useEffect(() => {
    const graphData = createGraphData(matrix, nodeNames);

    const options = {
      nodes: {
        shape: 'dot',
        size: 20,  // Nodos ligeramente más grandes para 10 nodos
        color: '#99ccff',
        font: { color: '#000000', size: 16 },  // Tamaño del texto de los nodos
      },
      edges: {
        color: '#848484',
        arrows: 'to',
        font: {
          color: '#000000',
          size: 14,  // Tamaño de la etiqueta del peso
          align: 'horizontal',
        },
        smooth: {
          enabled: true,  // Activar curvas en las conexiones
        }
      },
      physics: {
        enabled: true,  // Activar física para mejorar la distribución
        barnesHut: {  
          gravitationalConstant: -3000,  // Reducir repulsión para nodos conectados
          centralGravity: 0.2,  // Aumentar la gravedad central para que los nodos desconectados no se vayan demasiado lejos
          springLength: 200,  // Longitud de resorte para mantener nodos separados moderadamente
          springConstant: 0.05,  // Resorte flexible para buena distribución
          avoidOverlap: 1  // Evitar superposición entre nodos
        },
        solver: 'barnesHut',
        stabilization: {
          enabled: true,
          iterations: 500,  // Menos iteraciones para estabilizar rápido
          updateInterval: 50,
        },
      },
      layout: {
        improvedLayout: true,  // Mejorar layout inicial
      }
    };
    const network = new Network(networkContainer.current, graphData, options);

    return () => {
      network.destroy(); // Limpiar la red al desmontar el componente
    };
  }, [matrix, nodeNames]);

  return <div 
              ref={networkContainer} 
              style={{ 
                height: '800px', 
                width: '100%',
                borderRadius: '10px',
              }} />;
};

export default GraphComponent;
