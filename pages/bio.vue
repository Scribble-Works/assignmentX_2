<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const { auth } = useSupabaseClient();
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const fName = ref('');
const school = ref('');
const dob = ref('');

const submit = async () => {
    try {
        const { data, error } = await client.from('profiles').insert({
            fullName: fName.value,
            school: school.value,
            DOB: dob.value,
            id: user.value.id
        }).single();

        if (error) {
            alert('An error occurred. Please try again later.');
            console.error(error);
        } else {
            alert('Profile updated successfully!');
            router.push('/workbook/');
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
};
</script>
<template>
    <div class="d-flex flex-column fill-height justify-center min-h-screen">
        <v-container>
            <form @submit.prevent="submit">
                <v-row>
                    <v-col cols="" lg="6" md="12" sm="12">
                        <v-label>Full Name</v-label>
                        <v-text-field variant="outlined" placeholder="Full Name" v-model="fName"></v-text-field><br>
                    </v-col>
                    <v-col cols="" lg="6" md="12" sm="12">
                        <v-label>School</v-label>
                        <v-text-field variant="outlined" placeholder="School" v-model="school"></v-text-field><br>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="" lg="6" md="12" sm="12">
                        <v-label>Date of Birth</v-label>
                        <v-text-field placeholder="Date of Birth" variant="outlined" v-model="dob"></v-text-field><br>
                    </v-col>
                    <v-col cols="" lg="6" md="12" sm="12">
                        <v-label>Gender</v-label>
                        <v-select placeholder="Gender" variant="outlined" :items="['Male', 'Female']" v-model="gender"></v-select>
                    </v-col>
                </v-row>



                <v-btn color="blue" type="submit">Submit</v-btn>

            </form>
        </v-container>
    </div>
</template>
<style>
.datePicker{
    color: rgb(122, 133, 143);
};
</style>