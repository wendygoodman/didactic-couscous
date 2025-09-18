# Hanuman License — MVP Shop (Vite + Express)

This repo contains your shop UI **and** a tiny Express backend that proxies to **PayWay** to create a checkout link, then shows a **QR code popup** with the balance to pay.

> ⚠️ Do **NOT** expose your private key to the client. Keep it in `.env.local` on the server only.

## Quick start

```bash
npm i
cp .env.example .env.local  # add your keys
npm run dev                 # starts Vite (5173) + Express (5174)
```

Open http://localhost:5173

## Environment

Create a `.env.local` in project root:

```
PAYWAY_MERCHANT_ID=ec449731
PAYWAY_PUBLIC_KEY=930628f01692ca4700dd0a787212e062fbc8d7f2
PAYWAY_RSA_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCWNENhb2RlrH9TMP9HkyVLZyS+
kaYYDef5btFjiGJM3F2fyYCo+tvCaqCFAGOSfwG9wPBIY4Xgc9XiBh1ea0IlBev0
nMRrRqtUelxV3EIbwgj5ofrzo/pX2v4r8/J884K4pziOfE9CS3x6k3zxt+S+OCc2
q9WaMiuasvk8LH9keQIDAQAB
-----END PUBLIC KEY-----
PAYWAY_RSA_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
PAYWAY_API_URL=https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase
```

> These are **sandbox** values you provided. For production, switch to the live API URL and live keys.

## How it works

1. Click **Proceed to checkout** → frontend posts to `POST /api/payway/purchase` with your order.
2. Server signs a canonical string with **RSA-SHA512** (and includes HMAC fallback) and forwards to PayWay `payments/purchase`.
3. Response should contain a **payment URL** → UI opens **QR popup** showing the amount + QR + a direct button to open the link.
4. After payment, PayWay should redirect you to the provided `return_url` (we set `/#paid`).

If your merchant account expects a slightly different signature or canonical string, adjust `server.js` accordingly (merchant portal → Developers → Docs).

Enjoy! 🎉
