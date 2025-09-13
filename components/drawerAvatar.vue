<script setup>
const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const client = useSupabaseClient();
import { ref, watchEffect } from "vue";

const profile = ref(null);

watchEffect(async () => {
    if (user.value && user.value.id) {
        const { data } = await client
            .from("profiles")
            .select("firstName, lastName, school, DOB")
            .eq("id", user.value.id)
            .single();
        profile.value = data;
    }
});
const signout = async () => {
    try {
        const { error } = await auth.signOut();
        if (error) {
            console.error(error);
        } else {
            router.push("/");
        }
    } catch (error) {
        alert("An error occurred. Please try again later.");
        console.error(error);
    }
};
</script>
<template>
    <div>
        <v-list>
            <v-list-item v-if="user">
                <template #prepend>
                    <v-avatar>
                        <v-icon style="font-size: 3em;">mdi-account-circle</v-icon>
                    </v-avatar>
                </template>
                <v-list-item-title>
                    {{ (profile && profile.firstName ? profile.firstName : '') + ' ' + (profile && profile.lastName ? profile.lastName : '') }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ user && user.email ? user.email : '' }}</v-list-item-subtitle>
            </v-list-item>
        </v-list>
    </div>
</template>