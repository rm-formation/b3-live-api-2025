import * as dbJson from './dbJson.mjs';
import * as dbMemory from './dbMemory.mjs';

const dbSystem = dbJson;

export async function loadAll(resource) {
    return await dbSystem.loadAll(resource);
}

export async function loadOne(resource, id) {
    return await dbSystem.loadOne(resource, id);
}

export async function saveOne(resource, object) {
    return await dbSystem.saveOne(resource, object);
}