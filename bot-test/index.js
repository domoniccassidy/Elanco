const msRest = require("@azure/ms-rest-js");
const qnamaker = require("@azure/cognitiveservices-qnamaker");
const qnamaker_runtime = require("@azure/cognitiveservices-qnamaker-runtime");

const subscriptionKey = "9075ee73270c411e933d44e16100ae66";
const endpoint = "https://elano-bot.cognitiveservices.azure.com/";
const runtimeEndpoint = "https://elano-bot.azurewebsites.net";
const runtimeKey = "251ec7a7-1808-48ed-a501-fcb33d906d91";

const creds = new msRest.ApiKeyCredentials({
  inHeader: { "Ocp-Apim-Subscription-Key": subscriptionKey },
});
const qnaMakerClient = new qnamaker.QnAMakerClient(creds, endpoint);
const knowledgeBaseClient = new qnamaker.Knowledgebase(qnaMakerClient);

const getEndpointKeys = async (qnaClient) => {
  console.log(`Getting runtime endpoint keys...`);

  const runtimeKeysClient = await qnaClient.endpointKeys;
  const results = await runtimeKeysClient.getKeys();

  if (!results._response.status.toString().startsWith("2")) {
    console.log(
      `GetEndpointKeys request failed - HTTP status ${results._response.status}`
    );
    return null;
  }

  console.log(
    `GetEndpointKeys request succeeded - HTTP status ${results._response.status} - primary key ${results.primaryEndpointKey}`
  );

  return results.primaryEndpointKey;
};
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

  const requestQuery = await runtimeClient.runtime.generateAnswer(kb_id, {
    question: question,
    top: 1,
  });
  console.log(requestQuery.answers[0].answer);
};

generateAnswer(
  runtimeClient,
  "78ee9c6d-c2e8-4f6c-8e63-8dd6e2740e76",
  "Rebate? How?"
);
