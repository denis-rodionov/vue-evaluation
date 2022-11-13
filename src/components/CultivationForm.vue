<script>
export default {
  props: ['formObject'],
  emits: ['close', 'save'],
  data() {
    return {
      count: 0,
      mutatedObject: {}
    }
  }
}
</script>

<template>
    <v-card>
        <v-toolbar
            dark
            color="cyan"
        >
            <v-btn
              icon
              dark
              @click="$emit('close')"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Create "Create Cultivation"</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                dark
                text
                @click="$emit('save', mutatedObject)"
              >
                Save
              </v-btn>
            </v-toolbar-items>
        </v-toolbar>

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
