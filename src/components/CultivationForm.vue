<script>
import FormToolbar from './FormToolbar'
export default {
  props: ['updatingObject', 'update'],
  emits: ['close', 'save', 'update'],
  components: {
    FormToolbar
  },
  data: () => ({
      mutatedObject: {},
  }),
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
          @save="onSave"
          @update="onUpdate"
          @close="onClose"
        />

        <v-container>
            <v-form
              ref="form"
            >
              <v-text-field
                v-model="mutatedObject.plotname"
                label="Plot Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.fieldSize"
                label="Field Size"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.varity"
                label="Variety"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.year_planted"
                label="Year Planted"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.vines_sum"
                label="Vines Sum"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.action_done"
                label="Action Done"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.issues"
                label="Issues"
              ></v-text-field>
            </v-form>
        </v-container>

        <v-divider></v-divider>
    </v-card>
</template>
