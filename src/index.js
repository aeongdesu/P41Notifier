import express from "express"

import FetchData from "./FetchData.js"

const app = express()

const port = process.env.PORT
const webhook = process.env.DISCORD_WEBHOOK

app.get("/", (req, res) => {
    res.redirect("https://github.com/aeongdesu/P41Notifier")
})

app.get("/notify", async (req, res) => {
    if (!webhook) return res.status(404).send("No webhook provided")
})

// cron
app.post("/__space/v0/actions", async (req, res) => {
    console.log(req)
    const event = req.body.event
    if (event.id === "fetch") {
        res.send(await FetchData())
    }
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})