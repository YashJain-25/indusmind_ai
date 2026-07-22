# 🏭 IndusMind AI

### **AI-Powered Industrial Knowledge Intelligence Platform**

**IndusMind AI** is an AI-powered platform that transforms scattered engineering documents, maintenance records, SOPs, inspection reports, and operational data into a **unified, searchable knowledge ecosystem** using **Retrieval-Augmented Generation (RAG)**, **Knowledge Graphs**, **OCR**, and **Agentic AI**.

---

## 📖 Overview

Industrial organizations generate and manage **vast amounts of engineering and operational data** across multiple systems. This fragmentation makes it difficult to quickly retrieve accurate information for **maintenance, troubleshooting, compliance, and decision-making**.

**IndusMind AI** centralizes enterprise knowledge into a single intelligent platform by combining **document intelligence**, **semantic search**, **AI-powered reasoning**, and **asset relationship mapping**. Engineers can retrieve contextual answers, analyze equipment history, identify compliance requirements, and access critical operational knowledge through a **conversational interface**.

---

## ✨ Key Features

- 📄 **Intelligent document ingestion**
- 🔍 **OCR** for scanned industrial documents
- 🧠 **Industrial entity extraction**
- 🔗 **Knowledge Graph** generation
- 🤖 **AI-powered Industrial Copilot**
- 📚 **Retrieval-Augmented Generation (RAG)**
- ⚙️ **Predictive Maintenance** insights
- 📋 **Compliance Intelligence**
- 📊 **Executive Analytics Dashboard**
- 🔐 **Secure JWT Authentication & Role-Based Access Control**

---

## 🏗 Architecture

```
Industrial Documents
        │
        ▼
 Document Upload
        │
        ▼
    OCR Engine
        │
        ▼
 Entity Extraction
        │
        ▼
 Knowledge Graph
        │
        ▼
  Vector Database
        │
        ▼
   RAG Pipeline
        │
        ▼
 AI Industrial Copilot
        │
 ┌──────────────┬──────────────┬──────────────┐
 │ Maintenance  │ Compliance   │ Analytics    │
 └──────────────┴──────────────┴──────────────┘
```

---

## 🛠 Technology Stack

### **Frontend**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

### **Backend**
- **FastAPI**
- **Python**
- **Pydantic**
- **JWT Authentication**
- **OAuth2**

### **AI & Data**
- **LangChain**
- **OpenAI / Gemini**
- **Retrieval-Augmented Generation (RAG)**
- **OCR**
- **Knowledge Graphs**
- **PostgreSQL**
- **Neo4j**
- **ChromaDB**

### **DevOps**
- **Docker**
- **Docker Compose**
- **GitHub Actions**

---

## 📂 Project Structure

```
indusmind-ai/
│
├── frontend/
├── backend/
│   ├── app/
│   ├── core/
│   ├── middleware/
│   ├── models/
│   ├── routers/
│   └── services/
│
├── ai/
├── docs/
├── datasets/
├── docker/
│
├── docker-compose.yml
├── requirements.txt
├── README.md
└── LICENSE
```

---

## 📡 Core Modules

| Module | Description |
|---|---|
| **Authentication** | Secure user authentication using **JWT** |
| **Document Upload** | Upload and manage industrial documents |
| **OCR Engine** | Extract text from scanned documents |
| **Entity Extraction** | Identify industrial assets and metadata |
| **Knowledge Graph** | Map relationships between assets and documents |
| **Vector Search** | Semantic document retrieval |
| **AI Copilot** | Context-aware industrial question answering |
| **Compliance** | Compliance assessment and reporting |
| **Predictive Maintenance** | Equipment health analysis |
| **Analytics** | Operational insights and dashboards |

---

## 🚀 Getting Started

### **Clone the Repository**

```bash
git clone https://github.com/<your-username>/indusmind-ai.git
cd indusmind-ai
```

### **Backend Setup**

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

### **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

---

## 📖 API Documentation

After starting the backend:

**Swagger UI**
```
http://localhost:8000/api/v1/docs
```

**ReDoc**
```
http://localhost:8000/api/v1/redoc
```

---

## 🔒 Security

**IndusMind AI** incorporates industry-standard backend security practices:

- **JWT-based Authentication**
- **OAuth2 Authorization**
- **Role-Based Access Control (RBAC)**
- **Password Hashing (bcrypt)**
- **Input Validation**
- **Centralized Exception Handling**
- **Structured Logging**
- **Secure Middleware**
- **CORS Configuration**

---

## 📄 License

This project is licensed under the **MIT License**.
