import { Component } from "react";
import "../../App.css";
import FirebaseApp from "../../util/FirebaseInit";
import { FirebaseConverter, TaskModel } from "../../model/TaskModel";
import TaskComponent from "./components/TaskComponent";
import FilterComponent from "./components/FilterComponent";
import { AddTaskBtn } from "./components/AddTaskBtn";
import TasksDataSource from "./../../data/TasksDataSource";
import { AddTaskDialog } from "./components/AddTaskDialog";
import { MessageCard } from "./components/MessageCard";
import { TaskList } from "./components/TaskList";

class TasksScreen extends Component {
  constructor(props) {
    super(props);
    this.taskDatasource = null;
    this.state = {
      category: "all",
      tasks: [],
      dialog: {
        isNewTask: true,
        dialogIsVisible: false,
      },
      userMessage: {
        message: "",
        isError: false,
      },
      new_task: {
        title: "",
        description: "",
        completed: false,
      },
    };
    this.getTasks = this.getTasks.bind(this);
    this.addTask = this.addTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.onSubmitTask = this.onSubmitTask.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onToggleComplete = this.onToggleComplete.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
  }

  componentDidMount() {
    // create reference to data source
    this.taskDatasource = new TasksDataSource();
    this.getTasks();
  }

  componentWillUnmount() {
    // destroy reference to data source
    this.taskDatasource = null;
  }

  clearTaskForm() {
    this.setState({
      new_task: {
        title: "",
        description: "",
        completed: false,
      },
    });
  }

  toggleDialog() {
    this.setState({
      dialog: {
        isNewTask: true,
        dialogIsVisible: !this.state.dialog.dialogIsVisible,
      },
    });
  }

  addTask() {
    const { title, description, completed } = this.state.new_task;
    const task = new TaskModel(title, description, Date.now(), completed);
    this.taskDatasource.addTask(task);
    this.showUserMessage("Added new task successfully", false);
    this.toggleDialog();
  }

  async getTasks() {
    try {
      let tasks = await this.taskDatasource.getTasks(this.state.category);
      this.setState({
        tasks: tasks,
      });
      console.log(tasks)
    } catch (err) {
      console.log(err)
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
      isError,
    };
    this.setState({
      userMessage: userMessage,
    });

    setTimeout(() => {
      this.dismissMessage();
    }, 4000);
  }

  dismissMessage() {
    this.setState({
      userMessage: {
        message: "",
        isError: false,
      },
    });
  }

  onSubmitTask(event) {
    event.preventDefault();
    const formIsValid =
      this.state.new_task.title.trim().length > 0 &&
      this.state.new_task.description.trim().length > 0;

    if (!formIsValid) {
      this.showUserMessage("Title or description cannot be empty", true);
      return;
    }

    if (this.state.dialog.isNewTask) {
      this.addTask();
    } else {
      this.updateTask();
    }
  }

  updateTask() {
    const task = this.state.new_task;
    this.taskDatasource.updateTask(task);
    this.toggleDialog();
    this.getTasks(this.db);
  }

  onToggleComplete(id) {
    const task = this.state.tasks.find((task) => {
      return task.id === id ? task : undefined;
    });
    task.completed = !task.completed;
    this.setState({
      new_task: task,
    });
  }

  onEdit(id) {
    const task = this.state.tasks.find((task) => {
      return task.id === id ? task : undefined;
    });
    this.setState({
      new_task: task,
      dialog: {
        isNewTask: false,
        dialogIsVisible: !this.state.dialog.dialogIsVisible,
      },
    });
  }

  async onChangeCategory(category) {
    try {
      
      let tasks = await this.taskDatasource.getTasks(category);
      this.setState({
        category: category,
        tasks: tasks,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const taskListJsx = this.state.tasks.map((task) => {
      return (
        <li key={task.id}>
          <TaskComponent
            task={task}
            onEdit={() => this.onEdit(task.id)}
            onDelete={() => {
              this.taskDatasource.deleteTask(task.id);
            }}
            onToggleComplete={() => {
              this.onToggleComplete(task.id);
            }}
          />
        </li>
      );
    });

    const messageType = this.state.userMessage.isError ? "error" : "info";
    const messageCardStatus =
      this.state.userMessage.message.length > 0 ? "visible" : "";
    const dialogStatus = this.state.dialog.dialogIsVisible ? "visible" : "";
    return (
      <div className="tasks-screen">
        <div className="top-bar">
          <AddTaskBtn onToggleDialog={this.toggleDialog} />
          <FilterComponent
            selectedCategory={this.state.category.replace(
              this.state.category.charAt(0),
              this.state.category.charAt(0).toUpperCase()
            )}
            onChangeCategory={(category) => {
              this.onChangeCategory(category);
            }}
          />
        </div>
        <AddTaskDialog
          dialogStatus={dialogStatus}
          onToggleDialog={this.toggleDialog}
          onSubmitTask={this.onSubmitTask}
          task={this.state.new_task}
          onTitleChange={this.handleTitleChange}
          onDescriptionChange={this.handleDescriptionChange}
        />

        <MessageCard
          userMessage={this.state.userMessage}
          messageType={messageType}
          messageCardStatus={messageCardStatus}
        />
        <TaskList tasks={taskListJsx} />
      </div>
    );
  }
}

export default TasksScreen;
