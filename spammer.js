import fetch from "isomorphic-fetch";
import { Logger } from "./logger.js";

export async function spam(urls, reqsPerSecond, secsToRun) {
    const log = new Logger()

    log.line(`Spamming ${urls} with ${reqsPerSecond*secsToRun} requests over ${secsToRun} seconds.`)

    const timeOutIds = []

    let requestsSent = 0

    for (let url of urls) {
        log.time("spam")
        timeOutIds.push(setInterval(async () => {
            for (let i = 0; i < reqsPerSecond / urls.length; i++) fetch(url).then(res => {
                if (res.status >= 500) {
                    if (!log.hasLoggedServerCrash) log.serverCrash(requestsSent, res.status, url)
                    return;
                }

                if (res.status >= 400) {
                    if (!log.hasLoggedServerBlock) log.serverBlock(requestsSent, res.status, url)
                }
            })

            requestsSent += reqsPerSecond / urls.length

            if (requestsSent >= reqsPerSecond * secsToRun) {
                log.timeEnd("spam")
                log.line(requestsSent)
                timeOutIds.forEach(clearTimeout)
            }
        }, 1000))
    }
}
