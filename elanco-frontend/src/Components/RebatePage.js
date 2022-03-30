import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import rebates from "../rebates.json";
import Rebate from "./Rebate";
import Rebate2 from "./Rebate2";
import { ImCross } from "react-icons/im";
import { signIn, signUp } from "../html";
import {
  FormRecognizerClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";

const msRest = require("@azure/ms-rest-js");
const qnamaker = require("@azure/cognitiveservices-qnamaker");
const qnamaker_runtime = require("@azure/cognitiveservices-qnamaker-runtime");

const originalErrors = {
  forenameError: "",
  surnameError: "",
  addressError: "",
  cityError: "",
  stateError: "",
  zipError: "",
  phoneError: "",
  emailError: "",
  confirmError: "",
  petError: "",
  clinicError: "",
  clinicAddressError: "",
  clinicStateError: "",
  clinicZipError: "",
  loginEmailError: "",
  loginPasswordError: "",
};

const RebatePage = () => {
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [products, setProducts] = useState([]);
  const [accountWindow, setAccountWindow] = useState("");
  const [successWindow, setSuccessWindow] = useState("");
  const [dog, setDog] = useState("normal");
  const [isModal, setIsModal] = useState(false);
  const [isChoice, setIsChoice] = useState(false);
  const [isAi, setIsAi] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [isLayout, setIsLayout] = useState(false);
  const [noRebates, setNoRebates] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [dogMessage, setDogMessage] = useState(true);
  const [userMessage, setUserMessage] = useState("");
  const [hideDog, setHideDog] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Woof! Welcome to Elanco rebates!",
      sender: "bot",
    },
  ]);
  const [errors, setErrors] = useState(originalErrors);
  const [purchaseForm, setPurchaseForm] = useState({
    clinicName: "",
    clinicAddress: "",
    clinicState: "",
    clinicZip: "",
  });
  const [userForm, setUserForm] = useState({
    forename: "",
    surname: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    confirmEmail: "",
    pet: "",
  });
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accountForm, setAccountForm] = useState({
    forename: "",
    surname: "",
    address: "",
    city: "",
    state: "",
    confirmPassword: "",
    password: "",
    zip: "",
    phone: "",
    email: "",
    confirmEmail: "",
    pet: "",
    pets: [],
  });

  const endpoint = "https://b7012116-psp-fr.cognitiveservices.azure.com/";
  const apiKey = "ad53f517375c4133a6e27a518b9c598e  ";
  const modelId = "b89dd708-cd7e-4424-9208-899d9c06d53e";
  const subscriptionKey = "9075ee73270c411e933d44e16100ae66";
  const chatEndpoint = "https://elano-bot.cognitiveservices.azure.com/";
  const runtimeEndpoint = "https://elano-bot.azurewebsites.net";
  const runtimeKey = "251ec7a7-1808-48ed-a501-fcb33d906d91";

  const creds = new msRest.ApiKeyCredentials({
    inHeader: { "Ocp-Apim-Subscription-Key": subscriptionKey },
  });
  const qnaMakerClient = new qnamaker.QnAMakerClient(creds, chatEndpoint);
  const knowledgeBaseClient = new qnamaker.Knowledgebase(qnaMakerClient);
  const queryRuntimeCredentials = new msRest.ApiKeyCredentials({
    inHeader: {
      Authorization: "EndpointKey " + runtimeKey,
    },
  });
  const runtimeClient = new qnamaker_runtime.QnAMakerRuntimeClient(
    queryRuntimeCredentials,
    runtimeEndpoint
  );
  const onSubmit = (e) => {
    let number = 0;
    const newErrors = {
      ...originalErrors,
    };
    e.preventDefault();
    if (userForm.forename == "") {
      number +=1;
      newErrors.forenameError = "You must include a first name";
    }
    if (userForm.surname == "") {
      number +=1;
      newErrors.surnameError = "You must include a last name";
    }
    if (userForm.address == "") {
      number +=1;
      newErrors.addressError = "You must include an address";
    }
    if (userForm.city == "") {
      number +=1;
      newErrors.cityError = "You must include a city";
    }
    if (userForm.state == "") {
      number +=1;
      newErrors.stateError = "You must include a state";
    }
    if (userForm.email == "") {
      number +=1;
      newErrors.emailError = "You must include an email";
    }
    if (userForm.zip == "") {
      number +=1;
      newErrors.zipError = "You must include a zip code";
    }
    // if (!isNaN(userForm.phone)) {
    //   newErrors.phoneError = "You must include a valid phone number";
    // }
    if (userForm.pet == "") {
      newErrors.petError = "You must select a pet";
      number +=1;
    }
    if (purchaseForm.clinicAddress == "") {
      number +=1;
      newErrors.clinicAddressError =
        "You must include the address of your clinic";
    }
    if (purchaseForm.clinicName == "") {
      number +=1;
      newErrors.clinicError = "You must include the name of your clinic";
    }
    if (purchaseForm.clinicState == "") {
      number +=1;
      newErrors.clinicStateError = "You must include the state of your clinic";
    }
    if (purchaseForm.clinicZip == "") {
      number +=1;
      newErrors.clinicZipError = "You must include the zip code of your clinic";
    }
    if(number == 0){
      
      setSuccessWindow("open")
      setPurchaseForm({
        clinicName: "",
        clinicAddress: "",
        clinicState: "",
        clinicZip: "",
      })
      setFile(null)
      setFile2(null);
      setProducts([])
    }
    setErrors(newErrors);
  };
  const onSignUp = (e) => {
    e.preventDefault();
    signUp(accountForm).then((e) => {
      setUserForm(e.data.user);
      localStorage.setItem("account", JSON.stringify(e.data.user));

      setAccountWindow("");
      setIsSignedIn(true);
    });
  };
  const onSignOut = (e) => {
    e.preventDefault();
    setAccountForm({
      forename: "",
      surname: "",
      address: "",
      city: "",
      state: "",
      confirmPassword: "",
      zip: "",
      phone: "",
      email: "",
      confirmEmail: "",
      pet: "",
    });
    setUserForm({
      forename: "",
      surname: "",
      address: "",
      city: "",
      state: "",
      confirmPassword: "",
      zip: "",
      phone: "",
      email: "",
      confirmEmail: "",
      pet: "",
    });
    setIsSignedIn(false);
    localStorage.removeItem("account");
  };

  const onReset = () => {
    setUserForm({
      forename: "",
      surname: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",
      confirmEmail: "",
      pet: "",
    });
    setPurchaseForm({
      clinicName: "",
      clinicAddress: "",
      clinicState: "",
      clinicZip: "",
    });
    setFile(null);
    setProducts([]);
    setFile2(null);
    setErrors({
      forenameError: "",
      surnameError: "",
      addressError: "",
      cityError: "",
      stateError: "",
      zipError: "",
      phoneError: "",
      emailError: "",
      confirmError: "",
      petError: "",
      clinicError: "",
      clinicAddressError: "",
      clinicStateError: "",
      clinicZipError: "",
    });
  };
  const changeFile = (e) => {
    setIsAi(true);
    setIsCustom(true);
    setProducts([]);
    e.preventDefault();
    setFile(e.target.files[0]);
  };
  const changeFile2 = (e) => {
    setIsLayout(true);
    e.preventDefault();
    setFile2(e.target.files[0]);
  };
  useEffect(() => {
    if (file != null) {
      setErrors({
        forenameError: "",
        surnameError: "",
        addressError: "",
        cityError: "",
        stateError: "",
        zipError: "",
        phoneError: "",
        emailError: "",
        confirmError: "",
        petError: "",
        clinicError: "",
        clinicAddressError: "",
        clinicStateError: "",
        clinicZipError: "",
      });
      analyze().then(() => {
        console.log(products);
        if (products.length < 1) {
          console.log("hello");
          setNoRebates(true);
        }
      });
      analyzeCustom();
    }
  }, [file]);
  useEffect(() => {
    if (file2) {
      analyzeForm();
    }
  }, [file2]);

  const onSignIn = (e) => {
    e.preventDefault();
    setErrors(originalErrors);
    let newErrors = {
      ...originalErrors,
    };
    signIn(accountForm)
      .then((e) => {
        console.log("hello");
        setUserForm(e.data.user);
        localStorage.setItem("account", JSON.stringify(e.data.user));

        setAccountWindow("");
        setIsSignedIn(true);
      })
      .catch((e) => {
        if (accountForm.email === "") {
          newErrors = {
            ...newErrors,
            loginEmailError: "You must include your email",
          };
        } else if (e.response.data.message === "User not found") {
          newErrors = {
            ...newErrors,
            loginEmailError: "Your email was not found",
          };
        }

        if (!accountForm.password) {
          newErrors = {
            ...newErrors,
            loginPasswordError: "You must include your password",
          };
        } else if (e.response.data.message === "Invalid Password") {
          newErrors = {
            ...newErrors,
            loginPasswordError: "Your password is incorrect",
          };
        }
        setErrors(newErrors);
      });
  };
  const onSendMessage = (e) => {
    e.preventDefault();

    generateAnswer(
      runtimeClient,
      "78ee9c6d-c2e8-4f6c-8e63-8dd6e2740e76",
      userMessage
    ).then(
      () =>
        (document.getElementsByClassName(
          "message-container"
        )[0].scrollTop = 10000)
    );

    setUserMessage("");
  };
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
    setIsAi(true);
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
                rebate?.productNames?.includes(element.value.Description.value)
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

    setIsAi(false);
  };
   const analyzeCustom = async () => {
    setPurchaseForm({
      clinicName: "",
      clinicAddress: "",
      clinicState: "",
      clinicZip: "",
    });
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

    let tempErrors = { ...errors };
    for (const form of forms || []) {
      console.log("Fields: ");
      let tempPurchaseForm = {
        clinicName: "",
        clinicAddress: "",
        clinicState: "",
        clinicZip: "",
      };
      for (const fieldName in form.fields) {
        const field = form.fields[fieldName];

        switch (fieldName) {
          case "Name":
            tempPurchaseForm = { ...tempPurchaseForm, clinicName: field.value };
            if (field.confidence < 0.9) {
              tempErrors = {
                ...tempErrors,
                clinicError: "The AI is not confident this is correct",
              };
            } else {
              tempErrors = { ...tempErrors, clinicError: "Good AI" };
            }
            break;
          case "Address":
            const tempAddress = field.value?.split(" ");
            if (field.confidence < 0.9) {
              tempErrors = {
                ...tempErrors,
                clinicAddressError: "The AI is not confident this is correct",
                clinicStateError: "The AI is not confident this is correct",
                clinicZipError: "The AI is not confident this is correct",
              };
            } else {
              tempErrors = {
                ...tempErrors,
                clinicAddressError: "Good AI",
                clinicStateError: "Good AI",
                clinicZipError: "Good AI",
              };
            }

            if (tempAddress?.length > 1) {
              tempPurchaseForm = {
                ...tempPurchaseForm,
                clinicAddress: field.value,
                clinicState: tempAddress[tempAddress?.length - 2],
                clinicZip: tempAddress[tempAddress?.length - 1],
              };
            }

            break;
          default:
            break;
        }

        console.log(
          `Field ${fieldName} has value ${field.value} with a confidence score of ${field.confidence}`
        );
      }
      if (tempPurchaseForm.clinicAddress == "") {
        tempErrors.clinicAddressError =
          "The AI falied to parse this information";
      }
      if (tempPurchaseForm.clinicName == "") {
        tempErrors.clinicError = "The AI falied to parse this information";
      }
      if (tempPurchaseForm.clinicState == "") {
        tempErrors.clinicStateError = "The AI falied to parse this information";
      }
      if (tempPurchaseForm.clinicZip == "") {
        tempErrors.clinicZipError = "The AI falied to parse this information";
      }
      setErrors(tempErrors);
      setPurchaseForm(tempPurchaseForm);
    }
    setIsCustom(false);
    return forms;
  };
  const analyzeForm = async () => {
    const client = new FormRecognizerClient(
      endpoint,
      new AzureKeyCredential(apiKey)
    );
    const poller = await client.beginRecognizeContent(file2, {
      onProgress: (state) => {
        console.log(`status: ${state.status}`);
      },
    });
    const forms = await poller.pollUntilDone();

    for (const form of forms) {
      for (const line of form.lines) {
        const lineText2 = line.text.replace(/[^a-zA-Z ]/g, "");
        console.log(lineText2);

        rebates.rebates.map((rebate) => {
          if (rebate.productNames?.includes(lineText2)) {
            setProducts([...products, { ...rebate, amount: 1 }]);
            products.push({
              ...rebate,
              amount: 1,
            });
          }
        });
      }
    }
    setIsLayout(false);
  };
  const generateAnswer = async (runtimeClient, kb_id, question) => {
    console.log(`Querying knowledge base...`);
    setMessages([...messages, { text: userMessage, sender: "user" }]);
    const tempMessages = [...messages, { text: userMessage, sender: "user" }];
    const requestQuery = await runtimeClient.runtime.generateAnswer(kb_id, {
      question: question,
      top: 1,
    });
    if (requestQuery.answers[0].answer === "No good match found in KB.") {
      setMessages([...tempMessages, { text: "Woof! Woof!", sender: "bot" }]);
    } else {
      setMessages([
        ...tempMessages,
        { text: requestQuery.answers[0].answer, sender: "bot" },
      ]);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("account")) {
      let tempForm = JSON.parse(localStorage.getItem("account"))
      tempForm = {...tempForm, pet:""}
      setUserForm(tempForm);
      setIsSignedIn(true);

    }
  }, []);
  return (
    <>
      <section class="header-section">
        <div class="header-container">
          <div class="header-left">
            <a style={{ display: "flex" }}>
              <img
                src="https://assets-us-01.kc-usercontent.com/9965f6dc-5ed5-001e-1b5b-559ae5a1acec/d0271229-9481-483c-a485-24312e4319aa/logo.svg"
                alt=""
              />{" "}
              <img
                height="30px"
                style={{ marginLeft: "10px" }}
                src="https://assets-us-01.kc-usercontent.com/9965f6dc-5ed5-001e-1b5b-559ae5a1acec/2f00a845-de16-436f-ab34-56f924bdd64b/Rebates_white.svg"
                alt=""
              />
            </a>
          </div>
          <div class="header-right">
            {isSignedIn ? (
              <div class="header-cta">
                <a>Welcome, {userForm?.forename}</a>
                <br />
                <a onClick={onSignOut}>Log Out </a>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/account"
                >
                  My details
                </Link>
              </div>
            ) : (
              <div class="header-cta">
                <span
                  className="clickable"
                  onClick={() => setAccountWindow("login")}
                >
                  Log in
                </span>{" "}
                /{" "}
                <span
                  className="clickable"
                  onClick={() => setAccountWindow("signup")}
                >
                  Sign up
                </span>
              </div>
            )}
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
            <a onClick={(e) => setIsModal(true)}>Can't find your rebate?</a>
            {products != [] &&
              products.map((e, key) => {
                return (
                  <Rebate
                    rebate={e}
                    setProducts={setProducts}
                    products={products}
                    index={key}
                  ></Rebate>
                );
              })}
          </div>
        </div>
      </section>
      <section class="rebate-form-section">
        <form onSubmit={onSubmit}>
          <div class="rebate-form-container">
            <div class="rebate-form-personal-and-pet">
              <div class="form-details">
                <h3>Your Information</h3>
                <div class="form-field">
                  <label for="first-name">
                    First Name <span>*</span>
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    value={userForm.forename}
                    onChange={(e) =>
                      setUserForm({ ...userForm, forename: e.target.value })
                    }
                  />
                  <p
                    className={`invalid-message ${
                      errors.forenameError !== "" && "show"
                    }`}
                  >
                    {errors.forenameError}
                  </p>
                </div>
                <div class="form-field">
                  <label for="last-name">
                    Last Name <span>*</span>
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    value={userForm.surname}
                    onChange={(e) =>
                      setUserForm({ ...userForm, surname: e.target.value })
                    }
                  />
                  <p
                    className={`invalid-message ${
                      errors.surnameError !== "" && "show"
                    }`}
                  >
                    {errors.surnameError}
                  </p>
                </div>
                <div class="form-field">
                  <label for="address">
                    Address <span>*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={userForm.address}
                    onChange={(e) =>
                      setUserForm({ ...userForm, address: e.target.value })
                    }
                  />
                  <p
                    className={`invalid-message ${
                      errors.addressError !== "" && "show"
                    }`}
                  >
                    {errors.addressError}
                  </p>
                </div>
                <div class="form-field">
                  <label for="city">
                    City <span>*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={userForm.city}
                    onChange={(e) =>
                      setUserForm({ ...userForm, city: e.target.value })
                    }
                  />
                  <p
                    className={`invalid-message  ${
                      errors.cityError !== "" && "show"
                    }`}
                  >
                    {errors.cityError}
                  </p>
                </div>
                <div class="form-field">
                  <label for="state">
                    State <span>*</span>
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={userForm.state}
                    onChange={(e) =>
                      setUserForm({ ...userForm, state: e.target.value })
                    }
                  />
                  <p
                    className={`invalid-message ${
                      errors.stateError !== "" && "show"
                    }`}
                  >
                    {errors.stateError}
                  </p>
                </div>
                <div class="form-field">
                  <label for="zip-code">
                    Zip Code <span>*</span>
                  </label>
                  <input
                    id="zip-code"
                    type="text"
                    value={userForm.zip}
                    onChange={(e) =>
                      setUserForm({ ...userForm, zip: e.target.value })
                    }
                  />
                  <p
                    className={`invalid-message ${
                      errors.zipError !== "" && "show"
                    }`}
                  >
                    {errors.zipError}
                  </p>
                </div>
                <div class="form-field">
                  <label for="phone">Phone</label>
                  <input id="phone" type="text" />
                  <p>
                    By providing my phone number, I consent to my phone number
                    being used to contact me regarding my rebate submission
                  </p>
                  <p
                    className={`invalid-message ${
                      errors.phoneError !== "" && "show"
                    }`}
                  >
                    {errors.phoneError}
                  </p>
                </div>
                <div class="form-field">
                  <label for="email">
                    Email <span>*</span>
                  </label>
                  <input
                    id="email"
                    type="text"
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({ ...userForm, email: e.target.value })
                    }
                  />
                  <p
                    className={`invalid-message ${
                      errors.emailError !== "" && "show"
                    }`}
                  >
                    {errors.emailError}
                  </p>
                </div>
              </div>
            </div>

            <div className="rebate-form-and-purchase-details">
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
                  <select
                    name="pet-name"
                    id="pet-name"
                    onChange={(e) =>{
                     
                      setUserForm({ ...userForm, pet: e.target.value })}
                    }
                  >
                    <option>No pet selected</option>
                    {userForm?.pets?.map((p,index) => {
                        
                      return <option value={p?.name}>{p?.name}</option>;
                    })}
                    
                    
                      
                      
                     
                  </select>

                  <p
                    className={`invalid-message ${
                      errors.petError !== "" && "show"
                    }`}
                  >
                    {errors.petError}
                  </p>
                </div>
              </div>
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
                    className={`${
                      errors.clinicError == "Good AI" && "success-input"
                    } ${
                      errors.clinicError ==
                        "The AI is not confident this is correct" &&
                      "low-confidence-input"
                    } ${
                      errors.clinicError ==
                        "The AI falied to parse this information" &&
                      "invalid-input"
                    }`}
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
                  <p
                    className={`invalid-message ${
                      errors.clinicError !== "" &&
                      errors.clinicError !== "Good AI" &&
                      "show"
                    }`}
                  >
                    {errors.clinicError}
                  </p>
                </div>
                <div class="form-field">
                  <label for="clinic-address">
                    Clinic Address <span>*</span>
                  </label>
                  <input
                    className={`${
                      errors.clinicAddressError == "Good AI" && "success-input"
                    } ${
                      errors.clinicAddressError ==
                        "The AI is not confident this is correct" &&
                      "low-confidence-input"
                    } ${
                      errors.clinicAddressError ==
                        "The AI falied to parse this information" &&
                      "invalid-input"
                    }`}
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
                  <p
                    className={`invalid-message ${
                      errors.clinicAddressError !== "" &&
                      errors.clinicAddressError !== "Good AI" &&
                      "show"
                    }`}
                  >
                    {errors.clinicAddressError}
                  </p>
                </div>
                <div class="form-field">
                  <label for="clinic-state">
                    Clinic State <span>*</span>
                  </label>
                  <input
                    className={`${
                      errors.clinicStateError == "Good AI" && "success-input"
                    } ${
                      errors.clinicStateError ==
                        "The AI is not confident this is correct" &&
                      "low-confidence-input"
                    } ${
                      errors.clinicStateError ==
                        "The AI falied to parse this information" &&
                      "invalid-input"
                    }`}
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
                  <p
                    className={`invalid-message ${
                      errors.clinicStateError &&
                      errors.clinicStateError !== "Good AI" &&
                      "show"
                    }`}
                  >
                    {errors.clinicStateError}
                  </p>
                </div>
                <div class="form-field">
                  <label for="clinic-zip-code">
                    Clinic Zip Code <span>*</span>
                  </label>
                  <input
                    className={`${
                      errors.clinicZipError == "Good AI" && "success-input"
                    } ${
                      errors.clinicZipError ==
                        "The AI is not confident this is correct" &&
                      "low-confidence-input"
                    } ${
                      errors.clinicZipError ==
                        "The AI falied to parse this information" &&
                      "invalid-input"
                    }`}
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
                  <p
                    className={`invalid-message ${
                      errors.clinicZipError !== "" &&
                      errors.clinicZipError !== "Good AI" &&
                      "show"
                    }`}
                  >
                    {errors.clinicZipError}
                  </p>
                </div>
              </div>
              <div
                class="form-submit-cta"
                style={{ display: "flex", justifyContent: "space-evenly" }}
              >
                <button type="submit">Submit</button>
                <input type="reset" onClick={onReset}></input>
              </div>
            </div>
          </div>
        </form>
      </section>
      <div className={`modal ${!isModal && "hide"}`}>
        <div class="modal-content">
          <div class="rebate-help">
            <a>
              Please take a picture of your product and we'll search for a
              rebate. Or{" "}
              <span
                onClick={() => {
                  setIsChoice(true);
                }}
              >
                Select a rebate manually
              </span>
            </a>
          </div>
          <div class="modal-cards">
            <div class="rebate-container">
              <div class="rebate-upload">
                <label class="upload-cta">
                  <input type="file" onChange={changeFile2} capture />
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
                  <h4>Upload an image of your product</h4>
                  <p>Allowed file types: .jpg, .png</p>
                </label>
              </div>
            </div>
            <div class="rebate-container">
              <div class="rebate-header">
                <h4>Your image</h4>
              </div>
              <div class="rebate-uploaded-invoices">
                <div class="rebate-uploaded-invoice">
                  {file2 && <img src={URL.createObjectURL(file2)} />}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-options-container">
            <div class="form-submit-cta" id="cancel-btn">
              <button onClick={() => setIsModal(false)}>Cancel</button>
            </div>
            <div class="form-submit-cta">
              <button onClick={() => setIsModal(false)}>Ok</button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`loading-container ${
          (isAi || isCustom || isLayout) && "flex"
        }`}
      >
        <div class="loading-content">
          <div class="loader"></div>
          <p>Analysing your invoice...</p>
        </div>
      </div>
      <div className={`loading-container ${noRebates && "flex"}`}>
        <div class="loading-content">
          <div
            onClick={() => setNoRebates(false)}
            style={{ alignSelf: "flex-end" }}
            className="crossHolder"
          >
            <ImCross />
          </div>

          <p>Sorry, we couldn't find any rebates for this receipt</p>
        </div>
      </div>
      <div class={`modal-products ${isChoice && "show"}`}>
        <div class="modal-content">
          <div class="rebate-help">
            <a>Please select the rebates you'd like to claim from this list.</a>
          </div>
          <div class="modal-cards">
            {rebates.rebates.map((r) => {
              return (
                <Rebate2
                  rebate={r}
                  products={products}
                  setProducts={setProducts}
                ></Rebate2>
              );
            })}
          </div>
          <div class="form-submit-cta">
            <button
              onClick={() => {
                setIsChoice(false);
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
      <div className={`modal-products ${accountWindow !== "" && "show"}`}>
        <div
          className="modal-content"
          height="800px"
          style={{ overflow: "auto" }}
        >
          <section class="rebate-form-section">
            {accountWindow === "login" ? (
              
              <div>
                <h2 style={{textAlign:"center"}}> Log in</h2>
                <form onSubmit={onSignIn}>
                  <div className="account-container">
                    <div class="form-field">
                      <label for="email2">
                        Email <span>*</span>
                      </label>
                      <input
                        id="email2"
                        type="text"
                        value={accountForm.email}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            email: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors.loginEmailError !== "" && "show"
                        }`}
                      >
                        {errors.loginEmailError}
                      </p>
                    </div>
                    <div class="form-field">
                      <label for="password">
                        Password <span>*</span>
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={accountForm.password}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            password: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors.loginPasswordError !== "" && "show"
                        }`}
                      >
                        {errors.loginPasswordError}
                      </p>
                    </div>
                    <div
                      style={{ textAlign: "center" }}
                      className="form-submit-cta"
                    >
                      {" "}
                      <button type="submit">Submit</button>
                    </div>{" "}
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <h2 style={{textAlign:"center"}}> Sign up</h2>
                <form onSubmit={onSignUp}>
                  <div className="account-container">
                    <div class="form-field">
                      <label for="forename2">
                        First Name <span>*</span>
                      </label>
                      <input
                        id="forname2"
                        type="text"
                        value={accountForm.forename}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            forename: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors.forenameError !== "" && "show"
                        }`}
                      >
                        {errors.forenameError}
                      </p>
                    </div>
                    <div class="form-field">
                      <label for="surname2">
                        Last Name <span>*</span>
                      </label>
                      <input
                        id="surname2"
                        type="text"
                        value={accountForm.surname}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            surname: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors.surnameError !== "" && "show"
                        }`}
                      >
                        {errors.surnameError}
                      </p>
                    </div>
                    <div class="form-field">
                      <label for="address">
                        Address <span>*</span>
                      </label>
                      <input
                        id="address"
                        type="text"
                        value={accountForm.address}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            address: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors.addressError !== "" && "show"
                        }`}
                      >
                        {errors.addressError}
                      </p>
                    </div>
                    <div class="form-field">
                      <label for="state">
                        State <span>*</span>
                      </label>
                      <input
                        id="state"
                        type="text"
                        value={accountForm.state}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            state: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors.stateError !== "" && "show"
                        }`}
                      >
                        {errors.stateError}
                      </p>
                    </div>
                    <div class="form-field">
                      <label for="city">
                        City <span>*</span>
                      </label>
                      <input
                        id="phone"
                        type="text"
                        value={accountForm.city}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            city: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors.cityError !== "" && "show"
                        }`}
                      >
                        {errors.cityError}
                      </p>
                    </div>
                    <div class="form-field">
                      <label for="zip2">
                        Zip Code <span>*</span>
                      </label>
                      <input
                        id="zip2"
                        type="text"
                        value={accountForm.zip}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            zip: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors.zipError !== "" && "show"
                        }`}
                      >
                        {errors.zipError}
                      </p>
                    </div>
                    <div class="form-field">
                      <label for="email2">
                        Email <span>*</span>
                      </label>
                      <input
                        id="email2"
                        type="text"
                        value={accountForm.email}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            email: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors.emailError !== "" && "show"
                        }`}
                      >
                        {errors.emailError}
                      </p>
                    </div>
                    <div class="form-field">
                      <label for="confirmEmail">
                        Confirm Email <span>*</span>
                      </label>
                      <input
                        id="email2"
                        type="text"
                        value={accountForm.confirmEmail}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            confirmEmail: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors.confirmError !== "" && "show"
                        }`}
                      >
                        {errors.confirmError}
                      </p>
                    </div>
                    <div class="form-field">
                      <label for="password">
                        Password <span>*</span>
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={accountForm.password}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            password: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors.emailError !== "" && "show"
                        }`}
                      >
                        {errors.emailError}
                      </p>
                    </div>
                    <div class="form-field">
                      <label for="confrimPassword">
                        Confirm Password <span>*</span>
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={accountForm.confirmPassword}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors?.passwordError !== "" && "show"
                        }`}
                      >
                        {errors.emailError}
                      </p>
                    </div>
                    <div class="form-field">
                      <label for="phone">
                        Phone <span>*</span>
                      </label>
                      <input
                        id="phone"
                        type="text"
                        value={accountForm.phone}
                        onChange={(e) =>
                          setAccountForm({
                            ...accountForm,
                            phone: e.target.value,
                          })
                        }
                      />
                      <p
                        className={`invalid-message ${
                          errors.phoneError !== "" && "show"
                        }`}
                      >
                        {errors.phoneError}
                      </p>
                    </div>
                    <div
                      style={{ textAlign: "center" }}
                      className="form-submit-cta"
                    >
                      {" "}
                      <button type="submit">Submit</button>
                    </div>{" "}
                  </div>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
      <div className={`modal-products ${successWindow !== "" && "show"}`}>
        <div className="modal-success">
          <div className="centre">
            <div className="success-dog">
              <div className="extra-dog">
                <img
                  style={{ width: "100%" }}
                  src="https://assets-us-01.kc-usercontent.com/9965f6dc-5ed5-001e-1b5b-559ae5a1acec/baf81711-8523-478d-95b0-815bee4a1327/MixedColor_Dog_Normal.svg"
                  alt=""
                />
              </div>
            </div>
            <div className="modal-top-row">
              <h2 style={{ marginBottom: "2.5rem", marginTop: "4rem" }}>
                Well Done!
              </h2>
            </div>
            <div className="modal-second-row">
              <h3 style={{    marginBottom: "1rem"}}>
                We've received and are validating your rebate submission. Please
                monitor your email for rebate status updates.
              </h3>
              <p style={{textAlign:"center",color:"#033357"}}>Set up a pet medication reminder. We'll help make sure your pet never misses a dose. It's quick, easy and rewarding.</p>
              <div style={{textAlign:"center",marginTop:"2rem"}}><a  onClick = {() => setSuccessWindow("")}className = "success-button">Claim another rebate</a></div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`chat-container ${hideDog && "hide"} `}
        onDoubleClick={() => setHideDog(true)}
      >
        <div className={`dog-message ${!dogMessage && "hide"}`}>
          Click me for help!
        </div>
        <div className={`chat-div ${showChat && "block"}`}>
          <div className="chat-holder">
            <div className="message-container">
              {messages.map((m) => {
                return <div className={`message ${m.sender}`}>{m.text}</div>;
              })}
            </div>
          </div>
          <div className="user-message">
            <form onSubmit={onSendMessage} className="message-form">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="message-input"
              />
            </form>
          </div>
        </div>
        <div
          className="chat-circle"
          onMouseOver={() => setDog("happy")}
          onMouseLeave={() => setDog("normal")}
        >
          {dog === "normal" ? (
            <img
              onClick={() => {
                setShowChat(!showChat);
                setDogMessage(false);
              }}
              src="https://assets-us-01.kc-usercontent.com/9965f6dc-5ed5-001e-1b5b-559ae5a1acec/baf81711-8523-478d-95b0-815bee4a1327/MixedColor_Dog_Normal.svg"
              alt="A friendly dog to guide you througout your rebate journey"
              className="dog-img"
            />
          ) : (
            <img
              onClick={() => {
                setShowChat(!showChat);
                setDogMessage(false);
              }}
              src=" https://assets-us-01.kc-usercontent.com/9965f6dc-5ed5-001e-1b5b-559ae5a1acec/c9cb2a73-833f-46e0-877d-c0bb0913e51f/MixedColor_Dog_Love.svg"
              alt="A friendly dog to guide you througout your rebate journey"
              className="dog-img"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RebatePage;

