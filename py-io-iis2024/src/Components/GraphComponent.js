import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone/esm/vis-network';

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
        size: 16,
        color: '#4CAF50',
        font: { color: '#000000' },
      },
      edges: {
        color: '#848484',
        arrows: 'to',
      },
      physics: {
        enabled: false,
        
      },
    };

    const network = new Network(networkContainer.current, graphData, options);

    return () => {
      network.destroy(); // Limpiar la red al desmontar el componente
    };
  }, [matrix, nodeNames]);

  return <div 
              ref={networkContainer} 
              style={{ 
                height: '300px', 
                borderRadius: '10px',
              }} />;
};

export default GraphComponent;
