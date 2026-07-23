<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadsController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::query();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $leads = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'leads'       => $leads->items(),
            'total'       => $leads->total(),
            'currentPage' => $leads->currentPage(),
            'lastPage'    => $leads->lastPage(),
        ]);
    }

    public function show($id)
    {
        $lead = Lead::findOrFail($id);
        return response()->json(['lead' => $lead]);
    }

    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $validated = $request->validate([
            'status' => 'sometimes|in:new,read,replied,archived',
        ]);

        $lead->update($validated);

        return response()->json(['lead' => $lead]);
    }

    public function destroy($id)
    {
        Lead::findOrFail($id)->delete();
        return response()->json(['message' => 'Lead deleted']);
    }

    public function stats()
    {
        return response()->json([
            'total' => Lead::count(),
            'new'   => Lead::where('status', 'new')->count(),
            'read'  => Lead::where('status', 'read')->count(),
            'replied' => Lead::where('status', 'replied')->count(),
        ]);
    }
}
