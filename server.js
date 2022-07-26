const express = require("express")
const server = express()

server.all("/", (req, res) => {
  res.send('Please connect me into a hosting website to enable 24/7 hosting.')
})

function keepAlive(){
    server.listen(process.env.PORT, ()=>{console.log("")});
}

module.exports = keepAlive
