import {invoiceModelCall,customModelCall} from "./TestingFunctions.js"

function testAsync(callback){
    callback().then(e =>{
      if(Object.keys(e).length >0){
        console.log("The test was a success");
      }
      else{
        console.log("The test was a failure");
      }
    }).catch(e =>{
      console.log("The test threw an exception");
    })
    
  }
  
testAsync(invoiceModelCall)
testAsync(customModelCall)