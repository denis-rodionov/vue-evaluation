<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
    <v-list dense>
      <v-subheader>NAVIGATION</v-subheader>
      <v-list-item-group
        v-model="selectedItem"
        color="cyan"
      >
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ menuItems[selectedItem].text }}</v-toolbar-title>

      <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mx-2"
            dark
            color="cyan"
            right
            fixed
            v-bind="attrs"
            v-on="on"
          >
            Create
          </v-btn>
        </template>
        <v-card>
          <v-toolbar
            dark
            color="cyan"
          >
            <v-btn
              icon
              dark
              @click="dialog=false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Create "{{ menuItems[selectedItem].text }}"</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                dark
                text
                @click="onDialogSave"
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
                v-model="dialogObject.plotname"
                :counter="100"
                label="Plot Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="dialogObject.fieldSize"
                label="Field Size"
              ></v-text-field>

              <v-text-field
                v-model="dialogObject.varity"
                label="Variety"
              ></v-text-field>

              <v-text-field
                v-model="dialogObject.year_planted"
                label="Year Planted"
                required
              ></v-text-field>

              <v-text-field
                v-model="dialogObject.vines_sum"
                label="Vines Sum"
                required
              ></v-text-field>

              <v-text-field
                v-model="dialogObject.action_done"
                label="Action Done"
                required
              ></v-text-field>

              <v-text-field
                v-model="dialogObject.issues"
                label="Issues"
                required
              ></v-text-field>
            </v-form>
          </v-container>

          <v-divider></v-divider>
        </v-card>
      </v-dialog>
    </v-app-bar>
    

    <v-main>
      <v-container
        v-if="selectedItem === 0"
        class="py-8 px-6"
        fluid
      >
      <v-alert
        dismissible
        type="error"
        v-if="error"
      >{{ error }}</v-alert>
      <v-alert
        dismissible
        type="success"
        v-if="successMessage"
      >{{ successMessage }}</v-alert>
        <v-row>
          <v-col
            cols="12"
          >
            <v-card>
              <v-subheader>List</v-subheader>

              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Plot Name
                      </th>
                      <th class="text-left">
                        Field Size
                      </th>
                      <th class="text-left">
                        Variety
                      </th>
                      <th  class="text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in cultivations"
                      :key="item.plotname"
                    >
                      <td>{{ item.plotname }}</td>
                      <td>{{ item.fieldsize }}</td>
                      <td>{{ item.variety }}</td>
                      <td>
                        <v-btn
                          class="mx-2"
                          fab
                          dark
                          x-small
                          color="cyan"
                          @click="dialog = true"
                        >
                          <v-icon dark>
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                        <v-btn
                          class="mx-2"
                          fab
                          dark
                          x-small
                          color="red"
                        >
                          <v-icon dark>
                            mdi-trash-can
                          </v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
        
      </v-container>

      
    </v-main>
  </v-app>
</template>

<script>
  import SchemaService from './services/SchemaService';

  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  export default {
    data: () => ({ 
      drawer: true,
      selectedItem: 0,
      menuItems: [
        { text: 'Cultivation', icon: 'mdi-flag' },
        { text: 'Fluid Storage', icon: 'mdi-flag' },
        { text: 'Fluid Storage Content', icon: 'mdi-flag' },
        { text: 'Vinification Material', icon: 'mdi-flag' },
        { text: 'Lab Values', icon: 'mdi-flag' },
        { text: 'Equipment General', icon: 'mdi-flag' },
        { text: 'Bottling', icon: 'mdi-flag' },
      ],
      cultivations: [
        { plotname: "green", fieldsize: 16, variety: "sdf asdf sd fgn sdflgdsf"},
        { plotname: "yelow", fieldsize: 55, variety: "sdf asdf sd fgn sdflgdsf"},
        { plotname: "blue", fieldsize: 253, variety: "sdf asdf sd fgn sdflgdsf"}
      ],
      dialog: false,
      dialogObject: {},
      error: "",
      successMessage: false
    }),
    methods: {
      async onDialogSave() {
        console.log(JSON.stringify(this.dialogObject));
        this.dialog = false;
        try {
          await this.schemaService.createCultivation(this.dialogObject);
          this.showSuccessMessage("Cultivation object is created!")
        }
        catch {
          await this.showError("Could not create an item. See console logs for more details")
        }
      },
      async showError(errorText) {
        this.error = errorText;
        await sleep(3000);
        this.error = "";
      },
      async showSuccessMessage(message) {
        this.successMessage = message;
        await sleep(3000);
        this.successMessage = "";
      }
    },

    async created() {
      this.schemaService = new SchemaService();
      await this.schemaService.init();
      this.cultivations = this.schemaService.getCultivations();
    }
  }
</script>