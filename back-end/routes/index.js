var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config')
console.log(config)
var connection = mysql.createConnection(config)
connection.connect();


router.get('/', function(req, res){
	const selectQuery = `SELECT * FROM tasks`;
	connection.query(selectQuery, (error, results)=>{
		if(error){
			throw (error)
		}else{
			var newArray = results.filter((task, id)=>{
				console.log(task.timeStamp.toDateString())
				return (task.timeStamp.toDateString() == 'Thu Mar 29 2018')
			})
			console.log('this is what we are pulling from DB', newArray.length)
			res.json(results)
		}
	})
})

/* GET home page. */
router.get('/getStudents', function(req, res, next){
	const selectQuery = `SELECT * FROM students`;
	connection.query(selectQuery,(error, results)=>{
		if (error){
			console.log('error connecting to DB');
		}else{
			console.log("connection to DB = success");
			res.json(results);
		}
	})
  
});

router.post('/deleteTask', function(req, res){
	const taskId = req.body.taskId;
	console.log('task to delete: ', taskId)
	const deleteQuery = `DELETE FROM tasks WHERE id=?`;
	var promiseOne = new Promise((resolve, reject)=>{
		connection.query(deleteQuery, [taskId], (error, result)=>{
			if (error){
				reject(error)
			}else{
				resolve({msg: "Success"});
			}
		})
	})
	promiseOne.then((data)=>{
		const selectQuery = `SELECT * FROM tasks;`;
		const resetAutoincrement = `ALTER TABLE tasks AUTO_INCREMENT = 1;`;
		connection.query(selectQuery, (error, results)=>{
			if (error){
				console.log(error)
			}else{
				console.log('results: ', results)
				if (results.length === 0){
					connection.query(resetAutoincrement)
				}
				res.json(results)
			}			
		})

	})
})

router.post('/addStudent',(req, res)=>{
	// this data is posted from axios in React (App.js)
	const studentName = req.body.studentName;
	var insertQuery = `INSERT INTO students (name) VALUES (?);`;
	var promiseOne = new Promise((resolve, reject)=>{
	connection.query(insertQuery, [studentName],(error)=>{
		if (error){
			reject(error);
		}else{
			resolve({msg:"Success"});
			// res.json({
			// 	newStudent: studentName - one way
			}
		})
	})
	// .then will run on our promise when it's finished
	promiseOne.then((data)=>{
		var promiseTwo = new Promise((resolve, reject)=>{
		const query = `SELECT * FROM students`;
		connection.query(query,(error, results)=>{
			if(error){
				reject(error);
			}else{
				resolve(results)
			}
			})
		})
		promiseTwo.then((studentsList)=>{
			res.json(studentsList)
		})
	})
	// res.json(req.body)
})


router.post('/addTask', (req, res)=>{
	const newTask = req.body.taskName;
	const taskDate = req.body.taskDate;
	var thePromise = new Promise((resolve, reject)=>{
		const insertQuery = `INSERT INTO tasks (taskName, taskDate) VALUES (?,?)`
		connection.query(insertQuery, [newTask, taskDate], (error)=>{
			if(error){
				reject(error)
			}else{
				resolve({msg: "success"})
			}
		})
	})
	thePromise.then((promiseResponse)=>{
		const selectQuery = `SELECT * FROM tasks`;
		connection.query(selectQuery, (error, results)=>{
			if(error){
				throw (error)
			}else{
				res.json(results)
			}
		})
	})
})

module.exports = router;
