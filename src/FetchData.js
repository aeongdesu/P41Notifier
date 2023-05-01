import fetch from "node-fetch"

const PREVIEW_URL = "https://t.me/s/hotdeal_kr"

export default async () => {
    const preview = await fetch(PREVIEW_URL)
    if (!preview.ok) return
    return preview.json()
}