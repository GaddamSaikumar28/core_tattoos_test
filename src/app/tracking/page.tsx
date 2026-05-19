

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { 
  PackageSearch, 
  Mail, 
  Hash, 
  Loader2, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  Box, 
  Calendar,
  ArrowRight,
  Package,
  AlertCircle
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { fetchParcelPanelTracking } from "@/src/app/actions/track";

// --- Framer Motion Variants ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

function TrackingDetailPage() {
  const searchParams = useSearchParams();

  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<any | null>(null);

  useEffect(() => {
    if (orderNumber && email && !trackingData && !isLoading) {
      handleTrack();
    }
  }, [searchParams]);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber || !email) return;

    setIsLoading(true);
    setError(null);
    setTrackingData(null);

    const response = await fetchParcelPanelTracking(orderNumber.trim(), email.trim());

    if (response.success && response.data?.tracking?.length > 0) {
      setTrackingData(response.data.tracking[0]);
    } else {
      setError(response.error || "We couldn't find tracking info for that order and email combination.");
    }
    
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FE8204] selection:text-white pt-32 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Immersive Ambient Glow for Transparent Header Integration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[#FE8204] opacity-[0.04] blur-[150px] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* --- Hero Section --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2 shadow-lg">
            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Package Locator
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
            Track Your Order
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg font-medium leading-relaxed">
            Enter your order number and email address to get real-time updates on your package.
          </p>
        </motion.div>

        {/* --- Search Form --- */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          onSubmit={handleTrack} 
          className="bg-zinc-900/80 backdrop-blur-xl p-3 sm:p-4 rounded-[2rem] border border-white/10 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 relative z-10 hover:border-white/20 hover:shadow-2xl hover:shadow-[#FE8204]/5 transition-all duration-300"
        >
          <div className="relative flex-1">
            <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text"
              placeholder="Order Number (e.g. 1001)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-950/50 rounded-xl border border-white/5 focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] outline-none text-white placeholder-zinc-600 font-medium transition-all"
              required
            />
          </div>
          <div className="hidden sm:block w-px bg-white/10 my-2"></div>
          <div className="relative flex-1 border-t sm:border-t-0 border-white/10">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-950/50 rounded-xl border border-white/5 focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] outline-none text-white placeholder-zinc-600 font-medium transition-all"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black uppercase tracking-widest text-sm font-bold rounded-xl hover:bg-[#FE8204] hover:text-white transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-[#FE8204]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-5 h-5 animate-spin" /> Fetching
                </motion.div>
              ) : (
                <motion.div
                  key="track"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  Track <ArrowRight className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.form>

        <AnimatePresence mode="wait">
          {/* --- Error State --- */}
          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="max-w-3xl mx-auto overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-red-950/30 text-red-400 font-medium border border-red-900/50 flex items-center justify-center gap-2 mt-4 shadow-inner">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            </motion.div>
          )}

          {/* --- Tracking Results Dashboard --- */}
          {trackingData && !isLoading && (
            <motion.div 
              key="results"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              
              {/* Top Status Banner */}
              <motion.div variants={fadeUp} className="bg-zinc-900 rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t-4 border-t-[#fe8204] relative overflow-hidden">
                
                {/* Subtle internal glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10">
                  <p className="text-xs font-black tracking-[0.2em] text-zinc-500 uppercase mb-2">Current Status</p>
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fe8204] opacity-60"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-[#fe8204]"></span>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                      {trackingData.status_num?.name || trackingData.status}
                    </h2>
                  </div>
                  {trackingData.status_num?.StatusDescription && (
                    <p className="text-zinc-400 mt-2 font-medium">
                      {trackingData.status_num.StatusDescription}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-6 md:text-right relative z-10">
                  {trackingData.order_created_at && (
                    <div>
                      <p className="text-xs font-black tracking-[0.2em] text-zinc-500 uppercase mb-2 flex items-center md:justify-end gap-1.5">
                        <Calendar className="w-4 h-4 text-[#fe8204]" /> Order Date
                      </p>
                      <p className="font-bold text-zinc-200">
                        {formatDate(trackingData.order_created_at)}
                      </p>
                    </div>
                  )}
                  {trackingData.shipping_map?.location && (
                    <div>
                      <p className="text-xs font-black tracking-[0.2em] text-zinc-500 uppercase mb-2 flex items-center md:justify-end gap-1.5">
                        <MapPin className="w-4 h-4 text-[#fe8204]" /> Destination
                      </p>
                      <p className="font-bold text-zinc-200 max-w-[200px] truncate" title={trackingData.shipping_map.location}>
                        {trackingData.shipping_map.location.split(',').slice(-3).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Timeline (Left 2 columns) */}
                <motion.div variants={fadeUp} className="lg:col-span-2 bg-zinc-900 rounded-[2rem] p-6 sm:p-8 border border-white/10 shadow-xl">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-zinc-800 border border-white/5 rounded-xl shrink-0">
                      <Truck className="w-6 h-6 text-[#fe8204]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Tracking History</h3>
                  </div>

                  <div className="pl-4">
                    <motion.div variants={staggerContainer} className="relative border-l-2 border-white/10 space-y-10 pb-4">
                      
                      {trackingData.trackinfo?.length > 0 ? (
                        trackingData.trackinfo.map((event: any, idx: number) => {
                          const isFirst = idx === 0;
                          return (
                            <motion.div variants={fadeUp} key={`track-${idx}`} className="relative pl-8">
                              <span className={`absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-zinc-900 ${isFirst ? 'bg-[#fe8204] text-white shadow-lg shadow-[#fe8204]/20' : 'bg-zinc-800 text-zinc-500 border border-white/10'}`}>
                                {isFirst ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2.5 h-2.5 bg-zinc-600 rounded-full" />}
                              </span>
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                <div>
                                  <h4 className={`text-base font-bold ${isFirst ? 'text-[#fe8204]' : 'text-zinc-300'}`}>
                                    {event.StatusDescription || event.name}
                                 </h4>
                                  {event.Details && <p className="text-sm text-zinc-400 mt-1 font-medium">{event.Details}</p>}
                                </div>
                                <time className="text-sm font-bold text-zinc-500 whitespace-nowrap">
                                  {event.Date}
                                </time>
                              </div>
                            </motion.div>
                          );
                        })
                      ) : (
                        Object.values(trackingData.status_node || {})
                          .filter((n: any) => n.name)
                          .map((node: any, idx: number) => {
                            const isFirst = idx === 0;
                            return (
                              <motion.div variants={fadeUp} key={`node-${idx}`} className="relative pl-8">
                                <span className={`absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-zinc-900 ${isFirst ? 'bg-[#fe8204] text-white shadow-lg shadow-[#fe8204]/20' : 'bg-zinc-800 text-zinc-500 border border-white/10'}`}>
                                  {isFirst ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2.5 h-2.5 bg-zinc-600 rounded-full" />}
                                </span>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                  <div>
                                    <h4 className={`text-base font-bold ${isFirst ? 'text-[#fe8204]' : 'text-zinc-300'}`}>
                                      {node.name}
                                    </h4>
                                  </div>
                                  {node.Date && (
                                    <time className="text-sm font-bold text-zinc-500 whitespace-nowrap">
                                      {node.Date}
                                    </time>
                                  )}
                                </div>
                              </motion.div>
                            )
                          })
                      )}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Order Items (Right 1 column) */}
                <motion.div variants={fadeUp} className="bg-zinc-900 rounded-[2rem] p-6 sm:p-8 border border-white/10 h-fit shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-zinc-800 border border-white/5 rounded-xl shrink-0">
                      <Package className="w-6 h-6 text-[#fe8204]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Order Items</h3>
                  </div>

                  <motion.div variants={staggerContainer} className="space-y-4">
                    {trackingData.products?.length > 0 ? (
                      trackingData.products.map((product: any, idx: number) => (
                        <motion.div variants={fadeUp} key={`prod-${idx}`} className="flex gap-4 p-3 -mx-3 rounded-2xl hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-white/5 group">
                          {product.image_url ? (
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-white/10 group-hover:border-[#fe8204]/40 transition-colors">
                              <img 
                                src={product.image_url} 
                                alt={product.title} 
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                              />
                              <div className="absolute -top-2 -right-2 bg-[#fe8204] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full z-10 shadow-sm">
                                {product.quantity}
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#fe8204]/40 transition-colors">
                              <Box className="w-6 h-6 text-zinc-600 group-hover:text-[#fe8204]/50 transition-colors" />
                            </div>
                          )}
                          <div className="flex flex-col justify-center">
                            <p className="text-sm font-bold text-zinc-200 line-clamp-2 leading-tight group-hover:text-[#fe8204] transition-colors">
                              {product.title}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1.5 font-bold uppercase tracking-wider">
                              Qty: {product.quantity}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                       <p className="text-sm text-zinc-500 italic bg-zinc-950/50 p-4 rounded-xl border border-white/5 text-center">
                         No item details available.
                       </p>
                    )}
                  </motion.div>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black text-white selection:bg-[#FE8204] selection:text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#fe8204]" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Loading Portal...</p>
        </div>
      </div>
    }>
      <TrackingDetailPage />
    </Suspense>
  );
}