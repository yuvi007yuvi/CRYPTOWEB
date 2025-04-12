import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useAuthState } from '../../hooks/useAuthState'
import { getCurrentPrices, getHistoricalData, getMarketData } from '../../services/cryptoApi'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const TRADING_PAIRS = [
  { symbol: 'BTC/USDT', name: 'Bitcoin' },
  { symbol: 'ETH/USDT', name: 'Ethereum' },
  { symbol: 'BNB/USDT', name: 'Binance Coin' },
]

export default function Trading() {
  const { user } = useAuthState()
  const [selectedPair, setSelectedPair] = useState(TRADING_PAIRS[0])
  const [orderType, setOrderType] = useState('limit')
  const [side, setSide] = useState('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: selectedPair.symbol,
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  })

  const [currentPrice, setCurrentPrice] = useState(null)
  const [priceChange24h, setPriceChange24h] = useState(null)

  useEffect(() => {
    let priceInterval
    const fetchPrices = async () => {
      try {
        const prices = await getCurrentPrices([selectedPair.symbol])
        const coinId = selectedPair.symbol.split('/')[0].toLowerCase()
        if (prices[coinId]) {
          setCurrentPrice(prices[coinId].usd)
          setPriceChange24h(prices[coinId].usd_24h_change)
        }
      } catch (error) {
        console.error('Error fetching prices:', error)
      }
    }

    const fetchChartData = async () => {
      try {
        const historicalData = await getHistoricalData(selectedPair.symbol)
        setChartData({
          labels: historicalData.map(point => new Date(point.x).toLocaleTimeString()),
          datasets: [{
            label: selectedPair.symbol,
            data: historicalData.map(point => point.y),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        })
      } catch (error) {
        console.error('Error fetching historical data:', error)
      }
    }

    fetchPrices()
    fetchChartData()
    
    // Update prices every 10 seconds
    priceInterval = setInterval(fetchPrices, 10000)

    return () => {
      if (priceInterval) clearInterval(priceInterval)
    }
  }, [selectedPair])

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `${selectedPair.name} Price Chart`
      }
    },
    scales: { y: { beginAtZero: false } }
  }

  const handleTrade = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!currentPrice) throw new Error('Current price not available')
      
      const tradePrice = orderType === 'market' ? currentPrice : parseFloat(price)
      const tradeAmount = parseFloat(amount)
      const total = tradePrice * tradeAmount

      // Store the trade in Firebase
      const trade = {
        userId: user.uid,
        date: new Date().toISOString(),
        pair: selectedPair.symbol,
        type: side,
        price: tradePrice,
        amount: tradeAmount,
        total: total,
        fee: total * 0.001, // 0.1% fee
        pnl: 0 // Will be updated later when position is closed
      }

      await addDoc(collection(db, 'trades'), trade)
      alert(`Trade executed successfully!\n\nDetails:\n${side.toUpperCase()} ${tradeAmount} ${selectedPair.symbol.split('/')[0]}\nPrice: $${tradePrice.toFixed(2)}\nTotal: $${total.toFixed(2)}`)

      // Reset form
      setAmount('')
      setPrice('')
    } catch (error) {
      console.error('Trade failed:', error)
      alert(`Trade failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Trading
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Trade cryptocurrencies in real-time
          </p>
        </div>

        <div className="relative inline-block text-left">
          <select
            value={selectedPair.symbol}
            onChange={(e) => setSelectedPair(TRADING_PAIRS.find(pair => pair.symbol === e.target.value))}
            className="input-field"
          >
            {TRADING_PAIRS.map((pair) => (
              <option key={pair.symbol} value={pair.symbol}>
                {pair.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2 crypto-card">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">
                  ${currentPrice ? currentPrice.toFixed(2) : '0.00'}
                </span>
                {priceChange24h && (
                  <span className={`ml-2 text-sm font-semibold ${priceChange24h >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                    {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="chart-container">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>

        {/* Trading Form */}
        <div className="crypto-card">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setSide('buy')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${side === 'buy' ? 'bg-crypto-success text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setSide('sell')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${side === 'sell' ? 'bg-crypto-danger text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Sell
                </button>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setOrderType('limit')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${orderType === 'limit' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Limit
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('market')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${orderType === 'market' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Market
                </button>
              </div>

              <form onSubmit={handleTrade} className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      step="0.00000001"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input-field"
                      placeholder={`Amount in ${selectedPair.symbol.split('/')[0]}`}
                    />
                  </div>
                </div>

                {orderType === 'limit' && (
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="price"
                        id="price"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="input-field"
                        placeholder={`Price in ${selectedPair.symbol.split('/')[1]}`}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full btn-primary ${side === 'buy' ? 'bg-crypto-success hover:bg-crypto-success/90' : 'bg-crypto-danger hover:bg-crypto-danger/90'}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      `${side === 'buy' ? 'Buy' : 'Sell'} ${selectedPair.symbol.split('/')[0]}`
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 space-y-1">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">Paper Trading Balance:</span>
                  <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Demo</span>
                </div>
                <p className="font-medium text-gray-900">₹{user?.testnetBalance?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-gray-500">This is a paper trading account with demo funds for practice</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}