# Interview Practice Partner – Conversational AI Agent

Interview Practice Partner is a conversational AI agent designed to simulate real job interviews.
It conducts mock interviews, asks intelligent follow-up questions, redirects off-topic users, provides structured feedback, and supports both voice and chat interactions.

This project demonstrates agentic behaviour, conversation quality, and strong technical implementation.

## 🚀 Features

### 🎙 Voice + Chat Interaction
- Voice input through Speech-to-Text
- Natural Text-to-Speech responses
- Hands-free interview mode

### 🧠 Intelligent Interview Behaviour
- Role-based and level-specific interview questions
- Automatic 1–3 follow-up questions
- Redirects chatty/off-topic users
- Clarifies user confusion
- Handles invalid or edge-case inputs gracefully

### 📄 Transcript & Feedback
- Real-time transcript
- Downloadable transcript (.txt)
- Structured final feedback: strengths, weaknesses, improvements

## 📁 Project Structure

project/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── package.json
├── .env.example
└── README.md

## 🛠 Setup Instructions

1. Install dependencies  
   npm install

2. Create .env file  
   GEMINI_API_KEY=your_api_key  
   PORT=3000

3. Start server  
   npm start

4. Open the application  
   http://localhost:3000

Recommended Browser: Microsoft Edge (best natural voice options like Zira/Heera)

## 🧩 Architecture Notes

### Frontend
- Pure HTML, CSS, and JavaScript
- Manages interview session, chat UI, conversation memory
- Handles Text-to-Speech & Speech-to-Text
- Stores all messages in a conv[] array
- Enables transcript download via Blob
- Clean UI replicates real interview flow

### Backend
- Node.js + Express server
- POST /api/gemini endpoint
- Forwards conversation history + mode to LLM
- Supports:
  - Interview mode
  - Follow-up mode
  - Feedback mode
- Lightweight and stateless

### LLM Agent Behaviour
The agent is controlled via strict system instructions:
- Ask one question at a time
- After each user answer, ask 1–3 follow-ups
- Redirect if user goes off-topic
- Clarify when user is confused
- Generate concise structured feedback on request
- Use plain text output

This ensures a focused, realistic, and controlled AI interviewer.

## 🤖 Design Decisions (Conversation Quality Focused)

- Prioritized natural interaction over feature quantity
- System prompt creates a consistent, professional interviewer persona
- Follow-up questioning adds realism and depth
- Redirection logic keeps chatty users on track
- Clarification behaviour improves confused-user experience
- Feedback stays short, structured, and actionable
- Minimal UI enhances immersion
- Transcript download supports learning and evaluation

## 🧪 User Personas Demonstrated

### 1. Efficient User
Short direct answers → agent gives deeper follow-ups.

### 2. Confused User
Agent provides clarification guidance.

### 3. Chatty User
User goes off-topic → agent acknowledges and redirects politely.

### 4. Edge Case User
Invalid or unrelated inputs → agent responds safely and maintains context.

These show adaptability and robust behaviour.


## 🧭 Summary of Design Reasoning

- Built a functional AI agent, not just API calls
- Strong focus on conversation quality and user experience
- Agent orchestration logic implemented on frontend + backend
- Voice capabilities make it immersive
- Transcript feature adds educational value
- Persona testing highlights flexibility and robustness
