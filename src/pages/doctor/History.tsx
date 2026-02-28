import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowUpDown,
  MoreVertical,
  FileClock,
  Filter,
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
    limit: 10, // Reduced for better UI visibility
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#1a1a2e] min-h-screen animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3 leading-none">
            <FileClock className="text-[#7c5dfa]" /> Analysis History
          </h1>
          <p className="text-[#94a3b8] text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            Global diagnostic logs across all patients
          </p>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
            <input
              type="text"
              placeholder="Search patient name..."
              className="w-full pl-12 pr-4 py-3 bg-[#252541] border border-white/5 rounded-2xl text-white outline-none focus:border-[#7c5dfa] transition-all placeholder:text-[#94a3b8]/30 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c5dfa] w-3 h-3" />
            <select
              className="appearance-none bg-[#252541] border border-white/5 rounded-2xl pl-8 pr-10 py-3 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-[#7c5dfa] transition-all cursor-pointer"
              value={filters.result}
              onChange={(e) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setFilters({ ...filters, result: e.target.value as any })
              }
            >
              <option value="all">All Results</option>
              <option value="cad">CAD Detected</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#252541] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1a1a2e]/50 text-[#94a3b8] text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th
                  className="px-8 py-5 cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSort("date")}
                >
                  <div className="flex items-center gap-2">
                    Analysis Date{" "}
                    <ArrowUpDown size={12} className="text-[#7c5dfa]" />
                  </div>
                </th>
                <th className="px-8 py-5 uppercase tracking-[0.2em]">
                  Patient Details
                </th>
                <th className="px-8 py-5 uppercase tracking-[0.2em]">
                  Diagnosis
                </th>
                <th
                  className="px-8 py-5 cursor-pointer hover:text-white transition-colors uppercase tracking-[0.2em]"
                  onClick={() => toggleSort("confidence")}
                >
                  <div className="flex items-center gap-2">
                    AI Confidence{" "}
                    <ArrowUpDown size={12} className="text-[#7c5dfa]" />
                  </div>
                </th>
                <th className="px-8 py-5 uppercase tracking-[0.2em]">
                  Source File
                </th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin w-8 h-8 border-4 border-[#7c5dfa] border-t-transparent rounded-full" />
                      <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">
                        Retrieving Secure Records...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr
                    key={record.analysisId}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => navigate(`/doctor/result/${record.ecgId}`)}
                  >
                    <td className="px-8 py-6 text-sm font-bold text-[#94a3b8]">
                      {new Date(record.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-white group-hover:text-[#7c5dfa] transition-colors uppercase tracking-tight">
                        {record.patientName}
                      </div>
                      <div className="text-[10px] text-[#94a3b8]/60 font-black uppercase tracking-widest mt-1">
                        ID: {record.patientId.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border ${
                          record.result === "CAD Detected"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {record.result}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-white leading-none">
                        {record.confidence}
                      </div>
                      <div className="w-12 bg-white/5 h-1 rounded-full mt-2">
                        <div
                          className="bg-[#7c5dfa] h-full rounded-full shadow-[0_0_8px_rgba(124,93,250,0.5)]"
                          style={{ width: record.confidence }}
                        />
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-black text-[#94a3b8] uppercase tracking-tighter truncate max-w-[120px]">
                      {record.fileName}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Additional actions like delete or download report
                        }}
                        className="p-2.5 bg-[#1a1a2e] border border-white/5 rounded-xl text-[#94a3b8] hover:text-[#7c5dfa] transition-all hover:scale-110"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!loading && history.length === 0 && (
            <div className="p-24 text-center">
              <p className="text-[#94a3b8] font-black uppercase tracking-widest text-[10px]">
                No clinical records found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Container */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-black text-[#94a3b8] uppercase tracking-widest px-4">
        <p>
          Showing {history.length} of{" "}
          <span className="text-white">{pagination.total}</span> records
        </p>
        <div className="flex gap-4">
          <button
            disabled={pagination.offset === 0}
            onClick={() =>
              setPagination((p) => ({
                ...p,
                offset: Math.max(0, p.offset - p.limit),
              }))
            }
            className="px-8 py-3 bg-[#252541] border border-white/5 rounded-xl text-white font-black hover:bg-[#7c5dfa] transition-all disabled:opacity-10 disabled:grayscale"
          >
            Previous
          </button>
          <button
            disabled={pagination.offset + pagination.limit >= pagination.total}
            onClick={() =>
              setPagination((p) => ({ ...p, offset: p.offset + p.limit }))
            }
            className="px-8 py-3 bg-[#252541] border border-white/5 rounded-xl text-white font-black hover:bg-[#7c5dfa] transition-all disabled:opacity-10 disabled:grayscale"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
