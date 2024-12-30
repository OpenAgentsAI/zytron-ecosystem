```python
from OpenAgentsAI import utils
from OpenAgentsAI.drivers import MarqoVectorStoreDriver
from OpenAgentsAI.engines import VectorQueryEngine
from OpenAgentsAI.loaders import WebLoader
from OpenAgentsAI.structures import Agent
from OpenAgentsAI.tools import KnowledgeBaseClient
import openai
from marqo import Client

# Set the OpenAI API key
openai.api_key_path = "../openai_api_key.txt"

# Define the namespace
namespace = "OpenAgentsAI"

# Initialize the vector store driver
vector_store = MarqoVectorStoreDriver(
    api_key=openai.api_key_path,
    url="http://localhost:8882",
    index="chat2",
    mq=Client(api_key="foobar", url="http://localhost:8882")
)

# Get a list of all indexes
#indexes = vector_store.get_indexes()
#print(indexes)

# Initialize the query engine
query_engine = VectorQueryEngine(vector_store_driver=vector_store)

# Initialize the knowledge base tool
kb_tool = KnowledgeBaseClient(
    description="Contains information about the OpenAgentsAI Framework from www.OpenAgentsAI.ai",
    query_engine=query_engine,
    namespace=namespace
)

# Load artifacts from the web
artifacts = WebLoader(max_tokens=200).load("https://openagents-ai.io")

# Upsert the artifacts into the vector store
vector_store.upsert_text_artifacts({namespace: artifacts,})

# Initialize the agent
agent = Agent(tools=[kb_tool])

# Start the chat
utils.Chat(agent).start()

```