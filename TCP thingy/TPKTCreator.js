let fs = require('fs')

let filelocation = process.argv[2]
let filename = process.argv[3]

fs.readFile(filelocation, function(err, data) {
    if (err) {
        console.log("Error:", err)
    } else {
        let finalLength = data.length
        console.log(finalLength)
        let sendBuffer1 = Buffer.alloc(2)
        sendBuffer1.writeUInt16BE(768)
        let sendBuffer2 = Buffer.alloc(2)
        sendBuffer2.writeUInt16BE(finalLength + 4)
        let finalSendBuffer = Buffer.concat([sendBuffer1, sendBuffer2, data])
        console.log(finalSendBuffer)
        fs.writeFile(filename, finalSendBuffer, (err) => {
            if(err) {
                console.log("Error:", err)
            }
        })
    }
})
