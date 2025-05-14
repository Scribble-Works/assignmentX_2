<script setup>
const { auth } = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const email = ref('');
</script>
<template>
    <div>
        <form @submit.prevent="forget">

        </form>
    </div>
</template>