from dotenv import load_dotenv
import os
from pathlib import Path
from langchain.chat_models import init_chat_model
from langchain_tavily import TavilySearch
from langgraph.prebuilt import create_react_agent

env_path = Path(__file__).resolve().parent.parent.parent / '.env'

load_dotenv(dotenv_path=env_path)

api_key = os.getenv("OPENAI_API_KEY")

if api_key:
    print("API Key loaded successfully.")
    print(api_key)
else:
    print("Failed to load API Key.")
  

llm = init_chat_model("gpt-4o-mini", model_provider="openai")

tavily_search_tool = TavilySearch(
    max_results=5,
    topic="general",
)

agent = create_react_agent(llm, [tavily_search_tool])

while True:
    # Get user input from the command line
    prompt = input("You: ")
    
    if prompt.lower() == 'exit':
        print("Exiting the chat. Goodbye!")
        break
    
    try:
        # Invoke the model with the prompt
        print("Bot: ")
        response_chunk = agent.stream({"messages": prompt}, stream_mode="values")
        for response in response_chunk:
            response["messages"][-1].pretty_print()
        # Display the response
        
    except Exception as e:
        print(f"⚠️ An error occurred: {e}")

