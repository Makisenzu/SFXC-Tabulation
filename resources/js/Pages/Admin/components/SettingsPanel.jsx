import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { FaUpload, FaImage, FaCheck } from 'react-icons/fa';
import { showAlert } from '@/Sweetalert';
import axios from 'axios';

export default function SettingsPanel() {
    const [currentLogo, setCurrentLogo] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch current logo
    useEffect(() => {
        fetchCurrentLogo();
    }, []);

    const fetchCurrentLogo = async () => {
        try {
            const response = await axios.get('/api/settings/logo');
            setCurrentLogo(response.data.logo);
        } catch (error) {
            console.error('Error fetching logo:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showAlert('error', 'Please select an image file');
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showAlert('error', 'File size must be less than 2MB');
                return;
            }

            setSelectedFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            showAlert('error', 'Please select a file first');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('logo', selectedFile);

        try {
            const response = await axios.post('/api/settings/logo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            showAlert('success', 'Logo updated successfully');
            setCurrentLogo(response.data.logo);
            setSelectedFile(null);
            setPreviewUrl(null);
            
            // Reload the page to update the logo everywhere
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error uploading logo:', error);
            showAlert('error', error.response?.data?.message || 'Failed to upload logo');
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Event Logo for Printing</h2>
                <p className="text-sm text-gray-600 mt-1">
                    Upload an event logo to be printed on results and cue cards (right side). The permanent SFXC logo will appear on the left. Recommended size: 200x200px (max 2MB)
                </p>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Logo */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Current Event Logo</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center bg-gray-50">
                            {loading ? (
                                <div className="text-gray-400">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : currentLogo ? (
                                <img
                                    src={`/storage/${currentLogo}`}
                                    alt="Current Logo"
                                    className="max-h-32 max-w-full object-contain"
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <FaImage className="w-12 h-12 mx-auto mb-2" />
                                    <p className="text-sm">No logo uploaded</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* New Logo Preview / Upload */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                            {previewUrl ? 'Preview' : 'Upload New Logo'}
                        </h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center bg-gray-50">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-h-32 max-w-full object-contain"
                                />
                            ) : (
                                <label className="cursor-pointer text-center">
                                    <FaUpload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-600 mb-1">Click to upload</p>
                                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {selectedFile && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-600 mb-2">
                                    <strong>Selected:</strong> {selectedFile.name}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading}
                                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-50 transition ease-in-out duration-150"
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheck className="mr-2" />
                                                Upload Logo
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={uploading}
                                        className="px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:border-gray-400 focus:ring ring-gray-300 disabled:opacity-50 transition ease-in-out duration-150"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
