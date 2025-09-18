
import { NextResponse } from 'next/server'
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('orderId')
  // Placeholder: always not paid
  return NextResponse.json({ orderId, paid: false })
}
