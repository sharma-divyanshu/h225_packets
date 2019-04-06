const buff = "68"
var buff1 = Buffer.from('h')
var comp =  buff1.slice(0,1).toString('hex')
console.log(comp)
if(comp == buff){
	console.log('match')
}
