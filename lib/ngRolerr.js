/*====+++++========+++++===*
* @Author: sovathana
* @Date:   2015-09-10 15:20:46
* @Last Modified by:   sovathana
* @Last Modified time: 2015-09-17 17:30:45
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
angular.module('ngRolerr', ['ng'])
 .constant('ngRolerrConfig', {
    rolesUrl: '',
    loginUrl: '',
    signupUrl: '',
    storageType: 'cookies',
    rolesSource: [],
    getUserUrl: '',
    getUrl: '',
    modeInterceptor: true,
    header: 'Authorization',
    tokenType: 'Bearer',
    keyTokenName: '__rolerr',
    expire: ''
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
          set: function(value) { config.storageType =  value; }
       },

       loginUrl: {
          get: function() { return config.loginUrl; },
          set: function(value) { config.loginUrl = value; }
       },

       signupUrl: {
          get: function() {return config.signupUrl; },
          set: function(value) { config.signupUrl = value; }
       },

       keyTokenName: {
          get: function() { return  config.keyTokenName; },
          set: function(value) { config.keyTokenName = value; }
       },

       expire: {
          get: function() { return config.expire; },
          set: function(value) { config.expire = value; }
       }

   });

   this.$get = ['service', 'rolerr', 'authorizer', function(service, rolerr, authorizer){
      var $rolerr = {};

      $rolerr.isTokenResolved = function() {
        return rolerr.isTokenResolved();
      };
      $rolerr.getToken = function() {
        return rolerr.getToken(config.keyTokenName);
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

      $rolerr.signup = function(signupData){
        return service.signup(signupData);
      };

      $rolerr.login = function(loginData) {
        return service.login(loginData);
      };

      $rolerr.logout = function() {
         return service.logout();
      };

      $rolerr.get = function(url) {
        return service.get(url);
      };

      $rolerr.post = function(url,data) {
        return service.post(url,data);
      };

      return $rolerr;
   }];
 }])

 .factory('serviceStorage', ['ngRolerrConfig','$window','$rolerrCookies', function(config, $window, $rolerrCookies){
  var $storage ={}, isCookies = (config.storageType ==='cookies');
     var windowStorage = function(type) {
        var supported;
         try {
            supported = $window[type];
            if(supported!=null)
              if(!isCookies){
            var key = '__' + Math.round(Math.random() * 1e7);
                try {
                      $window[config.storageType].setItem(key, key);
                      $window[config.storageType].removeItem(key);
                    }catch (err) {
                }

              }
            }catch (err) {
            supported = false;
          }
      };
      if(!windowStorage)
        console.warn(config.storageType+ ' is not supported');

      $storage.setItem = function(key,value,obj){
        if(!isCookies)
          return windowStorage ? $window[config.storageType].setItem(key, value) : undefined;
        else
          return isCookies ? $rolerrCookies.put(key, value, obj) : undefined;
      };

      $storage.getItem = function(key){
        if(!isCookies)
          return windowStorage ? $window[config.storageType].getItem(key) : undefined;
        else
          return isCookies ? $rolerrCookies.get(key) : undefined;
      };
      $storage.removeItem = function(key){
        if(!isCookies)
          return windowStorage ? $window[config.storageType].removeItem(key) : undefined;
        else
          return isCookies ? $rolerrCookies.remove(key) : undefined;
      };

    return $storage;

 }])
 .factory('service',['$rolerrCookies','rolerr', '$q',
  'ngRolerrConfig', '$http', function($rolerrCookies, rolerr, $q, config, $http){

    return {
       getRoles: function(){
          var deferred = $q.defer();
          $http.get(config.rolesUrl).success(function(data){
             deferred.resolve(data);
          }).error(function(err) { deferred.reject(err); });
        return deferred.promise;
       },

       getUser: function(){
      var deferred = $q.defer();
      $http.get(config.userRole).success(function(data){
        deferred.resolve(data);
      }).error(function(err) { deferred.reject(err); });
       },

       getData: function(){
          var deferred = $q.defer();
          $http.get(config.getUrl).success(function(data){
            deferred.resolve(data);
          }).error(function(err) { deferred.reject(err); });
       },

       login: function(loginData){
         var deferred = $q.defer();
         return $http.post(config.loginUrl,loginData).success(function(data){
            deferred.resolve(data);
          rolerr.authenticate(data.token);
         }).error(function(err){deferred.reject(err); });
       },

       signup: function(signupData){
         var deferred = $q.defer();
         return $http.post(config.signupUrl,signupData).success(function(data){
            deferred.resolve(data);
         }).error(function(err){deferred.reject(err); });
       },

       logout: function(){
          $rolerrCookies.remove(config.keyTokenName);
         return $q.when();
       },

       get: function(url){
         var deferred = $q.defer();
          return $http.get(url).success(function(res){
            deferred.resolve(res);
          }).error(function(err){deferred.reject(err); });
       },

       post: function(url, data){
         var deferred = $q.defer();
         return $http.post(url, data).success(function(res){
          deferred.resolve(res);
         }).error(function(err){deferred.reject(err);});
       }
    };

 }])
 .factory('rolerr',['ngRolerrConfig',
  '$q','$window',
  '$timeout','serviceStorage',
  function(config, $q, $window, $timeout, $storage) {
    var _token = undefined,
      _authenticated = false,
        dataRoles = {};

    return {
      isTokenResolved: function() {
        return angular.isDefined(_token);
      },
      getToken: function() {
        return $storage.getItem(config.storageName);
      },
      isAuthenticated: function() {
        if(config.storageType)
        var _token = $storage.getItem(config.keyTokenName);
          if (_token) {
            if (_token.split('.').length === 3) {
              var base64Url = _token.split('.')[1];
              var base64 = base64Url.replace('-', '+').replace('_', '/');
              var exp = JSON.parse($window.atob(base64)).exp;
              if (exp) {
                var isExpired = Math.round(new Date().getTime() / 1000) >= exp;

                if (isExpired) {
                  alert("This authentication is expire");
                  $storage.removeItem(config.keyTokenName);
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
           $storage.setItem(config.keyTokenName, identity,{expires: expireDate});
        else $storage.removeItem(config.keyTokenName);
      },

      identity: function(force) {
        var deferred = $q.defer();

        if (force === true) _token = undefined;

        if (angular.isDefined(_token)) {
          deferred.resolve(_token);

          return deferred.promise;
        }

        var self = this;
         $timeout(function() {
          _token =  $storage.getItem(config.keyTokenName);
          self.authenticate(_token);
          deferred.resolve(_token);
         });

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

        for(var j = 0, m=arr.length; j < m; j++){

            if (this[i] === arr[j]){
                return true;
            }
        }
    }
      return false;
};
  return  {

        checkRolesSource: function(getrr, roles) {
              var dataArr=[];
          if( !rolerr.isAuthenticated() || !rolerr.identity) return false;

           for(var i=0; i<getrr.roles.length;i++)
          dataArr.push(getrr.roles[i].name);
           return roles.equals(dataArr);
        }
  };
}])
.factory('authorizer', ['$location', 'service','shareservice','$rootScope', '$state', 'rolerr',
  function($location,service,shareservice, $rootScope, $state, rolerr) {
    return {
      authorize: function() {
         return  rolerr.identity()
            .then(function() {

          if (!rolerr.isAuthenticated()){
                $rootScope.returnToState = $rootScope.toState;
                $rootScope.returnToStateParams = $rootScope.toStateParams;
                if(!$rootScope.toState.data.failedTo)
                   $location.path($rootScope.toState.url);
                 else{
                  //alert("Logged in is expire!");
                 $state.go($rootScope.toState.data.failedTo);
               }
                 //console.log('Not Login ');
           }else{
            service.getRoles().then(function(data){
             if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !shareservice.checkRolesSource(data, $rootScope.toState.data.roles)) {
                 $state.go($rootScope.toState.data.deniedTo);
             }
           }, function(data) {
                    console.log('data retrieval failed.');
                });
     }
           });
      }
    };
  }
])
.factory('$rolerrCookies', ['$$cookieReader', '$$cookieWriter', function($$cookieReader,$$cookieWriter){
   var defaults = this.defaults = {};
    function calcOptions(options) {
      return options ? angular.extend({}, defaults, options) : defaults;
    }

  return {
    get : function(key) {
          return $$cookieReader()[key];
      },

    put : function(key, value, options) {
          $$cookieWriter(key, value, calcOptions(options));
      },

    remove : function(key, options) {
          $$cookieWriter(key, undefined, calcOptions(options));
      }
};
}]);
/* Spacial Thank to angular-cookies */

