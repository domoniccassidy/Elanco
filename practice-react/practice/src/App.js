
import React, { useEffect, useState } from "react";
import {FormRecognizerClient,AzureKeyCredential} from "@azure/ai-form-recognizer"

const endpoint = "https://b7012116-psp-fr.cognitiveservices.azure.com/";
    const apiKey = "4319cc85809a4849bd8f188d3d6feb08";
    const modelId = "cf822ea1-818e-4619-83a6-5d07774619ff";
    


function App() {
  const [file,setFile] = useState(null)
  const [total,setTotal] = useState("");
  
  const handleSubmit =(e) =>{
    e.preventDefault()
    setFile(e.target.files[0])
    
  }
  useEffect(() =>{
    analyze();
  },[file])

  const analyze = async() =>{
    const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));
    const poller = await client.beginRecognizeCustomForms(modelId, file, {
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
        if(fieldName == "Total") setTotal(field.value.substring((1)))
        console.log(
          `Field ${fieldName} has value '${field.value}' with a confidence score of ${field.confidence}`
        );
      }
    }
  }

 
  
  return (
    <div className="App">
      <input type="file" onChange={handleSubmit} />
      <input type="text" value = {total}/>
    </div>
  );
}

export default App;
