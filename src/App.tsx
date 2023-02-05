import './App.css';
import { useState } from 'react';
import { GenerateRowProps } from './types';
import { GenerateRows, Ticker, Ticker24 } from './helpers';
import Error from './Errors';

import Binance from 'node-binance-api';
const binance = new Binance().options({
  APIKEY: 'tYBDC6B47vvmYRyyWdMsXbNuiQO9vZds0RlUTWhIHI9KWAoftDZgvwHENSPP8NZS',
  APISECRET: 'QOxTCcskDhAlDqV1LeRl0hYFYzbpIdULlvg197l7WrcinpeKMMZhpefc09ahx0TE'
});

function App() {
  const [symbol, setSymbol] = useState('');
  const [inputError, setInputError] = useState('');
  const [apiError, setApiError] = useState('');
  const [trades, setTrades] = useState([]);
  const [ticker, setTicker] = useState({});
  const [ticker24, setTicker24] = useState({});
  const [sortInfo, setSortInfo] = useState({
    key: '',
    direction: '',
    arrows: {
      time: 'v',
      price: 'v',
      qty: 'v',
    } as {[key: string]: string}
  });

  const changeSortInfo = (key: string) => {
    let direction = 'asc';
    if (sortInfo.key === key && sortInfo.direction === 'asc') {
      direction = 'desc';
    }
    sortInfo.arrows[key] = direction === 'asc' ? '^' : 'v';
    setSortInfo({ key, direction, arrows: sortInfo.arrows });
  }

  function SearchResultTable ({trades, sortInfo}: GenerateRowProps): any {
    if (trades.length) {
      return(
        <table>
          <thead>
            <tr>
              <th><button className='header' onClick={() => changeSortInfo('time')}>Time {sortInfo.arrows['time']}</button></th>
              <th><button className='header' onClick={() => changeSortInfo('price')}>Price {sortInfo.arrows['price']}</button></th>
              <th><button className='header' onClick={() => changeSortInfo('qty')}>Quantity {sortInfo.arrows['qty']}</button></th>
            </tr>
          </thead>
          <tbody>
            <GenerateRows trades={trades} sortInfo={sortInfo}/>
          </tbody>
        </table>
      );
    }
  }

  const getMarketData = async (e: any) => {
    e.preventDefault();
    setSymbol('');
    const symbol = e.target.previousSibling.value;
    if (symbol.length === 6){
      setInputError('');
      setSymbol(symbol);
    }
    else 
      setInputError('Currency Pair is too short!');

    const tickerRes = await binance.prices(symbol);
    if (Object.keys(tickerRes).length)
      setTicker(tickerRes);

    const ticker24Res = await binance.prevDay(symbol);
    if (Object.keys(ticker24Res).length)
      setTicker24(ticker24Res);
      
    const tradesRes = await binance.recentTrades(symbol);
    if (Object.keys(tradesRes).length) {
      const lastTen = tradesRes.slice(0,10);
      setTrades(lastTen);
    }
    else 
      setApiError('An error occured when fetching the data :(');
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
          <Error error={apiError}/>
          <Error error={inputError}/>
        </form>
          <div className='market-data'>
            <Ticker ticker={ticker} symbol={symbol}/>
            <div className="ticker24-div">
              <Ticker24 ticker24={ticker24}/>
            </div>
            <SearchResultTable trades={trades} sortInfo={sortInfo}/>
          </div>
        </header>
    </div>
  );
}

export default App;
