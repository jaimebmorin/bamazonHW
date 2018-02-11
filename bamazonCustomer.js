//node packages required for this program

var mysql = require ("mysql");
var inquirer = require ("inquirer");

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

//goal 1 - display all items for sale.
//I've decided to put my inquirer inside of this portion of code in order to validate the answers - I'm not certain how else to do it.
//I will research better options as this seems sort of sloppy to me.
//goal 2 - inquirer customer responses of what they want to buy.
//goal 3 - ensure the item is in stock.
//goal 4 - update MYSQL database.

connection.query("SELECT * FROM products ORDER BY id", function(err, results) {
    //goal 1:
    if (err) {
        console.error("error: " + err);
        return;
    } else {
        for (var i = 0; i < results.length; i++){
            console.log("id:" + results[i].id + " product:" + results[i].product_name + " price: $" + results[i].price)
        }
    }
    //goal 2:
    //First time writing my own data validation for the inquirer package:
    var questions = [
        {
            type: 'input',
            name: 'itemWanted',
            message: 'What item would you like to buy?',
            validate: function(idCheck) {
                for (var i = 0; i < results.length; i++){
                    if (idCheck === results[i].id) {return true}  
                }
                return 'Please enter a valid product id';  
            }
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many do you want to buy?',
            validate: function(value){
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a naumber';
            }
        }
    ]

    inquirer.prompt(questions).then(answers => {
        console.log('\nOrder request:');
        console.log(JSON.stringify(answers, null, '  '));
      });
});






