interface Window {
  ethereum?: any;
}
window.ethereum = window.ethereum || undefined;

(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;
global.process = require('process');
