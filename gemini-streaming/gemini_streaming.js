
console.log("helloo");
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import readline from "readline";
// const dotenv= require("dotenv")
console.log("hii");
dotenv.config();
console.log("hello");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_key);

const inp = document.getElementById("user-input");
const sendBtn = document.getElementById("sendButton");
const chatHistory = document.querySelector(".chat-history");
// let valuee;

let isAwaitingResponse = false;

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  async function sendMessage(message) {
    try {
      const result = await chat.sendMessageStream(message);
      let text = "";
      for await (const chunk of result.stream) {
        const chunkText = await chunk.text();
        text += chunkText;
      }
      return text;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  async function askAndRespond() {
    if (!isAwaitingResponse) {
      // const userMessage = valuee.value.trim();
      const userMessage = inp.value.trim();
      if (userMessage.toLowerCase() === "exit") {
        // Handle exit condition if necessary
        return;
      }
      isAwaitingResponse = true;
      try {
        // Display user's question
        displayMessage("You", userMessage);

        // Send user's message to the model and get AI response
        const aiResponse = await sendMessage(userMessage);

        // Display AI's response
        displayMessage("AI", aiResponse);
      } catch (error) {
        console.error("Error:", error);
      }
      isAwaitingResponse = false;
    } else {
      console.log("Please wait for the current response to complete");
    }
  }

  function displayMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = `${sender}: ${message}`;
    chatHistory.appendChild(messageDiv);
  }

  // Add event listener to the send button
  sendBtn.onclick = function (event) {
    event.preventDefault();  // Prevent form submission
    // console.log(valuee);
    // valuee = inp; 
    console.log("i am clicked");
    askAndRespond();
  };
}

run();

