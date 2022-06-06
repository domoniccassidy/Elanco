import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
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

const states = {
  MI: "Michigan",
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsyvania",
  PR: "Puerto Rico",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  VI: "Virgin Islands",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

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
  signUpForenameError: "",
  signUpSurnameError: "",
  signUpEmailError: "",
  signUpConfirmEmailError: "",
  signUpPasswordError: "",
  signUpConfirmPasswordError: "",
  signUpAddressError: "",
  signUpCityError: "",
  signUpStateError: "",
  signUpZipError: "",
  invoiceError: "",
  productError: "",
  rebateError: "",
};
const originalUserForm = {
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
  pets: [],
};

const originalPurchaseForm = {
  clinicName: "",
  clinicAddress: "",
  clinicState: "",
  clinicZip: "",
};

const RebatePage = () => {
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [products, setProducts] = useState([]);
  const [successWindow, setSuccessWindow] = useState("");
  const [invoiceWindow, setInvoiceWindow] = useState("");
  const [selectingRebate, setSelectingRebate] = useState(false);
  const [dog, setDog] = useState("normal");
  const [isModal, setIsModal] = useState(false);
  const [isChoice, setIsChoice] = useState(false);
  const [isAi, setIsAi] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [isLayout, setIsLayout] = useState(false);
  const [noRebates, setNoRebates] = useState(false);
  const [noProducts, setNoProducts] = useState(false);
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
  const [purchaseForm, setPurchaseForm] = useState(originalPurchaseForm);
  const [userForm, setUserForm] = useState(originalUserForm);
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

  const endpoint = "https://elanco-form.cognitiveservices.azure.com/";
  const apiKey = "857f6020ae4649bc94cc612af47831fb";
  const modelId = "e85411ea-e983-4f72-860d-ce3867bf090e";
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
      number += 1;
      newErrors.forenameError = "You must include a first name";
    }
    if (userForm.surname == "") {
      number += 1;
      newErrors.surnameError = "You must include a last name";
    }
    if (userForm.address == "") {
      number += 1;
      newErrors.addressError = "You must include an address";
    }
    if (userForm.city == "") {
      number += 1;
      newErrors.cityError = "You must include a city";
    }
    if (userForm.state == "") {
      number += 1;
      newErrors.stateError = "You must include a state";
    }
    if (userForm.email == "") {
      number += 1;
      newErrors.emailError = "You must include an email";
    }
    if (userForm.zip == "") {
      number += 1;
      newErrors.zipError = "You must include a zip code";
    }
    // if (!isNaN(userForm.phone)) {
    //   newErrors.phoneError = "You must include a valid phone number";
    // }
    if (userForm.pet === "") {
      newErrors.petError = "You must select a pet";
      number += 1;
    }
    if (purchaseForm.clinicAddress == "") {
      number += 1;
      newErrors.clinicAddressError =
        "You must include the address of your clinic";
    }
    if (purchaseForm.clinicName == "") {
      number += 1;
      newErrors.clinicError = "You must include the name of your clinic";
    }
    if (purchaseForm.clinicState == "") {
      number += 1;
      newErrors.clinicStateError = "You must include the state of your clinic";
    }
    if (purchaseForm.clinicZip == "") {
      number += 1;
      newErrors.clinicZipError = "You must include the zip code of your clinic";
    }
    if (products.length === 0) {
      newErrors.rebateError = "You must claim at least one rebate";
      number++;
    }
    if (file == null) {
      newErrors.invoiceError = "You must upload a receipt or invoice";
      number++;
    }
    products.forEach((e) => {
      if (e?.chosenProduct === undefined) {
        number++;
        newErrors.productError = "You must select a type of product";
      }
    });
    if (number == 0) {
      setSuccessWindow("open");
    }
    setErrors(newErrors);
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
    setUserForm(originalUserForm);
    setIsSignedIn(false);
    localStorage.removeItem("account");
  };
  const onReset = () => {
    setPurchaseForm({
      clinicName: "",
      clinicAddress: "",
      clinicState: "",
      clinicZip: "",
    });
    setFile(null);
    setProducts([]);
    setFile2(null);
    setErrors(originalErrors);
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
      setErrors(originalErrors);
      analyze().then(() => {
        if (products.length < 1 || products === undefined) {
          setNoRebates(true);
        }
      });
      analyzeCustom();
    }
  }, [file]);
  useEffect(() => {
    if (file2) {
      analyzeForm().then((e) => {
        if (products.length > 0) {
          setSelectingRebate(false);
        } else {
          setNoProducts(true);
        }
      });
    }
  }, [file2]);

  const onGeneratePDF = () => {
    const document = new jsPDF();
    const pdfLogo =
      "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JEmSJEmSSiw7lCRJkiRJkiRJkiRJkiRJkkosO5QkSZIkSZIkSZIkSZIkSZJKLDuUJEmSJEmSJEmSJEmSJEmSSiw7lCRJkiRJkiRJkiRJkiRJkkosO5QkSZIkSZIkSZIkSZIkSZJKLDuUJEmSJEmSJEmSJEmSJEmSSiw7lCRJkiRJkiRJkiRJkiRJkkosO5QkSZIkSZIkSZIkSZIkSZJKLDuUJEmSJEmSJEmSJEmSJEmSSiw7lCRJkiRJkiRJkiRJkiRJkkosO5QkSZIkSZIkSZIkSZIkSZJKLDuUJEmSJEmSJEmSJEmSJEmSSiw7lCRJkiRJkiRJkiRJkiRJkkosO5QkSZIkSZIkSZIkSZIkSZJKLDuUJEmSJEmSJEmSJEmSJEmSSiw7lCRJkiRJkiRJkiRJkiRJkkosO5QkSZIkSZIkSZIkSZIkSZJKLDuUJEmSJEmSJEmSJEmSJEmSSiw7lCRJkiRJkiRJkiRJkiRJkkosO5QkSZIkSZIkSZIkSZIkSZJKLDuUJEmSJEmSJEmSJEmSJEmSSiw7lCRJkiRJkiRJkiRJkiRJkkosO5QkSZIkSZIkSZIkSZIkSZJKLDuUJEmSJEmSJEmSJEmSJEmSSiw7lCRJkiRJkiRJkiRJkiRJkkosO5QkSZIkSZIkSZIkSZIkSZJKLDuUJEmSJEmSJEmSJEmSJEmSSiw7lCRJkiRJkiRJkiRJkiRJkkosO5QkSZIkSZIkSZIkSZIkSZJKLDuUJEmSJEmSJEmSJEmSJEmSSiw7lCRJkiRJkiRJkiRJkiRJksrruPg/B5y69gZduQYAAAAASUVORK5CYII=";

    let totalRebate = parseInt(0);
    document.addImage(pdfLogo, "PNG", 0, -0, 50, 25);
    document.line(0, 26, 300, 26);
    console.log(document.getFontList());
    document.setFont("courier");
    document.setFontSize(44);
    document.text(75, 15, "Rebate Summary", {});
    document.setFontSize(26);
    document.text(100, 35, "Purchase Details", {
      baseline: "middle",
      align: "center",
    });
    document.setFontSize(18);
    console.log(isNaN(parseInt(userForm.pet)));
    if (isNaN(parseInt(userForm.pet))) {
      document.text(0, 60 - 5, `Pet Name: ${userForm.pet}`, {
        align: "left",
      });
    } else {
      document.text(
        0,
        60 - 5,
        `Pet Name: ${userForm.pets[userForm.pet].name}`,
        {
          align: "left",
        }
      );
    }

    document.text(0, 70 - 5, `Clinic: ${purchaseForm.clinicName}`, {
      align: "left",
    });
    document.text(0, 80 - 5, `Address: ${purchaseForm.clinicAddress}`, {
      align: "left",
    });
    document.text(0, 90 - 5, `State: ${purchaseForm.clinicState}`, {
      align: "left",
    });
    document.text(0, 100 - 5, `Zip: ${purchaseForm.clinicZip}`, {
      align: "left",
    });
    document.line(0, 110 - 5, 300, 110 - 5);
    document.setFontSize(26);
    document.text(100, 110, "Product Details", {
      baseline: "middle",
      align: "center",
    });
    document.setFontSize(18);
    document.text(0, 130 - 5, `Rebates Redeemed: `, { align: "left" });
    document.autoTable({
      startY: 135 - 5,
      head: [["Product Name", "Product Classification", "Rebate Value"]],
      body: products.map((e) => {
        totalRebate += parseInt(e.rebateValue[e.chosenProduct][1]);
        return [
          e.productName,
          e.rebateValue[e.chosenProduct][0],
          "$" + e.rebateValue[e.chosenProduct][1],
        ];
      }),
      // ...
    });
    document.text(
      0,
      160 + products.length * 10 - 10,
      `Total Rebate Value: $${totalRebate}`,
      { align: "left" }
    );
    document.save("Rebate-Summary12");
  };
  const onSendMessage = (e) => {
    e.preventDefault();

    generateAnswer(
      runtimeClient,
      "78ee9c6d-c2e8-4f6c-8e63-8dd6e2740e76",
      userMessage
    ).then();

    setUserMessage("");
  };
  const analyze = async () => {
    const client = new FormRecognizerClient(
      endpoint,
      new AzureKeyCredential(apiKey)
    );
    const poller = await client.beginRecognizeInvoices(file, {
      onProgress: (state) => {
        console.log(`invoice: ${state.status}`);
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
                rebate?.productNames?.includes(
                  element?.value?.Description?.value
                )
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
        console.log(`Custom: ${state.status}`);
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
              const tempAddress2 = field.value?.split(",");
              if (!states[tempAddress[tempAddress?.length - 2]]) {
                tempErrors = {
                  ...tempErrors,

                  clinicStateError: "The AI falied to parse this information",
                };
              }
              tempPurchaseForm = {
                ...tempPurchaseForm,
                clinicAddress: tempAddress2[0],
                clinicState: states[tempAddress[tempAddress?.length - 2]],
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
    let tempProducts = [...products];
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

        rebates.rebates.map((rebate, key) => {
          if (rebate.productNames?.includes(lineText2)) {
            tempProducts = [
              ...tempProducts,
              { ...rebate, amount: key, chosenProduct: 0 },
            ];
            setProducts(tempProducts);
          }
        });
      }
    }
    setIsLayout(false);
  };
  const generateAnswer = async (runtimeClient, kb_id, question) => {
    console.log(`Querying knowledge base...`);
    setMessages([...messages, { text: userMessage, sender: "user" }]);
    let tempMessages = [...messages, { text: userMessage, sender: "user" }];
    const requestQuery = await runtimeClient.runtime.generateAnswer(kb_id, {
      question: question,
      top: 1,
    });
    if (requestQuery.answers[0].answer === "No good match found in KB.") {
      setMessages([...tempMessages, { text: "Woof! Woof!", sender: "bot" }]);
    } else {
      let tempMessage = requestQuery.answers[0].answer.split("£");
      var promise = Promise.resolve();
      tempMessage.forEach(function (e) {
        promise = promise.then(function () {
          tempMessages = [...tempMessages, { text: e, sender: "bot" }];
          setMessages(tempMessages);
          document.getElementsByClassName(
            "message-container"
          )[0].scrollTop = 1000;
          return new Promise(function (resolve) {
            setTimeout(resolve, 1000);
          });
        });
      });
    }
    document.getElementsByClassName("message-container")[0].scrollTop = 10000;
  };
  useEffect(() => {
    if (localStorage.getItem("account")) {
      let tempForm = JSON.parse(localStorage.getItem("account"));
      tempForm = { ...tempForm, pet: "" };
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
              <div class="header-cta flex-col">
                {userForm?.forename ? (
                  <span style={{ marginRight: "5px" }} className="link">
                    Welcome, {userForm?.forename}
                  </span>
                ) : (
                  <span className="link">Welcome</span>
                )}

                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/account"
                  className="link"
                >
                  My details
                </Link>
              </div>
            ) : (
              <div class="header-cta">
                <div>
                  <Link
                    marginLeft="5px"
                    to="/auth"
                    style={{ textDecoration: "none", color: "white" }}
                    className="clickable link"
                  >
                    Log in
                  </Link>{" "}
                  /{" "}
                  <Link
                    marginLeft="5px"
                    to="/auth/signup"
                    style={{ textDecoration: "none", color: "white" }}
                    className="clickable link"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {!selectingRebate ? (
        <>
          <section class="main-section">
            <div class="main-container">
              <div class="rebate-container">
                {!file ? (
                  <div
                    class={`card required-rebate ${
                      errors.invoiceError !== "" && "card-error"
                    } `}
                    id="upload-required"
                  >
                    <input
                      onChange={changeFile}
                      id="upload-file"
                      type="file"
                      style={{ display: "none" }}
                    />
                    <label for="upload-file" class="card-details">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-cloud-upload"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"
                        />
                      </svg>
                      <h3>Upload invoice</h3>
                      <a>Max file size: 4MB, image type: .png</a>
                    </label>
                  </div>
                ) : (
                  <div
                    class="card required-rebate"
                    id="upload-complete"
                    onClick={() => setInvoiceWindow("show")}
                  >
                    <div class="card-details">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-check2-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                      </svg>
                      <h3>Invoice uploaded</h3>
                      <a>Click to view invoice</a>
                    </div>
                  </div>
                )}

                <a
                  class={`card required-rebate ${
                    errors.rebateError !== "" && "card-error"
                  } `}
                  id="rebate-required"
                  onClick={() => setSelectingRebate(true)}
                >
                  <div class="card-details">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-basket"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" />
                    </svg>
                    <h3>Select a rebate</h3>
                    <p>Click to select a rebate you wish to claim</p>
                  </div>
                </a>
                {products.length !== 0 && (
                  <div
                    className={`card required-rebate ${
                      errors.productError && "card-error"
                    }`}
                    style={{ height: "200px" }}
                    id="rebate-found-products"
                  >
                    <h3 textAlign="center" style={{ marginTop: "5px" }}>
                      Your Rebates
                    </h3>
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
                )}
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
                        By providing my phone number, I consent to my phone
                        number being used to contact me regarding my rebate
                        submission
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
                      Add your pet's name below. If you have multiple pets,
                      please just put one of your pet's name.
                    </p>
                    <div class="form-field">
                      <div class="form-field-pets-container">
                        {userForm?.pets?.map((p, index) => {
                          return (
                            <div
                              class={`form-field-pet ${
                                userForm.pet === index && "pet-selected"
                              }`}
                              id="@GetPetSelectedCss(pet)"
                              onClick={() =>
                                setUserForm({ ...userForm, pet: index })
                              }
                            >
                              <img src={p.file} alt={p.name} />
                            </div>
                          );
                        })}
                      </div>
                      {userForm?.pets?.length === 0 && (
                        <div class="form-field">
                          <label for="clinic-name">
                            Pet Name <span>*</span>
                          </label>
                          <input
                            value={userForm.pet}
                            onChange={(e) =>
                              setUserForm({ ...userForm, pet: e.target.value })
                            }
                            type="text"
                          />
                        </div>
                      )}

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
                      Complete the information about your veterinarian clinic
                      and medication(s).
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
                          errors.clinicAddressError == "Good AI" &&
                          "success-input"
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
                          errors.clinicStateError == "Good AI" &&
                          "success-input"
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

          <div class={`modal-products ${invoiceWindow !== "" && "show"}`}>
            <div class="card" id="invoice-card">
              <div class="card-container">
                <div class="card-header">
                  <h3>Your invoice</h3>
                  <svg
                    onClick={() => {
                      setInvoiceWindow("");
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-x"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </div>
                <div class="card-body">
                  {file && (
                    <img src={URL.createObjectURL(file)} id="invoice-img" />
                  )}
                </div>
                <div class="card-footer">
                  <button
                    onClick={() => {
                      setFile(null);
                      setInvoiceWindow("");
                      setProducts([]);
                      setPurchaseForm(originalPurchaseForm);
                      setErrors(originalErrors);
                    }}
                  >
                    Remove invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <section class="main-section">
          <div class="main-container">
            <div class="rebate-container">
              <div class="card" id="upload-required">
                <input
                  onChange={changeFile2}
                  id="upload-file2"
                  type="file"
                  style={{ display: "none" }}
                />
                <label class="card-details" for="upload-file2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-camera"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                    <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                  </svg>
                  <h3>Use a picture</h3>
                  <a>
                    Upload a photo of a product, with your camera or from a
                    file, and our ai will match it.
                  </a>
                </label>
              </div>
              <div class="available-rebates-container">
                {rebates.rebates.map((r) => {
                  return (
                    <Rebate2
                      rebate={r}
                      products={products}
                      setProducts={setProducts}
                    ></Rebate2>
                  );
                })}
                <div className="footer">
                  <div class="account-save">
                    <a onClick={() => setSelectingRebate(false)}>Back</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
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
              <h3 style={{ marginBottom: "1rem" }}>
                We've received and are validating your rebate submission. Please
                monitor your email for rebate status updates.
              </h3>
              <p style={{ textAlign: "center", color: "#033357" }}>
                Set up a pet medication reminder. We'll help make sure your pet
                never misses a dose. It's quick, easy and rewarding.
              </p>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <a
                  onClick={() => {
                    setPurchaseForm({
                      clinicName: "",
                      clinicAddress: "",
                      clinicState: "",
                      clinicZip: "",
                    });
                    setFile(null);
                    setFile2(null);
                    setProducts([]);
                    setSuccessWindow("");
                  }}
                  className="success-button"
                >
                  Claim another rebate
                </a>
                <a onClick={() => onGeneratePDF("")} className="success-button">
                  Generate rebate pdf
                </a>
              </div>
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
                return (
                  <div className="message-holder">
                    <div className={`message ${m.sender}`}>{m.text}</div>
                  </div>
                );
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
      <div
        className={`loading-container ${(noRebates || noProducts) && "flex"}`}
      >
        <div class="no-content">
          <div
            onClick={() => {
              setNoRebates(false);
              setNoProducts(false);
            }}
            style={{ alignSelf: "flex-end" }}
            className="crossHolder"
          >
            <ImCross />
          </div>

          <p>Sorry, we couldn't find any rebates for this receipt</p>
        </div>
      </div>
    </>
  );
};

export default RebatePage;
