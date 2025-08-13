<script setup>
definePageMeta({
    layout: 'auth',
});
const { auth } = useSupabaseClient();
const user = useSupabaseUser();
const client = useSupabaseClient();
const show = ref(false)
const router = useRouter();
const email = ref('');
const password = ref('');
// const alert = ref(false);


const rules = {
    required: value => !!value || 'Required.',
    min: v => v.length >= 8 || 'Min 8 characters',
    emailMatch: () => (`The email and password you entered don't match`),
}

const login = async () => {

    try {
        const { data, error } = await auth.signInWithPassword({
            email: email.value,
            password: password.value
        });
        const profile = await client.from('profiles').select('id').eq('id', user.value.id).single();
        if (!user.value) {
            // alert('Invalid email or password');
            const text = 'Invalid Email or Password!';
            const title = 'Login Message';
            alert.value = true;
            router.push('/auth');
            return;
        } else if (profile.data == null) {
            router.push('/bio');
        } else {
            router.push('/');
            console.log(user.value)
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
};

const googleSignIN = async () => {
    try {
        const { data, error } = await auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/'
            }
        });
        if (!user.value) {
            // alert('Invalid email or password');
            const text = 'Invalid Email or Password!';
            const title = 'Login Message';
            alert.value = true;
            router.push('/auth');
            return;
        } else if (profile.data == null) {
            router.push('/bio');
        } else {
            router.push('/');
            console.log(user.value)
        }
        if (error) {
            // alert('An error occurred while signing in with Google.');
            // console.error(error);
            const text = 'An error occurred while signing in with Google.';
            const title = 'Login Message';
            alert.value = true;
        }
    } catch (error) {
        // alert('An error occurred. Please try again later.');
        // console.error(error);
        const text = 'An error occurred. Please try again later.';
        const title = 'Login Message';
        alert.value = true;
    }
};
// const appleSignIN = async () => {
//     try {
//         const { data, error } = await auth.signInWithOAuth({
//             provider: 'apple',
//             options: {
//                 redirectTo: window.location.origin + '/auth'
//             }
//         });
//         if (!user.value) {
//             // alert('Invalid email or password');
//             alert.value = true;
//             const message = 'Invalid Email or Password';
//             const title = 'Login Error';
//             router.push('/auth');
//             return;
//         } else if (profile.data == null) {
//             router.push('/bio');
//         } else {
//             router.push('/workbook/');
//             console.log(user.value)
//         }
//         if (error) {
//             alert('An error occurred while signing in with Apple.');
//             console.error(error);
//         }
//     } catch (error) {
//         alert('An error occurred. Please try again later.');
//         console.error(error);
//     }
// };

</script>
<template>
    <div class="d-flex flex-column fill-height justify-center align-center min-h-screen mt-0">
        <v-row class="mt-16">
            <v-col cols="" lg="6" sm="12" md="12">
                <img height="auto" src="/img/login.png" alt="Login">
            </v-col>
            <v-col cols="" lg="6" sm="12" md="12">
                <v-container class="w-auto" role="presentation">
                    <h1 class="text-h2" style="font-family: 'Inter', sans-serif; font-weight: bold;">Welcome back!</h1>
                    <p style="font-family: 'Inter', sans-serif;">Enter your credentials to access your account</p>
                    <form class="mt-16" @submit.prevent="login">
                        <v-label>Email Address</v-label><br><br>
                        <v-text-field v-model="email" type="email" placeholder="Enter your email"
                            variant="outlined"></v-text-field>
                        <v-row>
                            <v-col>
                                <v-label>Password</v-label>
                            </v-col>
                            <v-col></v-col>
                            <v-col>
                                <NuxtLink to="/forget" style="color: #2096F3; font-family: 'Inter', sans-serif;">Forgot
                                    Password?</NuxtLink>
                            </v-col>
                        </v-row><br>
                        <v-text-field v-model="password" placeholder="Enter your password"
                            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="show = !show"
                            :rules="[rules.required, rules.min]" :type="show ? 'text' : 'password'"
                            hint="At least 8 characters" variant="outlined"></v-text-field><br>
                        <v-btn style="width: 100%;" type="submit" color="grey-darken-3">Login</v-btn>
                    </form><br>
                    <v-spacer></v-spacer>
                    <v-row align="center">
                        <v-col>
                            <v-divider :thickness="8" style="color: black;"></v-divider>
                        </v-col>
                        <v-col class="text-center">
                            <span>Or</span>
                        </v-col>
                        <v-col>
                            <v-divider :thickness="8" style="color: black;"></v-divider>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="" lg="12" md="12" sm="12">
                            <v-btn @click="googleSignIN" variant="outlined" style="width: 100%;"><v-icon
                                    style="color: red;">mdi-google</v-icon> Signin with Google</v-btn>
                        </v-col>
                        <!-- <v-col cols="" lg="6" md="6" sm="12">
                            <v-btn @click="appleSignIN" variant="outlined"
                                style="width: 100%;"><v-icon>mdi-apple</v-icon> Signin with Apple</v-btn>
                        </v-col> -->
                    </v-row><br>
                    <p class="text-center">Don't have an account? <NuxtLink
                            style="color: #2096F3; text-decoration: underline;" to="/register">Sign Up</NuxtLink>
                    </p>
                </v-container>
            </v-col>
        </v-row>
        <!-- <dialog :text="message" :title="title"  /> -->
    </div>
</template>
<style>
.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #000;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media screen and (min-width: 300px) {
    .form-contain {
        width: 100%;
    }

}
</style>