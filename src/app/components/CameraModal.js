"use client";

import { useState } from 'react';

export default function CameraModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        rtspUrl: '',
        type: 'hls',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/cameras', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to add camera');
            }

            const newCamera = await res.json();
            onAdd(newCamera);
            onClose();
            setFormData({ name: '', location: '', rtspUrl: '', type: 'hls' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Add Camera</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Camera Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-[#0f172a] border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Main Entrance Feed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Location / Zone</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-[#0f172a] border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g. Zone A - North Wing"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Stream URL</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                className="w-full bg-[#0f172a] border border-slate-700/50 rounded-lg px-4 py-2.5 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                value={formData.rtspUrl}
                                onChange={(e) => setFormData({ ...formData, rtspUrl: e.target.value })}
                                placeholder="http://..."
                            />
                            <div className="absolute left-3 top-2.5 text-slate-500">
                                🔗
                            </div>
                        </div>
                        <p className="mt-1.5 text-xs text-slate-500">Supports HLS (.m3u8) or public streams.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Stream Type</label>
                        <select
                            className="w-full bg-[#0f172a] border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="hls">HLS (HTTP Live Streaming)</option>
                            <option value="mjpeg">MJPEG Stream</option>
                            <option value="rtsp">RTSP (Transcoded)</option>
                        </select>
                    </div>

                    <div className="flex gap-3 mt-8 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm font-medium transition-colors border border-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Connecting...
                                </>
                            ) : (
                                'Add Camera Source'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
