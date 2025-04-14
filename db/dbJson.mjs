import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const dbDir = path.join(import.meta.dirname, 'jsonFiles');

function getFilePathForResource(resource) {
    return path.join(dbDir, resource + '.json');
};

export async function loadAll(resource) {
    const filePath = getFilePathForResource(resource);
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const resourceArray = JSON.parse(fileContent);
        return resourceArray;
    } else {
        return [];
    }
}

export async function loadOne(resource, id) {
    const resourceArray = await loadAll(resource);
    const resourceInstance = resourceArray.find(item => item.id === id);
    return resourceInstance ?? null;
}

export async function saveOne(resource, object) {
    const resourceArray = await loadAll(resource);
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
    const filePath = getFilePathForResource(resource);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir);
    }
    fs.writeFileSync(filePath, JSON.stringify(resourceArray), 'utf-8');
}