import React, { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Download, Calendar } from 'lucide-react'
import Button from '../../common/Button/Button'
import { paymentService } from '../../../services/payment'

const Finance = () => {
  const [transactions, setTransactions] = useState([])
  const [revenue, setRevenue] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFinanceData()
  }, [])

  const loadFinanceData = async () => {
    try {
      setLoading(true)
      const [transactionsResponse, revenueResponse] = await Promise.all([
        paymentService.getTransactions(),
        paymentService.getRevenueStats()
      ])

      if (transactionsResponse.success) {
        setTransactions(transactionsResponse.data)
      }

      if (revenueResponse.success) {
        setRevenue(revenueResponse.data)
      }
    } catch (error) {
      console.error('Error loading finance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportTransactions = async () => {
    try {
      const response = await paymentService.exportTransactions()
      if (response.success) {
        // Create download link
        const blob = new Blob([response.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'transactions.csv'
        link.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting transactions:', error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(revenue.total || 0)}
          </p>
          <p className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12.5% from last month
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">This Month</h3>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(revenue.thisMonth || 0)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Current monthly revenue
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Pending</h3>
            <DollarSign className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(revenue.pending || 0)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Awaiting clearance
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <Button
            variant="outline"
            icon={Download}
            onClick={handleExportTransactions}
          >
            Export CSV
          </Button>
        </div>

        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Finance