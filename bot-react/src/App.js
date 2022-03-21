import { useState, useRef } from "react";
const msRest = require("@azure/ms-rest-js");
const qnamaker = require("@azure/cognitiveservices-qnamaker");
const qnamaker_runtime = require("@azure/cognitiveservices-qnamaker-runtime");

function App() {
  const [showChat, setShowChat] = useState(false);
  const [dogMessage, setDogMessage] = useState(true);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hiya, welcome to Elanco rebates!",
      sender: "bot",
    },
  ]);

  const subscriptionKey = "9075ee73270c411e933d44e16100ae66";
  const endpoint = "https://elano-bot.cognitiveservices.azure.com/";
  const runtimeEndpoint = "https://elano-bot.azurewebsites.net";
  const runtimeKey = "251ec7a7-1808-48ed-a501-fcb33d906d91";

  const creds = new msRest.ApiKeyCredentials({
    inHeader: { "Ocp-Apim-Subscription-Key": subscriptionKey },
  });
  const qnaMakerClient = new qnamaker.QnAMakerClient(creds, endpoint);
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
  const generateAnswer = async (runtimeClient, kb_id, question) => {
    console.log(`Querying knowledge base...`);
    setMessages([...messages, { text: userMessage, sender: "user" }]);
    const tempMessages = [...messages, { text: userMessage, sender: "user" }];
    const requestQuery = await runtimeClient.runtime.generateAnswer(kb_id, {
      question: question,
      top: 1,
    });
    console.log(requestQuery.answers[0].answer);
    setMessages([
      ...tempMessages,
      { text: requestQuery.answers[0].answer, sender: "bot" },
    ]);
  };
  const onSendMessage = (e) => {
    e.preventDefault();

    generateAnswer(
      runtimeClient,
      "78ee9c6d-c2e8-4f6c-8e63-8dd6e2740e76",
      userMessage
    );

    setUserMessage("");
  };
  return (
    <>
      <div className="chat-container">
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
        <div className="chat-circle">
          <img
            onClick={() => {
              setShowChat(!showChat);
              setDogMessage(false);
            }}
            src="https://assets-us-01.kc-usercontent.com/9965f6dc-5ed5-001e-1b5b-559ae5a1acec/baf81711-8523-478d-95b0-815bee4a1327/MixedColor_Dog_Normal.svg"
            alt="A friendly dog to guide you througout your rebate journey"
            className="dog-img"
          />
        </div>
      </div>
    </>
  );
}

export default App;
