import express from 'express';
import path from 'path';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
// const express = require('express')

const app = express();
app.set("view engine", "ejs");
const PORT = 8000;

dotenv.config();

//some strict mime type checking was enabled so used below code to tell .js is actually javascript code

app.use(express.static('public',{ 
  setHeaders: (res, path, stat) => {
      if (path.endsWith('.js')) {
          res.set('Content-Type', 'text/javascript');
      }
  }
}));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_key);
let messageHistory = [];

app.get("/",(req, res) => {
  res.render("index.ejs")
});


app.get("/depression",(req, res) => {
  res.render("depression.ejs")
});
app.get("/anxiety",(req, res) => {
  res.render("anxiety.ejs")
});

app.get("/another",(req, res) => {
  const response = ""; // Example response data
  // res.render("another", { response });
  res.render('another', { messageHistory }); 
  // res.render("another");
});

//   function displayMessage(sender, message) {
//     const messageHTML = `
//       <div class="message">
//         <p style="font-size: 23px;">${sender}: ${message}</p>
//       </div>
//       <br>
//     `;
//     return messageHTML;
//   }
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// const chat = model.startChat({
//   history: [],
//   generationConfig: {
//     maxOutputTokens: 500,
//   },
// });


  app.post('/blogs', async (req, res) => {
    // let isAwaitingResponse = false;
    const userMessage = req.body.message.trim(); 
    const aiResponse = await sendMessage(userMessage);
    messageHistory.push({ sender: 'You', message: userMessage });
  messageHistory.push({ sender: 'Dr. Dreamy Doodles', message: aiResponse });
  
  // Render the 'another' template with the message history
  res.render('another', { messageHistory });
  //  res.send(aiResponse);
  res.render('another', { response: aiResponse });
  //   askAndRespond(userMessage);

  // async function sendMessage(userMessage) {
  //   try {
  //     const result = await chat.sendMessageStream(userMessage);
  //     let text = "";
  //     for await (const chunk of result.stream) {
  //       const chunkText = await chunk.text();
  //       text += chunkText;
  //     }
  //     return text;
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return null;
  //   }
  // }

  // async function askAndRespond(userMessage) {
  //   if (!isAwaitingResponse) {
  //     if (userMessage.toLowerCase() === "exit") {
  //       return;
  //     }
  //     isAwaitingResponse = true;
  //     try {
  //       displayMessage("You", userMessage);

  //       const aiResponse = await sendMessage(userMessage);

  //       displayMessage("Dr. Dreamy Doodles", aiResponse);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //     isAwaitingResponse = false;
  //   } else {
  //     console.log("Please wait for the current response to complete");
  //   }
  // }

    // Extract message from request body
    // Call askAndRespond function with userMessage
    // askAndRespond(userMessage);
    
    // Send response (optional)
    // res.send('Message received');
  });

// }

// run();

async function sendMessage(userMessage) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  try {
    let text = '';
    const result = await chat.sendMessageStream(userMessage);
    for await (const chunk of result.stream) {
      const chunkText = await chunk.text();
      text += chunkText;
    }
    return text;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}


app.listen(PORT, ()=> {
  console.log(`Server is running on port ${PORT}`)
})
// another one script.js
