import React, { useState, useEffect } from 'react'
import { useAuthState } from '../../hooks/useAuthState'
import { DocumentArrowDownIcon, ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { getMarketData } from '../../services/cryptoApi'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'

// Initialize empty trade history
const tradeHistory = [
  {
    id: 1,
    date: '2023-08-15T13:45:00Z',
    pair: 'BTC/USDT',
    type: 'buy',
    price: 29850.00,
    amount: 0.05,
    total: 1492.50,
    fee: 1.49,
    pnl: 74.63,
  },
  {
    id: 2,
    date: '2023-08-15T10:30:00Z',
    pair: 'ETH/USDT',
    type: 'sell',
    price: 1850.00,
    amount: 2.5,
    total: 4625.00,
    fee: 4.63,
    pnl: -231.25,
  },
]

const initialMetrics = [
  { name: 'Total Trades', value: '0' },
  { name: 'Win Rate', value: '0%' },
  { name: 'Best Trade', value: '$0.00' },
  { name: 'Worst Trade', value: '$0.00' },
  { name: 'Average Trade', value: '$0.00' },
  { name: 'Total Volume', value: '$0.00' },
]

export default function Reports() {
  const { user } = useAuthState()
  const [dateRange, setDateRange] = useState('7d') // '24h', '7d', '30d', 'all'
  const [performanceMetrics, setPerformanceMetrics] = useState(initialMetrics)
  const [trades, setTrades] = useState([])

  useEffect(() => {
    const fetchUserTrades = async () => {
      if (!user) return

      try {
        const tradesRef = collection(db, 'trades')
        const q = query(tradesRef, where('userId', '==', user.uid))
        const querySnapshot = await getDocs(q)
        
        const userTrades = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        setTrades(userTrades)

        // Calculate performance metrics from actual trades
        const totalTrades = userTrades.length
        const profitableTrades = userTrades.filter(trade => trade.pnl > 0).length
        const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0
        const totalVolume = userTrades.reduce((sum, trade) => sum + trade.total, 0)
        const bestTrade = Math.max(...userTrades.map(trade => trade.pnl), 0)
        const worstTrade = Math.min(...userTrades.map(trade => trade.pnl), 0)
        const avgTrade = totalTrades > 0 ? totalVolume / totalTrades : 0

        setPerformanceMetrics([
          { name: 'Total Trades', value: totalTrades.toString() },
          { name: 'Win Rate', value: `${winRate.toFixed(1)}%` },
          { name: 'Best Trade', value: `$${bestTrade.toFixed(2)}` },
          { name: 'Worst Trade', value: `$${worstTrade.toFixed(2)}` },
          { name: 'Average Trade', value: `$${avgTrade.toFixed(2)}` },
          { name: 'Total Volume', value: `$${totalVolume.toLocaleString()}` },
        ])
      } catch (error) {
        console.error('Error fetching market data:', error)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [dateRange])

  const handleExport = (format) => {
    // Here we would implement the export functionality
    alert(`Exporting report in ${format} format...`)
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Reports
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            View and analyze your trading performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex sm:space-x-3">
          <button
            onClick={() => handleExport('csv')}
            className="btn-secondary flex items-center"
          >
            <DocumentArrowDownIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="btn-secondary flex items-center"
          >
            <DocumentArrowDownIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="crypto-card">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {performanceMetrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  <span className="ml-3 text-sm font-medium text-gray-900">{metric.name}</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex space-x-2">
        {['24h', '7d', '30d', 'all'].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${dateRange === range ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {range.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Trade History */}
      <div className="crypto-card overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Trade History</h3>
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-5 w-5 mr-1" />
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pair
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P&L
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-sm text-gray-500">
                    No trade history to display
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