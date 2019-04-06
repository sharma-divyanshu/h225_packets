const converter = require('xml2json')
let fs = require('fs')
var json2xml = require('json2xml');
fs.readFile('./connecth225.xml', (err, data) => {
   let parsedData = converter.toJson(data.toString(), {object:true})
    console.log(parsedData)
var respJson = parsedData	
	json_recur(parsedData,'',respJson)
 
 //	 console.log(json2xml(parsedData))
})
function json_recur(obj,trace,respJson) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
		if(property=='guid'){
			console.log({property})
			console.log(obj[property])
			console.log({trace})
		}
		if(property=='ipAddress'){
                        console.log({property})
                        console.log(obj[property])
			console.log({trace})
			console.log(`${respJson}${trace}`)
			//obj[property].port = 5000
                }
		if(property=='conferenceID'){
                        console.log({property})
                        console.log(obj[property])
			console.log({trace})
                }
                if (typeof obj[property] == "object") {
			trace = trace + `[${property}]`
			json_recur(obj[property],trace,respJson);
                } else {
			console.log('endin da loopin')
                }
            }
        }
    }
function handleconnect(json,callback){
	fs.readFile('./connecth225.xml', (err, data) => {
   	let parsedData = converter.toJson(data.toString(), {object:true})
    	console.log(parsedData)
        json_recur(parsedData)
        var respJson = parsedData
	
 //      console.log(json2xml(parsedData))
       })
 //


}
