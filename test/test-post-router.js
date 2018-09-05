const chai = require('chai');
const chaiHttp = require('chai-http');

const { Post } = require('../app/post.model.js');
const { startServer, closeServer, app } = require('../app/server.js');
const { MONGO_TEST_URL } = require('../app/config.js');

const {
    createMockDatabase,
    deleteMockDatabase,
    getNewFakePost
} = require('./database-helper.js');

const should = chai.should();
chai.use(chaiHttp);

describe('/api/post api tests', function() {
    before(function() {
        return startServer(MONGO_TEST_URL);
    });

    beforeEach(function() {
        return createMockDatabase();
    });

    afterEach(function() {
        return deleteMockDatabase();
    });

    after(function() {
        return closeServer();
    });

    describe('Read/GET Posts', function() {
        it('should return all existing posts', function() {
            let res;
            return chai
                .request(app)
                .get('/api/post')
                .then(_res => {
                    res = _res;
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.at.least(1);
                    return Post.count();
                })
                .then(count => {
                    res.body.should.have.lengthOf(count);
                });
        });

        it('should return posts with right fields', function() {
            return chai
                .request(app)
                .get('/api/post')
                .then(function(res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.at.least(1);
                    res.body.forEach(function(post) {
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
        it('should add a new post', function() {
            const newPost = getNewFakePost();

            return chai
                .request(app)
                .post('/api/post')
                .send(newPost)
                .then(function(res) {
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
                .then(function(post) {
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
            return Post.findOne()
                .then(post => {
                    post.should.be.a('object');
                    newPostData.id = post.id;
                    return chai
                        .request(app)
                        .put(`/api/post/${post.id}`)
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
            return Post.findOne()
                .then(_post => {
                    postToDelete = _post;
                    return chai
                        .request(app)
                        .delete(`/api/post/${postToDelete.id}`);
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
