'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const PlotlyChart = ({ figure }) => {
  const plotRef = useRef(null)

  useEffect(() => {
    const initPlotly = async () => {
      const Plotly = (await import('plotly.js-dist-min')).default
      
      if (plotRef.current && figure) {
        const parsedFigure = typeof figure === 'string' ? JSON.parse(figure) : figure
        Plotly.newPlot(plotRef.current, parsedFigure.data, parsedFigure.layout)
      }
    }

    initPlotly()

    // Cleanup function
    return () => {
      if (plotRef.current) {
        const cleanup = async () => {
          const Plotly = (await import('plotly.js-dist-min')).default
          Plotly.purge(plotRef.current)
        }
        cleanup()
      }
    }
  }, [figure])

  return <div ref={plotRef} style={{ width: '100%', height: '100%' }} />
}

export default PlotlyChart 