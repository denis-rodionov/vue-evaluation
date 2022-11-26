<script>
export default {
  props: ['update', 'mutatedObject', 'entityDisplayName'],
  emits: ['save', 'update', 'close'],
  data: () => ({
  }),
  methods: {
  }
}
</script>

<template>
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
        <v-toolbar-title>
          {{ update ? "Update" : `Create ${entityDisplayName}` }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            v-if="!update"
            dark
            text
            @click="$emit('save', mutatedObject)"
          >
            Save
          </v-btn>
          <v-btn
            v-if="update"
            dark
            text
            @click="$emit('update', mutatedObject)"
          >
            Update
          </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>