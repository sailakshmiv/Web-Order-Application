var app = require('express').createServer()
var io = require('socket.io').listen(app);
var mysql = require("mysql");

var HOST = "localhost";
var PORT = 3306;
var USER = "root";
var PASSWORD = "root";
var DATABASE = "test";

//Connect to database server
var connection = mysql.createClient(
{
	host: HOST,
	port: PORT,
	user: USER,
	password: PASSWORD,
});

//start using the proper database
connection.query('use ' + DATABASE);

//let the web server start handling requests
app.listen(8080);


/*
* Section: Handle web requests
* We should only be fielding requests for the core html elements, the stylesheet, images, and javascript, so ignore any other requests.
*/

app.get('/', function (req, res)
{
	res.sendfile(__dirname + '/menu.html');
});

app.get('/style.css', function (req, res)
{
	res.sendfile(__dirname + '/style.css');
});

app.get('/placeorder', function (req, res)
{
	res.sendfile(__dirname + '/order.html');
});

app.get('/manageorders', function (req, res)
{
	res.sendfile(__dirname + '/manage.html');
});

app.get('/img/:filename', function (req, res)
{
	res.sendfile('img/' + req.params.filename);
});

app.get('/js/:filename', function (req, res)
{
	res.sendfile('js/' + req.params.filename);
});


/*
* Section: Handle database requests
* We'll be fielding requests from clients at runtime, so let's act as the intermediary and provide db interaction based on packet names.
*/

var chat = io.of('/db').on('connection', function(socket)
{
	socket.on('search_customer_by_phone_number', function(data)
	{
		var values = [data.phone_number+'%'];
		connection.query('select * from customers where phone_number like ?', values,
			function(err, result, fields)
			{
				if (err) throw err;
				else
				{				
					socket.emit('customer_phone_number_search_results', result);
				}
			});
	});

	socket.on('search_driver_by_name', function(data)
	{
		var values = ['%'+data.name+'%'];
		connection.query('select * from drivers where name like ? AND name <> \"unassigned\"', values,
			function(err, result, fields)
			{
				if (err) throw err;
				else
				{
					socket.emit('driver_name_search_results', result);
				}
			});

		console.log(data.phone_number);
	});

	socket.on('search_by_customer_id', function(data)
	{
		var values = [data.id];
		connection.query('select * from customers where id = ?', values,
			function(err, result, fields)
			{
				if (err) throw err;
				else
				{
					socket.emit('customer_information_result', result);
				}
			});

		console.log(data.phone_number);
	});
	
	socket.on('update_customer_information', function(data)
	{
		var values = [data.name, data.phone_number, data.street_address, data.city, data.zip_code, data.state, data.id];
		connection.query("UPDATE customers SET name = ?, phone_number = ?, street_address = ?, city = ?, zip_code = ?, state = ? WHERE id = ?", values,
			function(err, result, fields)
			{
				if (err) throw err;
			});
	});
	
	socket.on('update_delivery_status', function(data)
	{
		var values = [data.driver_id, data.delivery_status, data.id];
		connection.query("UPDATE orders SET driver_id = ?, delivery_status = ? WHERE id = ?", values,
			function(err, result, fields)
			{
				if (err) throw err;
			});
	});	

	socket.on('complete_delivery', function(data)
	{
		var values = [data.id];
		connection.query("UPDATE orders SET delivery_status = 3 WHERE id = ?", values,
			function(err, result, fields)
			{
				if (err) throw err;
			});
	});	
	
	socket.on('create_customer_information', function(data)
	{
		var values = [data.name, data.phone_number, data.street_address, data.city, data.zip_code, data.state];
		connection.query("INSERT INTO customers (name, phone_number, street_address, city, zip_code, state) VALUES (?, ?, ?, ?, ?, ?)", values,
			function(err, result, fields)
			{
				if (err) throw err;
				else
				{
					socket.emit('customer_creation_result', result);
				}
			});
	});

	socket.on('create_order_information', function(data)
	{
		var values = [data.customer_id, data.delivery_status, data.driver_id, data.delivery_street_address, data.delivery_city, data.delivery_zip_code, data.delivery_state];
		connection.query("INSERT INTO orders (customer_id, delivery_status, driver_id, delivery_street_address, delivery_city, delivery_zip_code, delivery_state) VALUES (?, ?, ?, ?, ?, ?, ?)", values,
			function(err, result, fields)
			{
				if (err) throw err;
			});
	});

	socket.on('request_delivery_statuses', function(data)
	{
		connection.query("SELECT id,status from delivery_statuses",
			function(err, result, fields)
			{
				if (err) throw err;
				else
				{
					socket.emit('receive_delivery_statuses', result);
				}
			});
	});

	socket.on('request_customer_names', function(data)
	{
		connection.query("SELECT id,name from customers",
			function(err, result, fields)
			{
				if (err) throw err;
				else
				{
					socket.emit('receive_customer_names', result);
				}
			});
	});
	
	socket.on('request_driver_names', function(data)
	{
		connection.query("SELECT id,name from drivers",
			function(err, result, fields)
			{
				if (err) throw err;
				else
				{
					socket.emit('receive_driver_names', result);
				}
			});
	});	

	socket.on("search_orders_by_status", function(data)
	{
		var values = [data.status]
		connection.query("SELECT * FROM orders WHERE delivery_status = ?", values,
			function(err, result, fields)
			{
				if (err) throw err;
				else
				{
					socket.emit('order_search_results', result);
				}
			});
	});
});
