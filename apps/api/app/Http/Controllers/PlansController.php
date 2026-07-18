<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\JsonResponse;

class PlansController extends Controller
{
    public function index(): JsonResponse
    {
        $plans = Plan::active()
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get();

        return response()->json(['plans' => $plans]);
    }
}
