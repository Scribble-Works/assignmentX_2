<script setup>
const { auth } = useSupabaseClient();
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
    <div class="d-flex flex-column fill-height justify-center align-center min-h-screen">
        <v-card elevation="1">
            <v-form @submit.prevent="resetPassword">
                <v-container style="width: 80dvw;">
                    <v-label>New Password</v-label>
                    <v-text-field variant="outlined" type="password" v-model="newPassword"></v-text-field>
                    <br>
                    <v-label>Confirm New Password</v-label>
                    <v-text-field variant="outlined" type="password" v-model="confirmNewPassword"></v-text-field>
                    <br>
                    <v-btn type="submit">Create New Password</v-btn>
                </v-container>
            </v-form>
        </v-card>

    </div>
</template>