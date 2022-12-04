<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
    <v-list dense>
      <v-subheader>NAVIGATION</v-subheader>
      <v-list-item-group
        color="cyan"
        v-model="selectedItemIndex"
      >
        <v-list-item
          v-for="(value, entityName) in menuItems" 
          :key="entityName"
          @click="selectedItem = entityName"
        >
          <v-list-item-icon>
            <v-icon v-text="value.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="value.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        {{ loaded ? menuItems[selectedItem].text : "Undefined" }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon 
        :x-large="tableView"
        :x-small="!tableView"
        @click="tableView=true">
        <v-icon>mdi-table</v-icon>
      </v-btn>
      <v-btn icon
        :x-large="!tableView"
        :x-small="tableView"
        @click="tableView=false">
        <v-icon>mdi-apps</v-icon>
      </v-btn>

      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        @input="onDialogInput($event)"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mx-2"
            dark
            color="cyan"
            right
            v-bind="attrs"
            v-on="on"
          >
            Create
          </v-btn>
        </template>

        <template v-for="(_, entityName) in menuItems">
          <EntityForm
            :key="entityName + editFormKey"
            v-if="selectedItem === entityName"
            :updatingObject="updatingItem"
            :update="update"
            :schema="schema[entityName]"
            :entityDisplayName="menuItems[entityName].text"
            :validationErrors="validationErrors"
            @close="closeDialog"
            @save="onDialogSave($event)"
            @update="onDialogUpdate($event)"
          />
        </template>
      </v-dialog>
    </v-app-bar>
    
    <v-main>
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
      <v-dialog
        v-model="deletionConfirmDialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="text-h5">
            Delete item?
          </v-card-title>

          <v-card-text>
            Are you sure you want to delete the selected item of 
            {{ selectedItem }}?
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              text
              @click="deletionConfirmDialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
              color="green darken-1"
              text
              @click="onItemDeletionConfirmed"
            >
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-container
        class="py-8 px-6"
        fluid
      >
        <v-row>
          <v-col
            cols="12"
          >
            <v-card outlined color="transparent">
              <template v-for="(_, entityName) in menuItems">
                <EntityList
                  :key="entityName + listKey"
                  v-if="selectedItem === entityName"
                  :itemList="menuItems[entityName].list" 
                  :schema="schema[entityName]"
                  :tableView="tableView"
                  @update="onItemUpdate($event)"
                  @delete="onItemDelete($event)"
                />
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import SchemaService from './services/SchemaService';
  import shared from './lib/shared.js'
  import EntityList from './components/EntityList'
  import EntityForm from './components/EntityForm'
import { ref } from 'vue';

  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  export default {
    components: {
      EntityForm, EntityList
    },
    data: () => ({ 
      drawer: true,
      selectedItem: null,
      selectedItemIndex: 0,   // shortcut to set initial selected menu item
      deletionConfirmDialog: false,
      deletingItem: null,
      menuItems: {},
      dialog: false,
      loaded: false,
      updatingItem: {},   // for updating object
      update: false,      // if true, the form is used for update
      editFormKey: ref(0),
      listKey: ref(0),
      validationErrors: {},
      error: "",
      successMessage: false,
      schema: {},
      tableView: true
    }),
    methods: {
      async onDialogSave(event) {
        const entity = this.selectedItem;
        console.log(`Saving ${entity} ${JSON.stringify(event)}`);
        try {
          const response = await this.schemaService.createEntity(event, entity);
          if (response['error'] == "Validation Error") {
            this.showValidationErrors(response);
          } else {
            this.menuItems[entity].list.push(response);
            this.closeDialog();
            this.rerenderList();
            await this.showSuccessMessage(`Object is saved!`);
          }
        }
        catch (err) {
          this.closeDialog();
          await this.showError(`Could not create an item: ${JSON.stringify(err)}`)
        }
      },
      showValidationErrors(response) {
        this.validationErrors = {};
        for (const valErr of response['messages']) {
          this.validationErrors[valErr.definition_name] = valErr.error_message;
        }
        this.rerenderForm();
      },
      async onDialogUpdate(event) {
        const entity = this.selectedItem;
        try {
          const response = await this.schemaService.updateEntity(event, entity);
          if (response['error'] == "Validation Error") {
            this.showValidationErrors(response);
          } else {
            this.closeDialog();
            await this.loadItems(this.selectedItem);
            this.rerenderList();
            await this.showSuccessMessage(`Object is updated!`);
          }
        }
        catch (error) {
          this.closeDialog();
          await this.showError(`Could not update the object: ${error}`)
        }
      },
      rerenderForm() {
        this.editFormKey++;
      },
      rerenderList() {
        this.listKey++;
      },
      async showError(errorText) {
        this.error = errorText;
        await sleep(10000);
        this.error = "";
      },
      async showSuccessMessage(message) {
        this.successMessage = message;
        await sleep(5000);
        this.successMessage = "";
      },
      async loadItems(entityName) {
        try {
          
          let menuItem = {};
          menuItem.list = await this.schemaService.getItems(entityName);
          
          if (this.schema[entityName].labels.en) {
            menuItem.text = shared.capitalize(this.schema[entityName].labels.en);
          } else {
            throw new Error(`Could not load ${entityName}: labels.en is empty!`);
          }
          console.log(`DEBUG: ${menuItem.text}`);
          menuItem.icon = 'mdi-database';
          this.menuItems[entityName] = menuItem;
        }
        catch (error) {
          this.showError(`Could not load ${entityName}: ${error}`)
        }
      },
      async onItemUpdate(event) {
        console.log(`On update: ${JSON.stringify(event)}`);
        this.showUpdateDialog(event);
      },
      async onItemDelete(event) {
        console.log(`On delete ${JSON.stringify(event)}`);
        this.deletionConfirmDialog = true;
        this.deletingItem = event;
      },
      async onItemDeletionConfirmed() {
        console.log(`Item deletion is confirmed: ${JSON.stringify(this.deletingItem)}`);
        this.deletionConfirmDialog = false;
        try {
          await this.schemaService.deleteEntity(this.deletingItem, this.selectedItem);
          await this.loadItems(this.selectedItem);
          await this.showSuccessMessage(`Entity ${this.selectedItem} was deleted!`)
          this.rerenderList();
        } catch (error) {
          await this.showError(`Could not delete the object: ${error}`);
        }
        this.deletingItem = null;
      },
      closeDialog() {
        this.dialog = false;
        this.update = false;
        this.updatingItem = {};
        this.validationErrors = {};
      },
      showUpdateDialog(updatingItem) {
        this.updatingItem = updatingItem;
        this.dialog = true;
        this.update = true;
      },
      onDialogInput(event) {
        console.log(`On dialog input: ${event}, ${this.dialog}`)
        if (!event) {
          this.closeDialog();
        }
      }
    },

    async created() {
      this.schemaService = new SchemaService();
      
      try {
        this.schema = await this.schemaService.get_schema();
        for (const [entityName] of Object.entries(this.schema)) {
          if (!this.selectedItem) {
            this.selectedItem = entityName;
          }
          console.log(`Loading entity ${entityName}...`);
          await this.loadItems(entityName);
        }
        console.log("LOADED");
        this.loaded = true;
      }
      catch (error) {
        this.showError(`Error during page initialisation: ${error}`)
      }
    },

    errorCaptured(err) {
      this.showError(err.message);
    }
  }
</script>