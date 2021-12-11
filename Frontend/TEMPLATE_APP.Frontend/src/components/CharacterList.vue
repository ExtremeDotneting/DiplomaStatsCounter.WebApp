<template>
  <v-container>

    <!-- Content -->

    <v-bottom-navigation
      v-model="visual.bottomId"
      :background-color="bottomColor"
      dark
      absolute
    >
      <v-btn v-for="item in visual.bottomNavigation" :key="item">
        <span>{{ item.name }}</span>
        <v-icon>{{ item.iconName }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
export default {
  name: "CharacterList",
  data: () => ({
    visual: {
      bottomId: 1,
      bottomNavigation: [
        {
          name: "Хар.",
          iconName: "mdi-television-play",
          bgColor:"blue-grey"
        },
        {
          name: "Хар.",
          iconName: "mdi-television-play",
          bgColor:"teal"
        },
        {
          name: "Хар.",
          iconName: "mdi-television-play",
          bgColor:"brown"
        },
        {
          name: "Хар.",
          iconName: "mdi-television-play",
          bgColor:"indigo"
        },
      ],

      
    },
  }),

  computed: {
    bottomColor() {
      let v=this.visual;
      return v.bottomNavigation[v.bottomId].bgColor;
    },
  },
};
</script>
