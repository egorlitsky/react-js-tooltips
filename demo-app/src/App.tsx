import React from 'react';
import './App.css';
import { TooltipContainer } from 'react-js-tooltips';
import { TooltipDemo } from './TooltipDemo';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <TooltipDemo />
      </header>
      <TooltipContainer />
    </div>
  );
}

export default App;
