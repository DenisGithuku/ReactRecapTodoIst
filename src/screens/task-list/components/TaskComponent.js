import "../../../App.css";

const TaskComponent = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const task_status = task.completed ? "completed" : "pending";
  return (
    <div className={`task-component ${task_status}`}>
      <div className="left">
        <input
          type="checkbox"
          value={task.completed}
          onChange={onToggleComplete}
        />
        <div className="task-content">
          <h4>{task.title}</h4>
          <span>{task.description}</span>
        </div>
      </div>
      <div className="action-btns">
        <button className="action-btn edit-btn" onClick={onEdit}>
          Edit
        </button>
        <button className="action-btn delete-btn" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskComponent;
