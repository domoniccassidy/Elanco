import React, { useState, useEffect, useRef } from "react";
import rebates from "../rebates.json";
import Rebate from "./Rebate";

import {
  FormRecognizerClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";

const RebatePage = () => {
  const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState("");

  const [purchaseForm, setPurchaseForm] = useState({
    clinicName: "",
    clinicAddress: "",
    clinicState: "",
    clinicZip: "",
  });

  const endpoint = "https://b7012116-psp-fr.cognitiveservices.azure.com/";
  const apiKey = "4319cc85809a4849bd8f188d3d6feb08";
  const modelId = "b89dd708-cd7e-4424-9208-899d9c06d53e";

  const changeFile = (e) => {
    setProducts([]);
    e.preventDefault();
    setFile(e.target.files[0]);
  };
  useEffect(() => {
    analyze();
    analyzeCustom();
  }, [file]);

  const analyze = async () => {
    const client = new FormRecognizerClient(
      endpoint,
      new AzureKeyCredential(apiKey)
    );
    const poller = await client.beginRecognizeInvoices(file, {
      onProgress: (state) => {
        console.log(`status: ${state.status}`);
      },
    });
    const forms = await poller.pollUntilDone();
    const productsTemp = products;

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
            rebates.rebates.map((rebate) => {
              if (
                rebate.productNames?.includes(element.value.Description.value)
              ) {
                setProducts([
                  ...products,
                  { ...rebate, amount: element?.value?.Quantity?.value },
                ]);
                products.push({
                  ...rebate,
                  amount: element?.value?.Quantity?.value,
                });
              }
            });
          });
        }
      }
    }
  };
  const analyzeCustom = async () => {
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

    for (const form of forms || []) {
      console.log("Fields: ");
      let tempPurchaseForm = purchaseForm;
      for (const fieldName in form.fields) {
        const field = form.fields[fieldName];

        switch (fieldName) {
          case "Name":
            tempPurchaseForm = { ...tempPurchaseForm, clinicName: field.value };
            break;
          case "Address":
            const tempAddress = field.value.split(" ");
            tempPurchaseForm = {
              ...tempPurchaseForm,
              clinicAddress: field.value,
              clinicState: tempAddress[tempAddress.length - 2],
              clinicZip: tempAddress[tempAddress.length - 1],
            };
            break;
          default:
            break;
        }

        console.log(
          `Field ${fieldName} has value ${field.value} with a confidence score of ${field.confidence}`
        );
      }
      setPurchaseForm(tempPurchaseForm);
    }
  };

  return (
    <>
      <section class="header-section">
        <div class="header-container">
          <div class="header-left">
            <a style={{display:"flex"}}><img src="https://assets-us-01.kc-usercontent.com/9965f6dc-5ed5-001e-1b5b-559ae5a1acec/d0271229-9481-483c-a485-24312e4319aa/logo.svg" alt="" /> <img height="30px" style={{marginLeft:"10px"}} src="https://assets-us-01.kc-usercontent.com/9965f6dc-5ed5-001e-1b5b-559ae5a1acec/2f00a845-de16-436f-ab34-56f924bdd64b/Rebates_white.svg" alt="" /></a>
          </div>
          <div class="header-right">
            <div class="header-cta">
              <a>Log In</a>
            </div>
            <div class="header-user-cta">
              <a>Log Out</a>
            </div>
          </div>
        </div>
      </section>

      <section class="claim-rebate-section">
        <div class="claim-rebate-container">
          <div class="claim-rebate-upload-and-invoices">
            <div class="rebate-container">
              <div class="rebate-upload">
                <label class="upload-cta">
                  <input type="file" onChange={changeFile} />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-cloud-arrow-up"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"
                    />
                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                  </svg>
                  <h4>Upload your invoice</h4>
                  <p>Allowed file types: .jpg, .png</p>
                </label>
              </div>
            </div>
            <div class="rebate-container">
              <div class="rebate-header">
                <h4>Your invoice</h4>
              </div>
              <div class="rebate-uploaded-invoices">
                <div class="rebate-uploaded-invoice">
                  {file && <img src={URL.createObjectURL(file)} />}
                </div>
              </div>
            </div>
          </div>
          <div class="rebate-container" id="rebate-found-products">
            <h4>We found these matching rebates</h4>
            {products != [] && products.map((e) =>{
              return <Rebate rebate ={e}></Rebate>
            })}
          </div>
        </div>
      </section>
      <section class="rebate-form-section">
        <form>
          <div class="rebate-form-container">
            <div class="rebate-form-personal-and-pet">
              <div class="form-details">
                <h3>Your Information</h3>
                <div class="form-field">
                  <label for="first-name">
                    First Name <span>*</span>
                  </label>
                  <input id="first-name" type="text" />
                </div>
                <div class="form-field">
                  <label for="last-name">
                    Last Name <span>*</span>
                  </label>
                  <input id="last-name" type="text" />
                </div>
                <div class="form-field">
                  <label for="address">
                    Address <span>*</span>
                  </label>
                  <input id="address" type="text" />
                </div>
                <div class="form-field">
                  <label for="city">
                    City <span>*</span>
                  </label>
                  <input id="city" type="text" />
                </div>
                <div class="form-field">
                  <label for="state">
                    State <span>*</span>
                  </label>
                  <input id="state" type="text" />
                </div>
                <div class="form-field">
                  <label for="zip-code">
                    Zip Code <span>*</span>
                  </label>
                  <input id="zip-code" type="text" />
                </div>
                <div class="form-field">
                  <label for="phone">Phone</label>
                  <input id="phone" type="text" />
                  <p>
                    By providing my phone number, I consent to my phone number
                    being used to contact me regarding my rebate submission
                  </p>
                </div>
                <div class="form-field">
                  <label for="email">
                    Email <span>*</span>
                  </label>
                  <input id="email" type="text" />
                </div>
                <div class="form-field">
                  <label for="confirm-email">
                    Confirm Email <span>*</span>
                  </label>
                  <input id="confirm-email" type="text" />
                </div>
              </div>
              <div class="form-details">
                <h3>Pet Information</h3>
                <p>
                  Add your pet's name below. If you have multiple pets, please
                  just put one of your pet's name.
                </p>
                <div class="form-field">
                  <label for="pet-name">
                    Pet Name <span>*</span>
                  </label>
                  <input id="pet-name" type="text" />
                </div>
              </div>
            </div>

            <div className="rebate-form-and-purchase-details">
              <div class="form-details">
                <h3>Purchase Details</h3>
                <p>
                  Complete the information about your veterinarian clinic and
                  medication(s).
                </p>
                <div class="form-field">
                  <label for="clinic-name">
                    Clinic Name <span>*</span>
                  </label>
                  <input
                    id="clinic-name"
                    value={purchaseForm.clinicName}
                    onChange={(e) =>
                      setPurchaseForm({
                        ...purchaseForm,
                        clinicName: e.target.value,
                      })
                    }
                    type="text"
                  />
                </div>
                <div class="form-field">
                  <label for="clinic-address">
                    Clinic Address <span>*</span>
                  </label>
                  <input
                    id="clinic-address"
                    type="text"
                    value={purchaseForm.clinicAddress}
                    onChange={(e) =>
                      setPurchaseForm({
                        ...purchaseForm,
                        clinicAddress: e.target.value,
                      })
                    }
                  />
                </div>
                <div class="form-field">
                  <label for="clinic-state">
                    Clinic State <span>*</span>
                  </label>
                  <input
                    id="clinic-state"
                    type="text"
                    value={purchaseForm.clinicState}
                    onChange={(e) =>
                      setPurchaseForm({
                        ...purchaseForm,
                        clinicState: e.target.value,
                      })
                    }
                  />
                </div>
                <div class="form-field">
                  <label for="clinic-zip-code">
                    Clinic Zip Code <span>*</span>
                  </label>
                  <input
                    id="clinic-zip-code"
                    type="text"
                    value={purchaseForm.clinicZip}
                    onChange={(e) =>
                      setPurchaseForm({
                        ...purchaseForm,
                        clinicZip: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div class="form-submit-cta">
                <button type="submit">Submit</button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default RebatePage;
