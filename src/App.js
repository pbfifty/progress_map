import logo from './logo.svg';
import './App.css';
import MapTabs from './MapTabs';
import React, { useEffect, useState } from "react";

function App() {
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(650);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth - 100;
      if (windowWidth >= 850 && windowWidth <= 1250) {
        setWidth(800);
        setHeight(975);
      } else if (windowWidth >= 550 && windowWidth < 850) {
        setWidth(500);
        setHeight(1560);
      } else if (windowWidth < 550) {
        setWidth(350);
        setHeight(1000); 
      } else {
        setWidth(1200);
        setHeight(650);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width, height]);

  return (
    <div className="App" style={{ marginTop: "40px" }}>
      <MapTabs width={width} height={height} />
    </div>
  );
}

export default App;
