# [ngRolerr](https://github.com/sophatvathana/ngRolerr/) 
i'm happy to sharing this module. The reason that i created this module because , i working on it with Laravel and angular as frontend.
# ngRolerr is very simple module of <a href="//angularjs.org" >Angular Js</a> to use for rest API with anuglar interceptor. Have built-in signin and signup. And you also can use Role manager for filter your UI-router as Admin or Online or ..etc.. Roles 

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Api](#api)
- [Note](#note)
- [Storage Suport](#storage-support)
- [How It Works](#how-it-works)
- [License](#license)

## Installation

The easy way to install ngRolerr just run command bellow: 

```bash
# Bower
as soon as i have free time :D

# NPM
npm install ngrolerr
```
Alternatively, you can [**get here**](https://github.com/sophatvathana/ngRolerr/releases) the latest release.

## Usage

**Configure ngRolerr**
**Step1. Injection**
```js
angular.module('App',['ngRolerr'])
  .config(['$rolerrProvider',function($rolerrProvider){
    $rolerrProvider.rolesUrl =''; //example: /api/roles ...
    $rolerrProvider.modeInterceptor = true; //Default is true; 
    $rolerrProvider.loginUrl =''; // api/login
    $rolerrProvider.signupUrl =''; // api/signup
    $rolerrProvider.storageType= 'cookies' // Default is cookies .. Support storage: sessionStroage , localStroage and cookies
    $rolerrProvider.header ='Authorization';
    $rolerrProvider.tokenType ='Bearer';
    
  }])
```
**Step2 Use Role in ui-router**
for example

```js
.state('account/admin',{
      url: '/account/admin',
      templateUrl:'',
      controller:'controller',
      resolve: {
          authorize: ['$rolerr',
            function($rolerr) {
              return  $rolerr.authorize();
            }
          ]
        },
      data: {
        roles: ["login"], // role you can use this array to allow someone who in this role ['Admin', 'user',...]
        deniedTo: 'home' //User not in this role will redirect page to home
        failedTo: 'login' // User not login will redirect to login
      }
      
    })
```
**Step3 Config run()**
```js
angular.module('App',['ngRolerr']).run(['$rolerr',function($rolerr){
  if ($rolerr.isTokenResolved()) $rolerr.authorize();
}])
```
## API

- **response** - The HTTP response object from the server.

```js
$rolerr.login(data).then(function(res){
/* doing something*/
  $state.go('home');
},function(err){});

$rolerr.signup(data).then(function(res){
/* doing something*/
  $state.go('home');
},function(err){});


$rolerr.get('url').then(function(res){
/* doing something*/
},function(err){});

$rolerr.post('url',data).then(function(res){
/* doing something*/
},function(err){});
```
- **Token and Authentication**
```js
$rolerr.isTokenResolved() //return true or false
$rolerr.getToken() //return token code
$rolerr.isAuthenticated() //return true or false
```

##note

```js
//some error loop ui-route state on case redirect to current route
.state('account/admin',{
      url: '/login',
      templateUrl:'',
      controller:'controller',
      resolve: {
          authorize: ['$rolerr',
            function($rolerr) {
              return  $rolerr.authorize();
            }
          ]
        },
      data: {
        roles: ["login"], // role you can use this array to allow someone who in this role ['Admin', 'user',...]
        deniedTo: 'home' //User not in this role will redirect page to home
        //failedTo: 'login' // This is will error loop state so comment it 
      }
      
    })
    
//Role Data should be like this 
For example From Laravel
{
  "roles": [
    {
      "id": "1",
      "name": "Admin",
      "description": "Admin",
      "created_at": "-0001-11-30 00:00:00",
      "updated_at": "-0001-11-30 00:00:00",
      "pivot": {
        "user_id": "1",
        "role_id": "1"
      }
    },
    {
      "id": "2",
      "name": "Online",
      "description": "Online",
      "created_at": "-0001-11-30 00:00:00",
      "updated_at": "-0001-11-30 00:00:00",
      "pivot": {
        "user_id": "1",
        "role_id": "2"
      }
    }
  ]
}
```
## Storage Support
  ngRolerr Support 
- Cookies for default
- localStorage
- sessionStorage

## License

The MIT License (MIT)

Copyright (c) 2015 Phat Sovathana

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
