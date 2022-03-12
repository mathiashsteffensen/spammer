import fetch from "isomorphic-fetch";
import { Logger } from "./logger.js";

export class Spammer {
    serverStatus = "up"
    intervalIds = []
    requestsSent = 0
    log = new Logger()

    async execute(urls, reqsPerSecond, secsToRun) {
        this.log.line(`Spamming ${urls} with ${reqsPerSecond*secsToRun} requests over ${secsToRun} seconds.`)
        this.log.line()

        for (let url of urls) {
            this.log.time("spam")
            this.intervalIds.push(this._spamUrl(url, reqsPerSecond / urls.length, secsToRun))
        }
    }

    _spamUrl(url, reqsPerSecond, secsToRun) {
        return setInterval(async () => {
            for (let i = 0; i < reqsPerSecond; i++) {
                fetch(url).then((res) => {
                    this._handleResponse(res, url)
                    this._incrementRequestCount(1)
                    this._checkIfComplete(reqsPerSecond, secsToRun)
                })
            }
        }, 1000)
    }

    _handleResponse(res, url) {
        if (res.status >= 500) {
            if (!this.log.hasLoggedServerCrash) this.log.serverCrash(this.requestsSent, res.status, url)
            this.serverStatus = "crashed"
            return
        }

        if (res.status >= 400) {
            if (!this.log.hasLoggedServerBlock) this.log.serverBlock(this.requestsSent, res.status, url)
            this.serverStatus = "blocked"
            return
        }

        if (this.serverStatus !== "up") {
            if (this.serverStatus === "crashed") {
                this.log.line("The server appears to be back up")
            }

            if (this.serverStatus === "block") {
                this.log.line("The server appears to have unblocked you")
            }

            this.log.line()

            this.serverStatus = "up"
            this.log = new Logger()
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
