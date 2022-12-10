<script>
import shared from '../lib/shared.js';
export default {
    props: ['item', 'schema'],
    methods: {
        headerName(str) {
            return shared.capitalize(str);
        }
    }
}
</script>
<template>
    <div>
        <p class="text-h4 text--primary">
            {{ item[Object.keys(item)[0]] }}
        </p>
        <p v-for="attr in schema.dynamic_attributes"
           :key="attr.method_name"
        >
            <b>{{ headerName(attr.method_name) }}:&nbsp;</b>
            <span align="right" v-if="item[attr.method_name]">{{ item[attr.method_name] }}</span>
            <span v-if="!item[attr.method_name]">N/A</span>
        </p>
    </div>
</template>