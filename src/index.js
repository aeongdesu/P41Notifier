import "dotenv/config"

import express from "express"
const app = express()
app.use(express.json()) // for cron

import FetchData from "./FetchData.js"

import { Deta } from "deta"
const deta = new Deta()
const db = deta.Base("P41Notifier")

const port = process.env.PORT
const webhook_url = process.env.DISCORD_WEBHOOK
const mention = process.env.MENTION_ID

app.get("/", (req, res) => {
    res.send({ repo: "https://github.com/aeongdesu/P41Notifier", path: "/latest" })
})

app.get("/latest", async (req, res) => {
    const latest = await db.get("latest")
    return res.send(latest)
})

// cron
app.post("/__space/v0/actions", async (req, res) => {
    const event = req.body?.event
    if (event?.id !== "fetch") return res.sendStatus(403)

    const data = await FetchData()
    let latest = await db.get("latest")
    if (latest?.link == data.link) return res.send("Up to date")

    latest = await db.put(data, "latest")

    const webhook = await fetch(webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: `<@${mention}>\n${data.link}`
        })
    })
    if (!webhook.ok) return res.sendStatus(500)
    return res.send(latest)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})