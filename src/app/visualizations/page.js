'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BarChart2, Download } from 'lucide-react'
import dynamic from 'next/dynamic'

const PlotlyChart = dynamic(() => import('@/components/PlotlyChart'), {
  ssr: false,
})

export default function Visualizations() {
  const [currentFile, setCurrentFile] = useState(null)
  const [activeTab, setActiveTab] = useState('distribution')

  useEffect(() => {
    const file = localStorage.getItem('currentFile')
    if (!file) {
      window.location.href = '/'
      return
    }
    setCurrentFile(file)
  }, [])

  const { data: plots, isLoading, error } = useQuery({
    queryKey: ['visualizations'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/visualize-data')
      console.log(`response : ${response}`)
      if (!response.ok) {
        throw new Error('Failed to fetch visualizations')
      }
      return response.json()
    },
    enabled: !!currentFile
  })

  const downloadPlots = () => {
    if (!plots) return
    const blob = new Blob([JSON.stringify(plots, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data_plots.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Generating visualizations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg">Error generating visualizations. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BarChart2 className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Data Visualizations</h2>
            </div>
            <button
              onClick={downloadPlots}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Plots
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {['distribution', 'correlation', 'time-series'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </nav>
          </div>

          {/* Charts */}
          {plots && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === 'distribution' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(plots)
                    .filter(([key]) => key.startsWith('distribution_'))
                    .map(([key, plotData], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-50 rounded-lg p-4 h-96"
                      >
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {key.replace('distribution_', '').replace(/_/g, ' ')}
                        </h3>
                        <PlotlyChart figure={plotData} />
                      </motion.div>
                    ))}
                </div>
              )}

              {activeTab === 'correlation' && plots.correlation && (
                <div className="h-96">
                  <PlotlyChart figure={plots.correlation} />
                </div>
              )}

              {activeTab === 'time-series' && plots.time_series && (
                <div className="h-96">
                  <PlotlyChart figure={plots.time_series} />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
} 