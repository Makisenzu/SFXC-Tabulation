<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class SettingsController extends Controller
{
    /**
     * Get current application logo
     */
    public function getLogo()
    {
        $logoPath = $this->getCurrentLogoPath();
        
        return response()->json([
            'logo' => $logoPath
        ]);
    }

    /**
     * Upload and update application logo
     */
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
        ]);

        try {
            // Get the uploaded file
            $file = $request->file('logo');
            
            // Delete old logo if exists
            $oldLogoPath = $this->getCurrentLogoPath();
            if ($oldLogoPath && Storage::disk('public')->exists($oldLogoPath)) {
                Storage::disk('public')->delete($oldLogoPath);
            }

            // Store new logo
            $filename = 'app-logo.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('logos', $filename, 'public');

            return response()->json([
                'message' => 'Logo uploaded successfully',
                'logo' => $path
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload logo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current logo path (check for app-logo.* in storage)
     */
    private function getCurrentLogoPath()
    {
        $extensions = ['png', 'jpg', 'jpeg', 'gif'];
        
        foreach ($extensions as $ext) {
            $path = 'logos/app-logo.' . $ext;
            if (Storage::disk('public')->exists($path)) {
                return $path;
            }
        }

        return null;
    }
}
