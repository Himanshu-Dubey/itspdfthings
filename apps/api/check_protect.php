<?php
$db = new PDO('sqlite:c:/laragon/www/loveupdf/apps/api/database/database.sqlite');
$rows = $db->query("SELECT substr(id,1,8) as sid, options, status, error_message FROM pdf_jobs WHERE tool_type='protect' ORDER BY created_at DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $r) {
    echo "id={$r['sid']}... options=" . ($r['options'] ?? 'NULL') . " status={$r['status']} err=" . ($r['error_message'] ?? 'none') . "\n";
}
