let fs = require('fs')

fs.readFile('./msd', function(err, data) {
    console.log(data[6])
    let buffer = data
    buffer1 = buffer.slice(0,6)
    buffer2 = buffer.slice(7, buffer.length)
    let newBuffer = Buffer.alloc(1)
    newBuffer.writeUInt8(60)
    let finalBuffer = Buffer.concat([buffer1, newBuffer, buffer2])
    fs.writeFile('msd_slave', finalBuffer, function(err) {
        console.log(err)
    })
})