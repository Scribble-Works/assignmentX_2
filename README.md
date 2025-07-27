# Educational Platform - ScribbleWorks

A comprehensive educational platform built with Nuxt 3, designed to provide interactive learning experiences for students and educators.

## 🎓 Project Overview

ScribbleWorks is a modern educational platform that offers:

- **Interactive Learning Modules** with workbooks and live sessions
- **User Authentication & Profile Management**
- **Progress Tracking & Analytics**
- **Responsive Design** for all devices
- **Accessibility Features** for inclusive learning

## 🚀 Features

### Core Functionality

- **User Authentication**: Secure login, registration, and password recovery
- **Profile Management**: Edit profiles, track progress, manage bookmarks
- **Learning Content**: Interactive workbooks, individual topics, and live sessions
- **Progress Tracking**: Monitor learning progress and completed courses
- **Onboarding System**: Guided setup for new users with role selection

### Technical Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Accessibility**: Built with accessibility in mind for all users
- **SEO Optimized**: Meta tags and structured content for search engines
- **Performance Optimized**: Fast loading times and efficient resource usage

## 📁 Project Structure

```
assignmentX_2/
├── app.vue                 # Main application component
├── assets/                 # Static assets (CSS, images)
├── components/             # Reusable Vue components
├── composables/            # Vue composables (useSheet.js)
├── layouts/                # Page layouts (auth, default, onboarding, resources)
├── pages/                  # Application pages
│   ├── index.vue          # Home page
│   ├── auth.vue           # Authentication
│   ├── edit-profile.vue   # Profile editing
│   ├── workbook/          # Learning workbooks
│   ├── individualtopic/   # Individual topics
│   └── sitemap.vue        # Site navigation map
├── plugins/                # Nuxt plugins (vuetify.js)
├── public/                 # Public assets
└── server/                 # Server-side configuration
```

## 🗺️ Site Map

### Main Pages

- **Home** (`/`) - Landing page with platform overview
- **About** (`/about`) - Company and platform information
- **Pricing** (`/pricing`) - Subscription plans and pricing
- **Resources** (`/resources`) - Learning materials and resources

### Authentication

- **Login** (`/auth`) - User sign-in
- **Register** (`/register`) - New user registration
- **Forgot Password** (`/forget`) - Password recovery
- **New Password** (`/newpassword`) - Password reset

### User Profile

- **Edit Profile** (`/edit-profile`) - Update account information
- **Bio** (`/bio`) - User biography and details
- **Progress** (`/progress`) - Learning progress tracking
- **Completed** (`/completed`) - Finished courses
- **Bookmarks** (`/bookmarks`) - Saved content

### Onboarding

- **Onboarding** (`/onboarding1`) - Welcome process
- **Role Selection** (`/role`) - Choose user role
- **Location** (`/location`) - Set user location
- **Accessibility** (`/accessibility`) - Accessibility settings

### Learning Content

- **Individual Topics** (`/individual`) - Topic overview
- **Topic Details** (`/individualtopic`) - Specific topic content
- **Workbooks** (`/workbook`) - Interactive learning workbooks
- **Live Sessions** (`/livesession`) - Real-time learning sessions
- **Preview** (`/preview`) - Content preview

### Legal & Support

- **Legal** (`/legal`) - Legal information
- **Privacy Policy** (`/privacy`) - Privacy information
- **Terms of Service** (`/termsofservice`) - Terms and conditions
- **Sales & Refunds** (`/salesandrefunds`) - Purchase policies

### Dynamic Routes

- **Workbook Structure**: `/workbook/workbook1/strand-[id]/substrand-[route]/[id]`
- **Individual Topics**: `/individualtopic/[id]`
- **Workbook Details**: `/workbookdetail/[name]`

## 🛠️ Technology Stack

- **Framework**: Nuxt 3 (Vue 3)
- **Styling**: Tailwind CSS
- **UI Components**: Vuetify
- **Authentication**: Supabase
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel/Netlify ready

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, pnpm, or bun

### 1. Clone the Repository

```bash
git clone <repository-url>
cd assignmentX_2
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm
pnpm install

# Using yarn
yarn install

# Using bun
bun install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### 4. Start Development Server

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev

# Using yarn
yarn dev

# Using bun
bun run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build & Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deployment

The application is ready for deployment on:

- **Vercel**: Automatic deployment from Git
- **Netlify**: Drag and drop deployment
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment

## 🎨 Customization

### Styling

- Modify `assets/style/main.css` for global styles
- Update `tailwind.config.js` for Tailwind customization
- Edit component-specific styles in individual `.vue` files

### Components

- Reusable components are in the `components/` directory
- Layout components are in the `layouts/` directory
- Page components are in the `pages/` directory

### Configuration

- Update `nuxt.config.ts` for Nuxt configuration
- Modify `plugins/` for additional functionality
- Edit `composables/` for shared logic

## 📊 Site Statistics

- **Total Pages**: 25
- **Main Pages**: 4
- **Authentication Pages**: 4
- **Dynamic Routes**: 7
- **User Profile Pages**: 5
- **Learning Content Pages**: 5
- **Legal & Support Pages**: 4

## 🔧 Development Guidelines

### Code Style

- Use Vue 3 Composition API
- Follow Nuxt 3 conventions
- Implement responsive design
- Ensure accessibility compliance

### Component Structure

```vue
<template>
  <!-- Template content -->
</template>

<script setup>
// Composition API logic
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### File Naming

- Use kebab-case for file names
- Use PascalCase for component names
- Use camelCase for variables and functions

## 🚀 Performance Optimization

- **Image Optimization**: Automatic image optimization with Nuxt
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components and images load on demand
- **Caching**: Built-in caching strategies
- **SEO**: Meta tags and structured data

## 🔒 Security Features

- **Authentication**: Secure user authentication with Supabase
- **Input Validation**: Form validation and sanitization
- **CSRF Protection**: Built-in CSRF protection
- **HTTPS**: Secure communication protocols
- **Data Privacy**: GDPR compliant data handling

## 📱 Responsive Design

The platform is fully responsive and optimized for:

- **Desktop**: Full-featured experience
- **Tablet**: Touch-optimized interface
- **Mobile**: Mobile-first design approach

## ♿ Accessibility

- **WCAG 2.1 AA Compliance**: Built with accessibility in mind
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Color Contrast**: High contrast ratios for readability
- **Focus Management**: Proper focus indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added user authentication and profile management
- **v1.2.0**: Implemented learning content and progress tracking
- **v1.3.0**: Enhanced UI/UX and accessibility features

---

**Built with ❤️ using Nuxt 3 and Vue 3**
