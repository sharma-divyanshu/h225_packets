const fs = require("fs"),
  parseString = require("xml2js").parseString;
  xml2js = require("xml2js");
fs.readFile("connecth225.xml", "utf-8", function(err, data) {
  if (err) console.log(err);
  // we log out the readFile results
  console.log(data);
  //     // we then pass the data to our method here
         parseString(data, function(err, result) {
             if (err) console.log(err);
                 // here we log the results of our xml string conversion
                  console.log (result['H323-UserInformation']['h323-uu-pdu'][0]['h323-message-body'][0]['connect'][0]['H245Address'][0])
                   result['H323-UserInformation']['h323-uu-pdu'][0]['h323-message-body'][0]['connect'][0]['conferenceID'][0] = 'FFFFFFFFF';
		   result['H323-UserInformation']['h323-uu-pdu'][0]['h323-message-body'][0]['connect'][0]['callIdentifier'][0]['guid'][0] = 'FFFFFFFF';
		var builder = new xml2js.Builder();
    var xml = builder.buildObject(result);

    fs.writeFile("edited-test.xml", xml, function(err, data) {
      if (err) console.log(err);

      console.log("successfully written our update xml to file");
    });
		  
     });
  });
