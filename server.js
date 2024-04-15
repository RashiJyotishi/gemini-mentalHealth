import express from 'express';
import path from 'path';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

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