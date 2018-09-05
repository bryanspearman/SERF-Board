const express = require('express');
const passport = require('passport');
const postsRouter = express.Router();

const { logInfo, logError, logSuccess, logWarn } = require('./logger.js');
const { Post } = require('./post.model.js');
const { HTTP_STATUS_CODES } = require('./config.js');
const { filterObject, checkObjectProperties } = require('./helpers.js');

const jwtPassportMiddleware = passport.authenticate('jwt', { session: false });

// ### Create ###
postsRouter.post('/', jwtPassportMiddleware, (request, response) => {
    // Checks for required fields inside request body. If any are missing, responds with an error.
    const fieldsNotFound = checkObjectProperties(
        ['title', 'response'],
        request.body
    );
    if (fieldsNotFound.length > 0) {
        const errorMessage = `Bad Request: Missing the following fields from the request body: ${fieldsNotFound.join(
            ', '
        )}`;
        logError(errorMessage);
        return response
            .status(HTTP_STATUS_CODES.BAD_REQUEST)
            .json({ error: errorMessage });
    }

    logInfo('Creating your response document ...');
    Post.create({
        user: request.user._id,
        title: request.body.title,
        response: request.body.response,
        receivedMessage: request.body.receivedMessage
    })
        .then(post => {
            logSuccess('New response document created');
            return response
                .status(HTTP_STATUS_CODES.CREATED)
                .json(post.serialize());
        })
        .catch(err => {
            logError(err);
            response
                .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
                .json({ error: 'Internal server error' });
        });
});

// ### Read ###
postsRouter.get('/', jwtPassportMiddleware, (request, response) => {
    logInfo('Fetching previous responses ...');
    Post.find({ user: request.user._id })
        .then(posts => {
            logSuccess('Response collection fetched succesfully');
            response.json(posts.map(post => post.serialize()));
        })
        .catch(err => {
            logError(err);
            response
                .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
                .json({ error: 'Internal server error' });
        });
});

// ### Update ###
postsRouter.put('/:id', jwtPassportMiddleware, (request, response) => {
    // Checks for required fields inside request body. If any are missing, responds with an error.
    const fieldsNotFound = checkObjectProperties(
        ['title', 'response'],
        request.body
    );
    if (fieldsNotFound.length > 1) {
        const errorMessage = `Bad Request: Missing the following fields from the request body: ${fieldsNotFound.join(
            ', '
        )}`;
        logError(errorMessage);
        return response
            .status(HTTP_STATUS_CODES.BAD_REQUEST)
            .json({ error: errorMessage });
    }

    logInfo('Updating response document ...');
    const fieldsToUpdate = filterObject(
        ['title', 'response', 'receivedMessage'],
        request.body
    );

    Post.findByIdAndUpdate(
        request.params.id,
        { $set: fieldsToUpdate },
        { new: true }
    )
        .then(() => {
            logSuccess('Response document updated succesfully');
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(err => {
            logError(err);
            return response
                .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
                .json({ error: 'Internal server error' });
        });
});

// ### Delete ###
postsRouter.delete('/:id', jwtPassportMiddleware, (request, response) => {
    logInfo('Deleting response document ...');
    Post.findByIdAndRemove(request.params.id)
        .then(() => {
            logSuccess('Deleted response document succesfully');
            response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(err => {
            logError(err);
            response
                .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
                .json({ error: 'Internal server error' });
        });
});

module.exports = { postsRouter };
