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
                v-model="mutatedObject.tankame"
                label="Tankname"
                required
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.maxvolume_in_l"
                label="Max Volume in liter"
              ></v-text-field>
            </v-form>
        </v-container>

        <v-divider></v-divider>
    </v-card>
</template>
