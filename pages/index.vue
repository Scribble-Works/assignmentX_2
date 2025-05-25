<script setup>
const user = useSupabaseUser();
</script>
<template>
    <div>
        <!-- Hero Section -->
        <section class="hero flex items-center justify-center min-h-screen bg-cover bg-center relative"
            style="background-image: url('/img/img1.jpg');">
            <div class="absolute inset-0 bg-black opacity-50"></div>
            <div class="text-center text-white relative z-10 p-4 max-w-lg mx-auto">
                <h1 class="text-4xl md:text-6xl font-bold">Unlock Learning with <div class="asign">AssignmentX</div></h1>
                <p class="mt-4 text-lg md:text-xl">Scan your workbook QR code to access an abundance of learning
                    resources.</p><br>
                <div v-if="!user">
                    <v-btn to="/auth" size="large" color="blue">Get Started</v-btn>
                </div>
                <div v-else>
                    <v-btn to="/workbook/" size="large" color="blue">Get Started</v-btn>
                </div>
            </div>
        </section>

        <v-container>
            <v-row>
                <v-col>
                    <p class="text-uppercase">what we do</p>
                    <h2>Struggling to understand your textbook?</h2><br>
                    <p>We've got you covered. <br> Clear explanations, helpful examples, and extra insights - all designed to help you master your subject.</p>
                </v-col>
                <v-col class="d-flex flex-column" cols="6">
                    <v-row>
                        <v-col cols="12">
                            <v-sheet height="600" class="d-flex" rounded>
                                <v-img src="/img/home1.jpg"></v-img>
                            </v-sheet>
                        </v-col>
                        <v-col cols="6">
                            <v-sheet height="300" class="d-flex" rounded>
                                <v-img src="/img/home2.jpg"></v-img>
                            </v-sheet>
                        </v-col>
                        <v-col cols="6">
                            <v-sheet height="300" class="d-flex" rounded>
                                <v-img src="/img/home3.jpg"></v-img>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>


            <div>
                <p class="text-center text-uppercase">what we do</p>
                <h1 class="text-center">Getting Started</h1><br>
                <v-row>
                    <v-col>
                        <v-sheet>
                            <v-img src="/img/home4.jpg"></v-img>
                        </v-sheet>
                    </v-col>
                    <v-col>
                        
                    </v-col>
                </v-row>
            </div>
        </v-container>
        
    </div>
</template>
<style>
.asign {
    color: rgb(255, 187, 0);
    
}
</style>