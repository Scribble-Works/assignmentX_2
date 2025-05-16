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
            router.push('/home');
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
};
</script>
<template>
    <div>
        <form @submit.prevent="submit">
            <v-container>
                <v-text-field variant="outlined" placeholder="Full Name" v-model="fName"></v-text-field><br>
                <v-text-field variant="outlined" placeholder="School" v-model="school"></v-text-field><br>
                <VueDatePicker v-model="dob"></VueDatePicker><br>
                <v-btn color="blue" type="submit">Submit</v-btn>
            </v-container>
        </form>
    </div>
</template>