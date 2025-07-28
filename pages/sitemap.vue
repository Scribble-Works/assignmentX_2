<template>
  <div class="min-h-screen bg-gray-50 px-[10%]">
    <div class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Site Map</h1>
        <p class="text-lg text-gray-600">Complete navigation structure of our educational platform</p>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Main Pages -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Main Pages
          </h2>
          <div class="space-y-3">
            <NuxtLink to="/" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Home</span>
                <span class="text-sm text-gray-500">Landing page</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/about" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">About</span>
                <span class="text-sm text-gray-500">Company information</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/pricing" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Pricing</span>
                <span class="text-sm text-gray-500">Subscription plans</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/resources" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Resources</span>
                <span class="text-sm text-gray-500">Learning materials</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Authentication -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Authentication
          </h2>
          <div class="space-y-3">
            <NuxtLink to="/auth" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Login</span>
                <span class="text-sm text-gray-500">Sign in</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/register" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Register</span>
                <span class="text-sm text-gray-500">Create account</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/forget" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Forgot Password</span>
                <span class="text-sm text-gray-500">Reset password</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/newpassword" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">New Password</span>
                <span class="text-sm text-gray-500">Set new password</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- User Profile -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            User Profile
          </h2>
          <div class="space-y-3">
            <NuxtLink to="/edit-profile" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Edit Profile</span>
                <span class="text-sm text-gray-500">Update account info</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/bio" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Bio</span>
                <span class="text-sm text-gray-500">User biography</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/progress" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Progress</span>
                <span class="text-sm text-gray-500">Learning progress</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/completed" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Completed</span>
                <span class="text-sm text-gray-500">Finished courses</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/bookmarks" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Bookmarks</span>
                <span class="text-sm text-gray-500">Saved content</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Onboarding -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Onboarding
          </h2>
          <div class="space-y-3">
            <NuxtLink to="/onboarding1" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Onboarding</span>
                <span class="text-sm text-gray-500">Welcome process</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/role" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Role Selection</span>
                <span class="text-sm text-gray-500">Choose user role</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/location" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Location</span>
                <span class="text-sm text-gray-500">Set location</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/accessibility" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Accessibility</span>
                <span class="text-sm text-gray-500">Accessibility settings</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Learning Content -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Learning Content
          </h2>
          <div class="space-y-3">
            <NuxtLink to="/individual" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Individual Topics</span>
                <span class="text-sm text-gray-500">Topic overview</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/individualtopic" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Topic Details</span>
                <span class="text-sm text-gray-500">Specific topics</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/workbook" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Workbooks</span>
                <span class="text-sm text-gray-500">Learning workbooks</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/livesession" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Live Sessions</span>
                <span class="text-sm text-gray-500">Live learning</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/preview" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Preview</span>
                <span class="text-sm text-gray-500">Content preview</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Legal & Support -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Legal & Support
          </h2>
          <div class="space-y-3">
            <NuxtLink to="/legal" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Legal</span>
                <span class="text-sm text-gray-500">Legal information</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/privacy" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Privacy Policy</span>
                <span class="text-sm text-gray-500">Privacy information</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/termsofservice" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Terms of Service</span>
                <span class="text-sm text-gray-500">Terms and conditions</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/salesandrefunds" class="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Sales & Refunds</span>
                <span class="text-sm text-gray-500">Purchase policies</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Dynamic Routes Info -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Dynamic Routes
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Workbook Structure</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <div>/workbook/workbook1/strand-[id]/substrand-[route]/[id]</div>
              <div>/workbook/workbook1/strand-[id]/substrand-[route]/index</div>
              <div>/workbook/workbook1/strand-[id]/index</div>
              <div>/workbook/workbook1/index</div>
              <div>/workbook/index</div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Other Dynamic Routes</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <div>/individualtopic/[id]</div>
              <div>/workbookdetail/[name]</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
          📊 Site Statistics & Visualizations
        </h2>
        
        <!-- Basic Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
          <div class="p-4 bg-blue-50 rounded-lg transform hover:scale-105 transition-all">
            <div class="text-2xl font-bold text-blue-600">{{ mainPages }}</div>
            <div class="text-sm text-gray-600">Main Pages</div>
          </div>
          <div class="p-4 bg-green-50 rounded-lg transform hover:scale-105 transition-all">
            <div class="text-2xl font-bold text-green-600">{{ authPages }}</div>
            <div class="text-sm text-gray-600">Auth Pages</div>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg transform hover:scale-105 transition-all">
            <div class="text-2xl font-bold text-purple-600">{{ dynamicRoutes }}</div>
            <div class="text-sm text-gray-600">Dynamic Routes</div>
          </div>
          <div class="p-4 bg-orange-50 rounded-lg transform hover:scale-105 transition-all">
            <div class="text-2xl font-bold text-orange-600">{{ totalPages }}</div>
            <div class="text-sm text-gray-600">Total Pages</div>
          </div>
        </div>

        <!-- Visualizations -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Pie Chart -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">📈 Page Distribution</h3>
            <div class="relative h-64 flex items-center justify-center">
              <!-- Pie Chart Visualization -->
              <div class="relative w-48 h-48">
                <!-- Main Pages -->
                <div class="absolute inset-0 rounded-full bg-blue-500 transform rotate-0" 
                     :style="`clip-path: polygon(50% 50%, 50% 0%, ${50 + (mainPages/totalPages) * 100}% 0%, 50% 50%)`"></div>
                <!-- Auth Pages -->
                <div class="absolute inset-0 rounded-full bg-green-500 transform rotate-0" 
                     :style="`clip-path: polygon(50% 50%, 50% 0%, ${50 + (authPages/totalPages) * 100}% 0%, 50% 50%); transform: rotate(${(mainPages/totalPages) * 360}deg)`"></div>
                <!-- Dynamic Routes -->
                <div class="absolute inset-0 rounded-full bg-purple-500 transform rotate-0" 
                     :style="`clip-path: polygon(50% 50%, 50% 0%, ${50 + (dynamicRoutes/totalPages) * 100}% 0%, 50% 50%); transform: rotate(${((mainPages + authPages)/totalPages) * 360}deg)`"></div>
                <!-- Other Pages -->
                <div class="absolute inset-0 rounded-full bg-orange-500 transform rotate-0" 
                     :style="`clip-path: polygon(50% 50%, 50% 0%, ${50 + ((totalPages - mainPages - authPages - dynamicRoutes)/totalPages) * 100}% 0%, 50% 50%); transform: rotate(${((mainPages + authPages + dynamicRoutes)/totalPages) * 360}deg)`"></div>
                
                <!-- Center circle -->
                <div class="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gray-800">{{ totalPages }}</div>
                    <div class="text-xs text-gray-600">Total</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Legend -->
            <div class="grid grid-cols-2 gap-2 mt-4 text-sm">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Main Pages ({{ mainPages }})</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Auth Pages ({{ authPages }})</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span>Dynamic Routes ({{ dynamicRoutes }})</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span>Other Pages ({{ totalPages - mainPages - authPages - dynamicRoutes }})</span>
              </div>
            </div>
          </div>

          <!-- Bar Chart -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">📊 Page Categories</h3>
            <div class="space-y-4">
              <!-- Main Pages Bar -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Main Pages</span>
                  <span>{{ mainPages }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-blue-500 h-3 rounded-full transition-all duration-1000" 
                       :style="`width: ${(mainPages/totalPages) * 100}%`"></div>
                </div>
              </div>
              
              <!-- Auth Pages Bar -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Auth Pages</span>
                  <span>{{ authPages }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-green-500 h-3 rounded-full transition-all duration-1000" 
                       :style="`width: ${(authPages/totalPages) * 100}%`"></div>
                </div>
              </div>
              
              <!-- Dynamic Routes Bar -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Dynamic Routes</span>
                  <span>{{ dynamicRoutes }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-purple-500 h-3 rounded-full transition-all duration-1000" 
                       :style="`width: ${(dynamicRoutes/totalPages) * 100}%`"></div>
                </div>
              </div>
              
              <!-- Other Pages Bar -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Other Pages</span>
                  <span>{{ totalPages - mainPages - authPages - dynamicRoutes }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-orange-500 h-3 rounded-full transition-all duration-1000" 
                       :style="`width: ${((totalPages - mainPages - authPages - dynamicRoutes)/totalPages) * 100}%`"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Stats -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Coverage Stats -->
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-2">🎯 Coverage</h4>
            <div class="text-3xl font-bold text-blue-600">{{ Math.round((totalPages/30) * 100) }}%</div>
            <div class="text-sm text-blue-700">Complete Platform</div>
          </div>
          
          <!-- Complexity Score -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <h4 class="font-semibold text-green-800 mb-2">🔧 Complexity</h4>
            <div class="text-3xl font-bold text-green-600">{{ Math.round((dynamicRoutes/totalPages) * 100) }}%</div>
            <div class="text-sm text-green-700">Dynamic Routes</div>
          </div>
          
          <!-- User Experience -->
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <h4 class="font-semibold text-purple-800 mb-2">👥 User Experience</h4>
            <div class="text-3xl font-bold text-purple-600">{{ Math.round(((mainPages + authPages)/totalPages) * 100) }}%</div>
            <div class="text-sm text-purple-700">Core Features</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page statistics
const mainPages = 4
const authPages = 4
const dynamicRoutes = 7
const totalPages = 25

// Set page title
useHead({
  title: 'Site Map - Educational Platform',
  meta: [
    {
      name: 'description',
      content: 'Complete site map and navigation structure of our educational platform'
    }
  ]
})
</script>
