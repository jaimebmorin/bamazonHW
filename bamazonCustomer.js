//goal 1 - display all items for sale.
//goal 2 - inquirer customer responses of what they want to buy.
//goal 3 - ensure the item is in stock.
//goal 4 - update MYSQL database after sale purchase.


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

function runMain() {
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
    //First time writing my own data validation for the inquirer package
    //everything seems to be working :-) I've found a few ways to "break" the validation but for now this is good enough.
    //I will reasearch what is going on at a later date. I've found for the second question if I enter an integer followed
    //by a number(for example 2344E) it'll accept the answer; but for most other cases it works.
    var questions = [
        {
            type: 'input',
            name: 'itemWanted',
            message: 'What item would you like to buy?',
            validate: function(idCheck) {
                parseInt(idCheck);
                for (var i = 0; i < results.length; i++){
                    if (idCheck == results[i].id) {return true}  
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

    //use inquirer to ask the questions and receive the answers
    
    inquirer.prompt(questions).then(answers => {
    var itemNeeded = parseInt(answers.itemWanted) - 1;
    var quantNeeded = parseInt(answers.quantity);
    if (answers.quantity == 1) {
        console.log("You've ordered " + quantNeeded + " " + results[itemNeeded].product_name);
    } else {
        console.log("You've ordered " + quantNeeded + " " + results[itemNeeded].product_name + "s");
    }
    
    //goal 3:

    if (quantNeeded > results[itemNeeded].stock_quantity){
        console.log("We do not have that many units in stock; we only have " + results[itemNeeded].stock_quantity + " -Please try again")
        runMain();
    }

    var price = results[itemNeeded].price * quantNeeded;
    console.log("The total purchase price for your order is $" + price );

    //goal 4
    var remainder = results[itemNeeded].stock_quantity - quantNeeded;
    var idNeeded = results[itemNeeded].id;
    var sql = 'UPDATE products SET stock_quantity = ? WHERE id = ?'

    connection.query(sql, [remainder, idNeeded], function(err, results2) {
        console.log("our records have been updated and your order has been proccessed - thanks!")
    });

    setTimeout(function() {
    var questions2 = [
        {
            type: 'confirm',
            name: 'buyAgain',
            message: 'would you like to purchase another item?',
            default: false
        }
    ]
    inquirer.prompt(questions2).then(answers2 => {
        if (answers2.buyAgain) {runMain()}
        else {connection.end();};
    });
    }, 500);
    });
});
}


runMain();
