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
    <div class="d-flex flex-column fill-height justify-center align-center min-h-screen">
        <form @submit.prevent="submit">
            <v-card>
                <v-container>
                    <v-label>Full Name</v-label>
                    <v-text-field variant="outlined" placeholder="Full Name" v-model="fName"></v-text-field><br>
                    <v-label>School</v-label>
                    <v-text-field variant="outlined" placeholder="School" v-model="school"></v-text-field><br>
                    <v-label>Date of Birth</v-label>
                    <VueDatePicker v-model="dob"></VueDatePicker><br>
                    <v-btn color="blue" type="submit">Submit</v-btn>
                </v-container>
            </v-card>
        </form>
    </div>
</template>