const fs = require('fs')
var sudo = require('sudo-js')
sudo.setPassword('Sauch@4321')
const converter = require('xml2json')
var json2xml = require('json2xml');

function connectionhandler(socket) {

	server.getConnections(function (error, count) {
		console.log('Number of concurrent connections to the server : ' + count);
	})

	// socket.setEncoding('utf8');
	socket.setNoDelay({ noDelay: true })

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
		console.log('Socket ended from other end');
		console.log('End data : ' + data);
	});

	socket.on('close', function (error) {
		var bread = socket.bytesRead;
		var bwrite = socket.bytesWritten;
		console.log('Bytes read : ' + bread);
		console.log('Bytes written : ' + bwrite);
		console.log('Socket closed');
		if (error) {
			console.log('Socket was closed because of transmission error');
		}
	});

	var q931buff;
	let tlv;

	function q931receive(payload) {
		var uu;
		console.log('Payload:', payload);
		var disc = payload[0];
		var d1 = payload.slice(0, 1)
		var d2 = payload.slice(1, 2)
		var d3 = payload[2]
		console.log({ d3 })
		var d4 = 128 + parseInt(d3)
		var buffd3 = Buffer.alloc(1)
		buffd3.writeUInt8(d4)
		console.log({ buffd3 })
		//console.log(disc)
		var calv_len = payload[1];
		console.log(parseInt(calv_len))
		var cal_value = payload.slice(3, 2 + parseInt(calv_len))
		var payload1 = payload.slice(2 + parseInt(calv_len))
		var m_type = payload1[0]
		let tempBuffer = Buffer.from('07', 'hex')
		console.log("TLV:", tlv)
		q931buff = Buffer.concat([d1, d2, buffd3, cal_value, tempBuffer])

		buff_recur(payload1.slice(1))
	}

	function q931receiveCallProceeding(payload) {
		var uu;
		console.log('Payload:', payload);
		var disc = payload[0];
		var d1 = payload.slice(0, 1)
		var d2 = payload.slice(1, 2)
		var d3 = payload[2]
		console.log({ d3 })
		var d4 = 128 + parseInt(d3)
		var buffd3 = Buffer.alloc(1)
		buffd3.writeUInt8(d4)
		console.log({ buffd3 })
		//console.log(disc)
		var calv_len = payload[1];
		console.log(parseInt(calv_len))
		var cal_value = payload.slice(3, 2 + parseInt(calv_len))
		var payload1 = payload.slice(2 + parseInt(calv_len))
		var m_type = payload1[0]
		let tempBuffer = Buffer.from('02', 'hex')
		console.log("TLV:", tlv)
		q931buff = Buffer.concat([d1, d2, buffd3, cal_value, tempBuffer])

		buff_recur(payload1.slice(1))
	}

	console.log("Connected")
	console.log("Buffer size:", socket.bufferSize)

	var rport = socket.remotePort;
	var raddr = socket.remoteAddress;
	var rfamily = socket.remoteFamily;

	console.log('REMOTE Socket is listening at port ' + rport);
	console.log('REMOTE Socket ip : ' + raddr);
	console.log('REMOTE Socket is IP4/IP6 : ' + rfamily);



	let flag = 0
	let messageType = "connect"
	let tempData

	socket.on('data', gotMessage)

	function gotMessage(data) {
		tempData = data
		let buf = new Buffer.from(data.toString('utf8'))
		let byteString = buf.toString('hex')
		lengthOfMessage = byteString.slice(4, 8)
		var d = data.slice(0, 1)
		console.log(d.toString())
		console.log(data)
		b = Buffer.concat([b, data]);
		evaluate();
	}

	function evaluate() {
		if (messageType == "callProceeding") {
			for (; ;) {
				if (b.length < 4) {
					return;
				}
				var L = 256 * b[2] + b[3];
				if (b.length < L) {
					return;
				}
				payload = b.slice(4, L);
				b = b.slice(L);
				q931receiveCallProceeding(payload);
			}
		} else {
			for (; ;) {
				if (b.length < 4) {
					return;
				}
				var L = 256 * b[2] + b[3];
				if (b.length < L) {
					return;
				}
				payload = b.slice(4, L);
				b = b.slice(L);
				q931receive(payload);
			}
		}
	}

	b = Buffer.from('', 'hex');
	function buff_recur(buffer) {
		buff_handle(buffer, function (buff1, buff2) {
			console.log(buff1)
			console.log(buff2)
			if (buff2.length <= 0) {
				return
			} else {
				buff_recur(buff2)
			}
		})

		function buff_handle(buffer, callback) {
			var ie = buffer[0]
			var len_byte = buffer.toString('hex', 0, 1)
			var leng, ct = 0
			if (ie == 126) {
				leng = buffer.toString('hex', 1, 3)
				ct = 3
				console.log({ leng })
			}
			else if (ie < 126) {
				leng = buffer.toString('hex', 1, 2)
				ct = 2
				console.log('leng :', leng)
			}
			var datalen = parseInt(leng, 16)
			var first = buffer.slice(ct, ct + datalen)
			var second = buffer.slice(ct + datalen)
			// if (len_byte === '28') {
			// 	tlv = buffer.slice(0, ct + datalen)
			// 	q931buff = Buffer.concat([q931buff,tlv])
			// }
			console.log(len_byte)
			if (len_byte === '7e') {
				console.log("we got uu")
				if (messageType == "callProceeding") {
					let fileName = 'uuCallProceeding'
					fs.writeFile(fileName, first.slice(1), function (err) {
						console.log('done')
						xmlParse(fileName).then((result) => {
							console.log(result.conferenceID, result.guid)
							replaceIdCallProceeding(result.conferenceID, result.guid)
						})
					})
				} else if (messageType == 'connect') {
					let fileName = 'uu'
					fs.writeFile(fileName, first.slice(1), function (err) {
						console.log('done')
						xmlParse(fileName).then((result) => {
							console.log(result.conferenceID, result.guid)
							replaceId(result.conferenceID, result.guid)
						})
					})
				}
				this.uu = first.slice(1)
			}
			callback(first, second)
		}

		async function xmlParse(fileName) {
			return new Promise(async function (resolve, reject) {
				sudo.exec(["./ffasn1dump", "-I", "aper", "-O", "xer", "-i", "h235.asn", "-i", "h245.asn", "h225.asn", "H323-UserInformation", fileName], function (err, stderr, stdout) {
					// console.log("STDOUT:", stdout)
					// console.log("STDERR:", stderr)
					let parsedData = converter.toJson(stdout.toString(), { object: false })
					let newData = JSON.parse(parsedData)
					// console.log(parsedData)
					// console.log(newData)
					if (Object.keys(newData["H323-UserInformation"]["h323-uu-pdu"]["h323-message-body"])[0] == "setup") {
						let conferenceID = newData["H323-UserInformation"]["h323-uu-pdu"]["h323-message-body"]["setup"]["conferenceID"]
						console.log("Conference ID:", conferenceID)
						if (Object.keys(newData["H323-UserInformation"]["h323-uu-pdu"]["h323-message-body"])[0] == "setup") {
							let guid = newData["H323-UserInformation"]["h323-uu-pdu"]["h323-message-body"]["setup"]["callIdentifier"]["guid"]
							console.log("GUID:", guid)
							let values = { conferenceID: conferenceID, guid: guid }
							resolve(values)
						}
					}
				})
			})
		}

		let replaceId = (conferenceID, guid) => {
			fs.readFile('./connecth225.xml', (err, data) => {
				let targetParsedData = converter.toJson(data.toString(), { object: true })
				console.log("Parsed JSON data:", targetParsedData)
				targetParsedData['H323-UserInformation']['h323-uu-pdu']['h323-message-body']['connect']['h245Address']['ipAddress']['ip'] = 'B497032A'
				targetParsedData['H323-UserInformation']['h323-uu-pdu']['h323-message-body']['connect']['h245Address']['ipAddress']['port'] = '6000'
				targetParsedData['H323-UserInformation']['h323-uu-pdu']['h323-message-body']['connect']['conferenceID'] = conferenceID
				targetParsedData['H323-UserInformation']['h323-uu-pdu']['h323-message-body']['connect']['callIdentifier']['guid'] = guid
				console.log(json2xml(targetParsedData))
				let modFileName = 'modified_connect.xml'
				fs.writeFile(modFileName, json2xml(targetParsedData), function (err) {
					if (err) { console.log("Error", err) }
					else {
						xmlToAsn1(modFileName).then((result) => {
							// console.log(typeof(result))
							// console.log(Buffer.from(result))
							let bufLength = result.length
							let buf = Buffer.alloc(2)
							buf.writeUInt16BE(bufLength + 1)
							let buf2 = Buffer.alloc(1)
							buf2.writeUInt8(5)
							let buf3 = Buffer.alloc(1)
							buf3.writeUInt8(126)
							let finalBuf = Buffer.concat([buf3, buf, buf2])
							// console.log("BUFFER LENGTH:", finalBuf, bufLength)
							let sendBuffer = Buffer.concat([q931buff, finalBuf, Buffer.from(result)])
							// console.log(sendBuffer)
							tpktsend(sendBuffer)
						})
					}
				})
			})
		}

		let replaceIdCallProceeding = (conferenceID, guid) => {
			fs.readFile('./pcap/callProceedingH225.xml', (err, data) => {
				let targetParsedData = converter.toJson(data.toString(), { object: true })
				console.log("Parsed JSON data:", targetParsedData)
				targetParsedData['H323-UserInformation']['h323-uu-pdu']['h323-message-body']['callProceeding']['callIdentifier']['guid'] = guid
				console.log(json2xml(targetParsedData))
				let modFileName = 'modified_callProceeding.xml'
				fs.writeFile(modFileName, json2xml(targetParsedData), function (err) {
					if (err) { console.log("Error", err) }
					else {
						xmlToAsn1CallProceeding(modFileName).then((result) => {
							// console.log(typeof(result))
							// console.log(Buffer.from(result))
							let bufLength = result.length
							let buf = Buffer.alloc(2)
							buf.writeUInt16BE(bufLength + 1)
							let buf2 = Buffer.alloc(1)
							buf2.writeUInt8(5)
							let buf3 = Buffer.alloc(1)
							buf3.writeUInt8(126)
							let finalBuf = Buffer.concat([buf3, buf, buf2])
							// console.log("BUFFER LENGTH:", finalBuf, bufLength)
							let sendBuffer = Buffer.concat([q931buff, finalBuf, Buffer.from(result)])
							// console.log(sendBuffer)
							tpktsend(sendBuffer)
						})
					}
				})
			})
		}


		function tpktsend(message) {
			let finalLength = message.length
			let sendBuffer1 = Buffer.alloc(2)
			sendBuffer1.writeUInt16BE(768)
			let sendBuffer2 = Buffer.alloc(2)
			sendBuffer2.writeUInt16BE(finalLength + 4)
			let finalSendBuffer = Buffer.concat([sendBuffer1, sendBuffer2, message])
			console.log("WRITING TO SOCKET", finalSendBuffer)
			socket.write(finalSendBuffer, function (err) {
				console.log("Sent")
			})
		}

		async function xmlToAsn1(fileName) {
			console.log(fileName)
			return new Promise(async function (resolve, reject) {
				sudo.exec(["./ffasn1dump", "-I", "xer", "-O", "aper", "-i", "h235.asn", "-i", "h245.asn", "h225.asn", "H323-UserInformation", fileName, "workRun"], function (err, stderr, stdout) {
					console.log("STDOUT:", Buffer.from(stdout))
					// console.log("STDERR:", stderr)
					let fileBuffer = fs.readFileSync("./workRun")
					console.log(fileBuffer)
					resolve(fileBuffer)
				})
			})
		}

		async function xmlToAsn1CallProceeding(fileName) {
			console.log(fileName)
			return new Promise(async function (resolve, reject) {
				sudo.exec(["./ffasn1dump", "-I", "xer", "-O", "aper", "-i", "h235.asn", "-i", "h245.asn", "h225.asn", "H323-UserInformation", fileName, "workRunCallProceeding"], function (err, stderr, stdout) {
					console.log("STDOUT:", Buffer.from(stdout))
					// console.log("STDERR:", stderr)
					let fileBuffer = fs.readFileSync("./workRunCallProceeding")
					console.log(fileBuffer)
					resolve(fileBuffer)
				})
			})
		}
	}
}

var net = require('net');
var server = net.createServer();
server.on('connection', connectionhandler);
server.listen(1720, '0.0.0.0');
process.stdout.write("Ready.\n");