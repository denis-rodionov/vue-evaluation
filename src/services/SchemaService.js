const BASE_URL = 'https://dynaflow.dev.brainwave-software.com';

export default class SchemaService {


    async init() {
        console.log("Initializing schemas...");
        const response = await fetch(BASE_URL + "/_models");
        this.schema = await response.json();
        console.log(this.schema);
    }

    async getCultivations() {
        console.log("Get cultivations...");
        let cultivationUrl = this.schema.cultivation.url;

        return this.getEntities(cultivationUrl);
    }

    async getEntities(url) {
        console.log(`Fetching url: ${url}`);

        let fullUrl = BASE_URL + url;
        let response = await fetch(fullUrl)
        let entities = await response.json();
        console.log(`fetched entities: ${entities}`);

        return entities;
    }
}
