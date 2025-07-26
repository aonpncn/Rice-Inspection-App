import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const data = await req.json()

  return NextResponse.json({
    success: true,
    message: 'Inspection created (mocked)',
    data,
  })
}
