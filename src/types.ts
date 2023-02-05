interface ErrorProps {
    error: string;
}

type TradeInfo = {
    [key: string]: string | number;
}

type SortInfo = {
    key: string;
    direction: string;
    arrows: {[key: string]: string};
};

interface GenerateRowProps {
    trades: Array<TradeInfo>;
    sortInfo: SortInfo;
}

interface TickerProps {
    ticker: {[key: string]: string};
    symbol: string;
}

interface Ticker24Props {
    ticker24: {[key: string]: string | number };
}

export type { SortInfo, ErrorProps, TradeInfo, GenerateRowProps, TickerProps, Ticker24Props };
