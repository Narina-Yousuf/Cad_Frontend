import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, Search, Activity, FileText, Eye, MoreVertical, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
interface HistoryEntry {
  id: string;
  ecgId: string;
  fileName: string;
  analysisDate: string;
  result: "CAD Detected" | "Normal";
  confidence: string;
}
export default function PatientHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const api = (await import("../../services/api")).default;
        const { data } = await api.get("/api/history");
        const mapped = (data.data.history || []).map((item: any) => ({
          id: item.analysisId,
          ecgId: item.ecgId,
          fileName: item.fileName,
          analysisDate: item.date,
          result: item.result,
          confidence: item.confidence,
        }));
        setHistory(mapped);
      } catch {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);
  const handleViewResult = (ecgId: string) => { setOpenMenu(null); navigate(`/patient/result/${ecgId}`); };
  const handleViewReport = async (ecgId: string) => {
    setOpenMenu(null);
    try {
      const api = (await import("../../services/api")).default;
      const resultRes = await api.get(`/api/ecg/${ecgId}/result`);
      const analysisId = resultRes.data.data.result.id;
      try {
        const { generateReport } = await import("../../services/report.service");
        const report = await generateReport(analysisId);
        navigate(`/patient/report/${report.id}`);
      } catch {
        const reportRes = await api.get(`/api/reports/analysis/${analysisId}`);
        navigate(`/patient/report/${reportRes.data.data.report.id}`);
      }
    } catch { toast.error("Report load karne mein masla!"); }
  };
  const filtered = history.filter(item => item.fileName.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-sky-100 border-t-sky-500 rounded-full" /></div>;
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 min-h-screen font-sans" onClick={() => setOpenMenu(null)}>
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100"><Archive className="text-[#0ea5e9]" size={28} /></div>
          <div><h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Archive Logs</h1><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">All Diagnostic Records</p></div>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
          <Search size={14} className="text-slate-400" />
          <input type="text" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-[11px] font-black text-slate-600 outline-none w-40" />
        </div>
      </div>
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl" style={{overflow: "visible"}}>
        <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <div className="col-span-2">Date</div><div className="col-span-4">File</div><div className="col-span-2">Result</div><div className="col-span-3">Confidence</div><div className="col-span-1"></div>
        </div>
        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-4"><Activity size={40} className="text-slate-200" /><p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No Records Found</p></div>
        ) : filtered.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-slate-50 hover:bg-slate-50/50 transition-all items-center" style={{position: "relative"}}>
            <div className="col-span-2 text-sm font-black text-slate-600">{new Date(item.analysisDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</div>
            <div className="col-span-4"><p className="font-black text-slate-900 uppercase text-xs truncate">{item.fileName}</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">ID: {item.id.slice(0, 8).toUpperCase()}</p></div>
            <div className="col-span-2"><span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border ${item.result === "CAD Detected" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>{item.result}</span></div>
            <div className="col-span-3 flex items-center gap-2"><div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${item.result === "CAD Detected" ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: item.confidence }} /></div><span className="text-[10px] font-black text-slate-600">{item.confidence}</span></div>
            <div className="col-span-1 flex justify-end" style={{position: "relative"}}>
              <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === item.id ? null : item.id); }} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
                <MoreVertical size={18} />
              </button>
              {openMenu === item.id && (
                <div style={{position: "absolute", right: 0, top: "100%", zIndex: 9999, background: "white", border: "1px solid #f1f5f9", borderRadius: "1rem", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", width: "180px", overflow: "hidden"}} onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleViewResult(item.ecgId)} style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"14px 20px",fontSize:"10px",fontWeight:900,color:"#475569",textTransform:"uppercase",letterSpacing:"0.1em",background:"none",border:"none",cursor:"pointer"}} onMouseEnter={e=>(e.currentTarget.style.background="#f0f9ff")} onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                    <Eye size={14} /> View Result
                  </button>
                  <button onClick={() => handleViewReport(item.ecgId)} style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"14px 20px",fontSize:"10px",fontWeight:900,color:"#475569",textTransform:"uppercase",letterSpacing:"0.1em",background:"none",border:"none",borderTop:"1px solid #f8fafc",cursor:"pointer"}} onMouseEnter={e=>(e.currentTarget.style.background="#f0f9ff")} onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                    <FileText size={14} /> View Report
                  </button>
                  <button onClick={async () => {
                      setOpenMenu(null);
                      if (!confirm("Do you want to delete this record?")) return;
                      try {
                        const api = (await import("../../services/api")).default;
                        await api.delete(`/api/ecg/${item.ecgId}`);
                        setHistory(prev => prev.filter(h => h.id !== item.id));
                        toast.success("Record deleted!");
                      } catch {
                        toast.error("Could not delete!");
                      }
                    }} style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"14px 20px",fontSize:"10px",fontWeight:900,color:"#ef4444",textTransform:"uppercase",letterSpacing:"0.1em",background:"none",border:"none",borderTop:"1px solid #f8fafc",cursor:"pointer"}} onMouseEnter={e=>(e.currentTarget.style.background="#fff1f2")} onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
