import React, {Component} from 'react';
import NavBar from './NavBar';
import axios from 'axios';

class ToDo extends Component{
	constructor(){
		super();
		this.state = {
			taskList: []
		}
		this.addNewTask = this.addNewTask.bind(this);
		this.deleteTask = this.deleteTask.bind(this);
		this.curentTasks = this.curentTasks.bind(this);
	}

	
	componentDidMount(){
		this.curentTasks()
	}

	curentTasks(){
		axios({
			method: "GET",
			url: "http://localhost:3002/"
		}).then((taskList)=>{
			console.log(taskList.data);
			this.setState({
				taskList: taskList.data
			})
		})
	}



	deleteTask(taskId){
		console.log('delete this task with this Id: ', taskId)
		axios({
			method: "POST",
			url: "http://localhost:3002/deleteTask",
			data: {
				taskId : taskId
			}
		}).then((taskData)=>{
			console.log(taskData.data)
			this.setState({
				taskList: taskData.data
			})
		})
	}

	addNewTask(event){
		event.preventDefault();
		const task = document.getElementById('new-task').value;
		const taskDate = document.getElementById('new-task-date').value;
		console.log(task, taskDate);
		axios({
			method: "POST",
			url: "http://localhost:3002/addTask",
			data:{
				taskName: task,
				taskDate: taskDate
			}
		}).then((taskData)=>{
			console.log(taskData.data);
			this.setState({
				taskList: taskData.data
			})
		})
	}

	render(){
		var taskArray = this.state.taskList.map((task,index)=>{
			task.taskDate = new Date(task.taskDate);//this is how produce right date format
			return(
				<tr key={index}>
					<td>{task.taskName} - {task.taskDate.toDateString()}</td>
					<td><button onClick={()=>{
					this.deleteTask(task.id)}}
					 className="btn red">
					 DELETE</button></td>
					<td><button className="btn blue">EDIT</button></td>
				</tr>
			)
		})
		return(
			<div className="to-do-app">
				<NavBar />
				<div className="section no-pad-bot" id="index-banner">
					<div className="container">
					<h1 className="header center orange-text">To-Do List</h1>
						<div className="row center">
							<h5 className="header col s12 light">Made with React and Express</h5>
						</div>
					</div>
				</div>
				<div className="container">
					<form className="add-box" onSubmit={this.addNewTask}>
						<input type="text" id="new-task" placeholder="New Task" />
						<input type="date" id="new-task-date" />
						<button type="submit" className="btn btn-primary">Add Task</button>
					</form>
					<table className = "table table-bordered">
						<thead>
							<tr>
								<th>Task</th>
								<th>Delete</th>
								<th>Edit</th>
							</tr>
						</thead>
						<tbody>
							{taskArray}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}

export default ToDo;