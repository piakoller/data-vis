import logo from './logo.svg';
import './App.css';
import vegaEmbed from "vega-embed";
import { useRef, useEffect } from "react";

function App() {
  const vegaLiteSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "data": {
      "values": [
        { "category": "A", "count": 28 },
        { "category": "B", "count": 55 },
        { "category": "C", "count": 43 },
        { "category": "D", "count": 91 },
        { "category": "E", "count": 81 },
        { "category": "F", "count": 28 },
        { "category": "G", "count": 22 },
        { "category": "H", "count": 99 },
        { "category": "I", "count": 5 },
        { "category": "J", "count": 54 },
      ],
    },
    "mark": "bar",
    "encoding": {
      "x": { "field": "category", "type": "ordinal" },
      "y": { "field": "count", "type": "quantitative" },
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
        <div className="parent">
          <div className="box1">
            <VegaLiteChart spec={vegaLiteSpec} />
          </div>
          <div className="box2">
            BOX 2
          </div>
          <div className="box3">
            BOX 3
          </div>
          <div className="box4">
            BOX 3
          </div>
        </div>
      </header>

    </div>
  );
}

export default App;
