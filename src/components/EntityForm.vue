<script>
import FormToolbar from './FormToolbar'
import shared from '../lib/shared.js';

export default {
    components: {
        FormToolbar
    },
    data: () => ({
        mutatedObject: {},
    }),
    props: ['updatingObject', 'update', 'schema', 'entityDisplayName'],
    emits: ['close', 'save', 'update'],
    methods: {
        onClose() {
            console.log("Component on close...")
            this.mutatedObject = {};
            this.$emit('close');
        },
        onUpdate() {
            this.$emit('update', this.mutatedObject);
            this.mutatedObject = {};
        },
        onSave() {
            this.$emit('save', this.mutatedObject);
            this.mutatedObject = {};
        },
        onStateChanged() {
            console.log(`State changed: ${JSON.stringify(this.updatingObject)}`)
            this.mutatedObject = this.updatingObject;
        },
        fieldName(str) {
            return shared.capitalize(str);
        }
    },
    created() {
        this.onStateChanged();
    },
    beforeUpdate() {
        this.onStateChanged();
    }
}
</script>

<template>
    <v-card>
        <FormToolbar
          :update="update"
          :mutatedObject="mutatedObject"
          :entityDisplayName="entityDisplayName"
          @save="onSave"
          @update="onUpdate"
          @close="onClose"
        />

        <v-container>
            <v-form
              ref="form"
            >
              <v-text-field
                v-for="attr in schema.dynamic_attributes"
                :key="attr.method_name"
                v-model="mutatedObject[attr.method_name]"
                :label="fieldName(attr.labels.en)"
              ></v-text-field>
            </v-form>
        </v-container>

        <v-divider></v-divider>
    </v-card>
</template>
