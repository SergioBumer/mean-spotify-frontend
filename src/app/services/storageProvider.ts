export class StorageProvider {
    constructor() {

    }

    getIdentity() {
        let identityObj = localStorage.getItem('identity');
        let identity = {};
        if(identityObj) {
            identity = JSON.parse(identityObj);

            if(identity != undefined) {
                return identity;
            }
        }
        return null as any;  
    }

    getToken() {
        let token = localStorage.getItem('token');
        if(token != undefined) {
            return token;
        }
        return null as any;  
    }

    deleteSessionStorage() {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.clear();
    }
}