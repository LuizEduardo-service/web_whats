const { DBSQLClient } = require('@databricks/sql');
require('dotenv').config();

const serverHostname = process.env.TESTE_SERVER_HOSTNAME;
const httpPath = process.env.TESTE_HTTP_PATH;
const token = process.env.TESTE_TOKEN;

if (!token || !serverHostname || !httpPath) {
    throw new Error("Cannot find Server Hostname, HTTP Path, or " +
        "personal access token. " +
        "Check the environment variables DATABRICKS_SERVER_HOSTNAME, " +
        "DATABRICKS_HTTP_PATH, and DATABRICKS_TOKEN.");
}
// 223342653
async function consultarPedido(num_pedido) {
    const client = new DBSQLClient();
    const connectOptions = {
        token: token,
        host: serverHostname,
        path: httpPath
    };

    try {

        const sql = `
                SELECT Doc_JornV2, CdEntrega, CodigoSku, DescricaoSku, QTD_ITEM
                FROM databox.logistica_malha_comum.gestao_estoque_ead_consulta
                WHERE Doc_JornV2 = '${num_pedido}'`;

        await client.connect(connectOptions);
        const session = await client.openSession();
        const queryOperation = await session.executeStatement(
            sql,
            {
                runAsync: true,
                maxRows: 10000 // This option enables the direct results feature.
            }
        );

        const result = await queryOperation.fetchAll();

        await queryOperation.close();

        console.table(result);

        await session.close();
        await client.close();

        return result;

    } catch (error) {
        console.error(error);
        return 'Erro ao obter dados do banco!';
    }


}

// if (require.main === module) {
//     consultarPedido('223342653').then(result => {
//         console.log('Resultado da consulta:', result);
//     }).catch(error => {
//         console.error('Erro ao executar a consulta:', error);
//     });
// }
module.exports = { consultarPedido };