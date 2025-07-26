'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'
import { generateInspectionId } from '@/Utilities/generateInspectionId'
import { formatDateTime } from '@/Utilities/formatDateTime'
import type { Result } from '@/types'
import { standards } from '@/data/standards'


export default function CreateInspection() {

    const router = useRouter()

    const [name, setName] = useState('')
    const [selectedStandardId, setSelectedStandardId] = useState(standards[0].id)
    const [file, setFile] = useState<File | null>(null)
    const [note, setNote] = useState('')
    const [price, setPrice] = useState('')
    const [samplingPoints, setSamplingPoints] = useState<string[]>([])
    const [dateTime, setDateTime] = useState('')
    const [uploadedJson, setUploadedJson] = useState<any | null>(null)

    const [errors, setErrors] = useState<{ name: boolean; standard: boolean }>({
        name: false,
        standard: false,
    })


    const handleJsonUpload = (json: any, id: string) => {
        const newResult: Result = {
            id,
            standard: selectedStandardId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            imageURL: json.imageURL,
            rawGrains: json.grains,
            note,
            price: parseFloat(price) || undefined,
            samplingPoint: samplingPoints,
            sampledAt: formatDateTime(dateTime),
        };

        const existing = JSON.parse(localStorage.getItem('inspectionResults') || '[]');
        localStorage.setItem('inspectionResults', JSON.stringify([...existing, newResult]));
        setUploadedJson(json);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const hasError = {
            name: name.trim() === '',
            standard: selectedStandardId === '',
        }

        setErrors(hasError);
        if (hasError.name || hasError.standard) return;

        const currentData = JSON.parse(localStorage.getItem('inspections') || '[]');
        const id = generateInspectionId(currentData.length);

        const newData = {
            inspectionId: id,
            name,
            standardId: selectedStandardId,
            note,
            price,
            samplingPoints,
            dateTime: formatDateTime(dateTime),
            fileName: file?.name || '',
        };

        const newDataList = [...currentData, newData];
        localStorage.setItem('inspections', JSON.stringify(newDataList));


        if (uploadedJson) {
            handleJsonUpload(uploadedJson, id);
        }

        router.push(`/result/${id}`);
    }

    const handleClear = () => {
        setName('')
        setSelectedStandardId(standards[0].id)
        setFile(null)
        setNote('')
        setPrice('')
        setSamplingPoints([])
        setDateTime('')
        setErrors({ name: false, standard: false })
    }



    const toggleSampling = (point: string) => {
        setSamplingPoints((prev) =>
            prev.includes(point)
                ? prev.filter((p) => p !== point)
                : [...prev, point]
        )
    }


    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Create Inspection</h1>

                <div className="flex justify-center">

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-lg shadow w-full max-w-md space-y-4"
                    >

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">
                                Name<span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Please enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full border px-3 py-2 rounded text-sm text-gray-900 ${errors.name ? 'border-red-500' : 'border-gray-400'
                                    }`}
                            />
                            {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}
                        </div>

                        {/* Standard */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">
                                Standard<span className="text-red-600">*</span>
                            </label>
                            <select
                                className={`w-full border px-3 py-2 rounded text-sm 
                                        ${errors.standard ? 'border-red-500' : 'border-gray-400'} 
                                        ${selectedStandardId === '' ? 'text-gray-400' : 'text-gray-900'}
                                    `}
                                value={selectedStandardId}
                                onChange={(e) => setSelectedStandardId(e.target.value)}
                            >
                                {standards.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>

                            {errors.standard && (
                                <p className="text-red-600 text-xs">{errors.standard}</p>
                            )}
                        </div>

                        {/* Upload File */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">
                                Upload File (.json)
                            </label>
                            <input
                                id="FileInput"
                                type="file"
                                accept=".json"
                                onChange={async (e) => {
                                    const selectedFile = e.target.files?.[0] || null
                                    setFile(selectedFile)

                                    if (selectedFile) {
                                        try {
                                            const text = await selectedFile.text()
                                            const json = JSON.parse(text)
                                            setUploadedJson(json)
                                        } catch (err) {
                                            alert('Invalid JSON file format.')
                                        }
                                    }
                                }}


                                className="hidden"
                            />
                            <div
                                onClick={() => document.getElementById('FileInput')?.click()}
                                className={`w-full border px-3 py-2 rounded text-sm cursor-pointer ${file ? 'text-gray-900' : 'text-gray-400'} border-gray-400`}
                            >
                                {file ? `${file.name} selected` : 'Click to upload .json file'}
                            </div>
                        </div>

                        {/* Note */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">
                                Note
                            </label>
                            <input
                                type="text"
                                placeholder="Add a note (optional)"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full border px-3 py-2 rounded text-sm text-gray-900 border-gray-400"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">
                                Price
                            </label>
                            <input
                                type="number"
                                placeholder="Enter price (0-100,000)"
                                min="0"
                                max="100000"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full border px-3 py-2 rounded text-sm text-gray-900"
                            />
                        </div>

                        {/* Sampling Point */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Sampling Point
                            </label>
                            <div className="flex gap-20 ml-4 text-sm text-gray-900">
                                {['Front End', 'Back End', 'Other'].map((point) => (
                                    <label key={point} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={samplingPoints.includes(point)}
                                            onChange={() => toggleSampling(point)}
                                            className="accent-green-700 mr-2"
                                        />
                                        {point}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Date/Time */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">
                                Date/Time of Sampling
                            </label>
                            <input
                                type="datetime-local"
                                value={dateTime}
                                onChange={(e) => setDateTime(e.target.value)}
                                className="w-full border px-3 py-2 rounded text-sm text-gray-900 border-gray-400"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-900 text-sm"
                            >
                                Submit
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
