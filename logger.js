export class Logger {
    hasLoggedServerCrash = false
    hasLoggedServerBlock = false

    // Extend methods from console object
    log = console.log
    time = console.time
    timeEnd = console.timeEnd

    line(...strings) {
        this.log(`${strings.join(" ")}\n`)
    }

    serverCrash(requestsRun, statusCode, target) {
        this.line(`The server responded with a status ${statusCode} which indicates the target webserver at ${target} may have crashed.`)
        this.line(`So far ${requestsRun} requests have been sent`)
        this.hasLoggedServerCrash = true
    }

    serverBlock(requestsRun, statusCode, target) {
        this.line(`The server responded with a status ${statusCode} which indicates the target webserver at ${target} may have blocked your IP address.`)
        this.line(`So far ${requestsRun} requests have been sent`)
        this.hasLoggedServerBlock = true
    }
}
