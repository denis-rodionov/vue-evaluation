const BASE_URL = 'https://dynaflow.dev.brainwave-software.com';

export default class SchemaService {
    async init() {
        console.log("SCHEMA: Initializing schemas...");

        try {
            const response = await fetch(BASE_URL + "/_models");
            if (response.status != 200) {
                throw new Error(`GET request returned ${response.status}: ${response.statusText}`);
            }
            this.schema = await response.json();
            console.log(this.schema);
        } catch (error) {
            throw new Error(`Could not fetch the schema: ${error}`)
        }
    }

    async getItems(entityName) {
        console.log(`SCHEMA: Geting ${entityName}...`);
        const url = this.getUrl(entityName);
        
        try {
            return await this.getEntities(url);
        } catch (error) {
            throw new Error(`Could not fetch ${entityName}: ${error}`)
        }
    }

    async createEntity(event, entityName) {
        console.log(`SCHEMA: Creating ${entityName}: ${JSON.stringify(event)}`)
        const url = this.getUrl(entityName);
        const data = this.getObjectFromEvent(event, entityName);
        await this.postEntity(url, data);

        return data;
    }

    getObjectFromEvent(event, entityName) {
        if (entityName == 'cultivation') {
            return {
                plotname: event.plotname,
                fieldSize: event.fieldSize,
                varity: event.varity,
                year_planted: event.year_planted,
                vines_sum: event.vines_sum,
                action_done: event.action_done,
                issues: event.issues
            }
        }
        else {
            throw new Error(`Unknow entity name '${entityName}'`)
        }
    }

    async updateEntity(event, entityName) {
        console.log(`SCHEMA: Updating ${entityName}: ${JSON.stringify(event)}`)
        const url = this.getUrl(entityName);
        const data = this.getObjectFromEvent(event, entityName);
        await this.postEntity(url, data); 
    }

    getUrl(entityName) {
        if (!this.schema) {
            throw new Error("Schema was not loaded!");
        }
        return this.schema[entityName].url
    }

    async postEntity(url, data) {
        const fullUrl = BASE_URL + url;
        let response;

        console.log(`POST request on URL ${fullUrl}`)
        try {
            response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },  
                body: JSON.stringify(data)
              });

            const result = await response.json();
            
            console.log(`POST request returned: ${JSON.stringify(result)}`)
        } catch (error) {
            console.log(`Failed post request. Error: ${JSON.stringify(error)}`);
        }
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            throw new Error(error);
        }
    }

    async getEntities(url) {
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
