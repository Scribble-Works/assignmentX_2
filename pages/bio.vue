<script setup>
definePageMeta({
    layout: 'auth',
});

const { auth } = useSupabaseClient();
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const menu = ref(false);
const modal = ref(false);

const fName = ref('');
const school = ref('');
const dob = ref(new Date().toISOString().substring(0, 10));
const gender = ref('');

const submit = async () => {
    try {
        const { data, error } = await client.from('profiles').insert({
            fullName: fName.value,
            school: school.value,
            DOB: dob.value,
            gender: gender.value,
            id: user.value.id
        }).single();

        if (error) {
            alert('An error occurred. Please try again later.');
            console.error(error);
        } else {
            alert('Profile updated successfully!');
            router.push('/');
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
};
</script>
<template>
    <div class="body">
        <v-container>
            <v-row>
                <v-col class="mt-16 pt-16" cols="" lg="6" sm="12" md="12">
                    <h3 class="text-h3" style="font-family: 'Inter', sans-serif; font-weight: bold;">Get Started Now</h3><br>
                    <form @submit.prevent="submit">
                        <v-row>
                            <v-col cols="" lg="6" md="12" sm="12">
                                <v-label>Full Name</v-label>
                                <v-text-field variant="outlined" placeholder="Full Name"
                                    v-model="fName"></v-text-field><br>
                            </v-col>
                            <v-col cols="" lg="6" md="12" sm="12">
                                <v-label>School</v-label>
                                <v-text-field variant="outlined" placeholder="School"
                                    v-model="school"></v-text-field><br>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="" lg="6" md="12" sm="12">
                                <v-label>Date of Birth</v-label>
                                <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="290px">
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-model="dob" variant="outlined" placeholder="Date of Birth"
                                            append-inner-icon="event" readonly v-bind="props"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="dob" @input="menu = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="" lg="6" md="12" sm="12">
                                <v-label>Gender</v-label>
                                <v-select placeholder="Gender" variant="outlined" :items="['Male', 'Female']"
                                    v-model="gender"></v-select>
                            </v-col>
                        </v-row>



                        <v-btn style="width: 100%;" color="grey-darken-3" type="submit">Submit</v-btn>

                    </form>
                </v-col>
                <v-col cols="" lg="6" sm="12" md="12">
                    <v-img src="/img/bio.png" height="700"></v-img>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<style>
.datePicker {
    color: rgb(122, 133, 143);
}
</style>