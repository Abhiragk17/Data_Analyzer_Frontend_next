'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FileSpreadsheet, Download } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function Summary() {
  const [currentFile, setCurrentFile] = useState(null)

  useEffect(() => {
    const file = localStorage.getItem('currentFile')
    if (!file) {
      window.location.href = '/'
      return
    }
    setCurrentFile(file)
  }, [])

  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['summary'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/generate-summary')
      if (!response.ok) {
        throw new Error('Failed to generate summary')
      }
      return response.json()
    },
    enabled: !!currentFile
  })

  const downloadSummary = () => {
    if (!summary) return
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data_summary.json'
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
          <p className="mt-4 text-lg text-gray-600">Generating summary...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg">Error generating summary. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileSpreadsheet className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Data Summary</h2>
              </div>
              <button
                onClick={downloadSummary}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Summary
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {summary && (
                <div className="space-y-6">
                  {/* Dataset Overview */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Dataset Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-sm text-gray-600">File Name</p>
                        <p className="font-medium">{currentFile}</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-sm text-gray-600">Total Records</p>
                        <p className="font-medium">{summary.shape || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
      

                  {/* Important Columns */}
                  {summary.important_cols && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Columns</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {summary.important_cols.map((col, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded border border-gray-200">
                            <p className="font-medium text-gray-900">{col}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Insights */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Key Insights</h3>
                    <div className="prose max-w-none">
                      <ReactMarkdown>{summary.Summary}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}