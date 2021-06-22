import {Logger} from "./logger";
import yargs from "yargs";

(async () => {
    const log = new Logger()

    const args = yargs(process.argv.slice(2))
        .usage('\nUsage: $0 --target [target url/urls] --reqs [requests per second] --secs [the number of seconds to run]\n')
        .usage('Example: $0 --target https://google.com --reqs 100 --secs 20')
        .demandOption(['target'])
        .argv;

    const urls = args.target.split(",")
    const reqsPerSec = args.reqs || 20
    const secsToRun = args.secs || 10
})()
