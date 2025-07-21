require('dotenv').config();

// importar módulo MongoDB
const { MongoClient } =  require('mongodb')

// Conexão URL
const url = process.env.DB_URL;

// DB name
const defaultNameDb = "Deckbuilder"

// Conexão
let client = undefined;

// Conexão à base de dados
async function getConnection() {
    if (!client) {
        try {
            client = await MongoClient.connect(url);
            if (!client) throw new Error("MongoClient.connect returned undefined");
        } catch (err) {
            console.error("Erro no MongoDB:", err);
            throw err; // Isso vai mostrar o erro real e impedir que client fique undefined
        }
    }
    return client;
}

// Fechar conexão à db
async function closeConnection() {
    const client = await getConnection();
    console.log(client);
    return await client.close()
}

// Aceder à coleção 
async function getCollection(collectionName) {
    const client = await getConnection();
    if (!client) {
        throw new Error("MongoDB client está undefined! Verifique a conexão e a variável DB_URL.");
    }
    const db = client.db(defaultNameDb);
    return db.collection(collectionName)
}


// Exportar para outros ficheiros as conexões
module.exports = {getConnection, closeConnection, getCollection}