<script setup>
const {auth} = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const newPassword = ref('');
const confirmNewPassword = ref('');
const resetPassword = async () => {
    try {
        if (newPassword.value !== confirmNewPassword.value) {
            alert('Passwords do not match');
            return;
        }
        const { data, error } = await auth.updateUser({
            password: newPassword.value
        });

        if (error) {
            alert('An error occurred. Please try again later.');
            console.error(error);
        } else {
            alert('Password updated successfully!');
            router.push('/auth');
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
};
</script>
<template>
    <div>
        <v-form @submit.prevent="resetPassword">
            <v-container>
                <v-label>New Password</v-label>
                <v-text-field type="password" v-model="newPassword"></v-text-field>
                <br>
                <v-label>Confirm New Password</v-label>
                <v-text-field type="password" v-model="confirmNewPassword"></v-text-field>
                <br>
                <v-btn type="submit">Create New Password</v-btn>
            </v-container>

        </v-form>
    </div>
</template>