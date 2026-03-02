import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowUpDown,
  MoreVertical,
  FileClock,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getHistory } from "../../services/history.service";
import type { HistoryRecord, HistoryFilters } from "../../types/history.types";
import toast from "react-hot-toast";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<HistoryFilters>({
    patientName: "",
    result: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchHistory();
    }, 300);
    return () => clearTimeout(handler);
  }, [
    searchTerm,
    filters.result,
    filters.sortBy,
    filters.sortOrder,
    pagination.offset,
  ]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory({
        ...filters,
        patientName: searchTerm,
        limit: pagination.limit,
        offset: pagination.offset,
      });
      setHistory(data.history);
      setPagination((prev) => ({ ...prev, total: data.total }));
    } catch (err) {
      toast.error("Failed to load records");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = (field: "date" | "confidence") => {
    setFilters((f) => ({
      ...f,
      sortBy: field,
      sortOrder: f.sortBy === field && f.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/30 min-h-screen animate-in fade-in duration-700 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-50 rounded-lg">
                <FileClock className="text-[#0ea5e9] w-6 h-6" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
               Archive <span className="text-[#0ea5e9]">Logs</span>
             </h1>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] ml-1">
            Global diagnostic synchronization across all patient endpoints
          </p>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0ea5e9] w-4 h-4 transition-colors" />
            <input
              type="text"
              placeholder="Filter by patient name..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-slate-700 outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300 font-bold text-xs uppercase tracking-wider shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-slate-200 rounded-[1.25rem] pl-6 pr-12 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none focus:border-[#0ea5e9] transition-all cursor-pointer shadow-sm"
              value={filters.result}
              onChange={(e) =>
                setFilters({ ...filters, result: e.target.value as any })
              }
            >
              <option value="all">Status: All</option>
              <option value="cad">CAD Detected</option>
              <option value="normal">Normal</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th
                  className="px-8 py-6 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => toggleSort("date")}
                >
                  <div className="flex items-center gap-2">
                    Analysis Date
                    <ArrowUpDown size={12} className="text-[#0ea5e9]" />
                  </div>
                </th>
                <th className="px-8 py-6">Patient Identification</th>
                <th className="px-8 py-6">Clinical Verdict</th>
                <th
                  className="px-8 py-6 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => toggleSort("confidence")}
                >
                  <div className="flex items-center gap-2">
                    AI Confidence
                    <ArrowUpDown size={12} className="text-[#0ea5e9]" />
                  </div>
                </th>
                <th className="px-8 py-6">Reference File</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin w-8 h-8 text-[#0ea5e9]" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Decrypting Secure Archives...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr
                    key={record.analysisId}
                    className="hover:bg-blue-50/30 transition-all group cursor-pointer"
                    onClick={() => navigate(`/doctor/result/${record.ecgId}`)}
                  >
                    <td className="px-8 py-8 text-xs font-bold text-slate-500 tabular-nums">
                      {new Date(record.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-8 py-8">
                      <div className="font-black text-slate-900 group-hover:text-[#0ea5e9] transition-colors uppercase tracking-tight text-sm">
                        {record.patientName}
                      </div>
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">
                        ID: {record.patientId.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm ${
                          record.result === "CAD Detected"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}
                      >
                        {record.result}
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-slate-900 leading-none tabular-nums">
                          {record.confidence}
                        </span>
                        <div className="flex-1 max-w-[80px] bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0ea5e9] h-full rounded-full shadow-[0_0_8px_rgba(14,165,233,0.4)]"
                            style={{ width: record.confidence }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100 group-hover:bg-white transition-colors">
                        {record.fileName.length > 15 ? `${record.fileName.slice(0, 15)}...` : record.fileName}
                      </span>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-3 bg-white border border-slate-100 rounded-[1rem] text-slate-300 hover:text-[#0ea5e9] hover:border-[#0ea5e9]/30 transition-all shadow-sm group-hover:bg-white"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!loading && history.length === 0 && (
            <div className="p-32 text-center bg-slate-50/20">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                 <FileClock className="text-slate-200 w-10 h-10" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                No clinical records match the current filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Container */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 px-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Displaying <span className="text-slate-900">{history.length}</span> of{" "}
          <span className="text-slate-900">{pagination.total}</span> global records
        </p>
        <div className="flex gap-3">
          <button
            disabled={pagination.offset === 0}
            onClick={() =>
              setPagination((p) => ({
                ...p,
                offset: Math.max(0, p.offset - p.limit),
              }))
            }
            className="flex items-center gap-2 px-6 py-3 bg-[#0ea5e9] border-slate-200 rounded-xl text-slate-600 font-black uppercase text-[10px] tracking-widest hover:border-[#7bcaee]  hover:text-white transition-all shadow-sm "
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <button
            disabled={pagination.offset + pagination.limit >= pagination.total}
            onClick={() =>
              setPagination((p) => ({ ...p, offset: p.offset + p.limit }))
            }
            className="flex items-center gap-2 px-6 py-3 bg-[#0ea5e9] border-slate-200 rounded-xl text-slate-600 font-black uppercase text-[10px] tracking-widest hover:border-[#71c5ec] hover:text-white transition-all shadow-sm"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}