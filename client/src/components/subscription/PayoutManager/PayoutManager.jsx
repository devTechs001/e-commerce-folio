import React, { useState, useEffect } from 'react'
import { 
  DollarSign, TrendingUp, Calendar, CreditCard, Download, 
  Check, AlertCircle, Clock, ArrowRight, Settings, Plus,
  Banknote, Wallet, Shield, Eye, Filter, Search
} from 'lucide-react'
import { subscriptionService } from '../../../services/subscription'
import Button from '../../common/Button/Button'

const PayoutManager = () => {
  const [payoutData, setPayoutData] = useState({
    balance: {
      available: 0,
      pending: 0,
      total: 0
    },
    payouts: [],
    paymentMethods: [],
    settings: {
      autoPayoutEnabled: false,
      minimumPayout: 50,
      payoutSchedule: 'monthly', // weekly, monthly, custom
      preferredMethod: null
    }
  })

  const [selectedTab, setSelectedTab] = useState('overview') // overview, payouts, methods, settings
  const [filterStatus, setFilterStatus] = useState('all') // all, completed, pending, failed
  const [showAddMethod, setShowAddMethod] = useState(false)
  const [userTier, setUserTier] = useState('free')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const tier = await subscriptionService.getUserTier()
      setUserTier(tier)
      loadPayoutData()
    }
    loadData()
  }, [])

  const loadPayoutData = () => {
    // Mock data - replace with actual API calls
    setPayoutData({
      balance: {
        available: 2456.80,
        pending: 832.50,
        total: 3289.30
      },
      payouts: [
        {
          id: 1,
          amount: 1500.00,
          status: 'completed',
          date: new Date('2025-10-01'),
          method: 'Bank Transfer',
          transactionId: 'PO-2025-001',
          processingTime: '2-3 days'
        },
        {
          id: 2,
          amount: 980.50,
          status: 'pending',
          date: new Date('2025-10-10'),
          method: 'PayPal',
          transactionId: 'PO-2025-002',
          processingTime: '1-2 days'
        },
        {
          id: 3,
          amount: 2200.00,
          status: 'completed',
          date: new Date('2025-09-15'),
          method: 'Bank Transfer',
          transactionId: 'PO-2025-003',
          processingTime: '2-3 days'
        }
      ],
      paymentMethods: [
        {
          id: 1,
          type: 'bank',
          name: 'Bank Account',
          details: '****1234',
          isDefault: true,
          verified: true
        },
        {
          id: 2,
          type: 'paypal',
          name: 'PayPal',
          details: 'user@example.com',
          isDefault: false,
          verified: true
        },
        {
          id: 3,
          type: 'mpesa',
          name: 'M-Pesa',
          details: '+254 *** *** **45',
          isDefault: false,
          verified: true
        }
      ],
      settings: {
        autoPayoutEnabled: true,
        minimumPayout: 50,
        payoutSchedule: 'monthly',
        preferredMethod: 1
      }
    })
  }

  const requestPayout = async () => {
    if (payoutData.balance.available < payoutData.settings.minimumPayout) {
      alert(`Minimum payout amount is $${payoutData.settings.minimumPayout}`)
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      alert('Payout request submitted successfully!')
      loadPayoutData()
      setLoading(false)
    }, 2000)
  }

  const filteredPayouts = payoutData.payouts.filter(payout => 
    filterStatus === 'all' || payout.status === filterStatus
  )

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800'
    }

    const icons = {
      completed: Check,
      pending: Clock,
      failed: AlertCircle,
      processing: Clock
    }

    const Icon = icons[status] || Clock

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </span>
    )
  }

  const paymentMethodIcons = {
    bank: Banknote,
    paypal: Wallet,
    mpesa: CreditCard,
    stripe: CreditCard
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payouts & Earnings</h2>
          <p className="text-gray-600">Manage your earnings and payout methods</p>
        </div>
        <Button
          onClick={requestPayout}
          icon={DollarSign}
          loading={loading}
          disabled={payoutData.balance.available < payoutData.settings.minimumPayout}
        >
          Request Payout
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Available Balance</h3>
            <DollarSign className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-4xl font-bold mb-2">${payoutData.balance.available.toFixed(2)}</p>
          <p className="text-sm opacity-75">Ready for withdrawal</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Pending Balance</h3>
            <Clock className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-4xl font-bold mb-2">${payoutData.balance.pending.toFixed(2)}</p>
          <p className="text-sm opacity-75">Processing payments</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Total Earnings</h3>
            <TrendingUp className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-4xl font-bold mb-2">${payoutData.balance.total.toFixed(2)}</p>
          <p className="text-sm opacity-75">All time earnings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: Eye },
              { id: 'payouts', name: 'Payout History', icon: Calendar },
              { id: 'methods', name: 'Payment Methods', icon: CreditCard },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    selectedTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Next Payout</span>
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">Nov 1, 2025</p>
                  <p className="text-sm text-gray-600">Estimated: $2,456.80</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Payout Method</span>
                    <Banknote className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">Bank Transfer</p>
                  <p className="text-sm text-gray-600">****1234</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {payoutData.payouts.slice(0, 3).map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white rounded-lg">
                          <DollarSign className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">${payout.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{payout.method}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(payout.status)}
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(payout.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'payouts' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Payouts</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <Button icon={Download} variant="outline" size="sm">
                  Export CSV
                </Button>
              </div>

              {/* Payout Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm text-gray-900">{payout.transactionId}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">${payout.amount.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payout.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payout.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(payout.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedTab === 'methods' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                <Button onClick={() => setShowAddMethod(true)} icon={Plus} size="sm">
                  Add Method
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {payoutData.paymentMethods.map((method) => {
                  const Icon = paymentMethodIcons[method.type] || CreditCard

                  return (
                    <div
                      key={method.id}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        method.isDefault
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <Icon className="h-6 w-6 text-gray-700" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{method.name}</h4>
                            <p className="text-sm text-gray-600">{method.details}</p>
                          </div>
                        </div>
                        {method.verified && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <Shield className="h-4 w-4" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {method.isDefault ? (
                          <span className="text-sm font-medium text-primary-600">Default Method</span>
                        ) : (
                          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            Set as Default
                          </button>
                        )}
                        <button className="text-sm text-gray-600 hover:text-gray-900">
                          Edit
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {showAddMethod && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Add Payment Method</h3>
                    <div className="space-y-4">
                      <button
                        onClick={() => alert('Bank account setup - Coming Soon!')}
                        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center space-x-3"
                      >
                        <Banknote className="h-6 w-6 text-gray-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Bank Account</p>
                          <p className="text-sm text-gray-600">Direct bank transfer</p>
                        </div>
                      </button>
                      <button
                        onClick={() => alert('PayPal setup - Coming Soon!')}
                        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center space-x-3"
                      >
                        <Wallet className="h-6 w-6 text-gray-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">PayPal</p>
                          <p className="text-sm text-gray-600">Instant transfer</p>
                        </div>
                      </button>
                      <button
                        onClick={() => alert('M-Pesa setup - Coming Soon!')}
                        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center space-x-3"
                      >
                        <CreditCard className="h-6 w-6 text-gray-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">M-Pesa</p>
                          <p className="text-sm text-gray-600">Mobile money</p>
                        </div>
                      </button>
                    </div>
                    <Button
                      onClick={() => setShowAddMethod(false)}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Automatic Payouts</p>
                      <p className="text-sm text-gray-600">Automatically send payouts on schedule</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={payoutData.settings.autoPayoutEnabled}
                        onChange={(e) => setPayoutData({
                          ...payoutData,
                          settings: { ...payoutData.settings, autoPayoutEnabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Payout Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={payoutData.settings.minimumPayout}
                        onChange={(e) => setPayoutData({
                          ...payoutData,
                          settings: { ...payoutData.settings, minimumPayout: parseFloat(e.target.value) }
                        })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payout Schedule
                    </label>
                    <select
                      value={payoutData.settings.payoutSchedule}
                      onChange={(e) => setPayoutData({
                        ...payoutData,
                        settings: { ...payoutData.settings, payoutSchedule: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <Button icon={Check} className="mt-4">
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PayoutManager
