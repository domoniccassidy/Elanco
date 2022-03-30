const { FormRecognizerClient, AzureKeyCredential } = require( "@azure/ai-form-recognizer");
const path = require('path');
const fs = require('fs');

const endpoint = "https://b7012116-psp-fr.cognitiveservices.azure.com/";
const apiKey = "ad53f517375c4133a6e27a518b9c598e  ";
const modelId = "b89dd708-cd7e-4424-9208-899d9c06d53e";
const subscriptionKey = "9075ee73270c411e933d44e16100ae66";



async function invoiceModelCall  (){
  
    const client = new FormRecognizerClient(
        endpoint,
        new AzureKeyCredential(apiKey)
      );
      const poller = await client.beginRecognizeInvoices(fs.createReadStream("Cat03.jpg"), {
        onProgress: (state) => {
          console.log(`status: ${state.status}`);
        },
      });
      const forms = await poller.pollUntilDone();
    
      for (const form of forms || []) {
        console.log("Fields:");
        for (const fieldName in form.fields) {
          // each field is of type FormField
          const field = form.fields[fieldName];
          if (Array.isArray(field.value)) {
            field.value.forEach((element) => {
              console.log(
                `Field ${element?.name} has a description '${element?.value?.Description?.value}' an amount of '${element?.value?.Quantity?.value}' with a confidence score of ${element.confidence}`
              );
             
            });
          }
        }
      }
      return forms;
};
    
function testAsync(callback){
  callback().then(e =>{
    console.log(e);
  })
}

testAsync(invoiceModelCall)
