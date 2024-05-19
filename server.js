import express from 'express';
import path from 'path';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DiffieHellmanGroup } from 'crypto';

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
// let messageHistory = [];
let chat;

app.get("/",(req, res) => {
  res.render("index.ejs")
});


app.get("/depression",(req, res) => {
  res.render("depression.ejs")
});

app.get("/anxiety",(req, res) => {
  res.render("anxiety.ejs")
});

//start chat session
async function startChat(){
  const model = await genAI.getGenerativeModel({model: 'gemini-pro'});
  chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500,
    },
  });
}

startChat();

let messageHistory = [];

app.get("/another",async (req, res) => {
  const aiMessage = "Hello, It's your psycologist here. How can I help you?"
  const userMessage = "please behave as a physocologist and your name is Dr. Dreamy Doodles. If anyone ask you that who are you then answer that I'm Doctor Dreamy Doodles and I'm you psycologist. If any one ask some thing like what do you do then reply that I help people recover their mental health. "
  const airesp = await sendMessage(userMessage);
  console.log(airesp);
  messageHistory.push({ sender: 'Dr. Dreamy Doodles', message: aiMessage})
  res.render('another', { messageHistory }); 
});

  app.post('/blogs', async (req, res) => {
    const userMessage = req.body.message.trim(); 
    const aiResponse = await sendMessage(userMessage);
    messageHistory.push({ sender: 'You', message: userMessage });
    messageHistory.push({ sender: 'Dr. Dreamy Doodles', message: aiResponse });
  
    res.setHeader('Content-Type', 'text/plain');
    res.send(aiResponse);
  });

async function sendMessage(userMessage) {

  try {
    let text = '';
    const result = await chat.sendMessageStream(userMessage);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      text += ((chunkText.replace(/\*/g, ''))+'\n');
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