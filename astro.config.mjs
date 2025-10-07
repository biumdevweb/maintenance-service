import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Site configuration
const site = 'https://maintenance-service.vercel.app';

export default defineConfig({
  site,
  output: 'static',
  
  // Integrations
  integrations: [
    tailwind({
      // Tailwind configuration
      applyBaseStyles: false,
      nesting: true
    }),
    sitemap({
      // Sitemap configuration
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date()
    })
  ],
  
  // Vite configuration
  vite: {
    define: {
      __VERCEL_ENV__: JSON.stringify(process.env.VERCEL_ENV || 'development'),
      __SITE_URL__: JSON.stringify(site)
    }
  }
});