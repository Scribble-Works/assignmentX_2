<script setup>
const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const client = useSupabaseClient();
const router = useRouter();

const profile = await client
    .from('profiles')
    .select('fullName, school, DOB')
    .eq('id', user.value.id)
    .single();
const signout = async () => {
    try {
        const { error } = await auth.signOut();
        if (error) {
            console.error(error);
        } else {
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
                        <v-icon>mdi-account</v-icon>
                    </v-avatar>
                </v-btn>
            </template>
            <v-card>
                <v-card-text>
                    <div class="mx-auto text-center">
                        <v-avatar color="brown">
                            <v-icon>mdi-account</v-icon>
                        </v-avatar>
                        <div v-if="profile.data == null">
                            <h3>Fill Bio Data</h3>
                        </div>
                        <div v-else>
                            <h3>{{ profile.data.fullName }}</h3>
                        </div>
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