import { useState, useMemo } from 'react';
import { Tool, CalibrationStatus } from '@/types';
import { MOCK_TOOLS } from '@/lib/mockData';
import { getCalibrationStatus } from '@/lib/deadlineUtils';

const STORAGE_KEY = 'mcms_tools';

function loadTools(): Tool[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Tool[];
  } catch {}
  return MOCK_TOOLS;
}

function saveTools(tools: Tool[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
}

export function useTools() {
  const [tools, setTools] = useState<Tool[]>(() => loadTools());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CalibrationStatus | 'ALL'>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filteredTools = useMemo(() => {
    let result = tools;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.toolName.toLowerCase().includes(q) ||
          t.serialNumber.toLowerCase().includes(q) ||
          t.responsiblePerson.toLowerCase().includes(q) ||
          t.department.toLowerCase().includes(q) ||
          t.storageLocation.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'ALL') {
      result = result.filter((t) => getCalibrationStatus(t.expiryDate) === statusFilter);
    }
    if (departmentFilter !== 'ALL') {
      result = result.filter((t) => t.department === departmentFilter);
    }
    return result;
  }, [tools, searchQuery, statusFilter, departmentFilter]);

  const paginatedTools = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTools.slice(start, start + pageSize);
  }, [filteredTools, page, pageSize]);

  const totalPages = Math.ceil(filteredTools.length / pageSize);

  const getToolById = (id: string) => tools.find((t) => t.id === id);

  const updateTool = (id: string, updates: Partial<Tool>) => {
    const updated = tools.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    setTools(updated);
    saveTools(updated);
  };

  const addTools = (newTools: Tool[]) => {
    const merged = [...newTools, ...tools.filter((t) => !newTools.some((n) => n.id === t.id))];
    setTools(merged);
    saveTools(merged);
  };

  const resetToDemo = () => {
    setTools(MOCK_TOOLS);
    saveTools(MOCK_TOOLS);
  };

  return {
    tools,
    filteredTools,
    paginatedTools,
    totalPages,
    page,
    setPage,
    pageSize,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    getToolById,
    updateTool,
    addTools,
    resetToDemo,
  };
}
