# PressKit Pro - Project Context

## Project Overview
PressKit Pro is a secure, high-performance platform for artists to build and share professional Electronic Press Kits (EPKs) across web, iOS, and Android platforms.

## Core Architecture
The platform consists of three separate applications:
1. **Backend Server:** (Node.js, Express, MongoDB) - The central, secure API
2. **Web Frontend:** (Next.js, Tailwind CSS) - The public website and web dashboard  
3. **Mobile Frontend:** (React Native, Expo) - The native iOS and Android apps

## User Tiers & Features
- **Free Tier:** Basic EPK with 3 photo galleries, 5 music tracks, standard templates
- **Premium Tier ($9.99/month):** Unlimited content, custom domains, advanced analytics, white-label options
- **Pro Tier ($29.99/month):** Team collaboration, custom CSS, integration APIs, priority support

## Technical Requirements
- **Security:** Protected against OWASP Top 10 vulnerabilities
- **Performance:** Core Web Vitals optimization, sub-3 second load times
- **SEO:** Technical optimization for search engines
- **Scalability:** Support 10,000+ concurrent users and 100,000+ EPKs
- **Uptime:** 99.9% availability target

## File Upload Specifications
- **Image Files:** JPEG, PNG, WebP, HEIC (max 10MB per file, 50 files per gallery)
- **Audio Files:** MP3, WAV, FLAC (max 25MB per file, 20 files per artist)
- **Document Files:** PDF (max 5MB per file for riders and press materials)
- **Total Storage:** 500MB for free tier, 5GB for premium tier

## Compliance Requirements
- **GDPR Compliance:** Full European data protection regulation compliance
- **CCPA Compliance:** California Consumer Privacy Act compliance for US users
- **Music Licensing:** Clear guidelines for uploaded music content and copyright protection