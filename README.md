# 📘 Election Process Education

An **AI-powered interactive web application** designed to educate users about the **election process, voter awareness, and democratic participation** through chat, quizzes, timelines, and personalized dashboards.

---

## 🚀 Live Demo
🔗 https://election-frontend-477047840260.us-central1.run.app/  

---

## 📂 GitHub Repository
🔗 https://github.com/Adhisheshu1210/Election-Process-Education.git  

---

## 🧠 Project Overview

**Election Process Education** is a modern full-stack platform that simplifies complex election procedures into **interactive, engaging, and easy-to-understand modules**.

It combines:

- 🤖 AI Chat Assistant  
- 🧩 Interactive Quizzes  
- 📊 Timeline Visualization  
- 👤 User Profile & Progress Tracking  

to create a **complete learning ecosystem for civic education**.

---

## ✨ Key Features

### 🤖 AI Election Assistant
- Ask questions about elections, voting, rules, and procedures  
- Context-aware responses using backend API  
- Smart suggestions and interaction buttons  

---

### 🧩 Quiz System
- Practice & Exam modes  
- Real-time scoring and feedback  
- Tracks performance in user profile  
- Quiz history stored with timestamps  

---

### 📅 Timeline View
- Step-by-step election lifecycle  
- Interactive milestones:
  - Notification  
  - Registration  
  - Nomination  
  - Campaign  
  - Polling  
  - Counting  
- Visual progress tracking  

---

### 📘 Election Details
- Structured educational content:
  - What is an election  
  - Types of elections  
  - Voting process  
  - Timeline  
  - Election Commission role  

---

### 👤 User Profile Dashboard
- Personal information management  
- Quiz performance tracking  
- Progress analytics  
- History with date & time  
- Editable profile (name, email, etc.)  

---

### ⚙️ Settings Panel
- Dark mode toggle 🌙  
- Notification controls 🔔  
- Language selection 🌍  
- Account management & data deletion  

---

### 📊 Progress Tracking
Tracks:
- Quiz scores  
- Timeline completion  
- Learning milestones  

Stored and displayed in profile dashboard.

---

## 🧱 Tech Stack

### Frontend
- React.js  
- Tailwind CSS / Custom CSS  
- Lucide Icons  
- Framer Motion  

### Backend
- FastAPI (Python)  
- REST API endpoints  
- JWT Authentication  

### Deployment
- Google Cloud Run ☁️  
- Docker (optional)  
- GitHub Integration  

---

## 📁 Project Structure
election-assistant-project/
│
├── frontend/ # React frontend
├── backend/ # FastAPI backend
├── public/
├── src/
├── .gitignore
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

git clone https://github.com/Adhisheshu1210/Election-Process-Education.git
cd Election-Process-Education


2️⃣ Backend Setup
cd backend

python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt

uvicorn app.main:app --reload


3️⃣ Frontend Setup
cd frontend

npm install
npm run dev


4️⃣ Open App
Frontend → http://localhost:5173  
Backend  → http://127.0.0.1:8000  


🌐 Deployment (Cloud Run)
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/election-app

gcloud run deploy election-app \
  --image gcr.io/YOUR_PROJECT_ID/election-app \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated

  
🧪 Evaluation Criteria Covered
✔ Code Quality
✔ Security (Token-based auth)
✔ Efficiency (Optimized UI & API calls)
✔ Accessibility (Clean UI/UX)
✔ Google Cloud Integration


📸 Screens (Optional)
Chat Assistant UI
Quiz Interface
Timeline View
Profile Dashboard


🚀 Future Enhancements
AI voice assistant 🎙️
Multi-language support 🇮🇳
Real-time election data APIs
Admin dashboard
Analytics dashboard


🤝 Contribution

Contributions are welcome!

fork → clone → branch → commit → push → PR


📜 License

This project is open-source and available under the MIT License.


👨‍💻 Author

Angothu Adhisheshu
📧 angothuadhisheshu@gmail.com

🔗 https://github.com/Adhisheshu1210


🏁 Final Note

This project was built as part of a Google for Developers & Hack2skill Challenge, focusing on building impactful solutions using modern technologies and cloud deployment.


🔥 Empowering citizens through technology and education.

