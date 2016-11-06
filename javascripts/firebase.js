"use strict";

var FbAPI = (function(){
  return {
    firebaseCredentials : function() {
      return new Promise((resolve, reject)=> {
        $.ajax({
          method: 'GET',
          url: 'firebaseKeys.json'
        }).then((response)=>{
          resolve(response);
        }, (error)=> {
          reject(error);
        });
      });
    }
  };
})(FbAPI || {});