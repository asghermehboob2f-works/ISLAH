'use client';

import React, { useState } from 'react';
import { Department } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  KeyRound, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Tag, 
  Briefcase,
  X,
  Lock
} from 'lucide-react';

export const ALL_CATEGORY_GROUPS = [
  {
    groupName: 'Civic Categories',
    categories: [
      'Roads',
      'Potholes',
      'Roads & Potholes',
      'Garbage',
      'Sanitation',
      'Waste & Sanitation',
      'Garbage & Sanitation',
      'Drainage',
      'Drainage & Sewage',
      'Streetlights',
      'Streetlights & Electrical',
      'Water',
      'Water Supply',
      'Public Infrastructure',
      'Public Safety & Hazards',
      'Other'
    ]
  },
  {
    groupName: 'Wildlife Protection',
    categories: [
      'Wildlife Protection',
      'Injured Wildlife',
      'Wildlife in Danger',
      'Poaching',
      'Illegal Capture',
      'Wildlife Trafficking',
      'Habitat Disturbance'
    ]
  },
  {
    groupName: 'Forest Protection',
    categories: [
      'Forest Protection',
      'Forest & Land Protection',
      'Illegal Tree Cutting',
      'Deforestation',
      'Forest Fire',
      'Illegal Logging',
      'Forest Encroachment',
      'Habitat Destruction'
    ]
  },
  {
    groupName: 'Water & Ecosystems',
    categories: [
      'Water & Ecosystem Protection',
      'Water & Ecosystems',
      'Water Pollution',
      'River/Lake Pollution',
      'Sewage Discharge',
      'Industrial Contamination',
      'Dead Fish/Aquatic Wildlife',
      'Wetland Destruction'
    ]
  },
  {
    groupName: 'Environmental Pollution',
    categories: [
      'Environmental Pollution',
      'Illegal Dumping',
      'Plastic Pollution',
      'Hazardous Waste',
      'Air Pollution',
      'Soil Contamination'
    ]
  },
  {
    groupName: 'Emergency Categories',
    categories: [
      'Emergency',
      'Civic Emergency / Emergency Hazard',
      'Environmental Emergency',
      'Environmental Emergencies'
    ]
  }
];

