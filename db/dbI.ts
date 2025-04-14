export interface DBSystem<T> {
    loadAll(resource:string):Array<T>;
    loadOne(resource:string, id:string):T;
    saveOne(resource:string, object:T):void;
}


