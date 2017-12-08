import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(){
    super();
    this.state = {
      students: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    axios.get('http://localhost:3002/getStudents')
      .then((response)=>{
        console.log(response.data)
        this.setState({
          students: response.data
        })
      })
  }

  handleSubmit(event){
    event.preventDefault();
    const studentName = document.getElementById('new-student').value;
    console.log(studentName)
    // we want to send studentName to the server.
    // we can not use get. we need to use post
    // there is an axios.post and there is axios
    // Axios always returns a promise, so we will 
    // send data to the express server and wait for a JSON response
    // when we get it, we will move forward
    axios({
      method: "POST",
      url: "http://localhost:3002/addStudent",
      data: {
        studentName: studentName
      }
    }).then((studentData)=>{
      console.log(studentData);
      this.setState({
        students: studentData.data
      })
    })
  }


  render() {
    var studentsArray = this.state.students.map((student, index)=>{
      return (<li key={index}>{student.name}</li>)
    })

    return (
      <div className="App">
        <form onSubmit = {this.handleSubmit}>
          <input type="text" id="new-student" placeholder="New Student" />
          <button type="submit">Add Student</button>
        </form>
        <ul>
          {studentsArray}
        </ul>
      </div>
    );
  }
}

export default App;
