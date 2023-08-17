export class TaskModel {
    constructor(id, title, description, timestamp, completed){
        this.id = id
        this.title = title
        this.description = description
        this.timestamp = timestamp
        this.completed = completed
    }
}

export const FirebaseConverter = {
    toFirestore: (taskModel) => {
        return {
            id: taskModel.id,
            title: taskModel.title,
            description: taskModel.description,
            timestamp: taskModel.timestamp,
            completed: taskModel.completed
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        return new TaskModel(
            data.id,
            data.title,
            data.description,
            data.timestamp,
            data.completed
        )
    }
}


