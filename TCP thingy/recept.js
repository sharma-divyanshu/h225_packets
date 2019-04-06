const fs = require('fs')
var redis = require('redis')
var flag1= 0 ,
    tcsACK = 0,
    msdACK = 0,
    tcs_data = 0,
    msd_data = 0

function connectionhandler (sock) {
        function datahandler(data) {
		console.log(flag1)
		if(flag1==0){
		console.log('hello')
		setTimeout(function(){
		var tcs = fs.readFileSync('./template/tcs')
		console.log({tcs})
		sock.write(tcs)
		
		var msd = fs.readFileSync('./template/msd')
		console.log({msd})
		sock.write(msd)

		},150)
		flag1 = 1
		}else {
		//console.log("DATA",data)
		b = Buffer.concat([b, data]);
                evaluate();
		}
		
                //let data1 = fs.readFileSync('./pcap/tpkt')
                //let data2 = fs.readFileSync('./pcap/q931')
                // let data3 = fs.readFileSync('./reversed')
//                let buff = Buffer.concat([data1, data2])
		//console.log({buff})
		//sock.write(buff)         
		//fs.writeFile('./6000',data,function(err){console.log("done") })       

        }

        function evaluate() {
                for( ; ; ) {

                        if (b.length < 4) {
                                return;
                        }
                        var L = 256*b[2] + b[3];
                        if (b.length < L) {
                                return;
                        }
                        payload = b.slice(4, L);
                        console.log('Payload');
                        console.log( payload );
                        b = b.slice( L );
			console.log({b})
			msgType(payload)

                }

        }

 

        function closehandler() {

                return;

        }

 

        b = Buffer.from('', 'hex');
	sock.on( 'connect', ()=>{
		console.log("SYN reccieved")	
	})
        sock.on( 'data', datahandler );
        sock.on( 'close', closehandler );


     function msgType(buffer){
	console.log({buffer})
	//var tcs_ack = buffer.toString('hex',0,3)
	var m_type = buffer.toString("hex",0,1)
	console.log({m_type})
	if( m_type == "21"){
		tcsACK = 1;
		var tcs_ack = fs.readFileSync('./template/tcsack')	
		sock.write(tcs_ack)
	}
	if( m_type  == "20"){
		msdACK = 1
		var msd_ack = fs.readFileSync('./template/msdack')
		sock.write(msd_ack)
	}
	if( m_type == "01"){
		msd_data = 1
	
	}
	if( m_type == "02"){
		tcs_data = 1
	}
	
	}
}

var net = require( 'net' );
var server = net.createServer();
server.on( 'connection', connectionhandler );
server.listen( process.argv[2], '0.0.0.0' );
process.stdout.write( "Ready.\n" );
