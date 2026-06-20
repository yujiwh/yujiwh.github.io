// Cloudflare Worker: Security Headers + CSP
// Deploy via: Cloudflare Dashboard > Workers & Pages > Create Worker
// Route: yujiwh.xyz/*

export default {
  async fetch(request, env, ctx) {
    const response = await fetch(request)
    const newResponse = new Response(response.body, response)

    // Security Headers
    newResponse.headers.set('X-Frame-Options', 'DENY')
    newResponse.headers.set('X-Content-Type-Options', 'nosniff')
    newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
    
    // HSTS (1 year, include subdomains, preload)
    newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

    // Content Security Policy
    // Adjust 'unsafe-inline' if you move all inline scripts/styles to external files
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",  // 'unsafe-inline' needed for inline <script> in HTML
      "style-src 'self' 'unsafe-inline'",   // 'unsafe-inline' needed for inline <style>
      "font-src 'self' data:",
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'"
    ].join('; ')
    
    newResponse.headers.set('Content-Security-Policy', csp)

    // Cache static assets
    const url = new URL(request.url)
    if (url.pathname.startsWith('/assets/') || 
        url.pathname.endsWith('.webp') || 
        url.pathname.endsWith('.woff2')) {
      newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }

    return newResponse
  }
}