let file1 = process.argv[2]
let file2 = process.argv[3]
let file3 = process.argv[4]

let fs = require('fs')

fs.readFile(file1, function(err, data) {
    if(err) {
        console.log("Error:", err)
    } else {
        fs.readFile(file2, function(err, data1) {
            if(err) {
                console.log("Error:", err)
            } else {
                let buffer = Buffer.concat([data, data1])
                fs.writeFile(file3, buffer, function(err) {
                    if(err) {
                        console.log(err)
                    }
                })
            }
        })
    }
})