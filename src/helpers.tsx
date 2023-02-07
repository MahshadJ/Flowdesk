import { TickerProps, Ticker24Props, GenerateRowProps, TradeInfo } from './types';

function Ticker ({ ticker, symbol }: TickerProps): any {
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

function GenerateRows ({trades, sortInfo}: GenerateRowProps): any {
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
    return (sortedTrades.map((row: TradeInfo) => {
      return(
        <tr>
          <td>{row.time}</td>
          <td>{row.price}</td>
          <td>{row.qty}</td>
        </tr>
      );
    }));
  };

export { GenerateRows, Ticker, Ticker24 };
