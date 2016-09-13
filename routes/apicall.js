var request = require('request');
var inspect = require('eyespect').inspector();

function apiCall(query, callback){
  var postData = {
                    "statements": [
                      {
                        "statement": query,
                        "resultDataContents": [
                          "graph"
                        ],
                        "includeStats": true
                      }
                    ]
                  };

      var options = {
        method: 'post',
        body: postData,
        json: true,
        url: 'http://'+ process.env.DB_USER +':'+ process.env.DB_PASS +'@localhost:7474/db/data/transaction/commit'
      };

      request(options, function (err, result, body) {
        if (err) {
          inspect(err, 'error posting json')
          return
        }
        var headers = result.headers
        var statusCode = result.statusCode
        inspect(headers, 'headers')
        inspect(statusCode, 'statusCode')
        inspect(body, 'body')
        callback(body.results[0].data);
      });
};

module.exports = apiCall;