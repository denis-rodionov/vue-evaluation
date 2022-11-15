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
                v-model="mutatedObject.variety"
                label="Variety"
                required
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.vintage"
                label="Vintage"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.is_volume_in_l"
                label="Contents in liter"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.action_done"
                label="Specific job done"
              ></v-text-field>
            </v-form>
        </v-container>

        <v-divider></v-divider>
    </v-card>
</template>
