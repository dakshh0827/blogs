# blogs

blogs is a public platform to create and discover blogs and articles. It features blog writing page, category based filtering and comments.

## ✨ Features

*   **Responsive Design**: Adapts to various screen sizes for a seamless experience on desktop and mobile devices.
*   **Contact Form**: Integrated contact form with Google reCAPTCHA v3 validation, sending emails via Resend.
*   **Theme Toggler**: Allows users to switch between dark and light modes, with styles managed via CSS variables and Next Themes.
*   **SEO Optimized**: Includes dynamic meta tags for better search engine visibility and automatically generates a sitemap on build.
*   **Category Filtering**: Allows users to filter the blogs based on the category.
*   **Credentials and OAuth**: Supports both credentials and OAuth authentication.

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) 13
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind](https://tailwindcss.com/)
*   **Form Handling**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) for validation
*   **Email Service**: [Resend](https://resend.com/) (for contact form submissions)
*   **State Management**: React Context API
*   **Linting**: [ESLint](https://eslint.org/)
*   **Captcha**: [Google reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)

## 📂 Project Structure

The project follows a standard Next.js structure with some key directories:

```
dakshh0827-blogs/
├── app/                                 # source directory for pages and APIs
|   ├── about/                           # About page
|   ├── api/                             # Backend APIs directory
|   |   ├── auth/                        # Authentication APIs
|   |   |   ├── [...nextauth]/           # Next Auth configuration
|   |   |   ├── register/                # Sign up API
|   |   |   ├── resend-verification/     # Verification code email resender and checker
|   |   |   ├── signin/                  # Sign in page
|   |   |   ├── signup/                  # Sign up page
|   |   |   ├── verifyMail/              # Verification code checker
|   |   ├── category-with-counts/        # Category and category count fetcher API
|   |   ├── category/                    # Category fetcher API
|   |   ├── comments/                    # Comments fetcher and create API
|   |   ├── contact/                     # Contact developer API
|   |   ├── posts/                       # Posts fetcher and creater API
|   |   |   ├── [slug]/                  # Unique posts fetcher by slug
|   |   ├── upload/                      # Image uploader(cloudinary) 
|   ├── blog/                            # Category based filtered blogs page
|   ├── contact/                         # Contact developer page
|   ├── posts/[slug]/                    # Unique posts page
|   ├── write/                           # Blog creating and publishing page
├── components/                          # Reusable UI components
│   ├── ui/                              # shad-cn components
├── helpers/                             # Miscellaneous components and types
├── lib/                                 # Configuration files
├── mails/                               # Static email format
├── prisma/                              # Prisma schema for database connection
├── public/                              # Static assets (images)
```

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dakshh0827/blogs.git
    cd blogs
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Then, fill in the required values in your `.env` file. The primary contact form (`pages/api/form.ts`) uses Resend. You will need to add/update the following variables:

    ```env
      NEXTAUTH_URL=""
      NEXTAUTH_SECRET=""
      
      RESEND_API_KEY=""
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY=""
      RECAPTCHA_SECRET_KEY=""
      CONTACT_EMAIL=""
      
      EMAIL_USER=""
      EMAIL_PASS=""
      EMAIL_FROM="noreply@blogs.com"
      
      GOOGLE_CLIENT_ID=""
      GOOGLE_CLIENT_SECRET=""
      GOOGLE_REFRESH_TOKEN=""

      DATABASE_URL=""
      
      CLOUDINARY_CLOUD_NAME=""
      CLOUDINARY_API_KEY=""
      CLOUDINARY_API_SECRET=""
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
    

*Thankyou*
