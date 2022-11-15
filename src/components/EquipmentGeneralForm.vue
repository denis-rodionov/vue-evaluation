<script>
import FormToolbar from './FormToolbar'
import formMixin from './mixins/formMixin.js'

export default {
  components: {
    FormToolbar
  },
  mixins: [formMixin],
  data: () => ({
      mutatedObject: {},
  })
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
                v-model="mutatedObject.kind_of_equipment"
                label="Plot Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.producer"
                label="Producer"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.serial_number"
                label="Serial Number"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.cost_action"
                label="Cost in â‚¬ and explanation of job done"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.date"
                label="Date"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.broken"
                label="Broken"
              ></v-text-field>
            </v-form>
        </v-container>

        <v-divider></v-divider>
    </v-card>
</template>
