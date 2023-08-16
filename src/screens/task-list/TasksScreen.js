import { Component } from "react";
import "../../App.css";
import FirebaseApp from "../../util/FirebaseInit";
import { FirebaseConverter, TaskModel } from "../../model/TaskModel";
import {
  getFirestore,
  getDocs,
  collection,
  doc,
  addDoc,
  setDoc
} from "firebase/firestore";

class TasksScreen extends Component {
  constructor(props) {
    super(props);
    this.db = undefined;
    this.state = {
      tasks: [],
      dialogIsVisible: false,
      userMessage: {
        message: "",
        isError: false
      },
      new_task: {
        title: "",
        description: "",
        completed: false,
      },
    };
    this.getTasks = this.getTasks.bind(this);
    this.addTask = this.addTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.onSubmitTask = this.onSubmitTask.bind(this)
    this.dismissMessage = this.dismissMessage.bind(this)
    this.toggleDialog = this.toggleDialog.bind(this)
  }

  componentDidMount() {
    // establish connection to db
    this.db = getFirestore(FirebaseApp);
    this.getTasks(this.db);
  }

  clearTaskForm() {
    this.setState({
      new_task: {
        title: "",
        description: "",
        completed: false,
      },
    })
  }

  toggleDialog() {
    this.setState({
      dialogIsVisible: !this.state.dialogIsVisible
    })
  }

  async addTask(db) {
    try {
      const taskRef = doc(collection(db, "tasks"));
      const { title, description, completed } = this.state.new_task;
      const task = new TaskModel(
        taskRef.id,
        title,
        description,
        Date.now(),
        completed
      );
      await setDoc(taskRef, FirebaseConverter.toFirestore(task))
      this.showUserMessage("Added new task successfully", false)
      this.toggleDialog()
      this.getTasks(this.db)
    } catch (err) {
      console.log(err);
    }
  }

  async getTasks(db) {
    try {
      const taskSnapshot = await getDocs(collection(db, "tasks"))
      const tasks = taskSnapshot.docs.map((data, options) => {
        return FirebaseConverter.fromFirestore(data,options)
      })
      this.setState({
        tasks: tasks,
      });
    } catch (err) {
      console.log(err);
    }
  }

  handleTitleChange(event) {
    const new_task = this.state.new_task;
    new_task.title = event.target.value;
    this.setState({
      new_task: new_task,
    });
  }

  handleDescriptionChange(event) {
    const new_task = this.state.new_task;
    new_task.description = event.target.value;
    this.setState({
      new_task: new_task,
    });
  }

  showUserMessage(message, isError) {
    const userMessage = {
      message,
      isError
    }
    this.setState({
      userMessage: userMessage,
    })

    setTimeout(() => {
      this.dismissMessage()
    }, 4000)
  }

  dismissMessage() {
    this.setState({
      userMessage: {
        message: "",
        isError: false
      }
    })
  }

  onSubmitTask(event) {
    event.preventDefault()
    const formIsValid =
      this.state.new_task.title.trim().length > 0 &&
      this.state.new_task.description.trim().length > 0;

    if (!formIsValid) {
      this.showUserMessage("Title or description cannot be empty", true)
      return
    }
    this.addTask(this.db)
  }

  async deleteTask() {}

  async updateTask() {}

  render() {
    const messageType = this.state.userMessage.isError ? "error" : "info"
    const messageCardStatus = this.state.userMessage.message.length > 0 ? "visible" : ""
    const dialogStatus = this.state.dialogIsVisible ? "visible" : ""
    return (
      <div className="tasks-screen">
        <button onClick={this.toggleDialog}>Add Task</button>
        <div className={`add-task-dialog ${dialogStatus}`}>
          <div className="dialog-title">
            <h2>Add new task</h2>
            <span onClick={this.toggleDialog} className="close-btn">x</span>
          </div>
          <div className="dialog-body">
            <form onSubmit={this.onSubmitTask}>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  className="form-input"
                  value={this.state.new_task.title}
                  onChange={(event) => {
                    this.handleTitleChange(event);
                  }}
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  className="form-input"
                  value={this.state.new_task.description}
                  onChange={(event) => {
                    this.handleDescriptionChange(event);
                  }}
                />
              </div>
              <input type="submit" value="Save" />
            </form>
          </div>
        </div>
        <div className={`message-card ${messageType} ${messageCardStatus}`}>
          <span>{this.state.userMessage.message}</span>
        </div>
        <h2>There are {this.state.tasks.length} tasks</h2>
      </div>
    );
  }
}

export default TasksScreen;
