# **Project Design & Requirements: PressKit Pro**

## **1\. Objective**

To create a secure, high-performance platform for artists to build and share professional Electronic Press Kits (EPKs) across the web, iOS, and Android.

## **2\. Functional Requirements**

* **User Authentication:** Secure sign-up and login for artists.  
* **EPK Builder Dashboard:** A private dashboard for artists to manage their bio, photos, music links, riders, and contact info.  
* **Public Press Kit:** A unique, shareable, and fast-loading webpage for each artist.

## **3\. Technical Requirements**

### **File Upload Specifications**
* **Image Files:** JPEG, PNG, WebP, HEIC (max 10MB per file, 50 files per gallery)
* **Audio Files:** MP3, WAV, FLAC (max 25MB per file, 20 files per artist)
* **Document Files:** PDF (max 5MB per file for riders and press materials)
* **Total Storage:** 500MB for free tier, 5GB for premium tier

### **User Tiers & Features**
* **Free Tier:** Basic EPK with 3 photo galleries, 5 music tracks, standard templates
* **Premium Tier ($9.99/month):** Unlimited content, custom domains, advanced analytics, white-label options
* **Pro Tier ($29.99/month):** Team collaboration, custom CSS, integration APIs, priority support

### **API Rate Limiting**
* **Authentication Endpoints:** 5 requests per minute per IP
* **File Upload Endpoints:** 10 requests per minute per authenticated user
* **Public EPK Access:** 100 requests per minute per IP
* **Admin/Dashboard APIs:** 60 requests per minute per authenticated user

### **Data Management**
* **Backup Strategy:** Daily automated backups with 30-day retention
* **Export Functionality:** Complete EPK data export in JSON and PDF formats
* **Data Retention:** User data retained for 12 months after account deletion
* **GDPR Compliance:** Right to access, modify, and delete personal data

## **4\. Non-Functional Requirements**

* **Security:** The application must be protected against common web vulnerabilities (OWASP Top 10). All data must be handled securely, both in transit and at rest.  
* **Performance:** The public-facing web pages must be highly performant and achieve good scores on Google's Core Web Vitals to ensure a positive user experience and SEO ranking.  
* **SEO:** The public-facing web pages must be technically optimized for search engines to maximize organic visibility for the artists.
* **Scalability:** Architecture must support 10,000+ concurrent users and 100,000+ EPKs
* **Uptime:** 99.9% availability target with comprehensive monitoring and alerting

## **5\. High-Level Architecture**

The platform consists of three separate applications:

1. **Backend Server:** (Node.js, Express, MongoDB) \- The central, secure API.  
2. **Web Frontend:** (Next.js, Tailwind CSS) \- The public website and web dashboard.  
3. **Mobile Frontend:** (React Native, Expo) \- The native iOS and Android apps.

## **6\. Compliance & Legal**

* **GDPR Compliance:** Full European data protection regulation compliance
* **CCPA Compliance:** California Consumer Privacy Act compliance for US users
* **Music Licensing:** Clear guidelines for uploaded music content and copyright protection
* **Terms of Service:** Comprehensive ToS covering content ownership and platform usage