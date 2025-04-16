import * as dbJson from './dbJson.mjs';
import * as dbMemory from './dbMemory.mjs';
import * as dbMongo from './dbMongo.mjs';

const dbSystem = dbMongo;

export async function loadAll(resource) {
    return await dbSystem.loadAll(resource);
}

export async function loadOne(resource, id) {
    return await dbSystem.loadOne(resource, id);
}

export async function saveOne(resource, object) {
    return await dbSystem.saveOne(resource, object);
}