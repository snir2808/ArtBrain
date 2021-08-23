const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema



const userSchema = new Schema({
    userId: {type: String, required: true},
    timeForMessage: {type: Number, required: true},
    timeBetweenMessage: {type: Number, required: true},
    message: {type: Array, required: true}
})

userSchema.statics.create = (timeForMessage, timeBetweenMessage, clientId) => {
    let user = new UserModel({
        userId: clientId,
        timeForMessage: timeForMessage,
        timeBetweenMessage: timeBetweenMessage,
        message : [
            {
                type: 'info',
                text: 'Big sale next week',
                index: 0,
                read: false
            }, 
            {
                type: 'info',
                text: 'New auction next month',
                index: 1,
                read: false

            }, 
            {
                type: 'warning',
                text: 'Limited edition books for next auction',
                index: 2,
                read: false

            }, 
            {
                type: 'success',
                text: 'New books with limited edition coming next week',
                index: 3,
                read: false

            }, 
            {
                type: 'error',
                text: 'Last items with limited time offer',
                index: 4,
                read: false

            }
        ]
    });

    return user.save();
};

const UserModel = mongoose.model('newUser', userSchema)

module.exports = {
    Schema: userSchema,
    Model: UserModel
};