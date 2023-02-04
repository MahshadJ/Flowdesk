import './App.css';
import { useState } from 'react';

import Binance from 'node-binance-api';
const binance = new Binance().options({
  APIKEY: 'tYBDC6B47vvmYRyyWdMsXbNuiQO9vZds0RlUTWhIHI9KWAoftDZgvwHENSPP8NZS',
  APISECRET: 'QOxTCcskDhAlDqV1LeRl0hYFYzbpIdULlvg197l7WrcinpeKMMZhpefc09ahx0TE'
});

type tradeInfo = {
  [key: string]: string | number 
}

interface GenerateRowProps {
  trades: Array<tradeInfo>;
}

interface TickerProps {
  ticker: {[key: string]: string};
}

interface Ticker24Props {
  ticker24: {[key: string]: string | number };
}

function App() {
  const [symbol, setSymbol] = useState('');
  const [inputError, setInputError] = useState('');
  const [trades, setTrades] = useState([]);
  const [ticker, setTicker] = useState({});
  const [ticker24, setTicker24] = useState({});
  const [apiError, setApiError] = useState('');
  const [sortInfo, setSortInfo] = useState({
    key: '',
    direction: '',
    arrows: {
      time: 'v',
      price: 'v',
      qty: 'v',
    } as {[key: string]: string}
  });

  function InputError (): any {
    if(inputError.length) {
      return (
        <h4>{inputError}</h4>
      );
    }
  }

  function ApiError (): any {
    if(apiError.length) {
      return (
        <h4>{apiError}</h4>
      );
    }
  }

  function Ticker ({ ticker }: TickerProps): any {
    console.log(ticker[symbol]);
    if (ticker && ticker[symbol]) {
      return(
        <div className="ticker-div">
          <h6>The {symbol} ticker price is: {ticker[symbol]}</h6>
        </div>
      );
    }
  }

  function Ticker24 ({ ticker24 }: Ticker24Props): any {
    if (ticker24) {
      return(
        Object.keys(ticker24).map((key) => {
          if (key !== 'symbol')
            return <h6 className="ticker24-h6">{key}: {ticker24[key]}</h6>
        })
      );
    }
  }

  const changeSortInfo = (key: string) => {
    let direction = 'asc';
    if (sortInfo.key === key && sortInfo.direction === 'asc') {
      direction = 'desc';
    }
    sortInfo.arrows[key] = direction === 'asc' ? '^' : 'v';
    setSortInfo({ key, direction, arrows: sortInfo.arrows });
  }

  function GenerateRows ({trades}: GenerateRowProps): any {
    let sortedTrades = [...trades];
    if (sortInfo.key !== '') {
      sortedTrades.sort((a, b) => {
        if (a[sortInfo.key] < b[sortInfo.key]) {
          return sortInfo.direction === 'asc' ? -1 : 1;
        }
        if (a[sortInfo.key] > b[sortInfo.key]) {
          return sortInfo.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return (sortedTrades.map((row: tradeInfo) => {
      return(
        <tr>
          <td>{row.time}</td>
          <td>{row.price}</td>
          <td>{row.qty}</td>
        </tr>
      );
    }));
  };

  function SearchResultTable ({trades}: GenerateRowProps): any {
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
            <GenerateRows trades={trades}/>
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
    console.log(tickerRes);
    if (Object.keys(tickerRes).length)
      setTicker(tickerRes);

    const ticker24Res = await binance.prevDay(symbol);
    console.log(ticker24Res);
    if (Object.keys(ticker24Res).length)
      setTicker24(ticker24Res);
      
    const tradesRes = await binance.recentTrades(symbol);
    if (Object.keys(tradesRes).length) {
      const lastTen = tradesRes.slice(0,10);
      setTrades(lastTen);
      console.log(lastTen);
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
          <ApiError/>
          <InputError/>
        </form>
          <div className='market-data'>
            <Ticker ticker={ticker}/>
            <div className="ticker24-div">
              <Ticker24 ticker24={ticker24}/>
            </div>
            <SearchResultTable trades={trades}/>
          </div>
        </header>
    </div>
  );
}

export default App;