export function DepartmentManagementSection() {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useApp();

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedDeptForView, setSelectedDeptForView] = useState<Department | null>(null);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Civic' as 'Civic' | 'Environmental' | 'Wildlife' | 'Emergency' | 'Environmental / Wildlife',
    description: '',
    contactEmail: '',
    contactPhone: '',
    alternatePhone: '',
    officeLocation: '',
    leadOfficer: '',
    slaHoursDefault: 24,
    loginEmail: '',
    password: '',
    status: 'active' as 'active' | 'inactive',
    categoriesHandled: [] as string[]
  });

  const openCreateModal = () => {
    setFormData({
      name: '',
      code: '',
      type: 'Civic',
      description: '',
      contactEmail: '',
      contactPhone: '',
      alternatePhone: '',
      officeLocation: '',
      leadOfficer: 'Department Officer',
      slaHoursDefault: 24,
      loginEmail: '',
      password: '',
      status: 'active',
      categoriesHandled: ['Roads & Potholes']
    });
    setEditingDeptId(null);
    setModalMode('create');
  };

  const openEditModal = (dept: Department) => {
    setFormData({
      name: dept.name,
      code: dept.code,
      type: dept.type || 'Civic',
      description: dept.description || '',
      contactEmail: dept.contactEmail || dept.email || '',
      contactPhone: dept.contactPhone || dept.phone || '',
      alternatePhone: dept.alternatePhone || '',
      officeLocation: dept.officeLocation || '',
      leadOfficer: dept.leadOfficer || 'Department Lead',
      slaHoursDefault: dept.slaHoursDefault || 24,
      loginEmail: dept.loginEmail || dept.email || '',
      password: '', // Blank unless admin wants to reset
      status: (dept.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
      categoriesHandled: dept.categoriesHandled || []
    });
    setEditingDeptId(dept.id);
    setModalMode('edit');
  };

  const handleCategoryToggle = (categoryName: string) => {
    setFormData(prev => {
      const exists = prev.categoriesHandled.includes(categoryName);
      if (exists) {
        return { ...prev, categoriesHandled: prev.categoriesHandled.filter(c => c !== categoryName) };
      } else {
        return { ...prev, categoriesHandled: [...prev.categoriesHandled, categoryName] };
      }
    });
  };

  const handleToggleSelectAllGroup = (groupCategories: string[]) => {
    setFormData(prev => {
      const allSelected = groupCategories.every(c => prev.categoriesHandled.includes(c));
      if (allSelected) {
        return { ...prev, categoriesHandled: prev.categoriesHandled.filter(c => !groupCategories.includes(c)) };
      } else {
        const merged = Array.from(new Set([...prev.categoriesHandled, ...groupCategories]));
        return { ...prev, categoriesHandled: merged };
      }
    });
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Department Name and Department Code are required.');
      return;
    }

    if (modalMode === 'create') {
      await addDepartment({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        description: formData.description,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        alternatePhone: formData.alternatePhone,
        officeLocation: formData.officeLocation,
        leadOfficer: formData.leadOfficer,
        slaHoursDefault: formData.slaHoursDefault,
        loginEmail: formData.loginEmail,
        password: formData.password,
        status: formData.status,
        categoriesHandled: formData.categoriesHandled
      } as any);
    } else if (modalMode === 'edit' && editingDeptId) {
      await updateDepartment(editingDeptId, {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        description: formData.description,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        alternatePhone: formData.alternatePhone,
        officeLocation: formData.officeLocation,
        leadOfficer: formData.leadOfficer,
        slaHoursDefault: formData.slaHoursDefault,
        loginEmail: formData.loginEmail,
        password: formData.password,
        status: formData.status,
        categoriesHandled: formData.categoriesHandled
      } as any);
    }

    setModalMode(null);
  };

  const handleToggleStatus = async (dept: Department) => {
    const newStatus = dept.status === 'active' ? 'inactive' : 'active';
    await updateDepartment(dept.id, { status: newStatus } as any);
  };

  const handleDelete = async (dept: Department) => {
    if (confirm(`Are you sure you want to delete/archive department "${dept.name}"? If historical tickets exist, it will be safely deactivated.`)) {
      await deleteDepartment(dept.id);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-700" />
            <h1 className="text-xl font-bold text-slate-900">Department Management</h1>
            <span className="bg-purple-100 text-purple-800 font-mono text-xs font-bold px-2.5 py-0.5 rounded-md">
              {departments.length} Departments
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure municipal & environmental departments, assign category routing rules, and manage department access credentials.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-purple-700/20 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Department
        </button>
      </div>

      {/* Departments Overview Table (Spec #14) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-950 text-slate-200 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Department & Code</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Assigned Categories</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Official Email / Login</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No departments created yet. Click "Create Department" to set up your first authority.
                  </td>
                </tr>
              ) : (
                departments.map((dept) => {
                  const categories = dept.categoriesHandled || [];
                  const displayCategories = categories.slice(0, 3);
                  const extraCount = categories.length - 3;

                  return (
                    <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                      
                      {/* Department Name & Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 text-[10px] px-2 py-0.5 rounded">
                            {dept.code}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{dept.name}</div>
                            <div className="text-[10px] text-slate-500">Lead: {dept.leadOfficer || 'Department Head'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          dept.type === 'Environmental' || dept.type === 'Wildlife' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          dept.type === 'Emergency' ? 'bg-red-100 text-red-800 border border-red-300' :
                          'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}>
                          {dept.type || 'Civic'}
                        </span>
                      </td>

                      {/* Assigned Categories */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {displayCategories.map((c, i) => (
                            <span key={i} className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded truncate max-w-[140px]">
                              {c}
                            </span>
                          ))}
                          {extraCount > 0 && (
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              +{extraCount} more
                            </span>
                          )}
                          {categories.length === 0 && (
                            <span className="text-[10px] text-slate-400 italic">No categories assigned</span>
                          )}
                        </div>
                      </td>

                      {/* Contact Phone */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div>{dept.contactPhone || dept.phone || 'N/A'}</div>
                        {dept.alternatePhone && (
                          <div className="text-[10px] text-slate-400">Alt: {dept.alternatePhone}</div>
                        )}
                      </td>

                      {/* Official Email / Login */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-semibold truncate max-w-[160px]">
                          {dept.loginEmail || dept.contactEmail || dept.email}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Credentials Hashed & Active
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(dept)}
                          title="Click to toggle department access"
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                            dept.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {dept.status === 'active' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Disabled
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => setSelectedDeptForView(dept)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" /> View
                        </button>
                        <button
                          onClick={() => openEditModal(dept)}
                          className="bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-[11px] font-bold px-2.5 py-1 rounded transition-colors"
                          title="Edit Department"
                        >
                          <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dept)}
                          className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-[11px] font-bold px-2.5 py-1 rounded transition-colors"
                          title="Delete / Archive Department"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* "Other" Category Dynamic Routing Management */}
      <OtherProblemOptionManager departments={departments} />

      {/* CREATE / EDIT DEPARTMENT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto font-sans">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-purple-950 text-white px-6 py-4 flex items-center justify-between border-b border-purple-800 shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-300" />
                <h2 className="text-base font-bold text-white">
                  {modalMode === 'create' ? 'Create New Municipal Department' : `Edit Department: ${formData.name}`}
                </h2>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-purple-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-900">
              
              {/* Section 1: Department Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                  1. Basic Department Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Department Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Roads & Infrastructure Department"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Department Code *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. PWD-RD"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Department Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-800"
                    >
                      <option value="Civic">Civic Department</option>
                      <option value="Environmental">Environmental Department</option>
                      <option value="Wildlife">Wildlife Protection Department</option>
                      <option value="Emergency">Emergency Hazard Cell</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Short Description</label>
                    <input
                      type="text"
                      placeholder="Brief responsibility overview..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Default SLA (Hours)</label>
                    <input
                      type="number"
                      min={1}
                      max={168}
                      value={formData.slaHoursDefault}
                      onChange={(e) => setFormData({ ...formData, slaHoursDefault: parseInt(e.target.value) || 24 })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Lead / Chief Officer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Eng. Tariq Ahmad"
                      value={formData.leadOfficer}
                      onChange={(e) => setFormData({ ...formData, leadOfficer: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Office / Location Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Municipal HQ, Block B, Floor 3"
                      value={formData.officeLocation}
                      onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                  2. Official Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Official Email Address</label>
                    <input
                      type="email"
                      placeholder="roads@islah.gov.in"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Official Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+91 194 245 1001"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Alternate Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 194 245 1099"
                      value={formData.alternatePhone}
                      onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Department Login Credentials & Password Management */}
              <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-purple-700" />
                    3. Department Access & Credentials
                  </h3>
                  <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded font-mono">
                    SECURE PBKDF2 HASHING
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Department Login Email / Username</label>
                    <input
                      type="text"
                      placeholder="roads.dept@islah.gov.in"
                      value={formData.loginEmail}
                      onChange={(e) => setFormData({ ...formData, loginEmail: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {modalMode === 'create' ? 'Initial Account Password' : 'Reset Department Password (leave blank to keep current)'}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Account Access Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-xs font-bold text-slate-800"
                    >
                      <option value="active">Active (Login Enabled)</option>
                      <option value="inactive">Disabled (Login Blocked)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Category Assignment Multi-Select */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                  <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-purple-700" />
                    4. Category Assignments ({formData.categoriesHandled.length} Selected)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Reports submitted under these categories will be automatically routed to this department.
                  </p>
                </div>

                <div className="space-y-4 pt-1 max-h-72 overflow-y-auto pr-2">
                  {ALL_CATEGORY_GROUPS.map((grp) => {
                    const allInGroup = grp.categories.every(c => formData.categoriesHandled.includes(c));

                    return (
                      <div key={grp.groupName} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{grp.groupName}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleSelectAllGroup(grp.categories)}
                            className="text-[11px] font-bold text-purple-700 hover:underline"
                          >
                            {allInGroup ? 'Deselect All' : 'Select All Group'}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                          {grp.categories.map((catName) => {
                            const isChecked = formData.categoriesHandled.includes(catName);
                            return (
                              <label
                                key={catName}
                                className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition-colors ${
                                  isChecked 
                                    ? 'bg-purple-100/70 border-purple-400 text-purple-950 font-bold' 
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleCategoryToggle(catName)}
                                  className="rounded border-slate-300 text-purple-700 focus:ring-purple-500"
                                />
                                <span className="truncate">{catName}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-700/20 transition-all"
                >
                  {modalMode === 'create' ? 'Save New Department' : 'Update Department'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* VIEW DEPARTMENT DETAILS MODAL */}
      {selectedDeptForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto font-sans">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded">
                  {selectedDeptForView.code}
                </span>
                <h2 className="text-lg font-bold text-slate-900">{selectedDeptForView.name}</h2>
              </div>
              <button
                onClick={() => setSelectedDeptForView(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Department Type</span>
                <div className="font-bold text-slate-800">{selectedDeptForView.type || 'Civic'}</div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Lead / Officer in Charge</span>
                <div className="font-bold text-slate-800">{selectedDeptForView.leadOfficer}</div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Contact Phone</span>
                <div className="font-mono font-bold text-slate-800">{selectedDeptForView.contactPhone || selectedDeptForView.phone || 'N/A'}</div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Official Email</span>
                <div className="font-mono font-bold text-slate-800">{selectedDeptForView.contactEmail || selectedDeptForView.email}</div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Office Location</span>
                <div className="font-semibold text-slate-800">{selectedDeptForView.officeLocation || 'Main Municipal HQ'}</div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Default Handling SLA</span>
                <div className="font-mono font-bold text-slate-800">{selectedDeptForView.slaHoursDefault || 24} Hours</div>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned Routing Categories</span>
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-36 overflow-y-auto">
                {(selectedDeptForView.categoriesHandled || []).map((cat, idx) => (
                  <span key={idx} className="bg-purple-50 text-purple-900 border border-purple-200 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedDeptForView(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

function OtherProblemOptionManager({ departments }: { departments: Department[] }) {
  const [options, setOptions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newTitle, setNewTitle] = React.useState('');
  const [newDeptId, setNewDeptId] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const fetchOptions = async () => {
    try {
      const res = await fetch('/api/other-options');
      const data = await res.json();
      if (data.success) {
        setOptions(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOptions();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDeptId) {
      alert('Please provide a problem title and select an assigned department.');
      return;
    }
    setSaving(true);
    const dept = departments.find(d => d.id === newDeptId);
    try {
      const res = await fetch('/api/other-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          departmentId: newDeptId,
          departmentName: dept?.name || ''
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewTitle('');
        setNewDeptId('');
        fetchOptions();
      } else {
        alert(data.error?.message || 'Failed to add option.');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this problem option?')) return;
    try {
      const res = await fetch(`/api/other-options?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchOptions();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-600" />
            "Other" Category Dynamic Problem Routing
          </h2>
          <p className="text-xs text-slate-500">
            Define specific problem titles that fall under "Other" categories and explicitly assign them to responsible departments.
          </p>
        </div>
        <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-200 self-start sm:self-auto">
          {options.length} Configured Problem Types
        </span>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="sm:col-span-6">
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            New Problem Title / Description
          </label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Stray Animal / Cattle Hazard, Illegal Hoardings..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white text-slate-900 font-medium focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="sm:col-span-4">
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            Assigned Department
          </label>
          <select
            value={newDeptId}
            onChange={(e) => setNewDeptId(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white text-slate-900 font-medium focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="">-- Select Concerned Department --</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Option
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Problem Title</th>
              <th className="py-2.5 px-3">Assigned Department</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {loading ? (
              <tr>
                <td colSpan={3} className="py-4 text-center text-slate-400 italic">
                  Loading problem options...
                </td>
              </tr>
            ) : options.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 text-center text-slate-400 italic">
                  No "Other" problem options configured yet. Add your first option above.
                </td>
              </tr>
            ) : (
              options.map((opt) => (
                <tr key={opt.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{opt.title}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded border border-purple-200">
                      {opt.departmentName}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleDelete(opt.id)}
                      className="text-red-600 hover:text-red-800 font-bold p-1 rounded hover:bg-red-50"
                      title="Delete Option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
