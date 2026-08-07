import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['Google-Extended', 'GPTBot', 'ChatGPT-User', 'anthropic-ai', 'OAI-SearchBot', 'CCBot'],
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/onboarding/',
          '/dashboard/', // usually dashboard is private
        ],
      }
    ],
    sitemap: 'https://sigmaspire.com/sitemap.xml',
  };
}
