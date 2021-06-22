import http from "http"

const server = http.createServer((req , res)=> {
    res.statusCode = 200
    res.end()
    console.log("Request handled")
})

server.listen(4000, () => console.log("Listening"))
