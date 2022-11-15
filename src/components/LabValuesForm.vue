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
                v-model="mutatedObject.sample_name"
                label="Sample name, tank, vintage, date"
                required
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.free_so2"
                label="Free SO2 mg/l"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.total_so2"
                label="Total SO2 mg/l"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.p_h"
                label="pH"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.sugar"
                label="Sugar in g/l"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.value_ntu"
                label="NTU"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.density"
                label="Density in X"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.alcohol"
                label="Alcohol in %"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.notes"
                label="Notes and tasting notes"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.harvest"
                label="Harvest"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.default_analyse"
                label="Default_analyse"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.decision_needed"
                label="Decision_needed"
              ></v-text-field>
            </v-form>
        </v-container>

        <v-divider></v-divider>
    </v-card>
</template>
