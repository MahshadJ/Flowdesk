import './App.css';
import { useState } from 'react';

import Binance from 'node-binance-api';
const binance = new Binance().options({
  APIKEY: 'tYBDC6B47vvmYRyyWdMsXbNuiQO9vZds0RlUTWhIHI9KWAoftDZgvwHENSPP8NZS',
  APISECRET: 'QOxTCcskDhAlDqV1LeRl0hYFYzbpIdULlvg197l7WrcinpeKMMZhpefc09ahx0TE'
});

function App() {
  const [auth, setAuth] = useState('');
  const getMarketData = async (e: any) => {
    e.preventDefault();
    const symbol = e.target.previousSibling.value;
    if (symbol.length === 6)
      setAuth('');
    else 
      setAuth('Currency Pair is too short!');
  }

  const SearchResultTable = () => {
    return <h4>{auth}</h4> as any;
  }
  return (
    <div className="App">
      <header className="App-header">
        <h4>
          Enter the currency pair you'd like to know more about!
        </h4>
        <form>
          <input style={{fontSize: 20}} placeholder='e.g BNBBTC' required />
          <button className='search-button' onClick={getMarketData}>Search</button>
          <SearchResultTable/>
        </form>
      </header>
    </div>
  );
}

export default App;
