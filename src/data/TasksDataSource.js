import FirebaseApp from "../util/FirebaseInit";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { FirebaseConverter } from "../model/TaskModel";
class TasksDataSource {
  constructor() {
    this.db = getFirestore(FirebaseApp);
  }

  async addTask(task) {
    try {
      const taskRef = doc(collection(this.db, "tasks"));
      task.id = taskRef.id;
      await setDoc(taskRef, FirebaseConverter.toFirestore(task));
      this.getTasks();
    } catch (err) {
      console.log(err);
    }
  }

  async deleteTask(id) {
    try {
      await deleteDoc(doc(this.db, "tasks", id));
      this.getTasks();
      this.getTasks(this.db);
    } catch (err) {
      console.log(err);
    }
  }

  async updateTask(task) {
    try {
      const data = FirebaseConverter.toFirestore(task);
      const taskRef = doc(this.db, "tasks", task.id);
      await setDoc(taskRef, data);
    } catch (err) {
      console.log(err);
    }
  }

  async getTasks(category) {
    try {
      const tasksSnapshot = await getDocs(collection(this.db, "tasks"));
      let tasks = tasksSnapshot.docs.map((data, options) => {
        return FirebaseConverter.fromFirestore(data, options);
      });
      tasks = tasks.filter((task) => {
        let predicate = false;
        if (category === "completed") {
          predicate = task.completed === true;
        } else if (category === "all") {
          predicate = true;
        } else if (category === "pending") {
          predicate = task.completed !== true;
        }
        return predicate;
      });
      return tasks;
    } catch (err) {
      console.log(err);
    }
  }

  getTaskById() {}
}

export default TasksDataSource;
