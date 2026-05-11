import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Save, Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const api = (await import("../../services/api")).default;
        const { data } = await api.get("/api/dashboard/patient");
        const p = data.data.patient;
        setForm({
          name: p.name || "",
          email: p.email || "",
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "",
          gender: p.gender || "",
          bloodGroup: p.bloodGroup || "",
          
        });
      } catch {
        toast.error("Could not fetch profile information!");
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const api = (await import("../../services/api")).default;
      await api.put("/api/patient/profile", form);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Could not update profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 min-h-screen font-sans">
      {/* Header */}
      <button
        onClick={() => navigate("/patient/dashboard")}
        className="group flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-900 transition-all"
      >
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-sky-50 transition-colors">
          <ArrowLeft size={18} />
        </div>
        Back to Dashboard
      </button>

      {/* Profile Card */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-900/5">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-50">
          <div className="w-20 h-20 bg-sky-50 rounded-[2rem] flex items-center justify-center border border-sky-100">
            <User className="text-[#0ea5e9] w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Medical Profile</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Update Your Health Information</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
            { label: "Email", key: "email", type: "email", placeholder: "Your email" },
            { label: "Date of Birth", key: "dateOfBirth", type: "date", placeholder: "" },
           
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 outline-none focus:border-sky-300 focus:bg-white transition-all"
              />
            </div>
          ))}

          {/* Gender */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Gender</label>
            <select
              value={form.gender}
              onChange={e => setForm({ ...form, gender: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 outline-none focus:border-sky-300 focus:bg-white transition-all"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Blood Group</label>
            <select
              value={form.bloodGroup}
              onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 outline-none focus:border-sky-300 focus:bg-white transition-all"
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-10 bg-[#0ea5e9] hover:bg-[#7cc9ed] text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3"
        >
          <Save size={18} /> {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}