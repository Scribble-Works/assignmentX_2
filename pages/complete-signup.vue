<script setup>
definePageMeta({
    layout: 'onboarding'
});
</script>
<template>
    <div class="complete-signup">
        <h1>Signup Complete!</h1>
        <div style="display: flex; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48" style="margin-bottom: 20px;">
            <rect width="48" height="48" rx="8" fill="#eaf6fb"/>
            <path d="M12 16a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V16zm2 0l12 10 12-10" stroke="#3498db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
        </div>
        <p>
            Thank you for signing up. Please check your email inbox and follow the instructions to confirm your email address.
        </p>
        <p>
            Once your email is confirmed, you can log in and start using your account.
        </p>
    </div>
</template>


<style scoped>
.complete-signup {
    max-width: 400px;
    margin: 80px auto;
    padding: 32px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    text-align: center;
}
.complete-signup h1 {
    margin-bottom: 16px;
    color: #2c3e50;
}
.complete-signup p {
    margin-bottom: 12px;
    color: #555;
}
</style>