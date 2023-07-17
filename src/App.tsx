import React from 'react';
import Home from './pages/Home';
import CanvasCtx from './components/CanvasCtx';

function App() {
  return (
    <CanvasCtx>
      <Home />
    </CanvasCtx>
  );
}

export default App;
