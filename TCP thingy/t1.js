const fs = require('fs')

var x = 100
var t = x.toString(16)
var buf = Buffer.alloc(2)
buf.writeUInt16BE(x)
//buf[0] = x

console.log(t,buf)
//console.log(n,n.toString('hex',0,1))
//console.log(parseInt(t, 16))
//console.log(x.toStringnary ())
binary = fs.readFileSync('./reversed')
//console.log(binary)
//var bf1 = n.slice(0,5) 
//var bf2 = n.slice(5)
//console.log(bf1.length,bf2.length)
