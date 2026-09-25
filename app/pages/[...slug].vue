<script setup lang="ts">
import { createError } from '#imports'

// Catch-all so unknown paths 404 without vue-router's "No match found" warning on stdout.
// Server: non-fatal still renders the error page, and Nitro only logs fatal/unhandled errors.
// Client: fatal is required to show the error page on in-app navigation.
throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: import.meta.client })
</script>
