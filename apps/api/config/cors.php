<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Never use '*' here — SameSite/credential cookies require an explicit origin.
    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://app.itspdfthings.com:3000,http://admin.itspdfthings.com:3001')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 600,

    // Required for Sanctum SPA cookie auth — do not set to false.
    'supports_credentials' => true,

];
