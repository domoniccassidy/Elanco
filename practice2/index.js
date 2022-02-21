const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");

const fs = require("fs");

async function main() {
    const endpoint = "https://b7012116-psp-fr.cognitiveservices.azure.com/";
    const apiKey = "4319cc85809a4849bd8f188d3d6feb08";
    const modelId = "cf822ea1-818e-4619-83a6-5d07774619ff";
    const path = "ASDA_Receipt6.jpg";
  
    const readStream = fs.createReadStream(path);
    
    const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));
    const poller = await client.beginRecognizeCustomForms(modelId, readStream, {
      onProgress: (state) => {
        console.log(`status: ${state.status}`);
      }
    });
    const forms = await poller.pollUntilDone();
  
    console.log("Forms:");
    for (const form of forms || []) {
      console.log(`${form.formType}, page range: ${form.pageRange}`);
      console.log("Pages:");
      for (const page of form.pages || []) {
        console.log(`Page number: ${page.pageNumber}`);
        console.log("Tables");
        for (const table of page.tables || []) {
          for (const cell of table.cells) {
            console.log(`cell (${cell.rowIndex},${cell.columnIndex}) ${cell.text}`);
          }
        }
      }
  
      console.log("Fields:");
      for (const fieldName in form.fields) {
        // each field is of type FormField
        const field = form.fields[fieldName];
        console.log(
          `Field ${fieldName} has value '${field.value}' with a confidence score of ${field.confidence}`
        );
      }
    }
  }
  
  main().catch((err) => {
    console.error("The sample encountered an error:", err);
  });