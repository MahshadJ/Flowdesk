interface ErrorProps {
    error: string;
}


type TradeInfo = {
    [key: string]: string | number 
}

interface GenerateRowProps {
    trades: Array<TradeInfo>;
}

interface TickerProps {
    ticker: {[key: string]: string};
}

interface Ticker24Props {
    ticker24: {[key: string]: string | number };
}

export {ErrorProps, TradeInfo, GenerateRowProps, TickerProps, Ticker24Props};
