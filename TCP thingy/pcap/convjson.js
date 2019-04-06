let converter = require('xml2json')
let fs = require('fs')

fs.readFile('connecth225.xml', (err, data) => {
    let parsedData = converter.toJson(data.toString(), {object:true} )
    console.log((parsedData))
})
