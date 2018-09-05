const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, startServer, closeServer } = require('../app/server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Basic GET request', function() {
    before(function() {
        return startServer();
    });

    after(function() {
        return closeServer();
    });

    it('should return index-html on GET', function() {
        return chai
            .request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
});

