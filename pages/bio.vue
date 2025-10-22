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
const lName = ref('');
const alert = ref(false);
const text = ref('');
const school = ref('');
const dob = ref(new Date().toISOString().substring(0, 10));
const gender = ref('');
const phone = ref('');

const submit = async () => {
    try {
        const { error } = await client.from('profiles').insert({
            firstName: fName.value,
            lastName: lName.value,
            school: school.value,
            DOB: dob.value,
            gender: gender.value,
            phone: phone.value,
            id: user.value && user.value.id ? user.value.id : null
        }).single();

        if (error) {
            alert.value = true;
            text.value = 'An error occurred. Please try again later.';
            console.error(error);
        } else {
            alert.value = true;
            text.value = 'Profile updated successfully!';
            // router.push('/');
        }
    } catch (error) {
        alert.value = true;
        text.value = 'An error occurred. Please try again later.';
        console.error(error);
    }
};
const closeAlert = () => {
    alert.value = false;
    if (text.value === 'Profile updated successfully!') {
        router.push('/');
    }
};
</script>
<template>
    <div class="body">
        <v-container>
            <v-row>
                <v-col class="mt-16 pt-16" cols="" lg="6" sm="12" md="12">
                    <h3 class="text-h3" style="font-family: 'Inter', sans-serif; font-weight: bold;">Get Started Now
                    </h3><br>
                    <form @submit.prevent="submit">
                        <v-row>
                            <v-col cols="" lg="6" md="12" sm="12">
                                <v-label>First Name</v-label>
                                <v-text-field variant="outlined" placeholder="First Name" v-model="fName" />
                            </v-col>
                            <v-col cols="" lg="6" md="12" sm="12">
                                <v-label>Last Name</v-label>
                                <v-text-field variant="outlined" placeholder="Last Name" v-model="lName" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="" lg="6" md="12" sm="12">
                                <v-label>Date of Birth</v-label>
                                <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="290px">
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-model="dob" variant="outlined" placeholder="Date of Birth"
                                            append-inner-icon="event" readonly v-bind="props" />
                                    </template>
                                    <v-date-picker v-model="dob" @update:model-value="menu = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="" lg="6" md="12" sm="12">
                                <v-label>Gender</v-label>
                                <v-select placeholder="Gender" variant="outlined" :items="['Male', 'Female']"
                                    v-model="gender" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="" lg="6" md="6" sm="12">
                                <v-label>School</v-label>
                                <v-text-field variant="outlined" placeholder="School" v-model="school" />
                            </v-col>
                            <v-col cols="" lg="6" md="6" sm="12">
                                <v-label>Phone Number</v-label>
                                <v-text-field variant="outlined" placeholder="Phone Number" v-model="phone" />
                            </v-col>
                        </v-row>
                        <v-btn style="width: 100%;" color="grey-darken-3" type="submit">Submit</v-btn>
                    </form>
                </v-col>
                <v-col cols="" lg="6" sm="12" md="12">
                    <v-img src="/img/bio.png" height="700"></v-img>
                </v-col>
            </v-row>

            <v-dialog v-model="alert" max-width="400">
                <v-card>
                    <v-card-title class="headline">Profile Update</v-card-title>
                    <v-card-text>{{ text }}</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" variant="text" @click="closeAlert()">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>
<style>
.datePicker {
    color: rgb(122, 133, 143);
}
</style>