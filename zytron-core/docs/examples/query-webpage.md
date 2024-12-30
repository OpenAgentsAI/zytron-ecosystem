```python
from OpenAgentsAI.artifacts import BaseArtifact
from OpenAgentsAI.drivers import LocalVectorStoreDriver
from OpenAgentsAI.loaders import WebLoader


vector_store = LocalVectorStoreDriver()

[
    vector_store.upsert_text_artifact(a, namespace="OpenAgentsAI")
    for a in WebLoader(max_tokens=100).load("https://openagents-ai.io")
]

results = vector_store.query(
    "creativity",
    count=3,
    namespace="OpenAgentsAI"
)

values = [BaseArtifact.from_json(r.meta["artifact"]).value for r in results]

print("\n\n".join(values))
```