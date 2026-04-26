'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User, Shield, Bell, Globe, HelpCircle, LogOut,
    ChevronRight, Lock, Smartphone, Mail, CheckCircle2, X, Save
} from 'lucide-react';
import { api } from '@/lib/api';

type UserProfile = {
    _id: string;
    firstname?: string;
    lastname?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    isEmailVerified?: boolean;
};

const SettingsPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [form, setForm] = useState({ firstname: '', lastname: '' });
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        api.get('/api/me').then(res => {
            setUser(res.data);
            setForm({
                firstname: res.data.firstname || res.data.firstName || '',
                lastname: res.data.lastname || res.data.lastName || '',
            });
        }).catch(() => {
            router.push('/login');
        });
    }, [router]);

    function handleLogout() {
        localStorage.removeItem('token');
        router.push('/');
    }

    async function saveProfile(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setSaveMsg('');
        try {
            const res = await api.patch('/api/me', form);
            setUser(res.data);
            setSaveMsg('Profile updated!');
            setTimeout(() => { setSaveMsg(''); setEditOpen(false); }, 1500);
        } catch {
            setSaveMsg('Update failed. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    const firstName = user?.firstname || user?.firstName || '';
    const lastName = user?.lastname || user?.lastName || '';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';

    const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
        <div onClick={onToggle} className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ${active ? 'bg-blue-500' : 'bg-slate-700'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
    );

    const Row = ({ icon: Icon, title, subtitle, action, color = 'text-slate-400', onClick }: any) => (
        <div onClick={onClick} className="flex items-center justify-between p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl bg-slate-800 group-hover:bg-slate-700 transition-colors ${color}`}><Icon size={20} /></div>
                <div><h4 className="text-white text-sm font-medium">{title}</h4>{subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}</div>
            </div>
            {action !== undefined ? action : <ChevronRight size={18} className="text-slate-600" />}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0F172A] font-sans text-white pb-24">
            <div className="max-w-lg mx-auto px-4 pt-8">
                <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>

                {/* Profile Card */}
                {user && (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-5 mb-6 flex items-center gap-4 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-white/30 flex items-center justify-center text-blue-600 font-bold text-xl">{initials}</div>
                            <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-blue-700 w-4 h-4 rounded-full" />
                        </div>
                        <div className="relative z-10 min-w-0">
                            <h2 className="text-white font-bold text-lg truncate">{firstName} {lastName}</h2>
                            <p className="text-blue-100 text-xs mb-1 truncate">{user.email}</p>
                            <div className="flex items-center gap-1 bg-black/20 w-fit px-2 py-0.5 rounded-full backdrop-blur-sm">
                                <CheckCircle2 size={10} className="text-green-400" />
                                <span className="text-[10px] text-white font-medium">{user.isEmailVerified ? 'Verified Account' : 'Unverified'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit profile modal */}
                {editOpen && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                        <div className="bg-[#1a2540] border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-white font-bold text-lg">Edit Profile</h3>
                                <button onClick={() => setEditOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={saveProfile} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">First Name</label>
                                    <input value={form.firstname} onChange={e => setForm(f => ({ ...f, firstname: e.target.value }))}
                                        className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Last Name</label>
                                    <input value={form.lastname} onChange={e => setForm(f => ({ ...f, lastname: e.target.value }))}
                                        className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-all" />
                                </div>
                                {saveMsg && <p className={`text-sm ${saveMsg.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>{saveMsg}</p>}
                                <button type="submit" disabled={saving}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm transition-all">
                                    {saving ? <>Saving…</> : <><Save size={15} /> Save Changes</>}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {/* General */}
                    <div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 ml-2">General</h3>
                        <div className="bg-[#151F32] rounded-2xl overflow-hidden border border-slate-800/60">
                            <Row icon={User} title="Personal Information" subtitle="Edit your name and profile" color="text-blue-400" onClick={() => setEditOpen(true)} />
                            <Row icon={Globe} title="Language" action={<span className="text-xs text-slate-400 font-medium">English (US)</span>} color="text-purple-400" />
                        </div>
                    </div>

                    {/* Security */}
                    <div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 ml-2">Security</h3>
                        <div className="bg-[#151F32] rounded-2xl overflow-hidden border border-slate-800/60">
                            <Row icon={Lock} title="Change Password" color="text-orange-400" />
                            <Row icon={Smartphone} title="Two-Factor Auth" subtitle="Managed via OTP email" color="text-green-400" action={<CheckCircle2 size={16} className="text-green-400" />} />
                            <Row icon={Shield} title="Login Activity" subtitle="View recent sessions" color="text-teal-400" />
                        </div>
                    </div>

                    {/* Preferences */}
                    <div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 ml-2">App Settings</h3>
                        <div className="bg-[#151F32] rounded-2xl overflow-hidden border border-slate-800/60">
                            <Row icon={Bell} title="Push Notifications" color="text-yellow-400"
                                action={<Toggle active={notifications} onToggle={() => setNotifications(!notifications)} />} />
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 ml-2">Support</h3>
                        <div className="bg-[#151F32] rounded-2xl overflow-hidden border border-slate-800/60">
                            <Row icon={HelpCircle} title="Help Center" color="text-pink-400" />
                            <Row icon={Mail} title="Contact Support" color="text-cyan-400" />
                        </div>
                    </div>

                    {/* Logout */}
                    <button onClick={handleLogout}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 py-4 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 border border-red-500/20">
                        <LogOut size={18} /> Sign Out
                    </button>
                    <p className="text-center text-slate-600 text-[10px] pb-4">Version 2.4.0 (Build 20260307)</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;