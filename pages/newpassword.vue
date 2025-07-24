<script setup>
definePageMeta({
    layout: 'auth',
});
const { auth } = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const newPassword = ref('');

const confirmNewPassword = ref('');

const backLogin = () => {
    router.push('/auth');
};
watchEffect(() => {
    auth.onAuthStateChange(async (event, session) => {
        if (event == "PASSWORD_RECOVERY") {
            const { data, error } = await auth.updateUser({ password: newPassword.value })
        }
    })
})
// const resetPassword = async () => {
//     try {
//         if (newPassword.value !== confirmNewPassword.value) {
//             alert('Passwords do not match');
//             return;
//         }
//         const { data, error } = await auth.updateUser({
//             password: newPassword.value
//         });

//         if (error) {
//             alert('An error occurred. Please try again later.');
//             console.error(error);
//         } else {
//             alert('Password updated successfully!');
//             router.push('/auth');
//         }
//     } catch (error) {
//         alert('An error occurred. Please try again later.');
//         console.error(error);
//     }
// };
</script>
<template>
    <div class="body">
        <v-container>
            <v-row>
                <v-col class="mt-16 pt-10">
                    <v-form @submit.prevent="">
                        <v-container>
                            <h3 style="font-family: 'Inter', sans-serif; font-weight: bold;"
                                class="text-h3 text-center">Set New Password</h3><br>
                            <p class="text-center">Must Be At Least 8 Characters</p>
                            <v-label>New Password</v-label>
                            <v-text-field variant="outlined" type="password" v-model="newPassword"></v-text-field>
                            <br>
                            <v-label>Confirm New Password</v-label>
                            <v-text-field variant="outlined" type="password"
                                v-model="confirmNewPassword"></v-text-field>
                            <br>
                            <v-btn style="width: 100%;" color="grey-darken-3" type="submit">Create New
                                Password</v-btn><br>
                            <v-btn @click="backLogin" class="mt-5" style="width: 100%;" variant="plain"><v-icon
                                    style="font-size: 2.5em; color: black;">mdi-keyboard-backspace</v-icon> Back to
                                Login</v-btn>
                        </v-container>
                    </v-form>
                </v-col>
                <v-col>
                    <v-img src="/img/newpass.png" height="800"></v-img>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<style>
.body {
    background-color: white;
}
</style>