import React from 'react';

import Header from './components/header';
import { MetaMaskContextProvider } from './hooks/useMetaMask';

function App() {
  return (
    <div>
      <MetaMaskContextProvider>
        <div>
          <div>
            <Header />
          </div>
          <main></main>
        </div>
      </MetaMaskContextProvider>
    </div>
  );
}

export default App;
