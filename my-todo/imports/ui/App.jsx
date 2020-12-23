import React, { useState, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TaskCollection } from '/imports/api/TaskCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';


const toggleChecked = ({ _id, isChecked }) => {
  TaskCollection.update(_id, {
    $set: {
      isChecked: !isChecked
    }
  })
};

const deleteTask = ({ _id }) => TaskCollection.remove(_id);

export const App = () => {
  const user = useTracker(() => Meteor.user());
  const [hideCompleted, setHideCompleted] = useState(false);
  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { hideCompletedFilter, userFilter };

  const tasks = useTracker(() => {
    if(!user) {
      return [];
    }

    return TaskCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: {createdAt: -1},
      }).fetch()
  });

  const pendingTaskCount = useTracker(() => {
    if (!user) {
      return 0;
    }

    return TaskCollection.find(pendingOnlyFilter).count();
  });

  const pendingTaskTitle = `${pendingTaskCount ? ` (${pendingTaskCount})` : ''
    }`;

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div class="app-header">
            <h1>Item List {pendingTaskTitle}</h1>
          </div>
        </div>
      </header>

      <div className="main">
        {user ? (
          <Fragment>
            <TaskForm user={user}/>
            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? "Show All" : "Hide Completed"}
              </button>
            </div>

            <ul className="tasks">
              {tasks.map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={toggleChecked}
                  onDeleteClick={deleteTask}
                />
              ))}
            </ul>
          </Fragment>
        )
          : (
            <LoginForm />
          )}
      </div>

    </div>
  );
};
