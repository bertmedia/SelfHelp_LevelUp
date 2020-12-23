import { check } from 'meteor/check';
import { TaskCollection } from '/imports/db/TaskCollection';

Meteor.methods({
    'tasks.insert'(text) {
        check(text, String);

        if(!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        TaskCollection.insert({
            text,
            createdAt: new Date,
            userId: this.userId,
        })
    },

    'tasks.remove'(taskId) {
        check(taskId, String);

        if(!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        TaskCollection.remove(taskId);
    },

    'tasks.setIsChecked'(taskId, isChecked) {
        check(taskId, String);
        check(isChecked, Boolean);

        if(!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        TaskCollection.update(taskId, {
            $set: {
                isChecked
            }
        });
    }
});