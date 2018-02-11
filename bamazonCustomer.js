//node packages required for this program

var mysql = require ("mysql");

//mysql connection info - please update your user information if needed
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "temp",
    database: "bamazon"
  });

//connect to MYSQL and console out status
connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected successfully as id " + connection.threadId);
});

//goal 1 - display all items for sale
connection.query("SELECT * FROM products ORDER BY id", function(err, results) {
    if (err) {
        console.error("error: " + err);
        return;
    } else {
        for (var i = 0; i < results.length; i++){
            console.log("id:" + results[i].id + " product:" + results[i].product_name + " price: $" + results[i].price)
        }
    }
});