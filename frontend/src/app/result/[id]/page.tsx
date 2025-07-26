'use client'

import React, { useEffect, useState } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { calculateInspectionResult } from '@/Utilities/calculateInspectionResult'
import { formatDateTime } from '@/Utilities/formatDateTime'
import type { Result, CompositionItem, DefectItem } from '@/types'
import { standards, StandardDefinition } from '@/data/standards'
import Header from '@/components/Header'

interface Props {
  params: Promise<{ id: string }>
}

const ResultPage = ({ params }: Props) => {
  const router = useRouter()
  const { id } = use(params)

  const [result, setResult] = useState<Result | null>(null)
  const [composition, setComposition] = useState<CompositionItem[]>([])
  const [defects, setDefects] = useState<DefectItem[]>([])
  const [selectedStandard, setSelectedStandard] = useState<StandardDefinition | null>(null)

  useEffect(() => {
    if (!id) return
    const stored = localStorage.getItem('inspectionResults')
    if (!stored) return

    const allResults = JSON.parse(stored) as Result[]
    const res = allResults.find((r) => r.id === id)

    if (res) {
      setResult(res)

      const standard = standards.find((s) => s.id === res.standard)
      if (!standard) return

      setSelectedStandard(standard)

      const { composition, defects } = calculateInspectionResult(res.rawGrains, standard)

      setComposition(
        composition.map((item) => ({
          ...item,
          actual: item.actual ?? item.percent ?? 0,
        }))
      )

      setDefects(
        defects.map((item) => ({
          ...item,
          actual: item.actual ?? item.percent ?? 0,
        }))
      )
    }
  }, [id])

  if (!result) {
    return <div className="p-8 text-center">No verification results found for ID: {id}.</div>
  }


return (
  <>
    <Header />
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Inspection</h1>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

        {/* Left Side: Image + Buttons */}
        <div className="flex flex-col items-end gap-4">
          <img
            src={result.imageURL}
            alt="Rice"
            className="w-full max-w-[250px] h-auto object-contain rounded-b-sm border"
          />
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/create-inspection')}
              className="px-4 py-1 text-sm border border-green-700 text-green-700 rounded-md hover:bg-gray-100"
            >
              Back
            </button>
            <button
              onClick={() => router.push(`/edit-result/${result.id}`)}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-900 text-sm"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 space-y-4 bg-gray-200/70 p-4 rounded-md">
        
          {/* Card 1 */}
          <div className="bg-white rounded-md shadow-sm border p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Create Date - Time</p>
              <p className="font-medium text-black">{formatDateTime(result.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-600">Update Date - Time</p>
              <p className="font-medium text-black">{formatDateTime(result.updatedAt)}</p>
            </div>
            <div>
              <p className="text-gray-600">Inspection ID</p>
              <p className="font-medium text-black">{result.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Standard</p>
              <p className="font-medium text-black">{selectedStandard!.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Sample</p>
              <p className="font-medium text-black">{result.rawGrains.length} kernal</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-md shadow-sm border p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Note</p>
              <p className="font-medium text-black">{result.note || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">Price</p>
              <p className="font-medium text-black">{result.price?.toLocaleString() || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">Date/Time of Sampling</p>
              <p className="font-medium text-black">
                {result.sampledAt ? formatDateTime(result.sampledAt) : '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Sampling Point</p>
              <p className="font-medium text-black">{result.samplingPoint?.join(', ') || '-'}</p>
            </div>
          </div>

          {/* Card 3: Composition */}
          <div className="bg-white rounded-md shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Composition</h2>
            <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Length</th>
                  <th className="px-4 py-2 text-left">Actual</th>
                </tr>
              </thead>
              <tbody>
                {composition.map((item) => (
                  <tr key={item.name} className="border-t">
                    <td className="px-4 py-2 text-gray-900">{item.name}</td>
                    <td className="px-4 py-2 text-gray-900">{item.lengthRange}</td>
                    <td className="px-4 py-2 text-green-700 font-medium">
                      {item.actual.toFixed(2)} %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card 4: Defect Table */}
          <div className="bg-white rounded-md shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Defect Rice</h2>
            <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Actual</th>
                </tr>
              </thead>
              <tbody>
                {defects.map((item) => (
                  <tr key={item.name} className="border-t">
                    <td className="px-4 py-2 text-gray-900">{item.name}</td>
                    <td className="px-4 py-2 text-green-700 font-medium">
                      {item.actual.toFixed(2)} %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </>
)




}

export default ResultPage
