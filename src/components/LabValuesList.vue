<script>
import listMixin from './mixins/listMixin.js'
export default {
    mixins: [listMixin]
}
</script>

<template>
    <v-simple-table>
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left">
                        Sample name, tank, vintage, date
                    </th>
                    <th class="text-left">
                        Free SO2 mg/l
                    </th>
                    <th class="text-left">
                        Total SO2 mg/l
                    </th>
                    <th class="text-left">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                  v-for="item in itemList"
                  :key="item.sample_name"
                >
                <td>{{ item.sample_name }}</td>
                <td>{{ item.free_so2 }}</td>
                <td>{{ item.total_so2 }}</td>
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