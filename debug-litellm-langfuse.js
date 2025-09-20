/**
 * Script de debug para testar a comunicação entre LiteLLM e Langfuse
 * Este script testa se os metadados estão sendo enviados corretamente
 */

// Teste direto com a API do LiteLLM
async function testLiteLLMDirectly() {
    const fetch = (await import('node-fetch')).default;
    
    const litellmUrl = 'http://10.0.13.118:4000';
    
    console.log('🧪 Testando comunicação direta com LiteLLM...');
    
    try {
        const response = await fetch(`${litellmUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-1234' // Use sua chave aqui
            },
            body: JSON.stringify({
                model: "lacanna",
                messages: [
                    {
                        role: "user",
                        content: "Teste de metadados: 49+2"
                    }
                ],
                metadata: {
                    project: "example-project",
                    env: "dev", 
                    workflow: "main-flow",
                    userId: "rlquilez",
                    langfuse_user_id: "rlquilez",
                    langfuse_session_id: "test-session-123",
                    // Adicione tags que são explicitamente suportadas pelo Langfuse
                    tags: ["n8n-test", "debug-metadata"]
                },
                user: "rlquilez" // Campo user no nível superior
            })
        });

        console.log('📊 Status da resposta:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro na resposta:', errorText);
            return;
        }

        const data = await response.json();
        console.log('✅ Resposta recebida:', JSON.stringify(data, null, 2));
        
        // Verificar cabeçalhos de resposta para pistas sobre o processamento
        console.log('📋 Cabeçalhos de resposta:');
        for (const [key, value] of response.headers.entries()) {
            if (key.toLowerCase().includes('litellm') || key.toLowerCase().includes('langfuse')) {
                console.log(`  ${key}: ${value}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Erro ao testar LiteLLM:', error.message);
    }
}

// Teste para verificar se o LiteLLM está configurado corretamente
async function checkLiteLLMConfig() {
    const fetch = (await import('node-fetch')).default;
    
    const litellmUrl = 'http://10.0.13.118:4000';
    
    console.log('🔧 Verificando configuração do LiteLLM...');
    
    try {
        // Tentar acessar endpoint de health/info se disponível
        const healthResponse = await fetch(`${litellmUrl}/health`, {
            method: 'GET'
        });
        
        if (healthResponse.ok) {
            const health = await healthResponse.json();
            console.log('🏥 Status de saúde do LiteLLM:', JSON.stringify(health, null, 2));
        }
        
    } catch (error) {
        console.log('ℹ️  Endpoint /health não disponível ou erro:', error.message);
    }
    
    try {
        // Verificar modelos disponíveis
        const modelsResponse = await fetch(`${litellmUrl}/v1/models`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer sk-1234'
            }
        });
        
        if (modelsResponse.ok) {
            const models = await modelsResponse.json();
            console.log('📝 Modelos disponíveis:', models.data?.map(m => m.id) || 'Nenhum');
        }
        
    } catch (error) {
        console.log('ℹ️  Erro ao buscar modelos:', error.message);
    }
}

// Função principal
async function main() {
    console.log('🚀 Iniciando diagnóstico LiteLLM + Langfuse\n');
    
    await checkLiteLLMConfig();
    console.log('\n' + '='.repeat(50) + '\n');
    await testLiteLLMDirectly();
    
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('1. Verifique se o LiteLLM tem as variáveis LANGFUSE_PUBLIC_KEY e LANGFUSE_SECRET_KEY configuradas');
    console.log('2. Confirme se o callback "langfuse" está ativo na configuração do LiteLLM');
    console.log('3. Verifique se o LANGFUSE_HOST está correto');
    console.log('4. No Langfuse, verifique o projeto correto está sendo usado');
    console.log('5. Teste com curl direto para confirmar o problema');
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { testLiteLLMDirectly, checkLiteLLMConfig };