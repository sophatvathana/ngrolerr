'use strict';
describe("test for api $rolerr", function(){

	beforeEach(function(){
		var me = this;
	      module('ngRolerr',['$rolerrProvider',function($rolerrProvider){
	      	me.$rolerrProvider = me.$rolerrProvider;
	      }]);
	      module('ui.router')
	});

	beforeEach(inject(['$rolerr', '$httpBackend', function($rolerr, $httpBackend){
	      	this.$rolerr = $rolerr;
	      	this.$httpBackend = $httpBackend;
	      }])
	);

	it("should be rest data.json", function(){
		var me = this;
		this.$httpBackend.flush();
		this.$httpBackend.expectGET('./api/someapi', function(headers) {
      		var token = headers[me.$rolerrProvider.header];
      		console.log(me.$rolerrProvider.header)
      		console.log(token)
      		expect(token).toBeDefined();
      		expect(token).toMatch(/Bearer\s+\w+/);
      		return headers;
    		}).respond(200);

    		this.$rolerr.get('./api/someapi');
    		this.$httpBackend.flush();
		
	 	  
	})
});