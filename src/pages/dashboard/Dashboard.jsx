import React, { useState, useEffect } from 'react'
import { useAuthState } from '../../hooks/useAuthState'
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'
import { getMarketData } from '../../services/cryptoApi'

const TRADING_PAIRS = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT']

const initialStats = [
  { name: 'Total Balance', value: '$0.00', change: '0%', icon: CurrencyDollarIcon },
  { name: 'Total Profit/Loss', value: '$0.00', change: '0%', icon: ArrowTrendingUpIcon },
  { name: '24h Change', value: '0%', change: null, icon: ArrowTrendingDownIcon },
]

export default function Dashboard() {
  const { user } = useAuthState()
  const [stats, setStats] = useState(initialStats)
  const [marketData, setMarketData] = useState([])

  useEffect(() => {
    let marketInterval

    const fetchMarketData = async () => {
      try {
        const data = await getMarketData(TRADING_PAIRS)
        setMarketData(data)

        // Update stats based on market data
        const totalBalance = data.reduce((sum, coin) => sum + coin.current_price, 0)
        const totalChange = data.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0) / data.length

        setStats([
          {
            name: 'Total Balance',
            value: `$${totalBalance.toFixed(2)}`,
            change: `${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}%`,
            icon: CurrencyDollarIcon
          },
          {
            name: 'Total Profit/Loss',
            value: `$${(totalBalance * (totalChange / 100)).toFixed(2)}`,
            change: `${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}%`,
            icon: ArrowTrendingUpIcon
          },
          {
            name: '24h Change',
            value: `${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}%`,
            change: null,
            icon: ArrowTrendingDownIcon
          }
        ])
      } catch (error) {
        console.error('Error fetching market data:', error)
      }
    }

    fetchMarketData()
    marketInterval = setInterval(fetchMarketData, 60000) // Update every minute

    return () => {
      if (marketInterval) clearInterval(marketInterval)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight transition-colors duration-200">
          Welcome back, {user?.firstName || 'Trader'}
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          Here's an overview of your trading activity and portfolio performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <div key={stat.name} className="crypto-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400 dark:text-gray-500 transition-colors duration-200" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate transition-colors duration-200">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-200 animate-fade-in">
                      {stat.value}
                    </div>
                    {stat.change && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${parseFloat(stat.change) >= 0 ? 'text-crypto-success dark:text-green-400' : 'text-crypto-danger dark:text-red-400'} transition-colors duration-200 animate-fade-in`}>
                        {stat.change}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Trades */}
      <div className="crypto-card overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white transition-colors duration-200">Recent Trades</h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    No recent trades to display
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}