const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { consultarPedido } = require('./databricks');
require('dotenv').config();

const pathNavegador = process.env.TESTE_TOKEN;
const regex = /^[pP]\d{9,11}$/;


const client = new Client({
    puppeteer: {
        executablePath: pathNavegador,
    }
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

client.on('message_create', async (message) => {
    if (message.body.toLocaleLowerCase() === 'pedido') {

        client.sendMessage(message.from, 'Escolha a opção desejada:');
        client.sendMessage(message.from, '[1] - Consultar Pedido');

    }
    if (message.body === '1') {
        client.sendMessage(message.from, 'Digite o numero do pedido para a consulta: ');
    }
    if (regex.test(message.body.toString())) {
        try {
            client.sendMessage(message.from, 'Aguarde processando...');
            let numPedidoString = message.body.toString().replace(/^[pP]/, '')
            console.log(numPedidoString)
            const result = await consultarPedido(numPedidoString);
            let responseText = '';

            if (Array.isArray(result) && result.length > 0) {
                responseText = result.map(row =>
                    `📦 Pedido: ${row.Doc_JornV2}\n
                    🚚 Entrega: ${row.CdEntrega}\n
                    🔢 SKU: ${row.CodigoSku}\n
                    🛒 Produto: ${row.DescricaoSku}\n
                    📦 Quantidade: ${row.QTD_ITEM}`
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

client.initialize();