
import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(req: Request) {
  try {
    const { orderId, amount } = await req.json()
    if (!orderId || !amount) return NextResponse.json({ error: 'Missing orderId or amount' }, { status: 400 })

    // If needed, integrate PayWay here. For now, create a mock link that encodes order + amount.
    const url = `https://checkout-sandbox.payway.com.kh/#/pay?order=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(amount)}`
    const qr = await QRCode.toDataURL(url, { margin: 1, width: 512 })
    return NextResponse.json({ url, amount, qr })
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
