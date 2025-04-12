import React, { useState, useEffect } from 'react'
import { useAuthState } from '../../hooks/useAuthState'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import { getMarketData } from '../../services/cryptoApi'

const TRADING_PAIRS = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT']

const PORTFOLIO_HOLDINGS = {
  'BTC': '0.15',
  'ETH': '2.5',
  'BNB': '5.0'
}

export default function Portfolio() {
  const { user } = useAuthState()
  const [portfolio, setPortfolio] = useState([])
  const [totalValue, setTotalValue] = useState(0)
  const [dayChange, setDayChange] = useState({ value: 0, percentage: 0 })
  const [bestPerformer, setBestPerformer] = useState('')

  useEffect(() => {
    let portfolioInterval

    const fetchPortfolioData = async () => {
      try {
        const marketData = await getMarketData(TRADING_PAIRS)
        
        const portfolioData = marketData.map(coin => {
          const amount = PORTFOLIO_HOLDINGS[coin.symbol.toUpperCase()]
          const value = parseFloat(amount) * coin.current_price
          return {
            coin: coin.symbol.toUpperCase(),
            name: coin.name,
            amount,
            price: coin.current_price,
            value,
            change24h: coin.price_change_percentage_24h,
            allocation: 0 // Will be calculated after total is known
          }
        })

        const total = portfolioData.reduce((sum, asset) => sum + asset.value, 0)
        const totalDayChange = portfolioData.reduce((sum, asset) => {
          return sum + (asset.value * (asset.change24h / 100))
        }, 0)

        // Calculate allocation percentages
        portfolioData.forEach(asset => {
          asset.allocation = (asset.value / total) * 100
        })

        // Find best performer
        const best = portfolioData.reduce((prev, current) => {
          return (prev.change24h > current.change24h) ? prev : current
        })

        setPortfolio(portfolioData)
        setTotalValue(total)
        setDayChange({
          value: totalDayChange,
          percentage: (totalDayChange / (total - totalDayChange)) * 100
        })
        setBestPerformer(best.coin)
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
      }
    }

    fetchPortfolioData()
    portfolioInterval = setInterval(fetchPortfolioData, 60000) // Update every minute

    return () => {
      if (portfolioInterval) clearInterval(portfolioInterval)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight transition-colors duration-200">
          Portfolio
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          Track your crypto assets and performance
        </p>
      </div>

      {/* Portfolio Summary */}
      <div className="crypto-card">
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Total Value</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                ${totalValue.toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">24h Change</dt>
              <dd className={`mt-1 text-3xl font-semibold ${dayChange.value >= 0 ? 'text-crypto-success dark:text-green-400' : 'text-crypto-danger dark:text-red-400'} transition-colors duration-200`}>
                {dayChange.value >= 0 ? '+' : ''}
                ${Math.abs(dayChange.value).toFixed(2)} ({dayChange.percentage >= 0 ? '+' : ''}{dayChange.percentage.toFixed(2)}%)
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Number of Assets</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                {portfolio.length}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Best Performer</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">{bestPerformer}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Portfolio Assets */}
      <div className="crypto-card overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white transition-colors duration-200">Assets</h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
              <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                    24h Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                    Allocation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                {portfolio.length > 0 ? (
                  portfolio.map((asset) => (
                    <tr key={asset.coin}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">{asset.coin}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{asset.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white transition-colors duration-200">
                        {asset.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white transition-colors duration-200">
                        ${asset.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white transition-colors duration-200">
                        ${asset.value.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center text-sm ${asset.change24h >= 0 ? 'text-crypto-success dark:text-green-400' : 'text-crypto-danger dark:text-red-400'} transition-colors duration-200`}>
                          {asset.change24h >= 0 ? (
                            <ArrowUpIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                          ) : (
                            <ArrowDownIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                          )}
                          <span className="ml-1">{Math.abs(asset.change24h).toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-200">
                              <div
                                className="h-2 bg-primary-600 dark:bg-primary-500 rounded-full transition-colors duration-200"
                                style={{ width: `${asset.allocation}%` }}
                              />
                            </div>
                          </div>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{asset.allocation.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      Loading portfolio data...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}