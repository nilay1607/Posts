const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth Middleware', function(){
    it('should throw an error if no auth header is defined', function(){
        const req = {
            get: function(header){
                return null;
            }
        };
        expect(authMiddleware.bind(this,req, {}, () => {})).to.throw('Not authenticated.');
    })
    
    it('should throw an error if no auth header is only one string', function(){
        const req = {
            get: function(header){
                return "XYZ";
            }
        };
        expect(authMiddleware.bind(this,req, {}, () => {})).to.throw();
    })

    it('should throw an error if token cannot be verified', function(){
        const req = {
            get: function(header){
                return "Bearer XYZ";
            }
        };
        expect(authMiddleware.bind(this,req, {}, () => {})).to.throw();
    })

    it('should output userid if token is valid', function(){
        const req = {
            get: function(header){
                return "Bearer XYZ";
            }
        };
        sinon.stub(jwt,'verify');
        jwt.verify.returns({userId: 'Abc'});
        authMiddleware(req,{},() => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId','Abc');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    })
})

