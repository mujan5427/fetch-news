var mysql = require('mysql')

var connection_db = function(sql_statment) {
  
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'justinho',
    password : '',
    database : 'c9'
  });
    
  connection.connect()
    
  connection.query(sql_statment, function (err, rows, fields) {
    if (err) throw err
  
    console.log('result : ' + rows[0])
  })
  
  connection.end()
  
}
 
module.exports = connection_db;