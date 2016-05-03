describe("ngRolerrConfig", function(){

	beforeEach(function(){
		var me = this;
		module('ngRolerr', ['$rolerrProvider',function($rolerrProvider){
			me.$rolerrProvider = $rolerrProvider;
		}]);
	});

	beforeEach(inject(function(ngRolerrConfig, shareservice){
		this.rolerrConfig = ngRolerrConfig;
		this.ngRolerrShared = shareservice;
	}));

	it("Should be set httpIntercepter", function(){
		this.$rolerrProvider.modeInterceptor = function() {return false;}
    		expect(this.rolerrConfig.modeInterceptor()).toEqual(false);
    		expect(this.$rolerrProvider.modeInterceptor()).toEqual(false);
    		this.$rolerrProvider.modeInterceptor = function( ) {return true;}
	});

	it('should be able to use an modeInterceptor strategy function', function() {
    		this.$rolerrProvider.modeInterceptor = function(request) {
        		return request.uri.indexOf('/api/') === 0;
   		 };
    		expect(this.rolerrConfig.modeInterceptor({uri: '/api/debug'})).toEqual(true);
    		expect(this.$rolerrProvider.modeInterceptor({uri: '/everything'})).toEqual(false);
    		this.$rolerrProvider.modeInterceptor = true;
  	});

	it('should set header', function() {
    		this.$rolerrProvider.header = 'x-auth-token';
    		expect(this.rolerrConfig.header).toEqual('x-auth-token');
    		expect(this.$rolerrProvider.header).toEqual('x-auth-token');
    		this.$rolerrProvider.header = 'Authorization';
  });
}) ;