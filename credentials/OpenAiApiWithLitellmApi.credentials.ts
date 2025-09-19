import type {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class OpenAiApiWithLitellmApi implements ICredentialType {
    name = 'openAiApiWithLitellmApi';
    icon = 'file:OpenAiApiWithLitellmApi.credentials.svg' as const;

    displayName = 'OpenAI API with LiteLLM API';
    documentationUrl = 'https://docs.litellm.ai/';

    properties: INodeProperties[] = [
        {
            displayName: 'OpenAI API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            required: true,
            default: '',
        },
        {
            displayName: 'OpenAI Organization ID (optional)',
            name: 'organizationId',
            type: 'string',
            default: '',
            hint: 'Only required if you belong to multiple organisations',
            description:
                "For users who belong to multiple organizations, you can set which organization is used for an API request. Usage from these API requests will count against the specified organization's subscription quota.",
        },
        {
            displayName: 'OpenAI Base URL',
            name: 'url',
            type: 'string',
            default: 'https://api.openai.com/v1',
            description: 'Override the default base URL for the API',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiKey}}',
                'OpenAI-Organization': '={{$credentials.organizationId}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials?.url}}',
            url: '/models',
        },
    };
}