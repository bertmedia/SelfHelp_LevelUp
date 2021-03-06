import React, { useState, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TaskCollection } from '/imports/db/TaskCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';


const toggleChecked = ({ _id, isChecked }) => {
  Meteor.call('tasks.setIsChecked', _id, !isChecked);
};

const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);

export const App = () => {
  const user = useTracker(() => Meteor.user());
  const [hideCompleted, setHideCompleted] = useState(false);
  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  const { tasks, pendingTaskCount, isLoading } = useTracker(() => {
    const noDataAvailable = { tasks: [], pendingTaskCount: 0 };

    if (!Meteor.user()) {
      return noDataAvailable;
    }

    const handler = Meteor.subscribe('tasks');

    if(!handler.ready()) {
      return { ...noDataAvailable, isLoading: true};
    }

    const tasks = TaskCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter, 
      {
        sort: {createdAt: -1},
      }
    ).fetch();

    const pendingTaskCount = TaskCollection.find(pendingOnlyFilter).count();

    return { tasks, pendingTaskCount };
  });

  /*
  const pendingTaskCount = useTracker(() => {
    if (!user) {
      return 0;
    }

    return TaskCollection.find(pendingOnlyFilter).count();
  });*/

  const logout = () => Meteor.logout();

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
            <div className="user" onClick={logout}>
              {user.username}
            </div>
            <TaskForm />
            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? "Show All" : "Hide Completed"}
              </button>
            </div>

            {isLoading && <div className="loading">loading...</div>}

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
