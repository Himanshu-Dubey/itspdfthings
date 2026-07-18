<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PlanController extends Controller
{
    public function index(): JsonResponse
    {
        $plans = Plan::orderBy('sort_order')->orderBy('price')->get();

        return response()->json(['plans' => $plans]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'            => ['required', 'string', 'max:100'],
            'description'     => ['nullable', 'string', 'max:500'],
            'price'           => ['required', 'numeric', 'min:0'],
            'interval'        => ['required', 'in:month,year'],
            'stripe_price_id' => ['nullable', 'string', 'max:255'],
            'features'        => ['nullable', 'array'],
            'features.*'      => ['string', 'max:255'],
            'is_active'       => ['boolean'],
            'sort_order'      => ['integer', 'min:0'],
        ]);

        $base = Str::slug(($data['name'] ?? 'plan') . '-' . ($data['interval'] ?? 'month'));
        $slug = $base;
        $i    = 1;
        while (Plan::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }
        $data['slug'] = $slug;

        $plan = Plan::create($data);

        return response()->json(['plan' => $plan], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $plan = Plan::findOrFail($id);

        $data = $request->validate([
            'name'            => ['sometimes', 'string', 'max:100'],
            'description'     => ['nullable', 'string', 'max:500'],
            'price'           => ['sometimes', 'numeric', 'min:0'],
            'interval'        => ['sometimes', 'in:month,year'],
            'stripe_price_id' => ['nullable', 'string', 'max:255'],
            'features'        => ['nullable', 'array'],
            'features.*'      => ['string', 'max:255'],
            'is_active'       => ['sometimes', 'boolean'],
            'sort_order'      => ['sometimes', 'integer', 'min:0'],
        ]);

        $plan->update($data);

        return response()->json(['plan' => $plan->fresh()]);
    }

    public function destroy(int $id): JsonResponse
    {
        Plan::findOrFail($id)->delete();

        return response()->json(['message' => 'Plan deleted.']);
    }
}
