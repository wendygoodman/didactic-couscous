import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(express.static('public'))

const MERCHANT_ID = process.env.PAYWAY_MERCHANT_ID || 'ec449731'
const PUBLIC_KEY = process.env.PAYWAY_PUBLIC_KEY || '930628f01692ca4700dd0a787212e062fbc8d7f2'
const RSA_PUBLIC_KEY = (process.env.PAYWAY_RSA_PUBLIC_KEY || `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCWNENhb2RlrH9TMP9HkyVLZyS+
kaYYDef5btFjiGJM3F2fyYCo+tvCaqCFAGOSfwG9wPBIY4Xgc9XiBh1ea0IlBev0
nMRrRqtUelxV3EIbwgj5ofrzo/pX2v4r8/J884K4pziOfE9CS3x6k3zxt+S+OCc2
q9WaMiuasvk8LH9keQIDAQAB
-----END PUBLIC KEY-----`).trim()
const RSA_PRIVATE_KEY = (process.env.PAYWAY_RSA_PRIVATE_KEY || `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDC1y5/hlod5v9J5GgwtjTcysBYajwu5YqpeM6ueD1ChaFLuBZa
zJO8MW0kROCZPGlg4M0R623MbTbK/iLFvgIJxpBmrLo/WdS3WeYne1/bM+C1CjUE
CRyNFAwC7wd0fpvw2yrjmuKNfpQ/hAbYCKJoJcG7n6MfmgqdHwH2g368jwIDAQAB
AoGAAmYx7WITJAEfLaLBYbAssHdSrQQJ36316iZRrTZP0szgcpU+uTmBrDSTmnm6
pkhnJ8k83Taf8H97yD4e4X54ee7VHqQF+Idxt0mAteYWVnRaFIU/JMHcjmZwHMmz
yVAldmSokMz/7pEwuqGauOxnuq84BSsZwqzH+RR7PwHjkXkCQQDUQfYaSLICASn3
+jn3cR7ki1/GxquUszrh19tpfnBP+HyWBmXjM6FpGd1ljfPsAKmoBcqhUG0cde54
nHMEi74jAkEA6v5ZXorBPHekeHH8fTIh644oHSdJOfFTyLj/7WcRhuXmbrZEwUjp
0xWQAsL0P/QxqPhojHZMLCp0xWGNSXkQpQJASshanvQR02b5lGbS2X0/dyIrwmro
tOFY040rvsVPaL2Rl4H1j9D3A4KbYFZdJD8vhwVTWPZvGuHp/RCR7X4WpQJBANA8
wj8oICKQNvvQrpjWwv41A9EJzjb9Zmx5m7jpW7u5oGA9PmI1VZcLBYmc7sp5f0Qn
lKXb8pY0rTN3xbb1BE0CQQDCS2pQ3qxY2jJu1J7/FplWeue6IwHBPfyiYf29fhWb
rHUP+Zd3WcXYajvOYMy3fzW+/sEFiU394h2QIWlrZCq2
-----END RSA PRIVATE KEY-----`).trim()
const PAYWAY_API = (process.env.PAYWAY_API_URL || 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase').trim()

function hmac512Hex(key, message) {
  return crypto.createHmac('sha512', key).update(message, 'utf8').digest('hex')
}
function rsaSignBase64(privateKey, data) {
  try {
    const sign = crypto.createSign('RSA-SHA512')
    sign.update(data, 'utf8')
    return sign.sign(privateKey, 'base64')
  } catch (e) {
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(data, 'utf8')
    return sign.sign(privateKey, 'base64')
  }
}

app.post('/api/payway/purchase', async (req, res) => {
  try {
    const { orderId, amount, currency='USD', items=[], description='', returnUrl, cancelUrl } = req.body || {}
    if (!orderId || !amount) return res.status(400).json({ error: 'orderId and amount required' })

    // Best guess canonical string; adjust to your merchant doc
    const canonical = `${MERCHANT_ID}${orderId}${Number(amount).toFixed(2)}${currency}${PUBLIC_KEY}`
    const signature = rsaSignBase64(RSA_PRIVATE_KEY, canonical)
    const hmac = hmac512Hex(RSA_PRIVATE_KEY.replace(/\r?\n/g,''), canonical)

    const payload = {
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      amount: Number(amount).toFixed(2),
      currency,
      items,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      description,
      public_key: PUBLIC_KEY,
      signature, signature_type: 'RSA', hmac, canonical
    }

    const r = await fetch(PAYWAY_API, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    const data = await r.json().catch(()=>({}))
    if (!r.ok) return res.status(r.status).json({ error: data?.message || 'PayWay error', data })

    res.json({ data, payment_url: data?.payment_url || data?.url || data?.checkout_url || data?.data?.checkout_url || data?.data?.url })
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) })
  }
})

app.get('/api/payway/status', async (req, res) => {
  res.json({ ok: true, paid: false })
})

const PORT = process.env.PORT || 5174
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
