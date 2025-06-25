'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, FileSpreadsheet, BarChart2, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      console.log('Uploading file...')
      const formData = new FormData()
     
      formData.append('file', file)
      console.log(formData)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-data`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let the browser set it with the boundary
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('Upload failed:', errorData || response.statusText)
        throw new Error(errorData?.message || 'Upload failed')
      }

      // Store file in localStorage for other pages
      localStorage.setItem('currentFile', file.name)
      
      // Redirect to summary page
      window.location.href = '/summary'
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error.message || 'Failed to upload file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  })

  return (
    <main className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Analyze Your Data with AI
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Upload your Excel or CSV file to get started with AI-powered analysis
          </p>
        </div>

        {/* Upload Area */}
        <div className="mt-12">
          <motion.div
            {...getRootProps()}
            className={`max-w-xl mx-auto p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? 'Drop the file here'
                : 'Drag and drop a file here, or click to select'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Excel (.xlsx, .xls) or CSV files only
            </p>
          </motion.div>

          {isUploading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Uploading...</p>
            </div>
          )}

          {uploadError && (
            <div className="mt-4 text-center text-red-600">
              {uploadError}
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-6 bg-white rounded-lg">
              <FileSpreadsheet className="h-8 w-8 text-blue-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Data Summary</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get AI-powered insights and summaries of your dataset
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-6 bg-white rounded-lg">
              <BarChart2 className="h-8 w-8 text-blue-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Visualizations</h3>
              <p className="mt-2 text-sm text-gray-500">
                Interactive charts and graphs for better data understanding
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-6 bg-white rounded-lg">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">AI Chat</h3>
              <p className="mt-2 text-sm text-gray-500">
                Ask questions and get instant insights about your data
              </p>
            </div>
          </div>
        </div>
        </div>
      </main>
  )
}
