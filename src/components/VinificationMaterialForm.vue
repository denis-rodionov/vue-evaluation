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
                label="Type of product"
                required
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.producer"
                label="Producer"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.lot_number"
                label="Lot Number"
              ></v-text-field>

              <v-text-field
                v-model="mutatedObject.amount_in_x"
                label="Amount in value X"
              ></v-text-field>
            </v-form>
        </v-container>

        <v-divider></v-divider>
    </v-card>
</template>
