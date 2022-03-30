import {invoiceModelCall,customModelCall,layoutModelCall} from "./TestingFunctions.js"
import { signIn } from "./src/html.js";

function testAzure(callback){
    callback().then(e =>{
      if(Object.keys(e).length >0){
        console.log(callback.name + " was a success");
      }
      else{
        console.log(callback.name + " was a failure");
      }
    }).catch(e =>{
      console.log(callback.name+" threw an exception");
    })
    
}

function testApi(callback){
  callback({email:"hello",password:"hello"})
  .then(e =>{
    console.log("hello");
  })
  .catch(e =>{
    console.log(e);
  })
}

testAzure(invoiceModelCall)
testAzure(customModelCall)
testAzure(layoutModelCall)

testApi(signIn)