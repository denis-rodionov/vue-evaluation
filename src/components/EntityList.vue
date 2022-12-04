<script>
import shared from '../lib/shared.js';
export default {
    props: ['itemList', 'schema', 'tableView'],
    emits: ['update', 'delete'],
    data: () => ({
        reveal: false
    }),
    created() {
        shared.log("List created:", this.itemList);
    },
    updated() {
        shared.log("List changed", this.itemList);
    },
    methods: {
        headerName(str) {
            return shared.capitalize(str);
        }
    }
}
</script>

<template>
    <v-simple-table v-if="tableView">
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left"
                        v-for="attr in schema.dynamic_attributes"
                        :key="attr.method_name"
                    >
                        {{ headerName(attr.labels.en) }}
                    </th>
                    <th class="text-left">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                  v-for="item in itemList"
                  :key="item['id']"
                >
                <td 
                    v-for="attr in schema.dynamic_attributes"
                    :key="attr.method_name"
                >{{ item[attr.method_name] }}</td>
                <td>
                        <v-btn class="mx-2" fab dark x-small color="cyan" @click="$emit('update', item)">
                            <v-icon dark>
                                mdi-pencil
                            </v-icon>
                        </v-btn>
                    <v-btn
                        class="mx-2"
                        fab
                        dark
                        x-small
                        color="red"
                        @click="$emit('delete', item)"
                    >
                        <v-icon dark>
                        mdi-trash-can
                        </v-icon>
                    </v-btn>
                </td>
            </tr>
            </tbody>
        </template>
    </v-simple-table>
    <v-container v-else>
        <v-row>
            <v-col cols="3" v-for="item in itemList"
                          :key="item['id']">
                <v-card class="mx-auto" max-width="344">
                    <v-card-text>
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
                    </v-card-text>
                    <v-card-actions>    
                        <v-btn text color="cyan accent-4" @click="$emit('update', item)">
                            Edit
                        </v-btn>
                        <v-btn text color="red accent-4" @click="$emit('delete', item)">
                            Delete
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

