
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


/*
let inp = document.getElementById("user-input");
let sendBtn = document.getElementById("sendButton");
// let out; 

const genAI = new GoogleGenerativeAI(process.env.API_key);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let isAwaitingResponse = false;

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  function askAndRespond() {
    if (!isAwaitingResponse) {
      sendBtn.onclick = (e) => {
        msg = inp;
      }
      // rl.question("You :", async (msg) => {
      //   if (msg.toLowerCase() === "exit") {
      //     rl.close();
      //   }
      async (msg) => {
        // if (msg.toLowerCase() === "exit"){

        // }
        // else {
          isAwaitingResponse = true;
          try {
            
            const userQuestionDiv = document.createElement("div");
                    userQuestionDiv.classList.add("outs");
                    userQuestionDiv.textContent = "You: " + msg;
                    document.body.appendChild(userQuestionDiv);


            const result = await chat.sendMessageStream(msg);
            let text = "";
            for await (const chunk of result.stream) {
              const chunkText = await chunk.text();
                // Create a new <div> element
              const divElement = document.createElement("div class=output");
        
              // Add class to the <div> element
              divElement.classList.add("outs");
        
              // Set the text content of the <div> element to the AI response
              divElement.textContent = "AI: " + chunkText;

              // Append the <div> element to the document body or any other desired element
              document.body.appendChild(divElement);

              // let divElmnt = document.createElement("div class=resp");

              console.log("AI :", chunkText);
              text += chunkText;
            }
            isAwaitingResponse = false;
            askAndRespond();
          } catch {
            console.error("Error: ", error);
            isAwaitingResponse = false;
          }
        // }
      }
    // );
    } else {
      console.log("please wait for the current response to complete");
    }
  }
  askAndRespond();
}
run();
*/