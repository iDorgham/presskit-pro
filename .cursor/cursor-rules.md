# **Cursor AI Master Rules for PressKit Pro**

## **1\. Core Philosophy & AI Interaction**

This is a multi-platform project. Always be aware of which part you are working on (server, client-web, or client-mobile). When I give a command, implicitly use @PDR.md, @tasks.md, @STRUCTURE.md, and this file (@.cursor-rules) for context.

## **2\. Design System & Style Guide**

* **Aesthetic:** Modern, flat, minimal, content-first.  
* **Color Palette:** Primary Background (\#F9FAFB), Text (\#1F2937), Primary Accent (\#8B5CF6).  
* **Typography:** Font (Inter), bold headings, readable body text.  
* **Layout:** Generous whitespace, consistent grid and spacing.  
* **Animation (Web):** Use framer-motion for subtle, meaningful animations.

## **3\. Security Mandates (Expanded)**

* **Never Trust the Client:** All data arriving at the backend API **must** be validated and sanitized. Use express-validator to define strict schemas for every endpoint (checking data types, lengths, formats).  
* **Secure Headers:** Use the helmet library in Express to set secure HTTP headers by default. This helps mitigate XSS and clickjacking.  
* **Rate Limiting:** Use express-rate-limit on authentication and other sensitive endpoints to prevent brute-force and denial-of-service attacks.  
* **CORS Policy:** Configure CORS on the backend to only allow requests from your known frontend domains in production. Be as restrictive as possible.  
* **Dependency Scanning:** Regularly run npm audit \--production to check for vulnerabilities in third-party packages and patch them immediately.  
* **Content Security Policy (CSP):** For the web app, generate a strict CSP to control which resources (scripts, styles, images) can be loaded, preventing many injection attacks.  
* **Secrets Management:** All secrets (API keys, DB URIs, JWT secrets) **must** be loaded from environment variables (.env) and never be committed to Git. Create a .env.example file.

## **4\. SEO Mandates (Expanded)**

* **Metadata:** Use Next.js's generateMetadata function on all public pages. Metadata must be dynamic and unique for each artist page, including a compelling title and description.  
* **Social & Open Graph:** Implement Open Graph (og:) and Twitter Card (twitter:) meta tags for rich social media sharing. Include og:title, og:description, og:image, and og:type.  
* **Structured Data (JSON-LD):** Implement JSON-LD structured data on public artist pages using the MusicGroup or Person schema from Schema.org. This provides rich results in Google Search.  
* **Crawlability:** Generate a sitemap.xml file to list all public artist pages and a robots.txt file to guide search engine crawlers.  
* **Performance (Core Web Vitals):** Prioritize performance. Use the next/image component for all images, lazy-load below-the-fold content, and keep JavaScript bundles small. Performance is a key ranking factor.  
* **Semantic HTML:** Use proper, semantic HTML5 tags (\<main\>, \<section\>, \<nav\>, \<h1\>, etc.) to give structure and meaning to the content.

## **5\. Backend & Frontend Rules**

* **Backend (/server):** Use routes \-\> controllers \-\> services pattern. Use async/await and try...catch blocks.  
* **Web (/client-web):** Use Next.js App Router. Use Tailwind CSS. Fetch data in Server Components.  
* **Mobile (/client-mobile):** Use Expo and Expo Router. Use StyleSheet for styling.