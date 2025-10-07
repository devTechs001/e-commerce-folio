import React, { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar, Filter, CreditCard, PieChart, BarChart3 } from 'lucide-react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { motion } from 'framer-motion'

const RevenueDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 12450.00,
    monthlyRevenue: 3200.00,
    pendingPayouts: 850.00,
    completedTransactions: 156
  })

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'subscription',
      amount: 29.99,
      customer: 'John Doe',
      date: new Date(Date.now() - 86400000),
      status: 'completed',
      plan: 'Pro Plan'
    },
    {
      id: 2,
      type: 'template',
      amount: 15.00,
      customer: 'Jane Smith',
      date: new Date(Date.now() - 172800000),
      status: 'completed',
      plan: 'Creative Template'
    },
    {
      id: 3,
      type: 'subscription',
      amount: 99.99,
      customer: 'Mike Johnson',
      date: new Date(Date.now() - 259200000),
      status: 'pending',
      plan: 'Enterprise Plan'
    }
  ])

  // Chart data for revenue trends
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [2100, 2800, 2200, 3400, 2900, 3200],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  // Chart data for revenue sources
  const sourceChartData = {
    labels: ['Subscriptions', 'Templates', 'Custom Work', 'Consulting'],
    datasets: [
      {
        data: [65, 20, 10, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }

  // Monthly comparison data
  const monthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'This Year',
        data: [2100, 2800, 2200, 3400, 2900, 3200],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Last Year',
        data: [1800, 2200, 1900, 2800, 2400, 2600],
        backgroundColor: 'rgba(156, 163, 175, 0.8)',
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(revenueData.totalRevenue),
      change: '+12.5%',
      changeType: 'increase',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(revenueData.monthlyRevenue),
      change: '+8.2%',
      changeType: 'increase',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Pending Payouts',
      value: formatCurrency(revenueData.pendingPayouts),
      change: '-2.1%',
      changeType: 'decrease',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Transactions',
      value: revenueData.completedTransactions.toString(),
      change: '+15.3%',
      changeType: 'increase',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Revenue Dashboard</h1>
              <p className="text-gray-600 mt-2">Track your earnings and financial performance</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'increase' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <TrendingUp className="h-5 w-5 text-primary-600" />
            </div>
            <div className="h-64">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>

          {/* Revenue Sources */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Sources</h3>
              <PieChart className="h-5 w-5 text-primary-600" />
            </div>
            <div className="h-64">
              <Doughnut data={sourceChartData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Comparison</h3>
            <BarChart3 className="h-5 w-5 text-primary-600" />
          </div>
          <div className="h-64">
            <Bar data={monthlyChartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{transaction.customer}</div>
                        <div className="text-sm text-gray-500">{transaction.plan}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize text-gray-600">{transaction.type}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(transaction.date)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
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

export default RevenueDashboard
