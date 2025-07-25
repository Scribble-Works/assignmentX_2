<script setup>
definePageMeta({
    layout: 'auth',
});
const { auth } = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const alert = ref(false);
const passwordText = ref('');

const newPassword = ref('');

const confirmNewPassword = ref('');

const backLogin = () => {
    router.push('/auth');
};
const resetPassword = async () => {
    if (newPassword.value !== confirmNewPassword.value) {
        passwordText.value = 'Passwords do not match';
        alert.value = true;
        return;
    }
    if (newPassword.value.length < 8) {
        passwordText.value = 'Password must be at least 8 characters';
        alert.value = true;
        return;
    }
    try {
        const { error } = await auth.updateUser({
            password: newPassword.value
        });
        if (error) {
            passwordText.value = 'An error occurred. Please try again later.';
            alert.value = true;
            console.error(error);
            return;
        }
        passwordText.value = 'Password Reset Successfully!';
        alert.value = true;
        router.push('/auth');
    } catch (error) {
        passwordText.value = 'An error occurred. Please try again later.';
        alert.value = true;
        console.error(error);
    }
};

const show = ref(false)
const rules = {
    required: value => !!value || 'Required.',
    min: v => v.length >= 8 || 'Min 8 characters',
    emailMatch: () => (`The email and password you entered don't match`),
};
</script>
<template>
    <div class="body">
        <v-container>
            <v-row>
                <v-col cols="" lg="6" sm="12" md="12" class="mt-16 pt-10">
                    <v-form @submit.prevent="resetPassword">
                        <v-container>
                            <h3 style="font-family: 'Inter', sans-serif; font-weight: bold;"
                                class="text-h3 text-center">Set New Password</h3><br>
                            <p class="text-center">Must Be At Least 8 Characters</p>
                            <v-label>New Password</v-label>
                            <v-text-field variant="outlined" :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="show = !show" :rules="[rules.required, rules.min]"
                                :type="show ? 'text' : 'password'" v-model="newPassword"></v-text-field>
                            <br>
                            <v-label>Confirm New Password</v-label>
                            <v-text-field variant="outlined" :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="show = !show" :rules="[rules.required, rules.min]"
                                :type="show ? 'text' : 'password'" v-model="confirmNewPassword"></v-text-field>
                            <br>
                            <v-btn style="width: 100%;" color="grey-darken-3" type="submit">Create New
                                Password</v-btn><br>
                            <v-btn @click="backLogin" class="mt-5" style="width: 100%;" variant="plain"><v-icon
                                    style="font-size: 2.5em; color: black;">mdi-keyboard-backspace</v-icon> Back to
                                Login</v-btn>
                        </v-container>
                    </v-form>
                </v-col>
                <v-col cols="" lg="6" sm="12" md="12">
                    <v-img src="/img/newpass.png" height="800"></v-img>
                </v-col>
            </v-row>

            <v-dialog v-model="alert" width="auto">
                <v-card max-width="400">
                    <template v-slot:title>
                        Reset Password
                    </template>
                    <template v-slot:text>
                        {{ passwordText }}
                    </template>
                    <template v-slot:actions>
                        <v-btn class="ms-auto" text="Ok" @click="alert = false"></v-btn>
                    </template>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>
<style>
.body {
    background-color: white;
}
</style>