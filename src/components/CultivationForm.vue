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
