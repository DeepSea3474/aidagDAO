import { useState, useEffect, useRef } from "react";

const COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" },
  { id: "solana", symbol: "SOL", name: "Solana", logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
  { id: "ripple", symbol: "XRP", name: "XRP", logo: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png" },
  { id: "cardano", symbol: "ADA", name: "Cardano", logo: "https://assets.coingecko.com/coins/images/975/small/cardano.png" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", logo: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png" },
  { id: "tron", symbol: "TRX", name: "TRON", logo: "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", logo: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", logo: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png" }
];

export default function CryptoTicker() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const ids = COINS.map(c => c.id).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
        );
        if (res.ok) {
          const data = await res.json();
          const result = COINS.map(coin => {
            const d = data[coin.id];
            return {
              ...coin,
              price: d?.usd || 0,
              change: d?.usd_24h_change || 0,
              volume: d?.usd_24h_vol || 0,
              marketCap: d?.usd_market_cap || 0
            };
          }).filter(c => c.price > 0);
          if (result.length > 0) setPrices(result);
        }
      } catch (e) {
        try {
          const res = await fetch(
            "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BNB,SOL,XRP,ADA,DOGE,TRX,DOT,AVAX&tsyms=USD"
          );
          if (res.ok) {
            const data = await res.json();
            const raw = data.RAW;
            if (raw) {
              const result = COINS.map(coin => {
                const d = raw[coin.symbol]?.USD;
                return {
                  ...coin,
                  price: d?.PRICE || 0,
                  change: d?.CHANGEPCT24HOUR || 0,
                  volume: d?.VOLUME24HOURTO || 0,
                  marketCap: d?.MKTCAP || 0
                };
              }).filter(c => c.price > 0);
              if (result.length > 0) setPrices(result);
            }
          }
        } catch (e2) {
          console.error("Price fetch failed");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  function formatPrice(price) {
    if (price >= 10000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 0.01) return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
  }

  function formatVolume(vol) {
    if (vol >= 1e9) return (vol / 1e9).toFixed(1) + "B";
    if (vol >= 1e6) return (vol / 1e6).toFixed(1) + "M";
    if (vol >= 1e3) return (vol / 1e3).toFixed(1) + "K";
    return vol.toFixed(0);
  }

  if (loading || prices.length === 0) {
    return (
      <div className="exchange-ticker">
        <div className="exchange-ticker-inner">
          <div className="exchange-ticker-live">
            <span className="exchange-live-dot"></span>
            <span className="exchange-live-text">MARKETS</span>
          </div>
          <div className="exchange-ticker-loading">Loading live market data...</div>
        </div>
      </div>
    );
  }

  const tickerItems = [...prices, ...prices, ...prices];

  return (
    <div 
      className="exchange-ticker"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="exchange-ticker-inner">
        <div className="exchange-ticker-live">
          <span className="exchange-live-dot"></span>
          <span className="exchange-live-text">LIVE</span>
        </div>
        <div className="exchange-ticker-scroll">
          <div 
            ref={trackRef}
            className={`exchange-ticker-track ${isPaused ? 'paused' : ''}`}
          >
            {tickerItems.map((coin, i) => (
              <div key={`${coin.symbol}-${i}`} className="exchange-ticker-coin">
                <img 
                  src={coin.logo} 
                  alt={coin.symbol}
                  width={18}
                  height={18}
                  className="exchange-coin-logo"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="exchange-coin-info">
                  <span className="exchange-coin-symbol">{coin.symbol}</span>
                  <span className="exchange-coin-name">{coin.name}</span>
                </div>
                <span className="exchange-coin-price">${formatPrice(coin.price)}</span>
                <span className={`exchange-coin-change ${coin.change >= 0 ? 'up' : 'down'}`}>
                  <svg className="exchange-coin-arrow" width="8" height="6" viewBox="0 0 8 6" fill="none">
                    {coin.change >= 0 
                      ? <path d="M4 0L8 6H0L4 0Z" fill="currentColor"/>
                      : <path d="M4 6L0 0H8L4 6Z" fill="currentColor"/>
                    }
                  </svg>
                  {Math.abs(coin.change).toFixed(2)}%
                </span>
                <span className="exchange-coin-vol">Vol ${formatVolume(coin.volume)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
