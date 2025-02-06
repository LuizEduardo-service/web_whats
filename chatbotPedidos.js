const { Client, LocalAuth, NoAuth, Buttons } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { consultarPedido } = require('./databricks');



const regex = /^[pP]\d{9,11}$/;
const regex_error = /^[pP]\d{1,8}$/;


// const client = new Client({ authStrategy: new NoAuth() });
const client = new Client({ authStrategy: new LocalAuth() });

client.on('ready', () => {
    console.log('Usuário Conectado com Sucesso!');
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
        await client.sendMessage(message.from, 'Olá! ' + name.split(" ")[0] + ' Sou o assistente virtual da empresa tal. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Consultar Pedido\n2 - Falar com Atendente'); //Primeira mensagem de texto        
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

    if (message.body !== null && message.body === '2' && message.from.endsWith('@c.us')) {
        const chat = await message.getChat();


        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(message.from, 'Clique no link e inicie a conversa com um de nossos atendentes.');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(message.from, 'Link para conversa: https://wa.me/qr/OISP5R2UZ2GQH1');
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
                responseText = `😭 Numero do pedido não foi encontrado.`;
            }
            await delay(1000); //delay de 3 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            await delay(1000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
            client.sendMessage(message.from, responseText);
            await delay(1000); //delay de 3 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            await delay(1000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
            await client.sendMessage(message.from, 'Sua consulta foi concluida com Sucesso?\n\nS - SIM\nN - NÂO'); //Primeira mensagem de texto

        } catch (error) {
            client.sendMessage(message.from, 'Erro ao buscar os dados.');
        }
    }
    else if (message.body !== null && message.body.toLocaleLowerCase() === 'n' && message.from.endsWith('@c.us')) {

        const chat = await message.getChat();
        await delay(1500); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(1000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        const numeroAtendente = '5511969206244'; // Número do atendente
        const linkAtendimento = `https://wa.me/${numeroAtendente}`;
        message.reply(`Clique no link para falar com um atendente: ${linkAtendimento}`);

    }
    else if (message.body !== null && message.body.toLocaleLowerCase() === 's' && message.from.endsWith('@c.us')) {

        client.sendMessage(message.from, 'Consulta concluida com sucesso.');

    }


});

