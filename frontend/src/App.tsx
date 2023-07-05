import React from 'react';

import Header from './components/header';
import { MetaMaskContextProvider } from './hooks/useMetaMask';

function App() {
  return (
    <MetaMaskContextProvider>
      <div>
        <Header></Header>
        <main></main>
      </div>
    </MetaMaskContextProvider>
  );
}

export default App;
