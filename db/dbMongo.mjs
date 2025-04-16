import { MongoClient, ServerApiVersion } from "mongodb";
import { v4 as uuid } from 'uuid';

const dbURI = 'mongodb://root:example@localhost:27018/';

let clientMemo;
let dbMemo;
async function getDB() {
    if (!clientMemo) {
        clientMemo = new MongoClient(dbURI);
        await clientMemo.connect();
    }

    if (!dbMemo) {
        dbMemo = clientMemo.db('pokeAPI');
    }
    return dbMemo;
}

export async function loadAll(resource, userId) {
    console.log("%%%% loadAll");
    const db = await getDB();
    const collection = db.collection(resource);
    const items = await collection.find().toArray();
    console.log("items", items);
    return items;
}

export async function loadOne(resource, id) {
    console.log("%%%% loadOne");
    const db = await getDB();
    const collection = db.collection(resource);
    const item = await collection.findOne({ id })
    console.log("loadOne item", item);
}

export async function saveOne(resource, object) {
    console.log("%%%% saveOne");
    const db = await getDB();
    const collection = db.collection(resource);
    object.id = uuid();
    await collection.insertOne(object);
}