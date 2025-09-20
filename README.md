# 🚀 n8n-nodes-openai-litellm

> **A simplified n8n community node for OpenAI-compatible LLM providers with advanced structured JSON metadata injection capabilities.**

[![npm version](https://img.shields.io/npm/v/@rlquilez/n8n-nodes-openai-litellm.svg)](https://www.npmjs.com/package/@rlquilez/n8n-nodes-openai-litellm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-FF6D5A.svg)](https://docs.n8n.io/integrations/community-nodes/)

## 🙏 Credits

This project is based on the excellent work by [rorubyy](https://github.com/rorubyy) and their original [n8n-nodes-openai-langfuse](https://github.com/rorubyy/n8n-nodes-openai-langfuse) project. This version has been simplified and refocused to provide a clean, dependency-free solution for structured JSON metadata injection with OpenAI-compatible providers.

Special thanks to **rorubyy** for the foundation and inspiration! 🎉

---

## ✨ Key Features

🎯 **Universal Compatibility**
- Full support for OpenAI-compatible chat models (`gpt-4o`, `gpt-4o-mini`, `o1-preview`, etc.)
- Seamless integration with LiteLLM and other OpenAI-compatible providers
- Works with Azure OpenAI, LocalAI, and custom APIs

🔧 **Structured Metadata Injection**  
- Inject custom JSON data directly into your LLM requests
- Add structured context for tracking and analysis
- Flexible metadata for projects, environments, workflows, and more

⚡ **Simplified Architecture**
- No external tracing dependencies
- Quick and easy setup
- Optimized for performance and reliability

---

**📦 NPM Package:** [`@rlquilez/n8n-nodes-openai-litellm`](https://www.npmjs.com/package/@rlquilez/n8n-nodes-openai-litellm)

**🏢 About n8n:** [n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## 📋 Table of Contents

- [🚀 Installation](#-installation)
- [🔐 Credentials](#-credentials)
- [⚙️ Configuration](#-configuration)
- [🎯 JSON Metadata](#-json-metadata)
- [🔧 Compatibility](#-compatibility)
- [📚 Resources](#-resources)
- [📈 Version History](#-version-history)

---


## 🚀 Installation

Follow the official [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) for n8n community nodes.

### 🎯 Community Nodes (Recommended)

For **n8n v0.187+**, install directly from the UI:

1. Go to **Settings** → **Community Nodes**
2. Click **Install**
3. Enter `@rlquilez/n8n-nodes-openai-litellm` in the "Enter npm package name" field
4. Accept the risks of using community nodes
5. Select **Install**

### 🐳 Docker Installation (Recommended for Production)

A pre-configured Docker setup is available in the `docker/` directory:

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

You can now access n8n at <http://localhost:5678>

### ⚙️ Manual Installation

For a standard installation without Docker:

```bash
# Go to your n8n installation directory
cd ~/.n8n 

# Install the node
npm install @rlquilez/n8n-nodes-openai-litellm

# Restart n8n to apply the node
n8n start
```

---
## 🔐 Credentials

This credential is used to authenticate your OpenAI-compatible LLM endpoint.

### OpenAI Settings

| Field | Description | Example |
|-------|-------------|---------|
| **OpenAI API Key** | Your API key for accessing the OpenAI-compatible endpoint | `sk-abc123...` |
| **OpenAI Organization ID** | (Optional) Your OpenAI organization ID, if required | `org-xyz789` |
| **OpenAI Base URL** | Full URL to your OpenAI-compatible endpoint | default: `https://api.openai.com/v1` |

> 💡 **LiteLLM Compatibility**: You can use this node with LiteLLM by setting the Base URL to your LiteLLM proxy endpoint (e.g., `http://localhost:4000/v1`).

✅ After saving the credential, you're ready to use the node with structured JSON metadata injection.

---

## ⚙️ Configuration

This node allows you to inject structured JSON metadata into your OpenAI requests, providing additional context for your model calls.

---
## 🎯 JSON Metadata

### Supported Fields

| Field | Type | Description |
|-------|------|-------------|
| **Custom Metadata (JSON)** | `object` | Custom JSON object with additional context (e.g., project, env, workflow) |
| **Session ID** | `string` | Used for trace grouping and session management |
| **User ID** | `string` | Optional: for trace attribution and user identification |

### 🧪 Configuration Example

| Input Field | Example Value |
|-------------|---------------|
| **Custom Metadata (JSON)** | See example below |
| **Session ID** | `default-session-id` |
| **User ID** | `user-123` |

```json
{
  "project": "example-project",
  "env": "dev",
  "workflow": "main-flow",
  "version": "1.0.0",
  "tags": ["ai", "automation"]
}
```

### 💡 How It Works

The node uses LiteLLM-compatible metadata transmission through the `extraBody.metadata` parameter, ensuring proper integration with LiteLLM proxies and observability tools.

**Metadata Flow:**
1. **Session ID** and **User ID** are automatically added to the custom metadata
2. All metadata is transmitted via LiteLLM's standard `extraBody.metadata` parameter
3. Compatible with LiteLLM logging, Langfuse, and other observability platforms
4. Maintains full compatibility with OpenAI-compatible endpoints

**Common Use Cases:**

- **Session Management**: Track conversations across multiple interactions
- **User Attribution**: Associate requests with specific users
- **Project Tracking**: Identify which project generated the request
- **Environment Control**: Differentiate between dev, staging, and production
- **Workflow Analysis**: Track performance by workflow type
- **Debugging**: Add unique identifiers for debugging purposes
- **Observability**: Integration with Langfuse, LiteLLM logging, and custom analytics

---

## 🔧 Compatibility

- **Minimum n8n version:** 1.0.0 or higher
- **Compatible with:**
  - [Official OpenAI API](https://api.openai.com)
  - Any OpenAI-compatible LLM (e.g., via LiteLLM, LocalAI, Azure OpenAI)
  - All providers that support OpenAI-compatible endpoints

### Tested Models

✅ **OpenAI Models:**

- `gpt-4o`, `gpt-4o-mini`
- `gpt-4-turbo`, `gpt-4`
- `gpt-3.5-turbo`
- `o1-preview`, `o1-mini`

✅ **Compatible Providers:**

- **LiteLLM** - Proxy for 100+ LLMs
- **Azure OpenAI** - Microsoft's enterprise API
- **LocalAI** - Self-hosted local LLMs
- **Ollama** - Local models via OpenAI-compatible API

---

## 📚 Resources

### Official Documentation

- 📖 [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- 🚀 [LiteLLM Documentation](https://docs.litellm.ai/)
- 💬 [n8n Community Forum](https://community.n8n.io/)
- 🤖 [OpenAI API Documentation](https://platform.openai.com/docs/)

### Useful Links

- 🐛 [Report Issues](https://github.com/rlquilez/n8n-nodes-openai-litellm/issues)
- 💡 [Request Features](https://github.com/rlquilez/n8n-nodes-openai-litellm/issues/new)
- 📦 [NPM Package](https://www.npmjs.com/package/@rlquilez/n8n-nodes-openai-litellm)

---

## 📈 Version History

### v1.0.9 - Current

- 🔧 **Critical Fix: Corrected extra_body parameter name** - Fixed `extraBody` to `extra_body` to match LangChain ChatOpenAI API specification
- ✅ **Verified metadata transmission** - Ensures metadata is properly sent to LiteLLM and OpenAI-compatible endpoints
- 📚 **Based on official documentation** - Implementation follows LangChain and LiteLLM examples

### v1.0.8

- 📝 **Enhanced documentation** - Updated README with detailed metadata features and version history
- 🎯 **Improved use cases** - Added comprehensive examples and observability integration details

### v1.0.7

- 🔧 **Fixed LiteLLM metadata payload transmission** - Implemented proper `extra_body.metadata` parameter for LiteLLM compatibility
- 📊 **Added Session ID and User ID fields** - Separate fields for better trace attribution and session management
- 🎯 **Improved metadata structure** - Based on LiteLLM documentation and reference implementation
- ✅ **Enhanced observability** - Better integration with Langfuse and LiteLLM logging systems

### v1.0.6

- 🆕 **Added Session ID and User ID fields** - Separate input fields for better metadata organization
- 🔧 **Improved metadata handling** - Enhanced processing and logging of metadata values
- 📝 **Simplified default JSON example** - Cleaner default metadata structure

### v1.0.5

- 🔄 **Repository synchronization** - Updated with latest remote changes
- 📚 **Documentation improvements** - Enhanced README and node descriptions

### v1.0.2

- 🔧 Documentation and examples improvements
- 🎯 Focus on custom JSON metadata injection
- 📝 Documentation completely rewritten

### v1.0.1

- 🎨 Updated icons to official OpenAI icons from n8n repository
- 🔧 Minor compatibility fixes

### v1.0.0

- 🎉 Initial release with OpenAI-compatible providers
- 📊 Structured JSON metadata injection
- ⚡ Simplified architecture without external tracing dependencies

---

## 💝 Contributing

Developed with ❤️ for the n8n community

*If this project was helpful, consider giving it a ⭐ on [GitHub](https://github.com/rlquilez/n8n-nodes-openai-litellm)!*
