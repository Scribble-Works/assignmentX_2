<script setup>
const yr = new Date().getFullYear();
</script>
<template>
    <div>
        <footer>
            <div class="footer-social-icons">
                <NuxtLink href="https://www.facebook.com/swphofficial?mibextid=ZbWKwL"><i class="fab fa-facebook"></i>
                </NuxtLink>
                <NuxtLink href="https://x.com/swphofficial?t=lqDdlhdLVqY9UYis9LlDIw&s=08"><i class="fab fa-twitter"></i>
                </NuxtLink>
                <NuxtLink href="https://www.instagram.com/swphofficial?igsh=Z2h1YTF6cng1ZTIz"><i
                        class="fab fa-instagram"></i></NuxtLink>
                <NuxtLink href="https://www.linkedin.com/company/swphofficial/"><i class="fab fa-linkedin"></i>
                </NuxtLink>
            </div>
            <p>&copy; {{ yr }} Assignment Workbook Series. All rights reserved.</p>
        </footer>
    </div>
</template>
<style>
footer {
    z-index: 1000;
    background-color: #f8f9fa;
    padding: 40px;
    margin-top: 40px;
    text-align: center;
    border: 1px solid;
    /* width: auto; */
}

.footer-social-icons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
}

.footer-social-icons a {
    color: #000;
    font-size: 20px;
}
</style>