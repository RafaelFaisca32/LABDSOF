# MySQL WIFI Spot Python Chatbot with Grook

🟡 This repository was inspired by this video [YouTube video tutorial](https://youtu.be/YqqRkuizNN4).


## Installation
Ensure you have Python installed on your machine. Then clone this repository:

Install the required packages:

```bash
pip install -r requirements.txt
```

Create your own .env file with the necessary variables, including your GROQ API key:

```bash
GROQ_API_KEY=[your-openai-api-key]
```

## Usage
To launch the Streamlit app and interact with the chatbot:

```bash
uvicorn main:app --reload
```

## Docker Usage
To have the image running in your docker locally just run 

```bash
docker-compose up --build
```

within this folder.

## Request example, running locally Windows

```bash
curl -v POST "http://127.0.0.1:8000/generate-sql" -H "Content-Type: application/json" -d "{\"user_query\": \"Which locations have charging stations and are child-friendly?\"}"
```