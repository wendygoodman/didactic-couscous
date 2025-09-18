
# Hanuman License — MVP Shop

Next.js 14 (App Router) shop with product grid/table, cart, and a **QR checkout modal**.
The payment endpoint is stubbed to generate a QR for a sandbox link. Swap in your
real PayWay call in `app/api/payway/create-payment-link/route.ts`.

## Run locally
```bash
npm i
npm run dev
```

## Deploy (Vercel)
- Import this repository into Vercel.
- Build command: `npm run build` (default).
- No special settings needed.
- Add your favicon / logo at `public/hanuman-logo.png`.

## Configuring PayWay (optional)
Replace the stub in `app/api/payway/create-payment-link/route.ts` with a real request to PayWay's sandbox:
`https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase`

Use environment variables to store credentials and sign requests as per the docs.
When you have a real `payment_url`, return it along with a QR code (use the included `qrcode` package):
```ts
const qr = await QRCode.toDataURL(payment_url)
return NextResponse.json({ url: payment_url, amount, qr })
```
