<script setup>
</script>
<template>
    <div>
        <!-- Hero Section -->
        <section class="hero flex items-center justify-center min-h-screen bg-cover bg-center relative"
            style="background-image: url('/img/Scribble monogram_color.png');">
            <div class="absolute inset-0 bg-black opacity-50"></div>
            <div class="text-center text-white relative z-10 p-4 max-w-lg mx-auto">
                <h1 class="text-4xl md:text-6xl font-bold">Unlock Learning with AssignmentX</h1>
                <p class="mt-4 text-lg md:text-xl">Scan your workbook QR code to access an abundance of learning
                    resources.</p>
                <NuxtLink to="/login" class="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded">Get Started</NuxtLink>
            </div>
        </section>

        <!-- Feature Section -->
        <section class="features py-12 bg-gray-100">
            <div class="container mx-auto text-center">
                <h2 class="text-3xl font-bold mb-8">Explore Our Features</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="card bg-white shadow-lg p-6 rounded">
                        <i class="fas fa-video fa-3x text-blue-500 mb-4"></i>
                        <h5 class="text-xl font-bold mb-2">Video Lessons</h5>
                        <p class="mb-4">Access interactive video tutorials on various topics.</p>
                        <a href="#" class="bg-blue-500 text-white py-2 px-4 rounded">Explore</a>
                    </div>
                    <div class="card bg-white shadow-lg p-6 rounded">
                        <i class="fas fa-book fa-3x text-green-500 mb-4"></i>
                        <h5 class="text-xl font-bold mb-2">Concept Notes</h5>
                        <p class="mb-4">Detailed study notes to deepen your knowledge.</p>
                        <a href="#" class="bg-green-500 text-white py-2 px-4 rounded">Read</a>
                    </div>
                    <div class="card bg-white shadow-lg p-6 rounded">
                        <i class="fas fa-question-circle fa-3x text-yellow-500 mb-4"></i>
                        <h5 class="text-xl font-bold mb-2">Quizzes</h5>
                        <p class="mb-4">Test yourself with interactive quizzes and challenges.</p>
                        <a href="#" class="bg-yellow-500 text-white py-2 px-4 rounded">Start</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Book Purchase Section -->
        <section class="book-purchase py-12 bg-yellow-500 text-white text-center">
            <div class="container mx-auto">
                <h2 class="text-3xl font-bold mb-4">Don't Have the Book Yet?</h2>
                <p class="text-lg mb-6">Get your ScribbleX Workbook now and unlock a world of learning with QR code
                    scanning!</p>
                <a href="#" class="bg-white text-yellow-500 py-2 px-4 rounded">Buy the Book</a>
            </div>
        </section>

        <!-- Call to Action Section -->
        <section class="cta bg-blue-500 text-white py-12 text-center">
            <div class="container mx-auto">
                <h2 class="text-3xl font-bold mb-4">Ready to take your learning to the next level?</h2>
                <NuxtLink to="/login" class="bg-white text-blue-500 py-2 px-4 rounded">Sign Up/Login Now</NuxtLink>
            </div>
        </section>
    </div>
</template>