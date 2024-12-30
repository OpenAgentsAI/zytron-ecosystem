To count tokens you can use OpenAgentsAI events and the `TokenCounter` util:

```python
from OpenAgentsAI import utils
from OpenAgentsAI.events import (
    StartPromptEvent, FinishPromptEvent,
)
from OpenAgentsAI.structures import Agent


token_counter = utils.TokenCounter()

agent = Agent(
    event_listeners={
        StartPromptEvent: [
            lambda e: token_counter.add_tokens(e.token_count)
        ],
        FinishPromptEvent: [
            lambda e: token_counter.add_tokens(e.token_count)
        ],
    }
)

agent.run("tell me about large language models")
agent.run("tell me about GPT")

print(f"total tokens: {token_counter.tokens}")

```