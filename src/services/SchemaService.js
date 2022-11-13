const BASE_URL = 'https://dynaflow.dev.brainwave-software.com';

export default class SchemaService {


    async init() {
        console.log("Initializing schemas...");

        try {
            const response = await fetch(BASE_URL + "/_models");
            this.schema = await response.json();
            console.log(this.schema);
        } catch (error) {
            throw new Error(`Could not fetch the schema: ${error}`)
        }
    }

    async getCultivations() {
        console.log("Geting cultivations...");
        const cultivationUrl = this.schema.cultivation.url;
        
        try {
            return await this.getEntities(cultivationUrl);
        } catch (error) {
            throw new Error(`Could not fetch cultivations: ${error}`)
        }
    }

    async createCultivation(cultivation) {
        const cultivationUrl = this.schema.cultivation.url;
        const data = {
            plotname: cultivation.plotname,
            year_planted: cultivation.year_planted
        }

        await this.postEntity(cultivationUrl, data);
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
        const response = await fetch(fullUrl)
        if (response.status != 200) {
            throw new Error(`GET request returned ${response.status}: ${response.statusText}`);
        }

        const entities = await response.json();
        console.log(`fetched entities: ${JSON.stringify(entities)}`);

        return entities;
    }
}
