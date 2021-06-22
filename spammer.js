import fetch from "isomorphic-fetch";
import { Logger } from "./logger.js";

export class Spammer {
    intervalIds = []
    requestsSent = 0
    log = new Logger()

    async execute(urls, reqsPerSecond, secsToRun) {
        this.log.line(`Spamming ${urls} with ${reqsPerSecond*secsToRun} requests over ${secsToRun} seconds.`)

        for (let url of urls) {
            this.log.time("spam")
            this.intervalIds.push(this._spamUrl(url, reqsPerSecond / urls.length, secsToRun))
        }
    }

    _spamUrl(url, reqsPerSecond, secsToRun) {
        return setInterval(async () => {
            for (let i = 0; i < reqsPerSecond; i++) fetch(url).then(this._handleResponse)

            this._incrementRequestCount(reqsPerSecond)

            this._checkIfComplete(reqsPerSecond, secsToRun)
        }, 1000)
    }

    _handleResponse(res) {
        if (res.status >= 500) {
            if (!this.log.hasLoggedServerCrash) this.log.serverCrash(this.requestsSent, res.status, url)
            return;
        }

        if (res.status >= 400) {
            if (!this.log.hasLoggedServerBlock) this.log.serverBlock(this.requestsSent, res.status, url)
        }
    }

    _checkIfComplete(reqsPerSecond, secsToRun) {
        if (this.requestsSent >=reqsPerSecond * secsToRun) {
            this.log.timeEnd("spam")
            this.log.line(this.requestsSent)
            this.intervalIds.forEach(clearTimeout)
        }
    }

    _incrementRequestCount(toAdd) { this.requestsSent += toAdd }
}
