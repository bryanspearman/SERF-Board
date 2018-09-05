const mongoose = require('mongoose');
const faker = require('faker');
const { User } = require('../app/user.model.js');
const { Post } = require('../app/post.model.js');
const { logInfo, logWarn, logSuccess, logError } = require('../app/logger.js');

module.exports = {
    createMockDatabase,
    deleteMockDatabase,
    getNewFakePost
};

// Populates the database with 10 records
function createMockDatabase() {
    logInfo('Seeding mock database...');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            title: faker.name.title(),
            response: faker.lorem.sentence(),
            receivedMessage: faker.lorem.text()
        });
    }
    return Post.insertMany(seedData)
        .then(() => {
            logSuccess('Mock database created.');
        })
        .catch(err => {
            logError(err);
        });
}

function deleteMockDatabase() {
    return new Promise((resolve, reject) => {
        logWarn('Deleting mock database ...');
        mongoose.connection
            .dropDatabase()
            .then(result => {
                logSuccess('Mock database deleted.');
                resolve(result);
            })
            .catch(err => {
                logError(err);
                reject(err);
            });
    });
}

function getNewFakePost() {
    return {
        title: faker.name.title(),
        response: faker.lorem.sentence(),
        receivedMessage: faker.lorem.text(),
        created: faker.date.past()
    };
}
