'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'


export default function HistoryPage() {

    const router = useRouter()

    const [searchId, setSearchId] = useState('')
    const [formDate, setFormDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [inspections, setInspections] = useState<any[]>([])

    const handleCreateButton = () => {
        router.push('/create-inspection')
    }

    const handleClear = () => {
        setSearchId('')
        setFormDate('')
        setToDate('')
        const data = JSON.parse(localStorage.getItem('inspections') || '[]')
        setInspections(data)
    }

    const handleSearch = () => {
        const data = JSON.parse(localStorage.getItem('inspections') || '[]');
        const filtered = data.filter((item: any) => {
            const matchId = searchId === '' || item.inspectionId.toString().includes(searchId);
            const matchFrom = formDate === '' || new Date(item.dateTime) >= new Date(formDate);
            const matchTo = toDate === '' || new Date(item.dateTime) <= new Date(toDate);
            return matchId && matchFrom && matchTo;
        });
        setInspections(filtered);
    };

    const toggleCheckbox = (id: number) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const handleDelete = () => {
    const stored = localStorage.getItem('inspections');
    if (!stored) return;

    const results = JSON.parse(stored);
    const updated = results.filter((item: any) => !selectedItems.includes(item.inspectionId));

    localStorage.setItem('inspections', JSON.stringify(updated));
    setInspections(updated);
    setSelectedItems([]);
    };



    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('inspections') || '[]')
        setInspections(data)
    }, [])


    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 px-10 py-4">
                <div className="flex justify-end py-4">

                    <button
                        onClick={handleCreateButton}
                        className="bg-green-700 hover:bg-green-900 text-white px-4 py-2 rounded flex items-center text-sm shadow"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Inspection
                    </button>

                </div>

                {/* Filter + Button */}
                <div className="bg-white rounded-lg shadow p-6 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">ID</label>
                            <input
                                type="text"
                                placeholder="Search with ID"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="mt-1 w-full border rounded px-3 py-2 text-sm text-gray-900 border-gray-500"
                            />
                        </div>

                        {/* Form Date */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700">Form Date</label>
                            <input
                                type="date"
                                value={formDate}
                                onChange={(e) => setFormDate(e.target.value)}
                                className="mt-1 w-full border rounded px-3 py-2 text-sm text-gray-500"
                                placeholder="Please select Form Date"
                            />
                        </div>

                        {/* To Date */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700">To Date</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="mt-1 w-full border rounded px-3 py-2 text-sm text-gray-500"
                                placeholder="Please select To Date"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between items-center">
                        <button onClick={handleClear} className="text-sm text-red-600 hover:text-red-700 underline">
                            Clear Filter
                        </button>
                        <button onClick={handleSearch} className="bg-green-700 hover:bg-green-900 text-white px-4 py-2 rounded flex items-center text-sm shadow">
                            <MagnifyingGlassIcon className="w-4 h-4 mr-1" />
                            Search
                        </button>
                    </div>
                </div>


                {/* Delete & Check Box */}
                {selectedItems.length > 0 && (
                    <div className="flex justify-start items-center mt-1 pb-4">
                        <button 
                        onClick={handleDelete}
                        className="flex items-center border border-green-700 text-green-700 px-4 py-1 rounded hover:bg-green-50 text-sm"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
                            </svg>
                            Delete
                        </button>
                        <span className="text-sm px-4 text-gray-700">
                            Select items: {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}
                        </span>
                    </div>
                )}



                {/* Table */}
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-green-700 text-white text-left">
                                <th className="px-6 py-2">Date - Time</th>
                                <th className="px-4 py-2">Inspection ID</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Standard</th>
                                <th className="p-2">Sampling Point</th>
                                <th className="px-4 py-2">Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inspections.map((row) => (
                                <tr
                                    key={row.inspectionId}
                                    onClick={() => router.push(`/result/${row.inspectionId}`)}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="px-6 py-2 text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(row.inspectionId)}
                                                onChange={() => toggleCheckbox(row.inspectionId)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="accent-green-700"
                                                />

                                            <span>{row.dateTime}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-gray-900">{row.inspectionId}</td>
                                    <td className="px-4 py-2 text-gray-900">{row.name}</td>
                                    <td className="px-4 py-2 text-gray-900">{row.standard}</td>
                                    <td className="px-4 py-2 text-gray-900">{row.samplingPoints?.join(', ')}</td>
                                    <td className="px-4 py-2 text-gray-900">{row.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 text-sm text-gray-900 flex justify-between items-center">
                        <span>{`1–${inspections.length} of ${inspections.length}`}</span>
                        <div className="space-x-2">
                            <button>{'<'}</button>
                            <button>{'>'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
