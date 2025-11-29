<script setup>
const props = defineProps({
    error: {
        type: Object,
        required: true
    }
});
const router = useRouter();
const goHome = () => {
    router.push('/');
};
const handleError = () => clearError({ redirect: '/' });
// handleError();
</script>
<template>
    <div class="error-page">
        <img src="/img/logo.png" alt="">
        <h1>Error</h1>
        <p><strong></strong><br> Sorry, something went wrong.</p>
        <button @click="goHome">Go to Home</button>
    </div>
</template>

<style scoped>
.error-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: #d32f2f;
    background: #f9f9f9;
}

h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

button {
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    background: #d32f2f;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background: #b71c1c;
}
</style>