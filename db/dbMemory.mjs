import fs from 'fs';
import { v4 as uuid } from 'uuid';

const resourcesArray = new Map();

export function loadAll(resource) {
    const resourceArray = resourcesArray.get(resource);
    return resourceArray ?? [];
}

export function loadOne(resource, id) {
    const resourceArray = loadAll(resource);
    const resourceInstance = resourceArray.find(item => item.id === id);
    return resourceInstance ?? null;
}

export function saveOne(resource, object) {
    const resourceArray = loadAll(resource);
    if (object.id === null || object.id === undefined) {
        object.id = uuid();
        resourceArray.push(object);
    } else {
        const index = resourceArray.findIndex(item => item.id === object.id);
        if (index === undefined) {
            throw new Error('dbJson.saveOne - index not found');
        }
        resourceArray[index] = object;
    }
    resourcesArray.set(resource, resourceArray);
}