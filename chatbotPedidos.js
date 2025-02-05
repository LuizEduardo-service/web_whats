const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { consultarPedido } = require('./databricks');
require('dotenv').config();


const regex = /^[pP]\d{9,11}$/;
const regex_error = /^[pP].*\d{1,8}$/;


const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('message_create', message => {
    console.log(message.body);
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

client.on('message', async (message) => {
    if (message.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) && message.from.endsWith('@c.us')) {

        const chat = await message.getChat();

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        const contact = await message.getContact(); //Pegando o contato
        const name = contact.pushname; //Pegando o nome do contato
        await client.sendMessage(message.from, 'Olá! ' + name.split(" ")[0] + ' Sou o assistente virtual da empresa tal. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Consultar Pedido'); //Primeira mensagem de texto
        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(5000); //Delay de 5 segundos


    }
    else if (message.body !== null && message.body === '1' && message.from.endsWith('@c.us')) {

        const chat = await message.getChat();

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        client.sendMessage(message.from, 'Digite o numero do pedido para a consulta: ');
        client.sendMessage(message.from, 'O numero do pedido precisa começar com a letra *P* seguidos de uma sequencia numerica de 9 a 11 digitos\n*P000000000" ');
        await delay(1500); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(1500); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        client.sendMessage(message.from, 'O sistema verificará se o pedido inserido está correto. Se estiver, você receberá a mensagem: _Aguarde, processando..._');
    }

    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '*Plano Individual:* R$22,50 por mês.\n\n*Plano Família:* R$39,90 por mês, inclui você mais 3 dependentes.\n\n*Plano TOP Individual:* R$42,50 por mês, com benefícios adicionais como\n\n*Plano TOP Família:* R$79,90 por mês, inclui você mais 3 dependentes');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');
    }

    else if (message.body !== null && regex_error.test(message.body.toString()) && message.from.endsWith('@c.us')) {
        const chat = await message.getChat();

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        client.sendMessage(message.from, '❌ ' + message.body + ' Não esta no modelo correto!\nVerifique e tente novamente.');
        await delay(1500); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(1500); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        client.sendMessage(message.from, 'O numero do pedido precisa começar com a letra *P* seguidos de uma sequencia numerica de 9 a 11 digitos\n*P000000000" ');
    }
    else if (message.body !== null && regex.test(message.body.toString()) && message.from.endsWith('@c.us')) {
        const chat = await message.getChat();

        try {
            await delay(3000); //delay de 3 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
            client.sendMessage(message.from, 'Aguarde, processando...');
            let numPedidoString = message.body.toString().replace(/^[pP]/, '')
            console.log(numPedidoString)
            const result = await consultarPedido(numPedidoString);
            let responseText = '';

            if (Array.isArray(result) && result.length > 0) {
                responseText = result.map(row =>
                    `📦 Pedido: ${row.Doc_JornV2}\n🚚 Entrega: ${row.CdEntrega}\n🔢 SKU: ${row.CodigoSku}\n🛒 Produto: ${row.DescricaoSku}\n📦 Quantidade: ${row.QTD_ITEM}`
                ).join('\n\n');
            } else {
                responseText = 'Nenhum dado encontrado!';
            }

            client.sendMessage(message.from, responseText);
        } catch (error) {
            client.sendMessage(message.from, 'Erro ao buscar os dados.');
        }
    }

});

