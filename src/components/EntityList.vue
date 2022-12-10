<script>
import shared from '../lib/shared.js';
import EntityCardView from './EntityCardView'
export default {
    props: ['itemList', 'schema', 'tableView'],
    components: {
        EntityCardView
    },
    emits: ['update', 'delete'],
    data: () => ({
        reveal: false,
        viewDialog: false,
        selectedItem: {}
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
        },
        onItemClick(item) {
            this.viewDialog = true;
            this.selectedItem = item;
        }
    }
}
</script>

<template>
    <v-simple-table v-if="tableView">
        <template v-slot:default>
            <thead>
                <v-dialog
                    v-model="viewDialog"
                    max-width="290"
                >
                    <v-card>
                      <v-card-title class="text-h5">
                      </v-card-title>

                      <v-card-text>
                        <EntityCardView
                            :item="selectedItem"
                            :schema="schema"
                        />
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                          color="green darken-1"
                          text
                          @click="viewDialog = false"
                        >
                          Close
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                </v-dialog>
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
                  @click="onItemClick(item)"
                >
                    <td 
                        v-for="attr in schema.dynamic_attributes"
                        :key="attr.method_name"
                    >{{ item[attr.method_name] }}</td>
                    <td @click.stop>
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
                        <EntityCardView 
                            :item="item"
                            :schema="schema" />
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

