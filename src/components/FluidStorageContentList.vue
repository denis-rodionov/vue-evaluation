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
                        Variety
                    </th>
                    <th class="text-left">
                        Vintage
                    </th>
                    <th class="text-left">
                        Contents in liter
                    </th>
                    <th class="text-left">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                  v-for="item in itemList"
                  :key="item.variety"
                >
                <td>{{ item.variety }}</td>
                <td>{{ item.year }}</td>
                <td>{{ item.is_volume_in_l }}</td>
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