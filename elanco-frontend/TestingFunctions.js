import { FormRecognizerClient, AzureKeyCredential } from "@azure/ai-form-recognizer"

import fs from'fs' ;

const endpoint = "https://b7012116-psp-fr.cognitiveservices.azure.com/";
const apiKey = "ad53f517375c4133a6e27a518b9c598e  ";
const modelId = "b89dd708-cd7e-4424-9208-899d9c06d53e";
const subscriptionKey = "9075ee73270c411e933d44e16100ae66";



export async function invoiceModelCall  (){
  
    const client = new FormRecognizerClient(
        endpoint,
        new AzureKeyCredential(apiKey)
      );
      const poller = await client.beginRecognizeInvoices(fs.createReadStream("./src/TestReciepts/Receipt.png"), {
        
      });
      const forms = await poller.pollUntilDone();
    
      return forms[0].fields;
};
    
export const customModelCall = async () => {
  const client = new FormRecognizerClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );
  const poller = await client.beginRecognizeCustomForms(modelId, "./src/TestReciepts/Receipt.png", {
   
  });
  const forms = await poller.pollUntilDone();

 
 
  return forms[0].fields;
};
export const layoutModelCall = async () => {
  const client = new FormRecognizerClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );
  const poller = await client.beginRecognizeContent(file2, {
    
  });
  const forms = await poller.pollUntilDone();

 
  return forms[0].fields;
};