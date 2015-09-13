/*====+++++========+++++===* 
* @Author: sovathana
* @Date:   2015-09-10 15:20:46
* @Last Modified by:   sovathana
* @Last Modified time: 2015-09-13 12:04:20
* @Email: sovathana.phat@gmail.com
* @Facebook && Twitter : Sophatvathana
* @Project: ngRolerr
* @FileName: ngRolerr.js
* @License: MIT
*==========================
*/

(function (window, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = factory(require('angular'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['angular'], function (angular) {
      return (window.ngRolerr = factory(angular));
    });
  } else {
    // Global Variables
    window.ngRolerr  = factory(window.angular);
  }
}(this, function ngRolerr(angular) {
  
'use strict';
angular.module('ngRolerr', ['ngCookies'])
 .constant('ngRolerrConfig', {
    rolesUrl: '',
    storageType: '$cookies',
    rolesSource: [],
    getUserUrl: '',
    getUrl: '',
    modeInterceptor: true,
    header: 'Authorization',
    tokenType: 'Bearer',
 })
 .provider('$rolerr',['ngRolerrConfig',function(config){
Object.defineProperties(this, {
       rolesUrl: {
          get: function() { return config.rolesUrl; },
          set: function(value) { config.rolesUrl = value; }
        },
       modeInterceptor: {
          get: function() { return config.modeInterceptor; },
          set: function(value) { config.modeInterceptor = value; }
       },
       getUserUrl: {
          get: function() { return config.getUserUrl; },
          set: function(value) { config.getUserUrl = value; }
       },
       getUrl: {
          get: function() { return config.getUrl; },
          set: function(value) { config.getUrl = value; }
        },
       rolesSource: {
          get: function() { return config.rolesSource; },
          set: function(value) { config.rolesSource = value; }
       },

       secret: {
          get: function() { return config.secret; },
          set: function(value) { config.secret = value; } 
        },

       storageType: {
          get: function() { return config.storageType; },
          set: function(value) { config.storageType =  value} 
       }

   });

   this.$get = ['service', 'rolerr', 'authorizer', function(service, rolerr, authorizer){
      var $rolerr = {};

      $rolerr.isTokenResolved = function() {
    return rolerr.isTokenResolved();
      };

      $rolerr.isAuthenticated = function() {
        return rolerr.isAuthenticated();
      };

      $rolerr.isInRole = function(role) {
        return rolerr.isInRole(role);
      };

      $rolerr.isInAnyRole = function(roles) {
    return rolerr.isInAnyRole(roles);
      };

      $rolerr.authenticate = function(identity) {
        return rolerr.authenticate(identity);
      };

      $rolerr.identity = function(force) {
        return rolerr.identity(force);
      };

      $rolerr.authorize = function() {
        return authorizer.authorize();
      };

      $rolerr.getUser = function() {
        return service.getUser();
      };

      $rolerr.getRoles = function() {
        return service.getRoles();
      };

      return $rolerr;
   }];
 }])
 .factory('service',['$q', 'ngRolerrConfig', '$http', function($q, config, $http){

    return {
       getRoles: function(){
          var deferred = $q.defer();
          $http.get(config.rolesUrl).success(function(data){
             deferred.resolve(data);
          }).error(function(data) { deferred.reject(data); });
        return deferred.promise;
       },

       getUser: function(){
      var deferred = $q.defer();
      $http.get(config.userRole).success(function(data){
        deferred.resolve(data);
      }).error(function(data) { deferred.reject(data); });
       },

       getData: function(){
          var deferred = $q.defer(); 
          $http.get(config.getUrl).success(function(data){
            deferred.resolve(data);
          }).error(function(data) { deferred.reject(data); });
       },
    }
 
 }])
 .factory('rolerr',['ngRolerrConfig',
  '$q','$window',
  '$timeout','$cookies',
  function(config, $q, $window, $timeout, $cookies) {
    var _token = undefined,
      _authenticated = false,
        dataRoles = {};
  
    return {
      isTokenResolved: function() {
        return angular.isDefined(_token);
      },

      isAuthenticated: function() {
        var _token = $cookies.get("__rolerr");
          if (_token) {
            if (_token.split('.').length === 3) {
              var base64Url = _token.split('.')[1];
              var base64 = base64Url.replace('-', '+').replace('_', '/');
              var exp = JSON.parse($window.atob(base64)).exp;

              if (exp) {
                var isExpired = Math.round(new Date().getTime() / 1000) >= exp;

                if (isExpired) {
                  $cookies.remove("__rolerr");
                  return false;
                } else {
                  return true;
                }
              }
              return true;
            }
            return true;
          }
          return false;
      },

      authenticate: function(identity) {
        _token = identity;
        _authenticated = identity != null;
        var expireDate = new Date();
             expireDate.setDate(expireDate.getDate() + 1);
        if (identity)
          $cookies.put("__rolerr", identity,{'expires': expireDate});
        else $cookies.remove("__rolerr");
      },

      identity: function(force) {
        var deferred = $q.defer();

        if (force === true) _token = undefined;

        if (angular.isDefined(_token)) {
          deferred.resolve(_token);

          return deferred.promise;
        }

        var self = this;
        //$timeout(function() {
          _token =  $cookies.get("__rolerr");
          self.authenticate(_token);
          deferred.resolve(_token);
       // }, 1000);

        return deferred.promise;
      }
    };
  }])
.factory('shareservice', [ 'ngRolerrConfig', '$q', 'rolerr', 'service', function( config, $q, rolerr, service){
   
   Array.prototype.equals = function (arr) {
      if (!arr) return false;
      if (this === null || arr === null) return false;
      if (this !== this && arr !== arr) return true;

    for(var i = 0, l=this.length; i < l; i++) {
         
        for(var j = 0, l=arr.length; j < l; j++){
  
            if (this[i] === arr[j]){
                return true;
                break;       
            }
        }                     
    }       
      return false;
} 
  return  {

        checkRolesSource: function(getrr, roles) {
              var dataArr=[];
              console.log(rolerr.isAuthenticated())
          //var dataObj =[],
             // dataSource =config.rolesSource;
          //if (!config.rolesSource || config.rolesSource == 'undefined') return false;
          if( !rolerr.isAuthenticated() || !rolerr.identity) return false;
          //for(var i=0, l=dataSource.length; i<l; i++){
            //dataObj.push(dataSource[i].name);
          //}
           for(var i=0; i<getrr.roles.length;i++)
          dataArr.push(getrr.roles[i].name);
           return roles.equals(dataArr);
        }
  };
}])
.factory('authorizer', ['service','shareservice','$rootScope', '$state', 'rolerr',
  function(service,shareservice, $rootScope, $state, rolerr) {
    return {
      authorize: function() {
         return   rolerr.identity()
            .then(function() {
            console.log('Not '+rolerr.isAuthenticated())
          if (!rolerr.isAuthenticated()){
                // alert("Not Authenticated")
                $rootScope.returnToState = $rootScope.toState;
                $rootScope.returnToStateParams = $rootScope.toStateParams;
                $state.go($rootScope.toState.data.failedTo);
                console.log('Not Login ');
           }else{
            service.getRoles().then(function(data){
             if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !shareservice.checkRolesSource(data, $rootScope.toState.data.roles)) {
                 $state.go($rootScope.toState.data.deniedTo); 
             }
           }, function(data) {
                    console.log('data retrieval failed.')
                });
     }
           });
      }
    };
  }
])
/*.factory('rolerrIntercepter', ['$q','$cookies', 'ngRolerrConfig', 'rolerr', 
  function($q, $cookies, config, rolerr){
  return {
        request: function(request) {
         // if (request.skipAuthorization) {
           // return request;
          // }

          if (rolerr.isAuthenticated() && config.modeInterceptor) {
            var token =  $cookies.get('__rolerr');
              request.headers['authorize'] = token;
            }

            return request;
          },
          responseError: function(response) {
            return $q.reject(response);
          }
        };
}])*/
.config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push(['$q','$cookies', 'ngRolerrConfig', 'rolerr', 
  function($q, $cookies, config, rolerr){
  return {
        request: function(request) {
         // if (request.skipAuthorization) {
           // return request;
          // }

          if (rolerr.isAuthenticated() && config.modeInterceptor) {
             var token =  $cookies.get('__rolerr');

                token =config.header && config.tokenType ? config.tokenType + ' ' + token:
                    $cookies.get('__rolerr');

              request.headers[config.header] = token;
               return request || $q.when(request);
            }

            return request;
          },
          responseError: function(response) {
            return $q.reject(response);
          }
        };
  }]);
}]);

 }));