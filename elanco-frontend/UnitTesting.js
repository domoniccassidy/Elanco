import {invoiceModelCall,customModelCall,layoutModelCall} from "./TestingFunctions.js"
import { signIn,signUp,updateUser } from "./src/html.js";

function testAzure(callback){
    callback().then(e =>{
      if(Object.keys(e).length >0){
        console.log("\x1b[36m%s\x1b[0m",callback.name + " was a success");
      }
      else{
        console.log("\x1b[33m%s\x1b[0m",callback.name + " was a failure");
      }
    }).catch(e =>{
      console.log("\x1b[31m%s\x1b[0m",callback.name+" threw an exception "  +e);
    })
    
}

function testApi(callback){
  callback({email:"hello",password:"hello"})
  .then(e =>{
    console.log("\x1b[36m%s\x1b[0m",callback.name + " was a success");
  })
  .catch(e =>{
    console.log("\x1b[31m%s\x1b[0m",callback.name+" threw an exception: " + e);
  })
}

testAzure(invoiceModelCall)
testAzure(customModelCall)
testAzure(layoutModelCall)

testApi(signIn)
testApi(signUp)
testApi(updateUser)