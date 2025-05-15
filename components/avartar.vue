<script setup>
const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const client = useSupabaseClient();
const router = useRouter();

const signout = async () => {
    try {
        const { error } = await auth.signOut();
        if (error) {
            // alert('An error occurred. Please try again later.');
            console.error(error);
        } else {
            // alert('Sign out successful!');
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
        <v-menu min-width="200px">
            <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props">
                    <v-avatar color="brown" size="large">
                        <!-- <span class="text-h5">{{ user.initials }}</span> -->
                    </v-avatar>
                </v-btn>
            </template>
            <v-card>
                <v-card-text>
                    <div class="mx-auto text-center">
                        <v-avatar color="brown">
                            <v-icon>mdi-account</v-icon>
                        </v-avatar>
                        <!-- <h3>{{ user.fullName }}</h3> -->
                        <p class="text-caption mt-1">
                            {{ user.email }}
                        </p>
                        <v-divider class="my-3"></v-divider>
                        <v-btn variant="text" rounded>
                            Edit Account
                        </v-btn>
                        <v-divider class="my-3"></v-divider>
                        <v-btn @click="signout" variant="text" rounded>
                            Sign Out
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-menu>
    </div>
</template>