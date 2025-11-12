// src/app/api/upload/route.ts
// DEV ONLY: returns verbose errors => remove or sanitize in production
export const runtime = 'nodejs'
export const maxDuration = 30 // 30 seconds for Vercel

import { NextResponse } from 'next/server'

const IMGBB_ENDPOINT = 'https://api.imgbb.com/1/upload'

export async function GET(request: Request) {
  const p = new URL(request.url).searchParams
  if (!p.has('test')) return NextResponse.json({ ok: true, note: 'Upload route active (dev verbose)' })
  try {
    const resp = await fetch(IMGBB_ENDPOINT, { method: 'GET' })
    return NextResponse.json({ ok: true, status: resp.status, url: IMGBB_ENDPOINT })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: 'fetch failed', message: err?.message ?? String(err), stack: err?.stack ?? null }, { status: 502 })
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get('image') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No image provided (form key "image")' }, { status: 400 })
    }

    const apiKey = process.env.IMGBB_API_KEY
    if (!apiKey) {
      console.error('[upload] Missing IMGBB_API_KEY environment variable')
      return NextResponse.json({ error: 'Server misconfigured: missing IMGBB_API_KEY' }, { status: 500 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' }, { status: 400 })
    }

    // read file -> base64
    const arrayBuffer = await file.arrayBuffer()
    const b64 = Buffer.from(arrayBuffer).toString('base64')

    // prepare body
    const params = new URLSearchParams()
    params.append('image', b64)

    const url = `${IMGBB_ENDPOINT}?key=${encodeURIComponent(apiKey)}`

    console.log(`[upload] Attempting to upload to ImgBB, file size: ${file.size} bytes`)

    let imgbbResp
    let imgbbText = ''
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 second timeout

    try {
      imgbbResp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        signal: controller.signal,
      })
      imgbbText = await imgbbResp.text()
    } catch (err: any) {
      clearTimeout(timeoutId)
      
      if (err.name === 'AbortError') {
        console.error('[upload] ImgBB API timeout after 25 seconds')
        return NextResponse.json({
          error: 'Upload timeout',
          message: 'Image upload service timed out. Please try again.'
        }, { status: 504 })
      }
      
      console.error('[upload] fetch threw', err)
      return NextResponse.json({
        error: 'Network error',
        message: 'Failed to connect to image service',
        fetchErrorMessage: err?.message ?? String(err),
      }, { status: 502 })
    } finally {
      clearTimeout(timeoutId)
    }

    // try parse imgbb response if possible
    let imgbbJson: any = null
    try {
      imgbbJson = imgbbText ? JSON.parse(imgbbText) : null
    } catch (parseErr: any) {
      console.error('[upload] imgbb returned non-JSON', imgbbText)
      return NextResponse.json({
        error: 'ImgBB returned invalid response',
        status: imgbbResp.status,
        rawBody: imgbbText.substring(0, 500), // First 500 chars only
      }, { status: 502 })
    }

    if (!imgbbResp.ok) {
      console.error('[upload] imgbb error response', { status: imgbbResp.status, body: imgbbJson })
      const imgbbError = imgbbJson?.error?.message || imgbbJson?.error || 'Upload failed'
      return NextResponse.json({
        error: 'ImgBB upload failed',
        status: imgbbResp.status,
        imgbbError: imgbbError,
      }, { status: 502 })
    }

    const imageUrl = imgbbJson?.data?.url ?? imgbbJson?.data?.display_url ?? imgbbJson?.data?.image?.url ?? null
    if (!imageUrl) {
      console.error('[upload] imgbb success missing url', imgbbJson)
      return NextResponse.json({
        error: 'ImgBB response missing image URL',
        body: imgbbJson,
      }, { status: 502 })
    }

    console.log('[upload] Successfully uploaded image:', imageUrl)
    // success
    return NextResponse.json({ url: imageUrl })
  } catch (err: any) {
    console.error('[upload] unexpected server error', err)
    // Return full error (dev only)
    return NextResponse.json({
      error: 'Server upload error',
      message: err?.message ?? String(err),
      stack: process.env.NODE_ENV === 'development' ? err?.stack : null,
    }, { status: 500 })
  }
}