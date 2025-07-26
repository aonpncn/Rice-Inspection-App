'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Result } from '@/types'
import Header from '@/components/Header'


export default function EditResultPage() {
  const { id } = useParams()
  const router = useRouter()
  const [result, setResult] = useState<Result | null>(null)


  useEffect(() => {
    const storedResults = localStorage.getItem('inspectionResults')
    if (storedResults) {
      const parsedResults: Result[] = JSON.parse(storedResults)
      const found = parsedResults.find((r) => r.id === id)
      if (found) setResult(found)
    }
  }, [id])

  const handleChange = (field: keyof Result, value: any) => {
    if (!result) return
    setResult({ ...result, [field]: value })
  }

  const toggleSamplingPoint = (point: string) => {
    if (!result) return
    const current = result.samplingPoint ?? []
    const updated = current.includes(point)
      ? current.filter((p) => p !== point)
      : [...current, point]
    setResult({ ...result, samplingPoint: updated })
  }

  const handleSubmit = () => {
    if (!result) return
    const stored = localStorage.getItem('inspectionResults')
    if (stored) {
      const results: Result[] = JSON.parse(stored)
      const updated = results.map((r) => (r.id === result.id ? result : r))
      localStorage.setItem('inspectionResults', JSON.stringify(updated))
    }
    router.push(`/result/${id}`)
  }

  const handleCancel = () => {
    router.push(`/result/${id}`)
  }

  if (!result) {
    return <div className="p-8 text-center">No verification results found for ID: {id}.</div>
  }

  return (
    <><Header />
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Edit Inspection ID : {id}
        </h1>
        <div className="flex justify-center">
          <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md space-y-6">

            {/* Note */}
            <div>
              <label className="block text-sm font-semibold text-gray-900">Note</label>
              <input
                type="text"
                placeholder="Add a note (optional)"
                value={result.note ?? ''}
                onChange={(e) => handleChange('note', e.target.value)}
                className="w-full mt-1 border px-3 py-2 rounded text-sm border-gray-400 text-gray-900"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-900">Price</label>
              <input
                type="number"
                placeholder="Enter price (0-100,000)"
                min="0"
                max="100000"
                step="0.01"
                value={result.price !== undefined ? result.price : ''}
                onChange={(e) => {
                  const value = e.target.value
                  handleChange('price', value === '' ? undefined : Number(value))
                }}
                className="w-full mt-1 border px-3 py-2 rounded text-sm border-gray-400 text-gray-900"
              />
            </div>


            {/* Sampling Point */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Sampling Point</label>
              <div className="flex gap-15 ml-4 text-sm text-gray-900">
                {['Front End', 'Back End', 'Other'].map((point) => (
                  <label key={point} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={result.samplingPoint?.includes(point) ?? false}
                      onChange={() => toggleSamplingPoint(point)}
                      className="accent-green-700 mr-2"
                    />
                    {point}
                  </label>
                ))}
              </div>
            </div>

            {/* Sampled At */}
            <div>
              <label className="block text-sm font-semibold text-gray-900">Date/Time of Sampling</label>
              <input
                type="datetime-local"
                value={result.sampledAt ?? ''}
                onChange={(e) => handleChange('sampledAt', e.target.value)}
                className="w-full mt-1 border px-3 py-2 rounded text-sm border-gray-400 text-gray-900"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm border rounded border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm bg-green-700 text-white rounded hover:bg-green-900"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )

}
