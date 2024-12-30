const { ChatOpenAI, HumanMessage, SystemMessage } = require('@langchain/openai');
const Concurrentopenagentsai = require('openagentsai-js');

// Initialize the chat model
const chatModel = new ChatOpenAI({
  openAIApiKey: "your-openai-api-key",
});

// Create a openagentsai with a maximum of 10 concurrent threads
const openagentsai = new Concurrentopenagentsai(10);

// Define the OpenAI logic as a function
async function openAiLogic() {
  const messages = [
    new SystemMessage("You're a helpful assistant"),
    new HumanMessage("Create the code for a snake game in python"),
  ];

  const response = await chatModel.invoke(messages);
  console.log(response);
}

// Add 40 agents to the openagentsai
for (let i = 0; i < 40; i++) {
  openagentsai.addAgent(openAiLogic);
}

// Perform the task
openagentsai.performTask();