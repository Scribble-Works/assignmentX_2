<script setup>
import strand1 from '~/strand1.json';
import strand2 from '~/strand2.json';
import strand3 from '~/strand3.json';
import strand4 from '~/strand4.json';
const route = useRoute();
// const supabase = useSupabaseClient();
const config = useRuntimeConfig();
const drawer = ref(null);
const group = ref(null);

const user = useSupabaseUser();
const router = useRouter();

watch(group, () => {
  drawer.value = false;
});

router.beforeEach((to, from, next) => {
  if (from.name && to.name !== from.name) {
    // This is equivalent to beforeRouteLeave
    if (drawer.value) {
      drawer.value = false;
    }
  }
  next();
});

const subStrand1Ls = strand1.sub_strands;
const subStrand2Ls = strand2.sub_strands;
const subStrand3Ls = strand3.sub_strands;
const subStrand4Ls = strand4.sub_strands;
// console.log(subStrand2Ls);

// const strands = await supabase.from('strands').select('*');
// console.log(strands);
// const strandLnk = await supabase.from('sub_strands_strand_lnk').select('*');
// console.log(strandLnk);

</script>
<template>
  <div>
    <v-app-bar color="white">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" variant="text"></v-app-bar-nav-icon>
      </template>
      <img style="height: 5em;" src="/img/logo.png" alt="SWPH">
      <v-app-bar-title>AssignmentX</v-app-bar-title>

      <avartar />

    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-btn variant="text" class="mt-5">
        Strand 1 - Number <v-icon>mdi-menu-down</v-icon>
        <v-menu activator="parent">
          <v-list>
            <v-list-item v-for="substrand in subStrand1Ls" :key="substrand">
              <NuxtLink :to="'/workbook/workbook1/strand1/substrand-' + substrand.id + '/'">{{ substrand.title }}</NuxtLink>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="text" class="mt-5">
        Strand 2 - Algebra <v-icon>mdi-menu-down</v-icon>
        <v-menu activator="parent">
          <v-list>
            <v-list-item v-for="substrand2 in subStrand2Ls" :key="substrand2">
              <NuxtLink :to="'/workbook/workbook1/strand2/substrand-' + substrand2.id + '/'">{{ substrand2.title }}</NuxtLink>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="text" class="mt-5">
        Strand 3 - Geometry <v-icon>mdi-menu-down</v-icon>
        <v-menu activator="parent">
          <v-list>
            <v-list-item v-for="substrand3 in subStrand3Ls" :key="substrand3">
              <NuxtLink :to="'/workbook/workbook1/strand3/substrand-' + substrand3.id + '/'">{{ substrand3.title }}</NuxtLink>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="text" class="mt-5">
        Strand 4 - Handling Data <v-icon>mdi-menu-down</v-icon>
        <v-menu activator="parent">
          <v-list>
            <v-list-item v-for="substrand4 in subStrand4Ls" :key="substrand4">
              <NuxtLink :to="'/workbook/workbook1/strand4/substrand-' + substrand4.id + '/'">{{ substrand4.title }}</NuxtLink>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-navigation-drawer>
  </div>
</template>