function $$CookieWriter($document, $log, $browser) {
  var cookiePath = $browser.baseHref();
  var rawDocument = $document[0];

  function buildCookieString(name, value, options) {
    var path, expires;
    options = options || {};
    expires = options.expires;
    path = angular.isDefined(options.path) ? options.path : cookiePath;
    if (value === undefined) {
      expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
      value = '';
    }
    if (angular.isString(expires)) {
      expires = new Date(expires);
    }

    var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    str += path ? ';path=' + path : '';
    str += options.domain ? ';domain=' + options.domain : '';
    str += expires ? ';expires=' + expires.toUTCString() : '';
    str += options.secure ? ';secure' : '';

    var cookieLength = str.length + 1;
    if (cookieLength > 4096) {
      $log.warn("Cookie '" + name +
        "' possibly not set or overflowed because it was too large (" +
        cookieLength + " > 4096 bytes)!");
    }

    return str;
  }

  return function(name, value, options) {
    rawDocument.cookie = buildCookieString(name, value, options);
  };
}

$$CookieWriter.$inject = ['$document', '$log', '$browser'];

angular.module('ngRolerr').provider('$$cookieWriter', function $$CookieWriterProvider() {
  this.$get = $$CookieWriter;
})

.config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push(['$q','serviceStorage', 'ngRolerrConfig', 'rolerr',
  function($q, $storage, config, rolerr){
  return {
        request: function(request) {
         // if (request.skipAuthorization) {
           // return request;
          // }

          if (rolerr.isAuthenticated() && config.modeInterceptor) {
             var token =  $storage.getItem(config.keyTokenName);

                token =config.header && config.tokenType ? config.tokenType + ' ' + token:
                    $storage.getItem(config.keyTokenName);

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
