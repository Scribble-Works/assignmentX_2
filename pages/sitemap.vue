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
                to="/resources"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Resources
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/workbook"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Workbook
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
                to="/auth"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Login/Register
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/register"
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
                to="/edit-profile"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Edit Profile
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/editprofile"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Edit Profile (Alt)
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/bio"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Bio
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/bookmarks"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Bookmarks
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/progress"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Progress
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/completed"
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
                to="/onboarding1"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Onboarding Step 1
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/role"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Role Selection
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/location"
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
                to="/individualtopic"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Individual Topics
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/livesession"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Live Sessions
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/preview"
                class="text-blue-600 hover:text-blue-800 transition flex items-center"
              >
                <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Preview
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
              Individual Topics
            </h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>/individualtopic/[id] - Specific topic pages</li>
              <li>/individualtopic/[id]/index - Topic index pages</li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">
              Workbook Structure
            </h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>/workbook/workbook1/strand-[id] - Strand pages</li>
              <li>
                /workbook/workbook1/strand-[id]/substrand-[route]/[id] -
                Substrand content
              </li>
              <li>/workbookdetail/[name] - Detailed workbook pages</li>
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
            <div class="text-2xl font-bold text-blue-600">25+</div>
            <div class="text-sm text-gray-600">Total Pages</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">6</div>
            <div class="text-sm text-gray-600">Main Categories</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">8</div>
            <div class="text-sm text-gray-600">Dynamic Routes</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-orange-600">3</div>
            <div class="text-sm text-gray-600">Layouts</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
