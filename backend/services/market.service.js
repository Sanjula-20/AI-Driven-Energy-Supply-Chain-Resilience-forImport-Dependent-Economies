const EIA_BASE_URL = 'https://api.eia.gov/v2/seriesid';

const DEMO_DATA = {
  source: 'DEMO',
  isLive: false,
  lastUpdated: new Date().toISOString(),

  brent: {
    price: 85.0,
    changePercent: 0,
    volatility: 0,
  },

  wti: {
    price: 82.0,
    changePercent: 0,
    volatility: 0,
  },

  history: [],
};

function calculateChangePercent(current, previous) {
  if (!previous || previous === 0) return 0;

  return Number((((current - previous) / previous) * 100).toFixed(2));
}

function calculateVolatility(values) {
  if (!values || values.length < 2) return 0;

  const returns = [];

  for (let i = 1; i < values.length; i += 1) {
    if (values[i - 1] === 0) continue;

    const dailyReturn =
      ((values[i] - values[i - 1]) / values[i - 1]) * 100;

    returns.push(dailyReturn);
  }

  if (returns.length === 0) return 0;

  const mean =
    returns.reduce((sum, value) => sum + value, 0) / returns.length;

  const variance =
    returns.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    returns.length;

  return Number(Math.sqrt(variance).toFixed(2));
}

async function fetchSeries(seriesId, limit = 30) {
  const apiKey = process.env.EIA_API_KEY;

  if (!apiKey) {
    throw new Error('EIA_API_KEY is not configured.');
  }

  const url =
    `${EIA_BASE_URL}/${seriesId}` +
    `?api_key=${encodeURIComponent(apiKey)}` +
    `&data[0]=value` +
    `&sort[0][column]=period` +
    `&sort[0][direction]=desc` +
    `&length=${limit}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`EIA API returned HTTP ${response.status}`);
  }

  const json = await response.json();

  if (!json.response || !Array.isArray(json.response.data)) {
    throw new Error('Unexpected response from EIA API.');
  }

  return json.response.data
    .map((item) => ({
      date: item.period,
      price: Number(item.value),
    }))
    .filter((item) => Number.isFinite(item.price));
}

async function getEnergyMarketData() {
  try {
    const [brentRaw, wtiRaw] = await Promise.all([
      fetchSeries('PET.RBRTE.D', 30),
      fetchSeries('PET.RWTC.D', 30),
    ]);

    if (brentRaw.length === 0 || wtiRaw.length === 0) {
      throw new Error('EIA returned no price data.');
    }

    // API returns newest first.
    // Reverse so history is oldest -> newest.
    const brentHistory = [...brentRaw].reverse();
    const wtiHistory = [...wtiRaw].reverse();

    const latestBrent = brentHistory[brentHistory.length - 1];
    const previousBrent =
      brentHistory.length > 1
        ? brentHistory[brentHistory.length - 2]
        : null;

    const latestWti = wtiHistory[wtiHistory.length - 1];
    const previousWti =
      wtiHistory.length > 1
        ? wtiHistory[wtiHistory.length - 2]
        : null;

    const brentValues = brentHistory.map((item) => item.price);
    const wtiValues = wtiHistory.map((item) => item.price);

    const history = brentHistory.map((item, index) => ({
      date: item.date,
      brent: item.price,
      wti: wtiHistory[index]?.price ?? null,
    }));

    return {
      source: 'EIA',
      isLive: true,
      lastUpdated: new Date().toISOString(),

      brent: {
        price: latestBrent.price,
        changePercent: calculateChangePercent(
          latestBrent.price,
          previousBrent?.price
        ),
        volatility: calculateVolatility(brentValues),
      },

      wti: {
        price: latestWti.price,
        changePercent: calculateChangePercent(
          latestWti.price,
          previousWti?.price
        ),
        volatility: calculateVolatility(wtiValues),
      },

      history,
    };
  } catch (error) {
    console.error(
      '[market] EIA request failed:',
      error.message
    );

    console.log('[market] Using DEMO/FALLBACK market data.');

    return {
      ...DEMO_DATA,
      lastUpdated: new Date().toISOString(),
    };
  }
}

module.exports = {
  getEnergyMarketData,
};