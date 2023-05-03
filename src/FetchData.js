import fetch from "node-fetch"

const PREVIEW_URL = "https://t.me/s/hotdeal_kr?q=p41"

// horror
const lastHotdeal = /<a class="tgme_widget_message_inline_button url_button" href="(.*)<\/span>/g
const buttonLink = /href="([^"]+)/
const buttonText = /<span[^>]*>(.*?)<\/span>/
const source = /\((.*?)\)/

export default async () => {
    const preview = await fetch(PREVIEW_URL)
    if (!preview.ok) return
    const text = await preview.text()
    const links = text.match(lastHotdeal)
    if (!links) return
    const link = links[links.length - 1]
    return {
        link: link.match(buttonLink)[1].replace(/&amp;/g, "&"),
        source: (link.match(buttonText)[1]).match(source)[1]
    }
}
