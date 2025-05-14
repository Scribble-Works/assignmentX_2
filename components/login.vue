<script setup>
const { auth } = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const email = ref('');
const password = ref('');

const login = async () => {
    try {
        const { data, error } = await auth.signInWithPassword({
            email: email.value,
            password: password.value
        });

        if (!user.value) {
            alert('Invalid email or password');
            router.push('/login');
            return;
        } else {
            router.push('/workbook/');
            console.log(user.value)
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
};
</script>
<template>
    <form @submit.prevent="login" class="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl text-center font-bold mb-6" id="formTitle">Sign In</h2>
        <div id="loginFields">
            <div class="mb-4">
                <label for="email" class="block text-sm font-medium">Email address</label>
                <input type="email" id="email" v-model="email"
                    class="w-full border-gray-300 border rounded mt-1 p-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="mb-4">
                <label for="password" class="block text-sm font-medium">Password</label>
                <input type="password" id="password" v-model="password"
                    class="w-full border-gray-300 border rounded mt-1 p-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <button type="submit"
                class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Login</button>

            <!-- <p class="mt-4 text-center">
                Don't have an account? <NuxtLink to="/signup" id="toggleFormLink" class="text-blue-500 hover:underline">
                    Create an account</NuxtLink>
            </p> -->
        </div>
    </form>
</template>