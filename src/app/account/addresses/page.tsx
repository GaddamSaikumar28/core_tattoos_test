"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Cookies from "js-cookie";
import { 
  getCustomerAddresses, 
  createCustomerAddress, 
  updateCustomerAddress, 
  deleteCustomerAddress, 
  setDefaultCustomerAddress,
  ShopifyAddress 
} from "@/src/lib/shopify";
import { MapPin, Plus, Edit2, Trash2, Star, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<ShopifyAddress[]>([]);
  const [defaultId, setDefaultId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // For Portal
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShopifyAddress | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", company: "", address1: "", address2: "",
    city: "", province: "", country: "", zip: "", phone: ""
  });

  const token = Cookies.get("shopify_customer_token");

  // Handle Portal Mounting and Scroll Lock
  useEffect(() => {
    setMounted(true);
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isModalOpen]);

  const loadAddresses = async () => {
    if (!token) return;
    try {
      const { addresses, defaultAddressId } = await getCustomerAddresses(token);
      setAddresses(addresses);
      setDefaultId(defaultAddressId);
    } catch (error) {
      toast.error("Failed to load addresses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadAddresses(); }, []);

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({ firstName: "", lastName: "", company: "", address1: "", address2: "", city: "", province: "", country: "", zip: "", phone: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (address: ShopifyAddress) => {
    setEditingAddress(address);
    setFormData({
      firstName: address.firstName || "", lastName: address.lastName || "", company: address.company || "",
      address1: address.address1 || "", address2: address.address2 || "", city: address.city || "",
      province: address.province || "", country: address.country || "", zip: address.zip || "", phone: address.phone || ""
    });
    setIsModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSaving(true);
    try {
      if (editingAddress) {
        await updateCustomerAddress(token, editingAddress.id, formData);
        toast.success("Address updated successfully!");
      } else {
        await createCustomerAddress(token, formData);
        toast.success("Address added successfully!");
      }
      setIsModalOpen(false);
      await loadAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteCustomerAddress(token, id);
      toast.success("Address deleted");
      await loadAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete address");
    }
  };

  const handleMakeDefault = async (id: string) => {
    if (!token) return;
    try {
      await setDefaultCustomerAddress(token, id);
      toast.success("Default address updated");
      await loadAddresses();
    } catch (error: any) {
      toast.error("Failed to set default address");
    }
  };

  if (isLoading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#FE8204]" />
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FE8204]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b border-white/5 pb-6 mt-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">Saved Addresses</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Manage your shipping and billing locations</p>
        </div>
        <button 
          onClick={openAddModal}
          className="group inline-flex items-center justify-center h-11 gap-2.5 px-6 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FE8204] hover:text-white hover:shadow-[0_0_20px_rgba(254,130,4,0.3)] hover:-translate-y-0.5 transition-all duration-300 shrink-0 shadow-lg"
        >
          <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" /> 
          Add New Address
        </button>
      </div>

      {/* Address Grid or Empty State */}
      {addresses.length === 0 ? (
        <div className="p-20 text-center bg-zinc-900/30 border border-white/5 backdrop-blur-md rounded-[2rem] flex flex-col items-center justify-center shadow-xl">
          <div className="w-16 h-16 bg-zinc-800/80 border border-white/10 text-zinc-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
            <MapPin className="w-8 h-8 text-zinc-400" />
          </div>
          <p className="text-zinc-300 font-black uppercase tracking-widest text-sm">No addresses found</p>
          <p className="text-xs text-zinc-500 font-medium mt-2">Add a new address to streamline your checkout process.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {addresses.map((address) => {
            const isDefault = address.id === defaultId;
            return (
              <div key={address.id} className={clsx(
                "p-8 border rounded-2xl flex flex-col h-full transition-all duration-300 backdrop-blur-md shadow-xl relative overflow-hidden group",
                isDefault 
                  ? "border-[#FE8204]/30 bg-zinc-900/60 shadow-[0_0_20px_rgba(254,130,4,0.05)]" 
                  : "border-white/5 bg-zinc-900/30 hover:border-white/15"
              )}>
                {/* Subtle highlight on default card */}
                {isDefault && <div className="absolute top-0 right-0 w-32 h-32 bg-[#FE8204]/10 rounded-full blur-2xl pointer-events-none" />}

                {/* Card Header */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <h3 className="font-black text-white text-lg leading-tight uppercase tracking-tight">{address.firstName} {address.lastName}</h3>
                    {address.company && <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1.5">{address.company}</p>}
                  </div>
                  {isDefault && (
                    <span className="px-3 py-1 bg-[#FE8204]/10 border border-[#FE8204]/20 text-[#FE8204] text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                      Default
                    </span>
                  )}
                </div>
                
                {/* Address Details */}
                <div className="text-sm text-zinc-400 space-y-1.5 mb-8 flex-1 font-medium relative z-10">
                  <p>{address.address1}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p>{address.city}, {address.province} {address.zip}</p>
                  <p className="text-zinc-600 uppercase text-[10px] font-black tracking-[0.2em] pt-2">{address.country}</p>
                  {address.phone && (
                    <div className="pt-4 flex items-center gap-2 text-[11px]">
                      <span className="font-black uppercase tracking-widest text-zinc-600">Phone:</span>
                      <span className="font-bold text-zinc-300">{address.phone}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex flex-wrap items-center gap-5 pt-6 border-t border-white/5 relative z-10 mt-auto">
                  <button onClick={() => openEditModal(address)} className="flex items-center gap-2 text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(address.id)} className="flex items-center gap-2 text-[10px] font-black text-zinc-400 hover:text-red-400 uppercase tracking-widest transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                  {!isDefault && (
                    <button onClick={() => handleMakeDefault(address.id)} className="ml-auto flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-[#FE8204] uppercase tracking-widest transition-colors">
                      <Star className="w-3.5 h-3.5" /> Make Default
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PORTAL MODAL */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
          
          {/* Blur Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setIsModalOpen(false)} 
          />
          
          {/* Modal Container */}
          <div className="relative bg-zinc-950 border border-white/10 rounded-[2.5rem] w-full max-w-2xl max-h-[calc(100vh-4rem)] flex flex-col shadow-2xl shadow-black animate-in zoom-in-95 duration-300 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5 shrink-0 bg-zinc-900/50">
              <div>
                <h2 className="text-xl font-black uppercase tracking-[0.1em] text-white">
                  {editingAddress ? "Edit Address" : "New Address"}
                </h2>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Specify destination coordinates</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-2xl text-zinc-400 hover:text-white transition-all hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar bg-zinc-950/50">
              <form id="address-form" onSubmit={handleSaveAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                {[
                  { name: "firstName", label: "First Name", type: "text", required: true },
                  { name: "lastName", label: "Last Name", type: "text", required: true },
                  { name: "company", label: "Company (Optional)", type: "text" },
                  { name: "phone", label: "Phone", type: "tel" },
                  { name: "address1", label: "Street Address", type: "text", required: true, fullWidth: true },
                  { name: "address2", label: "Apartment, suite, etc.", type: "text", fullWidth: true },
                  { name: "city", label: "City", type: "text", required: true },
                  { name: "country", label: "Country", type: "text", required: true },
                  { name: "province", label: "State / Province", type: "text", required: true },
                  { name: "zip", label: "ZIP / Postal Code", type: "text", required: true },
                ].map((field) => (
                  <div key={field.name} className={clsx("space-y-2 group", field.fullWidth && "sm:col-span-2")}>
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1 group-focus-within:text-[#FE8204] transition-colors">{field.label}</label>
                    <input 
                      type={field.type}
                      required={field.required}
                      placeholder={field.label}
                      value={(formData as any)[field.name]}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full h-14 px-6 bg-zinc-900/50 border border-white/5 rounded-2xl text-sm font-bold text-white outline-none focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] transition-all placeholder:text-zinc-600 shadow-inner"
                    />
                  </div>
                ))}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 md:p-8 border-t border-white/5 bg-zinc-900/80 shrink-0 flex flex-col sm:flex-row justify-end gap-4 rounded-b-[2.5rem]">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="order-2 sm:order-1 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                Go Back
              </button>
              <button 
                type="submit" 
                form="address-form" 
                disabled={isSaving} 
                className="order-1 sm:order-2 px-10 py-4 bg-[#FE8204] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#ff952b] hover:shadow-[0_0_20px_rgba(254,130,4,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Address"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}