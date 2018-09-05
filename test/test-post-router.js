/* global describe, it, before, after, beforeEach, afterEach */
'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, startServer, closeServer } = require('../app/server.js');
const { User } = require('../app/user.model.js');
const { Post } = require('../app/post.model.js');
const { JWT_SECRET, MONGO_TEST_URL } = require('../app/config.js');

const should = chai.should();

chai.use(chaiHttp);

const {
    createMockDatabase,
    deleteMockDatabase,
    getNewFakePost
} = require('./database-helper.js');

describe('/api/post route CRUD tests', function() {
    const _id = User._id;
    const name = 'John Doe';
    const username = 'johndoe';
    const password = 'password';

    before(function() {
        return startServer(MONGO_TEST_URL);
    });

    after(function() {
        return closeServer();
    });

    beforeEach(function() {
        return createMockDatabase().then(
            User.hashPassword(password).then(password =>
                User.create({
                    _id,
                    name,
                    username,
                    password
                })
            )
        );
    });

    afterEach(function() {
        return deleteMockDatabase().then(User.remove({}));
    });

    describe('GET Posts', function() {
        it('Should GET Posts by user ID', function() {
            const token = jwt.sign(
                {
                    user: {
                        username
                    }
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            return Post.find({ user: User._id })
                .then(post => {
                    post.should.be.a('array');
                    return chai
                        .request(app)
                        .get('/api/post/')
                        .set('authorization', `Bearer ${token}`);
                })
                .then(response => {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.should.be.a('object');
                    response.body.should.have.lengthOf.at.least(1);
                });
        });

        it('Should return posts with correct fields', function() {
            const token = jwt.sign(
                {
                    user: {
                        username
                    }
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            return chai
                .request(app)
                .get('/api/post')
                .set('authorization', `Bearer ${token}`)
                .then(response => {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('array');
                    response.body.should.have.lengthOf.at.least(1);
                    response.body.forEach(function(post) {
                        post.should.be.a('object');
                        post.should.include.keys(
                            'id',
                            'title',
                            'response',
                            'receivedMessage',
                            'created'
                        );
                    });
                });
        });
    });

    describe('Create/POST Posts', function() {
        it('Should create a new post', function() {
            const newPost = getNewFakePost();
            const token = jwt.sign(
                {
                    user: {
                        username
                    }
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            return chai
                .request(app)
                .post('/api/post')
                .set('authorization', `Bearer ${token}`)
                .send(newPost)
                .then(res => {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys(
                        'id',
                        'title',
                        'response',
                        'receivedMessage',
                        'created'
                    );
                    res.body.id.should.not.be.null;
                    res.body.title.should.equal(newPost.title);
                    res.body.response.should.equal(newPost.response);
                    res.body.receivedMessage.should.equal(
                        newPost.receivedMessage
                    );
                    return Post.findById(res.body.id);
                })
                .then(post => {
                    post.should.be.a('object');
                    post.title.should.equal(newPost.title);
                    post.response.should.equal(newPost.response);
                    post.receivedMessage.should.equal(newPost.receivedMessage);
                });
        });
    });

    describe('Update/PUT Posts', function() {
        it('should update fields you send over', function() {
            const newPostData = {
                title: 'Legacy Assurance Administrator',
                response: 'dogs dogs dogs'
            };
            const token = jwt.sign(
                {
                    user: {
                        username
                    }
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            return Post.findOne()
                .then(post => {
                    post.should.be.a('object');
                    newPostData.id = post.id;
                    return chai
                        .request(app)
                        .put(`/api/post/${post.id}`)
                        .set('authorization', `Bearer ${token}`)
                        .send(newPostData);
                })
                .then(res => {
                    return Post.findById(newPostData.id);
                })
                .then(post => {
                    post.should.be.a('object');
                    post.id.should.equal(newPostData.id);
                    post.title.should.equal(newPostData.title);
                    post.response.should.equal(newPostData.response);
                });
        });
    });

    describe('Remove/DELETE Posts', function() {
        it('should delete a post by id', function() {
            let postToDelete;
            const token = jwt.sign(
                {
                    user: {
                        username
                    }
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            return Post.findOne()
                .then(_post => {
                    postToDelete = _post;
                    return chai
                        .request(app)
                        .delete(`/api/post/${postToDelete.id}`)
                        .set('authorization', `Bearer ${token}`);
                })
                .then(res => {
                    res.should.have.status(204);
                    return Post.findById(postToDelete.id);
                })
                .then(_post => {
                    should.not.exist(_post);
                });
        });
    });
});
