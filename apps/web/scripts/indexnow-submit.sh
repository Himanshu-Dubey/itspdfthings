#!/bin/bash
# IndexNow submission script for itspdfthings.com
# Run this to submit all URLs to Bing/other IndexNow partners

KEY="bb853306c8c9b0673760ced255614d08f4dd8e8b13528dc4ec38052b9cfce5d9"
HOST="itspdfthings.com"
BASE="https://itspdfthings.com"
ENDPOINT="https://api.indexnow.org/indexnow"

# Collect all URLs
URLS=$(cat <<EOF
[
"${BASE}/",
"${BASE}/pricing",
"${BASE}/privacy",
"${BASE}/terms",
"${BASE}/about",
"${BASE}/contact",
"${BASE}/blog",
"${BASE}/merge-pdf",
"${BASE}/merge-pdf/online",
"${BASE}/merge-pdf/free",
"${BASE}/merge-pdf/without-watermark",
"${BASE}/merge-pdf/for-students",
"${BASE}/merge-pdf/for-teachers",
"${BASE}/merge-pdf/for-lawyers",
"${BASE}/merge-pdf/for-android",
"${BASE}/merge-pdf/for-windows",
"${BASE}/merge-pdf/for-mac",
"${BASE}/split-pdf",
"${BASE}/split-pdf/online",
"${BASE}/split-pdf/free",
"${BASE}/split-pdf/without-watermark",
"${BASE}/split-pdf/for-students",
"${BASE}/split-pdf/for-teachers",
"${BASE}/split-pdf/for-lawyers",
"${BASE}/split-pdf/for-android",
"${BASE}/split-pdf/for-windows",
"${BASE}/split-pdf/for-mac",
"${BASE}/compress-pdf",
"${BASE}/compress-pdf/online",
"${BASE}/compress-pdf/free",
"${BASE}/compress-pdf/without-watermark",
"${BASE}/compress-pdf/for-students",
"${BASE}/compress-pdf/for-teachers",
"${BASE}/compress-pdf/for-lawyers",
"${BASE}/compress-pdf/for-android",
"${BASE}/compress-pdf/for-windows",
"${BASE}/compress-pdf/for-mac",
"${BASE}/organize-pdf",
"${BASE}/organize-pdf/online",
"${BASE}/organize-pdf/free",
"${BASE}/organize-pdf/without-watermark",
"${BASE}/organize-pdf/for-students",
"${BASE}/organize-pdf/for-teachers",
"${BASE}/organize-pdf/for-android",
"${BASE}/organize-pdf/for-windows",
"${BASE}/organize-pdf/for-mac",
"${BASE}/image-to-pdf",
"${BASE}/image-to-pdf/online",
"${BASE}/image-to-pdf/free",
"${BASE}/image-to-pdf/without-watermark",
"${BASE}/image-to-pdf/for-students",
"${BASE}/image-to-pdf/for-teachers",
"${BASE}/image-to-pdf/for-android",
"${BASE}/image-to-pdf/for-windows",
"${BASE}/image-to-pdf/for-mac",
"${BASE}/pdf-to-image",
"${BASE}/pdf-to-image/online",
"${BASE}/pdf-to-image/free",
"${BASE}/pdf-to-image/without-watermark",
"${BASE}/pdf-to-image/for-students",
"${BASE}/pdf-to-image/for-teachers",
"${BASE}/pdf-to-image/for-android",
"${BASE}/pdf-to-image/for-windows",
"${BASE}/pdf-to-image/for-mac",
"${BASE}/watermark-pdf",
"${BASE}/watermark-pdf/online",
"${BASE}/watermark-pdf/free",
"${BASE}/watermark-pdf/for-students",
"${BASE}/watermark-pdf/for-teachers",
"${BASE}/watermark-pdf/for-lawyers",
"${BASE}/watermark-pdf/for-android",
"${BASE}/watermark-pdf/for-windows",
"${BASE}/watermark-pdf/for-mac",
"${BASE}/page-numbers",
"${BASE}/page-numbers/online",
"${BASE}/page-numbers/free",
"${BASE}/page-numbers/for-students",
"${BASE}/page-numbers/for-teachers",
"${BASE}/page-numbers/for-lawyers",
"${BASE}/page-numbers/for-android",
"${BASE}/page-numbers/for-windows",
"${BASE}/page-numbers/for-mac",
"${BASE}/protect-pdf",
"${BASE}/protect-pdf/online",
"${BASE}/protect-pdf/free",
"${BASE}/protect-pdf/for-students",
"${BASE}/protect-pdf/for-teachers",
"${BASE}/protect-pdf/for-lawyers",
"${BASE}/protect-pdf/for-android",
"${BASE}/protect-pdf/for-windows",
"${BASE}/protect-pdf/for-mac"
]
EOF
)

echo "Submitting $(echo "$URLS" | grep -c '"https://') URLs to IndexNow..."

RESULT=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{
    \"host\": \"$HOST\",
    \"key\": \"$KEY\",
    \"keyLocation\": \"${BASE}/${KEY}.txt\",
    \"urlList\": $URLS
  }")

HTTP_CODE=$(echo "$RESULT" | tail -1)
BODY=$(echo "$RESULT" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response: $BODY"

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "202" ]; then
  echo "OK: All URLs submitted successfully"
else
  echo "FAILED: Check the response above"
fi
