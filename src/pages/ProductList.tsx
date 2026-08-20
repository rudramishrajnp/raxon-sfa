import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Search, 
  Filter, 
  Tag, 
  IndianRupee, 
  Sparkles, 
  Calculator, 
  Share2, 
  Layers, 
  CheckCircle2, 
  HelpCircle,
  Package,
  Percent,
  TrendingUp,
  FileText,
  Building2,
  Edit3,
  Check
} from 'lucide-react';
import { getProductsCatalog, saveProductsCatalog, ProductMasterItem } from '../data/masterData';
import { getActiveCompany } from '../data/companyContext';
import { supabase } from '../supabaseClient';

export default function ProductList() {
  const [products, setProducts] = useState<ProductMasterItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [company, setCompany] = useState(() => getActiveCompany());

  // Editable Avg Chemist Margin
  const [avgChemistMargin, setAvgChemistMargin] = useState<string>(() => {
    return localStorage.getItem(`raxon_avg_chemist_margin_${company.id}`) || '26.5% + Scheme';
  });
  const [isEditingMargin, setIsEditingMargin] = useState(false);
  const [tempMargin, setTempMargin] = useState(avgChemistMargin);

  // Scheme Calculator State
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcProduct, setCalcProduct] = useState<ProductMasterItem | null>(null);
  const [calcQuantity, setCalcQuantity] = useState<number>(20);

  useEffect(() => {
    const refreshData = () => {
      const activeCmp = getActiveCompany();
      setCompany(activeCmp);
      setProducts(getProductsCatalog());
      setAvgChemistMargin(localStorage.getItem(`raxon_avg_chemist_margin_${activeCmp.id}`) || '26.5% + Scheme');
    };
    refreshData();
    window.addEventListener('raxon-company-changed', refreshData);
    window.addEventListener('raxon-company-switched', refreshData);
    window.addEventListener('raxon-products-updated', refreshData);
    return () => {
      window.removeEventListener('raxon-company-changed', refreshData);
      window.removeEventListener('raxon-company-switched', refreshData);
      window.removeEventListener('raxon-products-updated', refreshData);
    };
  }, []);

  useEffect(() => {
    try {
      supabase.from('system_meta').select('*').eq('id', `catalog_settings_${company.id}`).maybeSingle().then(({ data, error }) => {
        if (!error && data && data.data?.avgChemistMargin) {
          const remoteMargin = data.data.avgChemistMargin;
          setAvgChemistMargin(remoteMargin);
          localStorage.setItem(`raxon_avg_chemist_margin_${company.id}`, remoteMargin);
        }
      });
    } catch (e) {
      console.warn('Margin cloud listener notice:', e);
    }
  }, [company.id]);

  const handleSaveMargin = () => {
    if (!tempMargin.trim()) return;
    setAvgChemistMargin(tempMargin.trim());
    setIsEditingMargin(false);
    localStorage.setItem(`raxon_avg_chemist_margin_${company.id}`, tempMargin.trim());
    supabase.from('system_meta').upsert({
      id: `catalog_settings_${company.id}`,
      data: { avgChemistMargin: tempMargin.trim(), updatedAt: new Date().toISOString() },
      updated_at: new Date().toISOString()
    }).then(null, () => {});
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const divisions = ['All', ...Array.from(new Set(products.map(p => p.division)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.composition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.indications.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesDivision = selectedDivision === 'All' || product.division === selectedDivision;
    return matchesSearch && matchesCategory && matchesDivision;
  });

  // Calculate Retailer & Stockist Margin
  const calculateMargins = (item: ProductMasterItem) => {
    const retailerMarginRs = item.mrp - item.ptr;
    const retailerMarginPercent = ((retailerMarginRs / item.mrp) * 100).toFixed(1);
    const stockistMarginRs = item.ptr - item.pts;
    const stockistMarginPercent = ((stockistMarginRs / item.ptr) * 100).toFixed(1);
    return { retailerMarginRs, retailerMarginPercent, stockistMarginRs, stockistMarginPercent };
  };

  // WhatsApp Share Price List
  const handleShareOnWhatsApp = (item?: ProductMasterItem) => {
    let text = '';
    if (item) {
      const { retailerMarginPercent } = calculateMargins(item);
      text = `💊 *${company.name.toUpperCase()} - PRODUCT DETAILS & SCHEME*\n\n` +
        `🏢 *Division:* ${item.division}\n` +
        `🏷️ *Brand:* ${item.name}\n` +
        `🔬 *Composition:* ${item.composition}\n` +
        `📦 *Pack:* ${item.pack} (${item.category})\n` +
        `💰 *MRP:* ₹${item.mrp.toFixed(2)}\n` +
        `🏷️ *PTR:* ₹${item.ptr.toFixed(2)}\n` +
        `🏢 *PTS:* ₹${item.pts.toFixed(2)}\n` +
        `🎁 *OFFICIAL SCHEME:* ${item.scheme}\n` +
        `📈 *Retailer Margin:* ~${retailerMarginPercent}%\n` +
        `🏥 *Key Indications:* ${item.indications}\n\n` +
        `_For orders contact ${company.name} Authorized Representative_`;
    } else {
      text = `💊 *${company.name.toUpperCase()} - OFFICIAL BRAND & PRICE LIST*\n\n` +
        filteredProducts.map((p, idx) => 
          `${idx + 1}. *${p.name}* [${p.division}]\n` +
          `   Pack: ${p.pack} | MRP: ₹${p.mrp.toFixed(0)} | PTR: ₹${p.ptr.toFixed(0)} | Scheme: *${p.scheme}*`
        ).join('\n\n') +
        `\n\n_Official Price List • ${company.name}_`;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar with explicit Company and Division context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Pill className="h-7 w-7 text-indigo-600" />
              Product & Scheme Catalog
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-800 border border-indigo-200">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              {company.name}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1 font-medium">
            Company: <strong className="text-gray-900">{company.name}</strong> • Division: <strong className="text-indigo-700">{divisions.filter(d => d !== 'All').join(', ') || 'General Division'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleShareOnWhatsApp()}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            Share Price List on WhatsApp
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-3xs text-gray-500 font-bold uppercase tracking-wider">Total Brands</span>
          <p className="text-xl font-extrabold text-indigo-900 mt-0.5">{products.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-3xs text-gray-500 font-bold uppercase tracking-wider">Active Schemes</span>
          <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{products.filter(p => p.scheme).length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-3xs text-gray-500 font-bold uppercase tracking-wider">Divisions</span>
          <p className="text-xl font-extrabold text-purple-900 mt-0.5">{divisions.length - 1}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs relative group">
          <div className="flex items-center justify-between">
            <span className="text-3xs text-gray-500 font-bold uppercase tracking-wider">Avg Chemist Margin</span>
            {!isEditingMargin && (
              <button 
                onClick={() => { setTempMargin(avgChemistMargin); setIsEditingMargin(true); }}
                className="text-gray-400 hover:text-indigo-600 text-3xs font-bold flex items-center space-x-1"
                title="Click to change Chemist Margin"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>
          {isEditingMargin ? (
            <div className="mt-1 flex items-center space-x-1">
              <input 
                type="text" 
                value={tempMargin}
                onChange={(e) => setTempMargin(e.target.value)}
                className="text-xs font-bold text-gray-900 border border-indigo-400 rounded px-1.5 py-1 w-full focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. 26.5% + Scheme"
                autoFocus
              />
              <button 
                onClick={handleSaveMargin}
                className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700 shrink-0"
                title="Save"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setIsEditingMargin(false)}
                className="text-gray-400 hover:text-gray-600 p-1 text-xs shrink-0"
                title="Cancel"
              >
                ✕
              </button>
            </div>
          ) : (
            <p 
              onClick={() => { setTempMargin(avgChemistMargin); setIsEditingMargin(true); }}
              className="text-xl font-extrabold text-amber-900 mt-0.5 cursor-pointer flex items-center justify-between"
            >
              <span>{avgChemistMargin}</span>
            </p>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by brand, molecule or indication..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 bg-white"
            >
              <option value="All">All Divisions ({divisions.length - 1})</option>
              {divisions.filter(d => d !== 'All').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 bg-white"
            >
              <option value="All">All Formulations ({categories.length - 1})</option>
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => {
          const { retailerMarginRs, retailerMarginPercent } = calculateMargins(product);
          return (
            <div 
              key={product.id} 
              className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 p-4 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-3xs font-extrabold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 uppercase">
                      {product.division}
                    </span>
                    <h3 className="font-extrabold text-gray-900 text-base mt-1 flex items-center gap-1.5">
                      {product.name}
                    </h3>
                  </div>
                  <span className="text-3xs font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full shrink-0">
                    {product.pack}
                  </span>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                  <span className="text-3xs font-bold text-gray-500 uppercase block mb-0.5">Composition:</span>
                  <p className="font-semibold text-gray-900 leading-snug">{product.composition}</p>
                </div>

                {/* Price Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2 py-1 text-center">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-3xs font-bold text-gray-500 block">MRP</span>
                    <span className="text-sm font-extrabold text-gray-900">₹{product.mrp.toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200">
                    <span className="text-3xs font-bold text-emerald-800 block">PTR (Retailer)</span>
                    <span className="text-sm font-extrabold text-emerald-900">₹{product.ptr.toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-200">
                    <span className="text-3xs font-bold text-indigo-800 block">PTS (Stockist)</span>
                    <span className="text-sm font-extrabold text-indigo-900">₹{product.pts.toFixed(2)}</span>
                  </div>
                </div>

                {/* Scheme Badge Banner */}
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <span className="text-3xs font-bold text-amber-900 uppercase block">Official Scheme</span>
                      <span className="font-extrabold text-amber-950 text-xs">{product.scheme}</span>
                    </div>
                  </div>
                  <span className="text-3xs font-extrabold px-2 py-0.5 bg-white text-emerald-800 border border-emerald-300 rounded-md">
                    +{retailerMarginPercent}% Margin
                  </span>
                </div>

                <div className="text-3xs text-gray-500 line-clamp-2">
                  <strong className="text-gray-700">Indications:</strong> {product.indications}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 gap-2">
                <button
                  onClick={() => {
                    setCalcProduct(product);
                    setCalcQuantity(20);
                    setShowCalculator(true);
                  }}
                  className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 border border-indigo-200"
                >
                  <Calculator className="w-3.5 h-3.5 text-indigo-700" />
                  Scheme Calculator
                </button>

                <button
                  onClick={() => handleShareOnWhatsApp(product)}
                  className="py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 border border-emerald-200 shrink-0"
                  title="Share on WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                  Share
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheme Calculator Modal */}
      {showCalculator && calcProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-gray-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-3xs font-bold text-indigo-600 uppercase">Scheme & Margin Estimator</span>
                <h3 className="text-base font-extrabold text-gray-900">{calcProduct.name}</h3>
              </div>
              <button 
                onClick={() => setShowCalculator(false)}
                className="text-gray-400 hover:text-gray-600 p-1 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-1">
              <p><strong>MRP:</strong> ₹{calcProduct.mrp.toFixed(2)} | <strong>PTR:</strong> ₹{calcProduct.ptr.toFixed(2)} | <strong>PTS:</strong> ₹{calcProduct.pts.toFixed(2)}</p>
              <p className="text-amber-900 font-bold"><strong>Current Scheme:</strong> {calcProduct.scheme}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-800">
                Enter Order Quantity from Chemist:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-extrabold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-gray-600 shrink-0">Units</span>
              </div>
            </div>

            {/* Calculated Breakdown */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-700">
                <span>Total Billing Value (at PTR):</span>
                <span className="font-extrabold text-gray-900">₹{(calcQuantity * calcProduct.ptr).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-800">
                <span>Free Bonus Units Earned:</span>
                <span className="font-extrabold text-emerald-900">+{Math.floor(calcQuantity / 10)} Free Units</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Chemist Retail Total Value (at MRP):</span>
                <span className="font-extrabold text-gray-900">
                  ₹{((calcQuantity + Math.floor(calcQuantity / 10)) * calcProduct.mrp).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-2 text-emerald-950 font-extrabold">
                <span>Total Retailer Profit:</span>
                <span className="text-sm text-emerald-700">
                  ₹{(((calcQuantity + Math.floor(calcQuantity / 10)) * calcProduct.mrp) - (calcQuantity * calcProduct.ptr)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowCalculator(false)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                Close Estimator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
