import React, { useState } from 'react'
import { useAuthState } from '../../hooks/useAuthState'
import { QrCodeIcon, ArrowPathIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

const transactions = []  // Will be populated with real transactions from the backend

export default function Wallet() {
  const { user } = useAuthState()
  const [selectedCoin, setSelectedCoin] = useState('BTC')
  const [withdrawalAddress, setWithdrawalAddress] = useState('')
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleWithdrawal = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here we would integrate with the withdrawal API
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Reset form
      setWithdrawalAddress('')
      setWithdrawalAmount('')
      
      // Show success message (you might want to add a toast notification here)
      alert('Withdrawal request submitted successfully!')
    } catch (error) {
      console.error('Withdrawal failed:', error)
      alert('Withdrawal failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Wallet
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Manage your wallet and transactions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Wallet Balance */}
        <div className="crypto-card">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Wallet Balance</h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">BTC</span>
                  <span className="ml-2 text-sm text-gray-500">Bitcoin</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">0.15</div>
                  <div className="text-sm text-gray-500">≈ $4,477.50</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">ETH</span>
                  <span className="ml-2 text-sm text-gray-500">Ethereum</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">2.5</div>
                  <div className="text-sm text-gray-500">≈ $4,625.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="crypto-card">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Withdraw</h3>
            <form onSubmit={handleWithdrawal} className="mt-6 space-y-4">
              <div>
                <label htmlFor="coin" className="block text-sm font-medium text-gray-700">
                  Select Coin
                </label>
                <select
                  id="coin"
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  className="mt-1 input-field"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                </select>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Withdrawal Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    required
                    value={withdrawalAddress}
                    onChange={(e) => setWithdrawalAddress(e.target.value)}
                    className="input-field"
                    placeholder="Enter testnet address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    required
                    step="0.00000001"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="input-field"
                    placeholder={`Amount in ${selectedCoin}`}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                      <span>Withdraw</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="crypto-card overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Transaction History</h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hash
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            tx.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tx.amount} {tx.coin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a
                          href={`https://blockchain.info/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {tx.hash}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No transactions found
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