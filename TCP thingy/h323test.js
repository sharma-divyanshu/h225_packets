function q931receive (payload) {



        console.log('Payload');



        console.log( payload );

	var disc = payload[0];

	//console.log(disc)

	var calv_len = payload[1];

	console.log(parseInt(calv_len))

	var cal_value = payload.slice(2,2+parseInt(calv_len))

	var payload = payload.slice(2+parseInt(calv_len))

	var m_type = payload.slice[0]

  var tlv = {}

  buff_recur(payload.slice[1],tlv)

	//var bcap_ie = rempay[1]

	//var bcap_len = ie_type(bcap_ie)  //change

	//var bcap = rempay.slice(2,2+bcal_len)

	//rempay  = rempay.slice(2+bcap_len)

	//var display_ie = rempay[0]

	//var display_len = ie_type(display_ie)

	//var display = rempay.slice(,2+display_len)



}







function connectionhandler (sock) {



        function datahandler(data) {



                b = Buffer.concat([b, data]);



                evaluate();



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



                        b = b.slice( L );







                        q931receive( payload );



                }



        }







        function closehandler() {



                return;



        }







        b = Buffer.from('', 'hex');



        sock.on( 'data', datahandler );



        sock.on( 'close', closehandler );



}



function buff_recur(buffer,tlv){

  buff_handle(buffer,function(buff1,buff2){

    console.log(buff1)

    console.log(buff2)

          if(buff2.length<=0){

            return

          }else {

            buff_recur(buff2,tlv)

          }

      })



}



function buff_handle(buffer,tlv,callback){

	var ie = buffer[0]

	var len_byte = buffer.toString('hex',0,1)

	var leng,ct = 0

	if(ie==126){

		leng = buffer.toString('hex',1,3)

		ct = 3

		console.log({leng})

	}

	else if(ie < 126){

		leng = buffer.toString('hex',1,2)

		ct = 2

		console.log('leng :',leng)

	}

	var datalen = parseInt(leng,16)

	var first = buffer.slice(ct,ct+datalen)

	var second = buffer.slice(ct+datalen)

  if(len_byte == '')

	callback(first,second,tlv)

}



var net = require( 'net' );



var server = net.createServer();







server.on( 'connection', connectionhandler );



server.listen( 1720, '0.0.0.0' );


