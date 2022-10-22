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
        color="primary"
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
      <v-btn
                class="mx-2"
                dark
                color="cyan"
                right
                fixed
              >
                Create
              </v-btn>
    </v-app-bar>

    <v-main>
      <v-container
        v-if="selectedItem === 0"
        class="py-8 px-6"
        fluid
      >
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
  export default {
    data: () => ({ 
      drawer: true,
      selectedItem: 0,
      menuItems: [
        { text: 'Cultivation', icon: 'mdi-clock' },
        { text: 'Fluid Storage', icon: 'mdi-account' },
        { text: 'Fluid Storage Content', icon: 'mdi-flag' },
      ],
      cultivations: [
        { plotname: "green", fieldsize: 15, variety: "sdf asdf sd fgn sdflgdsf"},
        { plotname: "yelow", fieldsize: 55, variety: "sdf asdf sd fgn sdflgdsf"},
        { plotname: "blue", fieldsize: 253, variety: "sdf asdf sd fgn sdflgdsf"}
      ]
    }),
  }
</script>