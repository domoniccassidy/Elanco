import React, { useState, useEffect } from "react";
import rebates from "../rebates.json";

import {
  FormRecognizerClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";

const RebatePage = () => {
  const [file, setFile] = useState(null);
  const [total, setTotal] = useState("");

  const endpoint = "https://b7012116-psp-fr.cognitiveservices.azure.com/";
  const apiKey = "4319cc85809a4849bd8f188d3d6feb08";
  const modelId = "cae91ac8-28f3-487b-b60b-e88c045d690c";

  const changeFile = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };
  useEffect(() => {
      console.log(file);
    analyze();
  }, [file]);

  const analyze = async () => {
    const client = new FormRecognizerClient(
      endpoint,
      new AzureKeyCredential(apiKey)
    );
    const poller = await client.beginRecognizeCustomForms(modelId, file, {
      onProgress: (state) => {
        console.log(`status: ${state.status}`);
      },
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
            console.log(
              `cell (${cell.rowIndex},${cell.columnIndex}) ${cell.text}`
            );
          }
        }
      }

      console.log("Fields:");
      for (const fieldName in form.fields) {
        // each field is of type FormField
        const field = form.fields[fieldName];
        if (fieldName == "Total" && field != null)
          setTotal(field.value.substring(1));
        console.log(
          `Field ${fieldName} has value '${field.value}' with a confidence score of ${field.confidence}`
        );
      }
    }
  };

  return (
    <>
      <div className="topbar" />
      <div className="container">
        <div className="rebate-view">
          <h1 className="reciept-header">Rebates you are claiming</h1>
        </div>
        <div className="image-container">
          {" "}
          <h1 className="reciept-header">Your receipt</h1>
          <div className="form-input">
            <div className="preview">
                {file != null && <img src={URL.createObjectURL(file)}/>}
            </div>
            <label for="file-ip-1">Upload Image</label>
            <input
            onChange={changeFile}
              type="file"
              id="file-ip-1"
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RebatePage;
