export const AddTaskDialog = ({task, dialogStatus, onToggleDialog, onSubmitTask, onTitleChange, onDescriptionChange}) => {
    return (
        <div className={`add-task-dialog ${dialogStatus}`}>
          <div className="dialog-title">
            <h2>Add new task</h2>
            <span onClick={onToggleDialog} className="close-btn">
              x
            </span>
          </div>
          <div className="dialog-body">
            <form onSubmit={onSubmitTask}>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  className="form-input"
                  value={task.title}
                  onChange={(event) => {
                    onTitleChange(event)
                  }}
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  className="form-input"
                  value={task.description}
                  onChange={(event) => {
                    onDescriptionChange(event);
                  }}
                />
              </div>
              <input type="submit" value="Save" />
            </form>
          </div>
        </div>
    )
}