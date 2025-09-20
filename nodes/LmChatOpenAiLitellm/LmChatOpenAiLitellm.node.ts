import { ChatOpenAI, type ClientOptions } from '@langchain/openai';
import {
    jsonParse,
    NodeConnectionType,
    type INodeType,
    type INodeTypeDescription,
    type ISupplyDataFunctions,
    type SupplyData,
} from 'n8n-workflow';

import { searchModels } from './methods/loadModels';
import { N8nLlmTracing } from './utils/N8nLlmTracing'


export class LmChatOpenAiLitellm implements INodeType {
    methods = {
        listSearch: {
            searchModels,
        },
    };

    description: INodeTypeDescription = {
        displayName: 'OpenAI Chat Model with LiteLLM',

        name: 'lmChatOpenAiLitellm',
        icon: { light: 'file:LmChatOpenAiWithLitellmLight.icon.svg', dark: 'file:LmChatOpenAiWithLitellmDark.icon.svg' },
        group: ['transform'],
        version: [1, 1.1, 1.2],
        description: 'For advanced usage with an AI chain and structured JSON metadata',
        defaults: {
            name: 'OpenAI Chat Model with LiteLLM',
        },
        codex: {
            categories: ['AI'],
            subcategories: {
                AI: ['Language Models', 'Root Nodes'],
                'Language Models': ['Chat Models (Recommended)'],
            },
            resources: {
                primaryDocumentation: [
                    {
                        url: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatopenai/',
                    },
                ],
            },
        },

        inputs: [],
        outputs: [NodeConnectionType.AiLanguageModel],
        outputNames: ['Model'],
        credentials: [
            { name: 'openAiApiWithLitellmApi', required: true },
        ],
        requestDefaults: {
            ignoreHttpStatusErrors: true,
            baseURL:
                '={{ $parameter.options?.baseURL?.split("/").slice(0,-1).join("/") || $credentials?.url?.split("/").slice(0,-1).join("/") || "https://api.openai.com" }}',
        },
        properties: [
            {
                displayName: 'Credential',
                name: 'openAiApiWithLitellmApi',
                type: 'credentials',
                default: '',
                required: true,
            },
            // JSON Metadata

            {
                displayName: 'JSON Metadata',
                name: 'jsonMetadata',
                type: 'collection',
                default: {},
                options: [
                    {
                        displayName: 'Custom Metadata (JSON)',
                        name: 'customMetadata',
                        type: 'json',
                        default: `{
    "project": "example-project",
    "env": "dev",
    "workflow": "main-flow"
}`,
                        description: "Optional. Pass extra structured JSON metadata to be attached to the model.",
                    },
                    {
                        displayName: 'Session ID',
                        name: 'sessionId',
                        type: 'string',
                        default: 'default-session-id',
                        description: 'Used for trace grouping and session management',
                    },
                    {
                        displayName: 'User ID',
                        name: 'userId',
                        type: 'string',
                        default: '',
                        description: 'Optional: for trace attribution and user identification',
                    }
                ],
            },
            // Model
            {
                displayName:
                    'If using JSON response format, you must include word "json" in the prompt in your chain or agent. Also, make sure to select latest models released post November 2023.',
                name: 'notice',
                type: 'notice',
                default: '',
                displayOptions: {
                    show: {
                        '/options.responseFormat': ['json_object'],
                    },
                },
            },
            {
                displayName: 'Model',
                name: 'model',
                type: 'options',
                description:
                    'The model which will generate the completion. <a href="https://beta.openai.com/docs/models/overview">Learn more</a>.',
                typeOptions: {
                    loadOptions: {
                        routing: {
                            request: {
                                method: 'GET',
                                url: '={{ $parameter.options?.baseURL?.split("/").slice(-1).pop() || $credentials?.url?.split("/").slice(-1).pop() || "v1" }}/models',
                            },
                            output: {
                                postReceive: [
                                    {
                                        type: 'rootProperty',
                                        properties: {
                                            property: 'data',
                                        },
                                    },
                                    {
                                        type: 'filter',
                                        properties: {
                                            // If the baseURL is not set or is set to api.openai.com, include only chat models
                                            pass: `= {{
												($parameter.options?.baseURL && !$parameter.options?.baseURL?.startsWith('https://api.openai.com/')) ||
                    ($credentials?.url && !$credentials.url.startsWith('https://api.openai.com/')) ||
                    $responseItem.id.startsWith('ft:') ||
                    $responseItem.id.startsWith('o1') ||
                    $responseItem.id.startsWith('o3') ||
                    ($responseItem.id.startsWith('gpt-') && !$responseItem.id.includes('instruct'))
											}}`,
                                        },
                                    },
                                    {
                                        type: 'setKeyValue',
                                        properties: {
                                            name: '={{$responseItem.id}}',
                                            value: '={{$responseItem.id}}',
                                        },
                                    },
                                    {
                                        type: 'sort',
                                        properties: {
                                            key: 'name',
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
                routing: {
                    send: {
                        type: 'body',
                        property: 'model',
                    },
                },
                default: '',
                displayOptions: {
                    hide: {
                        '@version': [{ _cnd: { gte: 1.2 } }],
                    },
                },
            },
            {
                displayName: 'Model',
                name: 'model',
                type: 'resourceLocator',
                default: { mode: 'list', value: 'gpt-4.1-mini' },
                required: true,
                modes: [
                    {
                        displayName: 'From List',
                        name: 'list',
                        type: 'list',
                        placeholder: 'Select a model...',
                        typeOptions: {
                            searchListMethod: 'searchModels',
                            searchable: true,
                        },
                    },
                    {
                        displayName: 'ID',
                        name: 'id',
                        type: 'string',
                        placeholder: 'gpt-4.1-mini',
                    },
                ],
                description: 'The model. Choose from the list, or specify an ID.',
                displayOptions: {
                    hide: {
                        '@version': [{ _cnd: { lte: 1.1 } }],
                    },
                },
            },
            {
                displayName:
                    'When using non-OpenAI models via "Base URL" override, not all models might be chat-compatible or support other features, like tools calling or JSON response format',
                name: 'notice',
                type: 'notice',
                default: '',
                displayOptions: {
                    show: {
                        '/options.baseURL': [{ _cnd: { exists: true } }],
                    },
                },
            },
            {
                displayName: 'Options',
                name: 'options',
                placeholder: 'Add Option',
                description: 'Additional options to add',
                type: 'collection',
                default: {},
                options: [
                    {
                        displayName: 'Base URL',
                        name: 'baseURL',
                        default: 'https://api.openai.com/v1',
                        description: 'Override the default base URL for the API',
                        type: 'string',
                        displayOptions: {
                            hide: {
                                '@version': [{ _cnd: { gte: 1.1 } }],
                            },
                        },
                    },
                    {
                        displayName: 'Frequency Penalty',
                        name: 'frequencyPenalty',
                        default: 0,
                        typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
                        description:
                            "Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim",
                        type: 'number',
                    },
                    {
                        displayName: 'Max Retries',
                        name: 'maxRetries',
                        default: 2,
                        description: 'Maximum number of retries to attempt',
                        type: 'number',
                    },
                    {
                        displayName: 'Maximum Number of Tokens',
                        name: 'maxTokens',
                        default: -1,
                        description:
                            'The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 32,768).',
                        type: 'number',
                        typeOptions: {
                            maxValue: 32768,
                        },
                    },
                    {
                        displayName: 'Presence Penalty',
                        name: 'presencePenalty',
                        default: 0,
                        typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
                        description:
                            "Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics",
                        type: 'number',
                    },
                    {
                        displayName: 'Reasoning Effort',
                        name: 'reasoningEffort',
                        default: 'medium',
                        description:
                            'Controls the amount of reasoning tokens to use. A value of "low" will favor speed and economical token usage, "high" will favor more complete reasoning at the cost of more tokens generated and slower responses.',
                        type: 'options',
                        options: [
                            {
                                name: 'Low',
                                value: 'low',
                                description: 'Favors speed and economical token usage',
                            },
                            {
                                name: 'Medium',
                                value: 'medium',
                                description: 'Balance between speed and reasoning accuracy',
                            },
                            {
                                name: 'High',
                                value: 'high',
                                description:
                                    'Favors more complete reasoning at the cost of more tokens generated and slower responses',
                            },
                        ],
                        displayOptions: {
                            show: {
                                // reasoning_effort is only available on o1, o1-versioned, or on o3-mini and beyond, and gpt-5 models. Not on o1-mini or other GPT-models.
                                '/model': [{ _cnd: { regex: '(^o1([-\\d]+)?$)|(^o[3-9].*)|(^gpt-5.*)' } }],
                            },
                        },
                    },
                    {
                        displayName: 'Response Format',
                        name: 'responseFormat',
                        default: 'text',
                        type: 'options',
                        options: [
                            {
                                name: 'Text',
                                value: 'text',
                                description: 'Regular text response',
                            },
                            {
                                name: 'JSON',
                                value: 'json_object',
                                description:
                                    'Enables JSON mode, which should guarantee the message the model generates is valid JSON',
                            },
                        ],
                    },
                    {
                        displayName: 'Sampling Temperature',
                        name: 'temperature',
                        default: 0.7,
                        typeOptions: { maxValue: 2, minValue: 0, numberPrecision: 1 },
                        description:
                            'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
                        type: 'number',
                    },
                    {
                        displayName: 'Timeout',
                        name: 'timeout',
                        default: 60000,
                        description: 'Maximum amount of time a request is allowed to take in milliseconds',
                        type: 'number',
                    },
                    {
                        displayName: 'Top P',
                        name: 'topP',
                        default: 1,
                        typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
                        description:
                            'Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.',
                        type: 'number',
                    },
                ],
            },
        ],
    };

    async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
        const credentials = await this.getCredentials('openAiApiWithLitellmApi');

        const {
            sessionId,
            userId,
            customMetadata: customMetadataRaw = {},
        } = this.getNodeParameter('jsonMetadata', itemIndex) as {
            sessionId?: string;
            userId?: string;
            customMetadata?: string | Record<string, any>;
        };

        let customMetadata: Record<string, any> = {};

        if (typeof customMetadataRaw === 'string') {
            try {
                customMetadata = customMetadataRaw.trim()
                    ? jsonParse<Record<string, any>>(customMetadataRaw)
                    : {};
            } catch {
                customMetadata = { _raw: customMetadataRaw }; // fallback
            }
        } else if (customMetadataRaw && typeof customMetadataRaw === 'object') {
            customMetadata = customMetadataRaw as Record<string, any>;
        }

        // Add sessionId and userId to metadata if provided
        if (sessionId) {
            customMetadata.sessionId = sessionId;
        }
        if (userId) {
            customMetadata.userId = userId;
        }

        console.log('[JSON Metadata] Metadata prepared:', customMetadata, 'sessionId:', sessionId, 'userId:', userId);

        const version = this.getNode().typeVersion;
        const modelName =
            version >= 1.2
                ? (this.getNodeParameter('model.value', itemIndex) as string)
                : (this.getNodeParameter('model', itemIndex) as string);

        const options = this.getNodeParameter('options', itemIndex, {}) as {
            baseURL?: string;
            frequencyPenalty?: number;
            maxTokens?: number;
            maxRetries: number;
            timeout: number;
            presencePenalty?: number;
            temperature?: number;
            topP?: number;
            responseFormat?: 'text' | 'json_object';
            reasoningEffort?: 'low' | 'medium' | 'high';
        };

        const configuration: ClientOptions = {};

        if (options.baseURL) {
            configuration.baseURL = options.baseURL;
        } else if (credentials.url) {
            configuration.baseURL = credentials.url as string;
        }

        // Prepare extra_body for LiteLLM metadata support
        const extra_body: Record<string, any> = {};
        if (Object.keys(customMetadata).length > 0) {
            extra_body.metadata = customMetadata;
        }
        
        console.log('[JSON Metadata] Extra body to be sent:', extra_body);

        // Extra options to send to OpenAI, that are not directly supported by LangChain
        const modelKwargs: {
            response_format?: object;
            reasoning_effort?: 'low' | 'medium' | 'high';
        } = {};
        if (options.responseFormat) modelKwargs.response_format = { type: options.responseFormat };
        if (options.reasoningEffort && ['low', 'medium', 'high'].includes(options.reasoningEffort))
            modelKwargs.reasoning_effort = options.reasoningEffort;

        // Prepare ChatOpenAI configuration
        const chatOpenAIConfig: any = {
            callbacks: [new N8nLlmTracing(this, customMetadata)],
            metadata: customMetadata,
            apiKey: credentials.apiKey as string,
            configuration,
            model: modelName,
            ...options,
            timeout: options.timeout ?? 60000,
            maxRetries: options.maxRetries ?? 2,
            modelKwargs,
        };

        // Add extra_body if we have metadata to send
        if (Object.keys(extra_body).length > 0) {
            // Try both approaches: direct extra_body and via model_kwargs
            chatOpenAIConfig.extra_body = extra_body;
            chatOpenAIConfig.modelKwargs = {
                ...chatOpenAIConfig.modelKwargs,
                extra_body: extra_body
            };
            console.log('[JSON Metadata] ChatOpenAI config with extra_body:', JSON.stringify(chatOpenAIConfig, null, 2));
        }

        const model = new ChatOpenAI(chatOpenAIConfig);

        return {
            response: model,
        };
    }
}