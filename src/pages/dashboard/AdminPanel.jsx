import React, { useState } from 'react'
import { useAuthState } from '../../hooks/useAuthState'
import { UserIcon, CurrencyDollarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const mockUsers = [
  {
    id: 1,
    email: 'user1@example.com',
    name: 'John Doe',
    testnetBalance: 10000,
    status: 'active',
    lastLogin: '2023-08-15T13:45:00Z',
    trades: 24,
  },
  {
    id: 2,
    email: 'user2@example.com',
    name: 'Jane Smith',
    testnetBalance: 15000,
    status: 'suspended',
    lastLogin: '2023-08-14T10:30:00Z',
    trades: 12,
  },
]

export default function AdminPanel() {
  const { user } = useAuthState()
  const [selectedUser, setSelectedUser] = useState(null)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTopUp = async (e) => {
    e.preventDefault()
    if (!selectedUser) return

    setIsLoading(true)
    try {
      // Here we would integrate with the admin API
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(`Successfully topped up ${topUpAmount} USDT to ${selectedUser.email}`)
      setTopUpAmount('')
      setSelectedUser(null)
    } catch (error) {
      console.error('Top-up failed:', error)
      alert('Failed to process top-up request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (userId, newStatus) => {
    try {
      // Here we would integrate with the admin API
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(`User status updated successfully`)
    } catch (error) {
      console.error('Status update failed:', error)
      alert('Failed to update user status')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Admin Panel
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Manage users and monitor platform activity
        </p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="crypto-card">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-2xl font-semibold text-gray-900">156</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="crypto-card">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Trading Volume</dt>
                  <dd className="text-2xl font-semibold text-gray-900">$1.2M</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="crypto-card">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Sessions</dt>
                  <dd className="text-2xl font-semibold text-gray-900">24</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Up Form */}
      <div className="crypto-card">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Top Up Test Tokens</h3>
          <form onSubmit={handleTopUp} className="mt-5 sm:flex sm:items-center">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="user" className="sr-only">
                User
              </label>
              <select
                id="user"
                value={selectedUser?.id || ''}
                onChange={(e) => setSelectedUser(mockUsers.find(u => u.id === Number(e.target.value)))}
                className="input-field"
              >
                <option value="">Select user</option>
                {mockUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4 sm:w-40">
              <label htmlFor="amount" className="sr-only">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="input-field"
                placeholder="Amount"
              />
            </div>
            <button
              type="submit"
              disabled={!selectedUser || !topUpAmount || isLoading}
              className="mt-3 sm:mt-0 sm:ml-4 btn-primary"
            >
              {isLoading ? 'Processing...' : 'Top Up'}
            </button>
          </form>
        </div>
      </div>

      {/* User Management */}
      <div className="crypto-card overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">User Management</h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${user.testnetBalance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.trades}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() =>
                          handleStatusChange(
                            user.id,
                            user.status === 'active' ? 'suspended' : 'active'
                          )
                        }
                        className="text-primary-600 hover:text-primary-900"
                      >
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}