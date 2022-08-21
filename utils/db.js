/* eslint-disable */
const { MongoClient } = require('mongodb');

const Host = process.env.DB_HOST || 'localhost';
const Port = process.env.DB_PORT || 27017;
const Database = process.env.DB_DATABASE || 'files_manager'; 

class DBClient {
    constructor() {
        const url = `mongodb://${Host}:${Port}`;
        const client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        client.connect((error) => {
            error ? this.database = null : this.database = client.db(Database);
        });   
    };

    isAlive() {
        let status;
        this.database ?  status =  true : status = false;
        return status;
    };

    async nbUsers() {
        const findResult = await this.database.collection('users').find({}).toArray();
        return findResult.length;
    };

    async nbFiles() {
        const findResult = await this.database.collection('files').find({}).toArray();
        return findResult.length;
    };
};

const Client = new DBClient();
export default Client;
