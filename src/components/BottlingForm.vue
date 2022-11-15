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
                v-model="mutatedObject.kind_of_product"
                label="Name of product"
                required
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.source_tank"
                label="Source Tank"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.lot_number"
                label="Bottling/Labeling date"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.amount_in_x"
                label="Amount in pieces"
              ></v-text-field>
            </v-form>
        </v-container>

        <v-divider></v-divider>
    </v-card>
</template>
