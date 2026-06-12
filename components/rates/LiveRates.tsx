type CryptoRate = {
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
};

type FiatRate = {
  code: string;
  name: string;
  perUsdt: number;
};

const CRYPTO_RATES: CryptoRate[] = [
  { symbol: 'USDT', name: 'Tether', priceUsd: 1.0, change24h: 0.01 },
  { symbol: 'BTC', name: 'Bitcoin', priceUsd: 64250.0, change24h: 1.84 },
  { symbol: 'ETH', name: 'Ethereum', priceUsd: 3120.5, change24h: -0.62 },
  { symbol: 'TON', name: 'Toncoin', priceUsd: 6.74, change24h: 2.31 },
  { symbol: 'TRX', name: 'Tron', priceUsd: 0.118, change24h: 0.45 },
  { symbol: 'USDC', name: 'USD Coin', priceUsd: 1.0, change24h: -0.01 },
  { symbol: 'LTC', name: 'Litecoin', priceUsd: 84.2, change24h: 0.97 },
];

const FIAT_RATES: FiatRate[] = [
  { code: 'RUB', name: 'Russian Ruble', perUsdt: 92.4 },
  { code: 'KZT', name: 'Kazakhstani Tenge', perUsdt: 478.5 },
  { code: 'UZS', name: 'Uzbekistani Som', perUsdt: 12650 },
  { code: 'AZN', name: 'Azerbaijani Manat', perUsdt: 1.7 },
  { code: 'KGS', name: 'Kyrgyzstani Som', perUsdt: 89.2 },
];

const LAST_UPDATED = '11 Jun 2026, 14:00 UTC';

const formatNumber = (value: number, fractionDigits = 2) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

export default function LiveRates() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            Live Rates
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Crypto and Payout Currency Rates
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Transparent reference rates for crypto-to-bank settlements.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          Last Updated: {LAST_UPDATED}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">Crypto Rates</h3>
            <p className="mt-1 text-sm text-slate-500">Price in USD</p>

            <div className="mt-6 divide-y divide-slate-100">
              {CRYPTO_RATES.map((rate) => (
                <div
                  key={rate.symbol}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <p className="font-bold text-slate-950">{rate.symbol}</p>
                    <p className="text-sm text-slate-500">{rate.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-950">
                      ${formatNumber(rate.priceUsd)}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        rate.change24h >= 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {rate.change24h >= 0 ? '+' : ''}
                      {formatNumber(rate.change24h)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">
              Payout Currencies
            </h3>
            <p className="mt-1 text-sm text-slate-500">Local currency per USDT</p>

            <div className="mt-6 divide-y divide-slate-100">
              {FIAT_RATES.map((rate) => (
                <div
                  key={rate.code}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <p className="font-bold text-slate-950">{rate.code}</p>
                    <p className="text-sm text-slate-500">{rate.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-950">
                      {formatNumber(rate.perUsdt)}
                    </p>
                    <p className="text-sm font-medium text-slate-500">
                      1 USDT
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Rates are indicative placeholders and confirmed at request creation.
        </p>
      </div>
    </section>
  );
}
