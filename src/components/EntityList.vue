<script>
import shared from '../lib/shared.js';
export default {
    props: ['itemList', 'schema'],
    emits: ['update', 'delete'],
    data: () => ({
    }),
    created() {
      console.log(`List created: ${this.itemList}`)
    },
    methods: {
        headerName(str) {
            return shared.capitalize(str);
        }
    }
}
</script>

<template>
    <v-simple-table>
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
                  :key="item[Object.keys(item)[0]]"
                >
                <td 
                    v-for="attr in schema.dynamic_attributes"
                    :key="attr.method_name"
                >{{ item[attr.method_name] }}</td>
                <td>
                    <v-btn
                        class="mx-2"
                        fab
                        dark
                        x-small
                        color="cyan"
                        @click="$emit('update', item)"
                    >
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
</template>