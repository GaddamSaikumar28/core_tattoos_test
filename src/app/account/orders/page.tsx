"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { getCustomerOrders } from "@/src/lib/shopify";
import { Loader2, Receipt, Printer, PackageSearch, RotateCcw } from "lucide-react";

// ---------------------------------------------------------------------------
// PROFESSIONAL INVOICE COMPONENT (Optimized for Paper Printing)
// ---------------------------------------------------------------------------
const PrintInvoice = ({ order }: { order: any }) => {
  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(parseFloat(amount || "0"));
  };

  return (
    <div
      className="bg-white text-black p-8 md:p-12 w-full max-w-5xl mx-auto font-sans"
      style={{ pageBreakAfter: "always" }}
    >
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
        <div>
          <img 
            src="/assets/icons/Fotterlogo2.svg" 
            alt="JUST TATTOOS" 
            className="h-10 w-auto mb-4 object-contain print:grayscale" 
          />
          <p className="text-xs text-gray-600 font-medium">123 Inkwell Avenue, Suite 100</p>
          <p className="text-xs text-gray-600 font-medium">Art District, NY 10001</p>
          <p className="text-xs text-gray-500 mt-1 font-semibold">support@justtattoos.com | www.justtattoos.com</p>
        </div>

        <div className="text-right flex flex-col items-end">
          <h2 className="text-3xl font-black text-black uppercase tracking-widest mb-4">
            Invoice
          </h2>
          <table className="text-xs text-right">
            <tbody>
              <tr>
                <td className="pr-4 text-gray-400 font-medium py-1">Order Number:</td>
                <td className="font-bold text-black py-1">#{order.orderNumber}</td>
              </tr>
              <tr>
                <td className="pr-4 text-gray-400 font-medium py-1">Date:</td>
                <td className="font-bold text-black py-1">
                  {new Date(order.processedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
              </tr>
              <tr>
                <td className="pr-4 text-gray-400 font-medium py-1">Status:</td>
                <td className="font-bold py-1">
                  {order.canceledAt ? (
                    <span className="text-black border border-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                      Canceled / Returned
                    </span>
                  ) : (
                    <span className="text-black uppercase tracking-wider text-[10px] font-black">
                      {order.financialStatus}
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER DETAILS SECTION */}
      <div className="mb-12 flex justify-between">
        <div className="w-1/2">
          <h3 className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-3 border-b border-gray-100 pb-2">
            Billed / Shipped To
          </h3>
          {order.shippingAddress ? (
            <div className="text-xs text-gray-800 leading-relaxed font-medium">
              <p className="font-black text-black text-sm mb-1">
                {order.shippingAddress.name}
              </p>
              <p>{order.shippingAddress.address1} {order.shippingAddress.address2}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                {order.shippingAddress.zip}
              </p>
              <p className="text-gray-400 mt-0.5">{order.shippingAddress.country}</p>
              <p className="text-gray-900 mt-2 font-bold">{order.email}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No shipping address provided.</p>
          )}
        </div>
      </div>

      {/* ORDER ITEMS TABLE */}
      <div className="mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black text-[10px] font-black uppercase tracking-wider text-gray-400">
              <th className="py-2 px-2 w-16">Item</th>
              <th className="py-2 px-2">Description</th>
              <th className="py-2 px-2 text-center w-20">Qty</th>
              <th className="py-2 px-2 text-right w-28">Price</th>
              <th className="py-2 px-2 text-right w-32">Total</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium">
            {order.lineItems.edges.map(({ node: item }: any, idx: number) => {
              const itemPrice = parseFloat(item.variant?.price?.amount || "0");
              const itemTotal = itemPrice * item.quantity;
              const currency =
                item.variant?.price?.currencyCode ||
                order.totalPrice.currencyCode ||
                "USD";

              return (
                <tr key={idx} className="border-b border-gray-100 break-inside-avoid">
                  <td className="py-4 px-2 align-top">
                    {item.variant?.image ? (
                      <img
                        src={item.variant.image.url}
                        alt="Product"
                        className="w-10 h-10 object-cover rounded border border-gray-200 print:border-gray-300"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-50 rounded border border-gray-100 print:border-gray-200"></div>
                    )}
                  </td>
                  <td className="py-4 px-2 align-top">
                    <span className="font-bold text-black block mb-0.5">
                      {item.title}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center align-top text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="py-4 px-2 text-right align-top text-gray-600">
                    {formatCurrency(itemPrice.toString(), currency)}
                  </td>
                  <td className="py-4 px-2 text-right align-top font-bold text-black">
                    {formatCurrency(itemTotal.toString(), currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* TOTALS SECTION */}
      <div className="flex justify-end break-inside-avoid">
        <div className="w-full sm:w-1/2 md:w-1/3 space-y-2.5 text-xs font-medium">
          <div className="flex justify-between text-gray-500 px-2">
            <span>Subtotal</span>
            <span className="text-black font-semibold">
              {formatCurrency(
                order.subtotalPrice?.amount,
                order.subtotalPrice?.currencyCode
              )}
            </span>
          </div>
          <div className="flex justify-between text-gray-500 px-2">
            <span>Shipping</span>
            <span className="text-black font-semibold">
              {formatCurrency(
                order.totalShippingPrice?.amount,
                order.totalShippingPrice?.currencyCode
              )}
            </span>
          </div>
          <div className="flex justify-between text-gray-500 border-b border-gray-100 pb-3 px-2">
            <span>Tax</span>
            <span className="text-black font-semibold">
              {formatCurrency(
                order.totalTax?.amount,
                order.totalTax?.currencyCode
              )}
            </span>
          </div>
          <div className="flex justify-between font-black text-lg pt-1 px-2 text-black">
            <span>Total</span>
            <span>
              {formatCurrency(
                order.totalPrice?.amount,
                order.totalPrice?.currencyCode
              )}
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-20 pt-6 border-t border-gray-100 text-center text-[11px] text-gray-400 break-inside-avoid font-medium">
        <p className="font-bold text-black mb-1 text-xs uppercase tracking-wider">Thank you for your business!</p>
        <p>If you have any questions regarding this invoice, please contact our support team at support@justtattoos.com.</p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// MAIN PAGE COMPONENT
// ---------------------------------------------------------------------------
export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [printMode, setPrintMode] = useState<"single" | "all" | null>(null);
  const [printingOrder, setPrintingOrder] = useState<any | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      const token = Cookies.get("shopify_customer_token");
      if (token) {
        try {
          const fetchedOrders = await getCustomerOrders(token);
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Failed to fetch orders", error);
        }
      }
      setIsLoading(false);
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => {
      setPrintMode(null);
      setPrintingOrder(null);
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  const handlePrintSingle = (order: any) => {
    setPrintingOrder(order);
    setPrintMode("single");
    setTimeout(() => window.print(), 250);
  };

  const handlePrintAll = () => {
    setPrintMode("all");
    setTimeout(() => window.print(), 250);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-[#FE8204]" />
      </div>
    );
  }

  return (
    <>
      {/* PRINT STRUCTURAL CSS CONFIGURATION */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-root, #print-root * {
            visibility: visible;
          }
          #print-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
        }
      `}} />

      {/* WEB DASHBOARD WORKSPACE */}
      <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 ${printMode ? "hidden" : "block"}`}>
        
        {/* Dynamic Inner Glow Flare */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FE8204]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Section Header Frame */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Order History</h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Manage and view tracking reports</p>
          </div>
          {orders.length > 0 && (
            <button
              onClick={handlePrintAll}
              className="inline-flex items-center justify-center h-11 gap-2.5 px-5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FE8204] hover:text-white hover:shadow-[0_0_20px_rgba(254,130,4,0.3)] hover:-translate-y-0.5 transition-all duration-300 shrink-0 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              Print All Invoices
            </button>
          )}
        </div>

        {/* Dynamic Workspace Container */}
        {orders.length === 0 ? (
          <div className="p-16 text-center bg-zinc-900/30 border border-white/5 backdrop-blur-md rounded-[2rem] flex flex-col items-center justify-center shadow-xl">
            <div className="w-14 h-14 bg-zinc-800/80 border border-white/10 text-zinc-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <Receipt className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">No Orders Found</h3>
            <p className="text-sm text-zinc-400 max-w-sm font-medium">
              You haven't initialized or processed any item orders on this profile context yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isRefunded = order.financialStatus.toUpperCase().includes("REFUNDED");
              const isCanceled = !!order.canceledAt;

              return (
                <div
                  key={order.id}
                  className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-white/15 transition-all duration-300"
                >
                  {/* Order Meta Header Card */}
                  <div className="p-5 bg-zinc-900/80 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FE8204]">
                        Identification #{order.orderNumber}
                      </p>
                      <p className="text-sm font-black text-white uppercase tracking-tight">
                        {new Date(order.processedAt).toLocaleDateString("en-US", {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="text-left sm:text-right space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          Total Volume
                        </p>
                        <p className="text-sm font-black text-white">
                          <span className="text-xs text-zinc-400 font-bold mr-0.5">{order.totalPrice.currencyCode}</span>{" "}
                          {parseFloat(order.totalPrice.amount).toFixed(2)}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handlePrintSingle(order)}
                        className="w-10 h-10 bg-zinc-950 border border-white/10 text-zinc-400 rounded-xl flex items-center justify-center hover:text-white hover:border-[#FE8204] hover:bg-[#FE8204]/5 transition-all duration-300 shadow-md group"
                        title="Print Invoice"
                      >
                        <Printer className="w-4 h-4 group-hover:scale-105 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Body Activity Context Workspace */}
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5 mb-5">
                      {/* Luminous Core Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-white/5">
                          {order.fulfillmentStatus || "UNFULFILLED"}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            isRefunded
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {order.financialStatus}
                        </span>

                        {isCanceled && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            CANCELED / RETURNED
                          </span>
                        )}
                      </div>

                      {/* Action Interface Elements */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        {!isCanceled && !isRefunded && (
                          <Link
                            href="/returns"
                            className="inline-flex items-center justify-center h-9 gap-2 px-3.5 bg-zinc-950 border border-white/10 text-zinc-300 text-xs font-bold rounded-lg hover:text-white hover:bg-zinc-900 hover:border-white/20 transition-all duration-300"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                            Return Items
                          </Link>
                        )}
                        <Link
                          href={order.statusUrl}
                          target="_blank"
                          className="inline-flex items-center justify-center h-9 gap-2 px-4 bg-zinc-800 border border-white/5 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-zinc-700 hover:shadow-lg transition-all duration-300 group"
                        >
                          <PackageSearch className="w-3.5 h-3.5 text-[#FE8204]" />
                          Full Status
                        </Link>
                      </div>
                    </div>

                    {/* Order Line Item Interlocks */}
                    <div className="divide-y divide-white/5">
                      {order.lineItems.edges.map(
                        ({ node: item }: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 group"
                          >
                            <div className="w-14 h-14 bg-zinc-950 border border-white/10 rounded-xl overflow-hidden relative shrink-0 shadow-md">
                              {item.variant?.image && (
                                <img
                                  src={item.variant.image.url}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-white truncate uppercase tracking-tight group-hover:text-[#FE8204] transition-colors">
                                {item.title}
                              </p>
                              <p className="text-xs font-bold text-zinc-500 mt-0.5 uppercase tracking-wider">
                                Quantity Context: <span className="text-zinc-300 font-black">{item.quantity}</span>
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ACTIVE PRINT INVOICE BACKDROP HOOK CONTAINER */}
      {printMode && (
        <div id="print-root" className="bg-white w-full z-50">
          {printMode === "single" && printingOrder && (
            <PrintInvoice order={printingOrder} />
          )}

          {printMode === "all" &&
            orders.map((order) => <PrintInvoice key={order.id} order={order} />)}
        </div>
      )}
    </>
  );
}