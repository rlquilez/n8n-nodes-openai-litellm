# n8n-nodes-openai-langfuse

A simplified n8n community node for OpenAI-compatible LLM providers with structured JSON metadata injection capabilities.

npm package: [https://www.npmjs.com/package/n8n-nodes-openai-langfuse](https://www.npmjs.com/package/n8n-nodes-openai-langfuse)

## Features

- Support for OpenAI-compatible chat models (e.g., `gpt-4.1-mini`, `gpt-4o`)
- Compatible with LiteLLM and other OpenAI-compatible providers
- Structured JSON metadata injection: `sessionId`, `userId`, and custom JSON data
- Simplified architecture without external tracing dependencies

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Credentials](#credentials)  <!-- delete if no auth needed -->  
[Operations](#operations)  
[Compatibility](#compatibility)  
[Usage](#usage)  <!-- delete if not using this section -->  
[Resources](#resources)  
[Version history](#version-history)  <!-- delete if not using this section -->  

## Installation
Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the official n8n documentation for community nodes.

### Community Nodes (Recommended)
For **n8n v0.187+**, install directly from the UI:
1. Go to Settings → Community Nodes
2. Click **Install**
3. Enter `n8n-nodes-openai-langfuse` in Enter npm package name
4. Agree to the risks of using community nodes
5. Select Install

### Docker Installation (Recommended for Production)
A preconfigured Docker setup is available in the `docker/` directory:

1. Clone the repository and navigate to the docker/ directory
    ```bash
    git clone https://github.com/rlquilez/n8n-nodes-openai-litellm.git
    cd n8n-nodes-openai-litellm/docker
    ```
2. Build the Docker image
    ```bash
    docker build -t n8n-openai-litellm .
    ```
3. Run the container
    ```bash
    docker run -it -p 5678:5678 n8n-openai-litellm
    ```
You can now access n8n at http://localhost:5678

### Manual Installation
For a standard installation without Docker:
```bash
# Go to your n8n installation directory
cd ~/.n8n 
# Install the node
npm install n8n-nodes-openai-langfuse
# Restart n8n to apply the node
n8n start
```
## Credential 

This credential is used to authenticate your OpenAI-compatible LLM endpoint.

### OpenAI Settings
|Field Name|Description|Example|
|-----|-----|-----|
|OpenAI API Key|Your API key for accessing the OpenAI-compatible endpoint|`sk-abc123...`|
|OpenAI Organization ID|(Optional) Your OpenAI organization ID, if required|`org-xyz789`|
|OpenAI Base URL|Full URL to your OpenAI-compatible endpoint|default: `https://api.openai.com/v1`|

> 💡 **LiteLLM Compatibility**: You can use this node with LiteLLM by setting the Base URL to your LiteLLM proxy endpoint (e.g., `http://localhost:4000/v1`).

### Credential UI Preview
Once filled out, your credential should look like this:

![credentials-example](https://github.com/rlquilez/n8n-nodes-openai-litellm/blob/main/assets/credential-example.png?raw=true)
✅ After saving the credential, you're ready to use the node with structured JSON metadata injection.

## Operations

This node lets you inject structured JSON metadata into your OpenAI requests.  
You can add context such as `sessionId`, `userId`, and any custom metadata to your model calls.

---
### Supported Fields

| Field | Type | Description |
|----------|----------|----------|
| `sessionId` | `string` | Session identifier for grouping related requests |
| `userId` | `string` | User identifier for request attribution |
| `metadata` | `object` | Custom JSON object with additional context (e.g., workflowId, env) |

![metadata-example](https://github.com/rlquilez/n8n-nodes-openai-litellm/blob/main/assets/metadata-example.png?raw=true)
---
### 🧪 Example Setup
| Input Field | Example Value |
|----------|----------|
| Session ID | `{{$json.sessionId}}`|
| User ID | `test` |	
Custom Metadata (JSON)
```json
{
  "project": "test-project",
  "env": "dev",
  "workflow": "main-flow"
}
```
---
### Visual Example
1. **Node Configuration UI**: This shows a sample n8n workflow using the OpenAI LiteLLM Chat Node.

![node-example](https://github.com/rlquilez/n8n-nodes-openai-litellm/blob/main/assets/node-example.png?raw=true)

2. **Workflow Setup**: A typical workflow using this node.

![workflow-example](https://github.com/rlquilez/n8n-nodes-openai-litellm/blob/main/assets/workflow-example.png?raw=true)

3. **JSON Metadata Output**
Here’s how traces appear inside the Langfuse dashboard.

![metadata-output-example](https://github.com/rlquilez/n8n-nodes-openai-litellm/blob/main/assets/langfuse-example.png?raw=true)


## Compatibility
- Requires n8n version 1.0.0 or later
- Compatible with:
  - OpenAI official API (https://api.openai.com)
  - Any OpenAI-compatible LLM (e.g. via LiteLLM, LocalAI, Azure OpenAI)
  - All providers that support OpenAI-compatible endpoints

## Resources

- [n8n Community Node Docs](https://docs.n8n.io/integrations/community-nodes/)
- [LiteLLM Documentation](https://docs.litellm.ai/)
- [n8n Community Forum](https://community.n8n.io/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)

## Version History

- **v1.0** – Simplified release with OpenAI-compatible providers and structured JSON metadata injection
