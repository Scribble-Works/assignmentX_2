<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Site Map</h1>
        <p class="text-lg text-gray-600">
          Complete navigation structure of our educational platform
        </p>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Main Pages -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2
            class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2"
          >
            🏠 Main Pages
          </h2>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                to="/"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/about"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                About Us
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/pricing"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Pricing
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/facilitator-resources"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Resources
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/learning-modules"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Learning Modules
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Authentication -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2
            class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2"
          >
            🔐 Authentication
          </h2>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                to="/login"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Login/Register
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/sign-up"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Register
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/forget"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Forgot Password
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/newpassword"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                New Password
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- User Profile -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2
            class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2"
          >
            👤 User Profile
          </h2>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                :to="authLink('/edit-profile')"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Edit Profile
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="authLink('/editprofile')"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Edit Profile (Alt)
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="authLink('/bio')"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Bio
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="authLink('/bookmarks')"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Bookmarks
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="authLink('/progress')"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Progress
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="authLink('/completed')"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Completed
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Onboarding -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2
            class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2"
          >
            🚀 Onboarding
          </h2>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                :to="authLink('/onboarding')"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Onboarding Step 1
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="authLink('/role')"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Role Selection
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="authLink('/location')"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Location Setup
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Learning Content -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2
            class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2"
          >
            📚 Learning Content
          </h2>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                :to="authLink('/individual')"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Individual Topics
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="authLink('/livesession')"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Live Sessions
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Legal & Support -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2
            class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2"
          >
            ⚖️ Legal & Support
          </h2>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                to="/privacy"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                Privacy Policy
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/termsofservice"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                Terms of Service
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/legal"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                Legal
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/accessibility"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                Accessibility
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/salesandrefunds"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                Sales & Refunds
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Dynamic Routes Info -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2
          class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2"
        >
          🔗 Dynamic Routes
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">
              Learning Modules Structure
            </h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>
                /learning-modules/[module] - Module pages
                (assignment_workbook1–3, preassignment_workbook1–3)
              </li>
              <li>/learning-modules/[module]/strand-[id] - Strand pages</li>
              <li>
                /learning-modules/[module]/strand-[id]/substrand-[route] -
                Substrand pages
              </li>
              <li>
                /learning-modules/[module]/strand-[id]/substrand-[route]/[id] -
                Substrand content
              </li>
              <li>
                /learning-modules/[module]/strand-[id]/substrand-[route]/quiz/[contentId]
                - Quizzes and problem sets
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">
              Facilitator Resources
            </h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>
                /facilitator-resources/curriculum/[route] - Curriculum pages
              </li>
              <li>
                /facilitator-resources/bece-past-questions/[route] - BECE past
                question papers
              </li>
              <li>
                /facilitator-resources/worksheets/[route] - Worksheet
                collections
              </li>
              <li>
                /facilitator-resources/worksheets/[route]/[slug] - Individual
                worksheets
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">
              MPAP Premium
            </h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>/mpap/grade-[grade] - Grade pages</li>
              <li>/mpap/lesson-[id] - Lesson pages</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Site Statistics -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2
          class="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2"
        >
          📊 Site Statistics
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">85</div>
            <div class="text-sm text-gray-600">Total Pages</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">6</div>
            <div class="text-sm text-gray-600">Main Categories</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">11</div>
            <div class="text-sm text-gray-600">Dynamic Routes</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-orange-600">4</div>
            <div class="text-sm text-gray-600">Layouts</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Pages that need a signed-in user send visitors to login first; login.vue
// honours ?redirect= and returns them to the page they picked.
const user = useSupabaseUser();
const authLink = (path) =>
  user.value ? path : { path: "/login", query: { redirect: path } };

definePageMeta({
  layout: "default",
});

useHead({
  title: "Site Map - Educational Platform",
  meta: [
    {
      name: "description",
      content:
        "Complete navigation structure and site map of our educational platform",
    },
  ],
});
</script>
