<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class SettingsController extends Controller
{
    /**
     * Get current event logo (for printing)
     */
    public function getLogo()
    {
        $logoPath = $this->getCurrentLogoPath('event-logo');
        
        return response()->json([
            'logo' => $logoPath
        ]);
    }

    /**
     * Upload and update event logo (for printing)
     */
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
        ]);

        try {
            // Get the uploaded file
            $file = $request->file('logo');
            
            // Delete old event logo if exists
            $oldLogoPath = $this->getCurrentLogoPath('event-logo');
            if ($oldLogoPath && Storage::disk('public')->exists($oldLogoPath)) {
                Storage::disk('public')->delete($oldLogoPath);
            }

            // Store new event logo
            $filename = 'event-logo.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('logos', $filename, 'public');

            return response()->json([
                'message' => 'Event logo uploaded successfully',
                'logo' => $path
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload logo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current logo path (check for logo.* in storage)
     */
    private function getCurrentLogoPath($prefix = 'event-logo')
    {
        $extensions = ['png', 'jpg', 'jpeg', 'gif'];
        
        foreach ($extensions as $ext) {
            $path = 'logos/' . $prefix . '.' . $ext;
            if (Storage::disk('public')->exists($path)) {
                return $path;
            }
        }

        return null;
    }
}
