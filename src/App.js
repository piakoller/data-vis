import logo from './logo.svg';
import './App.css';
import vegaEmbed from "vega-embed";
import { useRef, useEffect } from "react";

function App() {
  const vegaLiteSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "data": {
      "values": [
        {"category": "A", "count": 28},
        {"category": "B", "count": 55},
        {"category": "C", "count": 43},
        {"category": "D", "count": 91},
        {"category": "E", "count": 81},
        {"category": "F", "count": 28},
        {"category": "G", "count": 22},
        {"category": "H", "count": 99},
        {"category": "I", "count": 5},
        {"category": "J", "count": 54},
      ],
    },
    "mark": "bar",
    "encoding": {
      "x": {"field": "category", "type": "ordinal"},
      "y": {"field": "count", "type": "quantitative"},
    },
  };

  const VegaLiteChart = ({ spec }) => {
    const containerRef = useRef(null);
  
    useEffect(() => {
      if (containerRef.current) {
        vegaEmbed(containerRef.current, spec);
      }
    }, [spec]);
  
    return <div ref={containerRef}></div>;
  };


  return (
    <div className="App">
      <header className="App-header">
      <VegaLiteChart spec={vegaLiteSpec} />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      
    </div>
  );
}

export default App;
