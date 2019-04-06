var net = require('net');

var server = net.createServer();

server.on('connection', (socket) => {
    console.log("Connected")
    console.log("Buffer size:", socket.bufferSize)

    var rport = socket.remotePort;
    var raddr = socket.remoteAddress;
    var rfamily = socket.remoteFamily;

    console.log('REMOTE Socket is listening at port ' + rport);
    console.log('REMOTE Socket ip : ' + raddr);
    console.log('REMOTE Socket is IP4/IP6 : ' + rfamily);


    server.getConnections(function (error, count) {
        console.log('Number of concurrent connections to the server : ' + count);
    })

    // socket.setEncoding('utf8');

    socket.on('drain', function () {
        console.log('write buffer is empty now .. u can resume the writable stream');
        socket.resume();
    });

    socket.on('error', function (error) {
        console.log('Error : ' + error);
    });

    socket.on('timeout', function () {
        console.log('Socket timed out !');
        socket.end('Timed out!');
        // can call socket.destroy() here too.
    });

    socket.on('end', function (data) {
        console.log('Socket ended from other end!');
        console.log('End data : ' + data);
    });

    socket.on('close', function (error) {
        var bread = socket.bytesRead;
        var bwrite = socket.bytesWritten;
        console.log('Bytes read : ' + bread);
        console.log('Bytes written : ' + bwrite);
        console.log('Socket closed!');
        if (error) {
            console.log('Socket was closed coz of transmission error');
        }
    });
var flag = 0;
var remain = 0;
//var checkbuff = Buffer.alloc()
    socket.on('data', function (data) {
		var d = data.slice(0,1)
		console.log(d.toString())
		console.log(data)	
	//console.log("Printing Data type here :--")
	//console.log(data.readUInt8());
	if(flag == 0){
		
	}
        var bread = socket.bytesRead;
        var bwrite = socket.bytesWritten;
        //console.log('Bytes read : ' + bread);
        //console.log('Bytes written : ' + bwrite);
        // console.log('Data sent to server : ' + data);
        let buf = new Buffer.from(data.toString('utf8'))
        //console.log(buf)
        let byteString = buf.toString('hex')
        //console.log("Data received: ", byteString)
        lengthOfMessage = byteString.slice(4,8)
       // console.log("Length of data:", parseInt(lengthOfMessage, 16))

        //echo data
        var is_kernel_buffer_full = socket.write('Data ::' + data);
        if (is_kernel_buffer_full) {
            console.log('Data was flushed successfully from kernel buffer i.e written successfully!');
        } else {
            socket.pause();
        }

    });

})

server.on('close', () => {
    console.log("Closed")
})

server.listen(1720);
