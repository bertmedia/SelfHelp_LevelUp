import { Meteor } from 'meteor/meteor';
import { TaskCollection } from '/imports/api/TaskCollection';
import { Accounts } from 'meteor/accounts-base';


const insertTask = (taskText, user) => TaskCollection.insert({
  text: taskText,
  userId: user._id,
  createdAt: new Date()
});

const SEED_USERNAME = 'admin';
const SEED_PASSWORD = 'test';

Meteor.startup(() => {
  if(!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if(TaskCollection.find().count() === 0) {
    [
      'First Item',
      'Second Item',
      'Third Item',
      'Fourth Item',
    ].forEach(taskText => insertTask(taskText, user))
  }

});
