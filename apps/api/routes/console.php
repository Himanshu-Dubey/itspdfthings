<?php

use Illuminate\Support\Facades\Schedule;

// Purge expired files from object storage every hour.
// The scheduler container in docker-compose runs `schedule:run` every 60 seconds.
Schedule::command('files:purge-expired')->hourly();
