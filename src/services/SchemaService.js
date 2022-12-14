const BASE_URL = 'https://dynaflow.dev.brainwave-software.com';

export default class SchemaService {
    async get_schema() {
        console.log("SCHEMA: Initializing schemas...");

        try {
            const response = await fetch(BASE_URL + "/_models");
            if (response.status != 200) {
                throw new Error(`GET request returned ${response.status}: ${response.statusText}`);
            }
            this.schema = await response.json();
            console.log(this.schema);
            return this.schema;
        } catch (error) {
            throw new Error(`Could not fetch the schema: ${error}`)
        }
    }

    async getItems(entityName) {
        console.log(`SCHEMA: Geting ${entityName}...`);
        const url = this.getUrl(entityName);
        
        try {
            const res = await this.getRequest(url);
            if (res) {
                return res[Object.keys(res)[0]];
            } else {
                return [];
            }
        } catch (error) {
            throw new Error(`Could not fetch ${entityName}: ${error}`)
        }
    }

    async createEntity(event, entityName) {
        console.log(`SCHEMA: Creating ${entityName}: ${JSON.stringify(event)}`)
        const url = this.getUrl(entityName);
        const data = this.getObjectFromEvent(event, entityName);
        return await this.postRequest(url, data);
    }

    getObjectFromEvent(event) {
        return event;
    }

    async updateEntity(event, entityName) {
        console.log(`SCHEMA: Updating ${entityName}: ${JSON.stringify(event)}`)
        const url = this.getUrl(entityName);
        const data = this.getObjectFromEvent(event, entityName);
        return await this.putRequest(url, data, event['id']); 
    }

    async deleteEntity(event, entityName) {
        console.log(`SCHEMA: Deleting ${entityName}...`)
        const url = this.getUrl(entityName);
        await this.deleteRequest(url, event['id']);
    }

    getUrl(entityName) {
        if (!this.schema) {
            throw new Error("Schema was not loaded!");
        }
        return this.schema[entityName].url
    }

    async postRequest(url, data) {
        const fullUrl = BASE_URL + url;

        console.log(`POST request on URL ${fullUrl}`)
        let response;
        let result;
        try {
            response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },  
                body: JSON.stringify(data)
              });

            result = await response.json();
            
            console.log(`POST request returned: ${JSON.stringify(result)}`)
        } catch (error) {
            console.log(`Failed post request. Error: ${JSON.stringify(error)}`);
        }
        if (response.status === 422) {
            // validation errors returned
            return result;
        } else if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        } else {
            return result[Object.keys(result)[0]][0];
        }
    }

    async putRequest(url, data, id) {
        const fullUrl = `${BASE_URL}${url}/${id}`;
        let response;
        let result;

        console.log(`PUT request on URL ${fullUrl}`)
        try {
            response = await fetch(fullUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },  
                body: JSON.stringify(data)
              });

            result = await response.json();
            
            console.log(`PUT request returned: ${JSON.stringify(result)}`)
        } catch (error) {
            console.log(`Failed PUT request. Error: ${JSON.stringify(error)}`);
        }
        if (response.status === 422) {
            // validation errors returned
            return result;
        } else if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        } else {
            return result[Object.keys(result)[0]][0];
        }
    }

    async deleteRequest(url, id) {
        console.log(`DELETE ${url}`);

        const fullUrl = `${BASE_URL}${url}/${id}`;
        let response;
        try {
            response = await fetch(fullUrl, {
                method: 'DELETE',
                headers: {}
            });
        }
        catch (error) {
            throw new Error(`fetch thrown an error: ${error}`);
        }
        if (response.status != 200) {
            throw new Error(`DELETE request returned ${response.status}: ${response.statusText} (Expected 204)`);
        }
    }

    async getRequest(url) {
        console.log(`Fetching url: ${url}`);

        const fullUrl = BASE_URL + url;
        let response;
        try {
            response = await fetch(fullUrl);
        }
        catch (error) {
            throw new Error(`fetch thrown an error: ${error}`);
        }
        if (response.status != 200) {
            throw new Error(`GET request returned ${response.status}: ${response.statusText}`);
        }

        const entities = await response.json();
        console.log(`fetched entities: ${JSON.stringify(entities)}`);

        return entities;
    }
}
