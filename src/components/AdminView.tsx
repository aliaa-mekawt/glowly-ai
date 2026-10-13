import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  ExternalLink,
  Info,
  Server,
  KeyRound,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { Product, ProductCategory } from '../types';

export const AdminView: React.FC = () => {
  const { catalog, addProductToCatalog, updateProductInCatalog, deleteProductFromCatalog, formatPrice, language } =
    useBeauty();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState<any>(null);

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/status', { credentials: 'same-origin' });
        const data = await res.json();
        setIsAuthenticated(Boolean(data.authenticated));
        setIsConfigured(data.configured !== false);
        if (data.authenticated) {
          fetchStorageStatus();
        }
      } catch (e) {
        console.warn('Admin status check failed:', e);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkSession();
  }, []);

  const fetchStorageStatus = async () => {
    try {
      const res = await fetch('/api/admin/storage-status', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setStorageInfo(data);
      }
    } catch (e) {
      console.warn('Storage status fetch error:', e);
    }
  };

  // Add Product Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [brand, setBrand] = useState('');
  const [brandAr, setBrandAr] = useState('');
  const [origin, setOrigin] = useState<'egyptian' | 'imported'>('egyptian');
  const [category, setCategory] = useState<ProductCategory>('cleanser');
  const [subcategory, setSubcategory] = useState('Facial Cleanser');
  const [priceEGP, setPriceEGP] = useState(150);
  const [size, setSize] = useState('150 ml');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [activeIngredients, setActiveIngredients] = useState('Ceramides, Hyaluronic Acid');
  const [verified, setVerified] = useState(true);
  const [retailerUrl, setRetailerUrl] = useState('https://bobana-eg.com');
  const [retailerName, setRetailerName] = useState('Egyptian Pharmacies');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Please enter the server administrator passcode.');
      return;
    }

    setLoginLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasscode('');
        setErrorMsg('');
        fetchStorageStatus();
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please verify your credentials.');
        if (data.configured === false) {
          setIsConfigured(false);
        }
      }
    } catch (err: any) {
      setErrorMsg('Connection error. Server may be starting or unreachable.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
    } catch (e) {}
    setIsAuthenticated(false);
    setStorageInfo(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) return;

    const success = await addProductToCatalog({
      name: name.trim(),
      nameAr: nameAr.trim() || undefined,
      brand: brand.trim(),
      brandAr: brandAr.trim() || undefined,
      category,
      subcategory,
      price: Math.round((priceEGP / 50) * 100) / 100,
      priceEGP: Number(priceEGP),
      currency: 'EGP',
      origin,
      dataStatus: 'verified',
      rating: 4.8,
      reviewsCount: 1,
      image: '/src/assets/images/skincare_routine_flatlay_1791894053876.jpg',
      verified,
      verifiedDate: new Date().toISOString().split('T')[0],
      priceVerificationDate: new Date().toISOString().split('T')[0],
      description: description.trim() || 'Verified cosmetic formulation.',
      descriptionAr: descriptionAr.trim() || undefined,
      targetSkinTypes: ['all', 'normal', 'combination'],
      targetConcerns: ['Healthy Radiance', 'Dehydration'],
      activeIngredients: activeIngredients.split(',').map((s) => s.trim()),
      howToUse: 'Apply gently as directed on label.',
      size,
      retailerUrl: retailerUrl.trim() || undefined,
      retailerName: retailerName.trim() || undefined,
    });

    if (success) {
      setName('');
      setNameAr('');
      setBrand('');
      setBrandAr('');
      setDescription('');
      setDescriptionAr('');
      setIsModalOpen(false);
      fetchStorageStatus();
    } else {
      alert('Could not save product. Your admin session may have expired.');
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="py-24 text-center text-xs text-[#8C7D73]">
        Checking secure admin session status...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-[#EAE3DA] rounded-3xl p-8 shadow-sm space-y-6 text-center animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-[#F7EBEB] text-[#C87D87] flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-[#28231D]">
            Secure Admin Portal
          </h2>
          <p className="text-xs text-[#544B46] leading-relaxed">
            Administrator credentials are verified server-side with rate limiting and secure HTTP-only cookies. No passwords or secret keys are stored in client bundles.
          </p>
        </div>

        {!isConfigured && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Setup Required:</strong> Define <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">ADMIN_PASSCODE</code> in your server environment variables or AI Studio Secrets panel.
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter server administrator passcode"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D9C5B2] bg-[#FAF7F2] text-xs text-[#28231D] text-center focus:outline-none focus:ring-2 focus:ring-[#C87D87]"
              autoComplete="current-password"
            />
            {errorMsg && (
              <p className="text-xs text-rose-600 mt-2 bg-rose-50 p-2 rounded-lg border border-rose-200">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-2.5 text-xs font-semibold text-white bg-[#28231D] hover:bg-[#3D352E] disabled:opacity-50 rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#E8B4B8]" />
            <span>{loginLoading ? 'Authenticating...' : 'Authenticate & Open Dashboard'}</span>
          </button>
        </form>

        <div className="pt-2 text-[11px] text-[#8C7D73] border-t border-[#F2ECE4]">
          Protected against brute-force attacks (5 attempts / 15-minute lockout).
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
            <span>Secure Administration System</span>
            <span aria-hidden="true">·</span>
            <span>{catalog.length} Products in Database</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231D] tracking-tight">
            Admin Catalog & Data Management
          </h1>
          <p className="text-sm text-[#544B46] mt-1 max-w-xl">
            Maintain verified formulation listings, update prices, manage purchase links, and monitor system AI operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#28231D] hover:bg-[#3D352E] rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#E8B4B8]" />
            <span>Add New Catalog Record</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-xs text-[#8C7D73] hover:text-rose-600 border border-[#EAE3DA] rounded-xl cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Storage Architecture & Limitations Audit Banner */}
      <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EAE3DA] space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#28231D]">
          <Server className="w-4 h-4 text-[#C87D87]" />
          <span>Storage Architecture & Resilience Disclosure</span>
        </div>
        <p className="text-[#544B46] leading-relaxed">
          <strong>Catalog Data:</strong> Cached in server memory with automatic fallback to <code className="bg-white px-1.5 py-0.5 rounded border border-[#EAE3DA] font-mono text-[11px]">catalog-storage.json</code> on local server disk.
          On free ephemeral server platforms (Cloud Run / container restarts), files stored on container disk reset unless backed by an external database. If container resets occur, the built-in 36 authentic Egyptian and imported catalog records are automatically restored without system failure.
        </p>
        <p className="text-[#544B46] leading-relaxed">
          <strong>User Data Isolation:</strong> All user profiles, daily routines, vanity shelves, shopping lists, and journals are strictly saved in the individual user’s browser <code className="bg-white px-1.5 py-0.5 rounded border border-[#EAE3DA] font-mono text-[11px]">localStorage</code>. No private user data is sent or synchronized across different users.
        </p>
        {storageInfo && (
          <div className="pt-2 border-t border-[#EAE3DA] flex flex-wrap items-center gap-4 text-[11px] text-[#8C7D73]">
            <span>Storage Type: <strong>{storageInfo.storageType}</strong></span>
            <span>Disk Backup File: <strong>{storageInfo.diskFileExists ? 'Active (' + storageInfo.fileSizeBytes + ' bytes)' : 'Standby'}</strong></span>
            <span>Live Products: <strong>{storageInfo.totalProductsCount}</strong></span>
          </div>
        )}
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DA] shadow-sm">
          <span className="text-[11px] text-[#8C7D73] block mb-1">Catalog Formulations</span>
          <span className="font-mono text-2xl font-bold text-[#28231D]">
            {catalog.length}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DA] shadow-sm">
          <span className="text-[11px] text-[#8C7D73] block mb-1">Verified Status Rate</span>
          <span className="font-mono text-2xl font-bold text-emerald-800">
            {Math.round((catalog.filter((p) => p.verified).length / catalog.length) * 100)}%
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DA] shadow-sm">
          <span className="text-[11px] text-[#8C7D73] block mb-1">AI Engine Pipeline</span>
          <span className="font-mono text-xs font-semibold text-[#6A5D7B] block mt-2">
            gemini-3.1-flash-lite / 3.8-flash
          </span>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-[#EAE3DA] rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#F2ECE4] flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-[#28231D]">
            Live Catalog Directory
          </h3>
          <span className="text-xs text-[#8C7D73]">Authorized Changes Persist Live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#8C7D73] uppercase tracking-wider font-semibold border-b border-[#EAE3DA]">
              <tr>
                <th className="py-3 px-4">Brand & Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Verified</th>
                <th className="py-3 px-4">Retailer Link</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {catalog.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#28231D]">{prod.name}</div>
                    <div className="text-[11px] text-[#8C7D73]">{prod.brand}</div>
                  </td>
                  <td className="py-3 px-4 capitalize">{prod.category.replace('_', ' ')}</td>
                  <td className="py-3 px-4 font-mono font-medium">{formatPrice(prod.price)}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => updateProductInCatalog(prod.id, { verified: !prod.verified })}
                      className="cursor-pointer"
                    >
                      {prod.verified ? (
                        <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="text-[#8C7D73] bg-[#FAF7F2] px-2 py-0.5 rounded-full text-[10px]">
                          Unverified
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    {prod.retailerUrl ? (
                      <a
                        href={prod.retailerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#C87D87] hover:underline flex items-center gap-1"
                      >
                        <span>Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[#8C7D73]">None</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteProductFromCatalog(prod.id)}
                      className="p-1 text-[#8C7D73] hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F2] border border-[#EAE3DA] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#28231D]">
              Add Authenticated Product
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#28231D] mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Daily Facial Cleanser"
                    className="w-full px-3 py-2 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#28231D] mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Cetaphil"
                    className="w-full px-3 py-2 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#28231D] mb-1">Product Name (Arabic)</label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثلاً: غسول الوجه اليومي"
                    className="w-full px-3 py-2 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D]"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#28231D] mb-1">Brand Name (Arabic)</label>
                  <input
                    type="text"
                    value={brandAr}
                    onChange={(e) => setBrandAr(e.target.value)}
                    placeholder="مثلاً: بوبانا أو ستارفيل"
                    className="w-full px-3 py-2 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D]"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block font-medium text-[#28231D] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D]"
                  >
                    <option value="cleanser">Cleanser</option>
                    <option value="moisturizer">Moisturizer</option>
                    <option value="sunscreen">Sunscreen</option>
                    <option value="serum">Serum</option>
                    <option value="toner">Toner</option>
                    <option value="foundation_concealer">Foundation</option>
                    <option value="blush_powder">Blush / Powder</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#28231D] mb-1">Origin</label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D]"
                  >
                    <option value="egyptian">Egyptian 🇪🇬</option>
                    <option value="imported">Imported 🌍</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#28231D] mb-1">Price (EGP) *</label>
                  <input
                    type="number"
                    step="5"
                    required
                    value={priceEGP}
                    onChange={(e) => setPriceEGP(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#28231D] mb-1">Size</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 150 ml"
                    className="w-full px-3 py-2 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#28231D] mb-1">Active Ingredients</label>
                <input
                  type="text"
                  value={activeIngredients}
                  onChange={(e) => setActiveIngredients(e.target.value)}
                  placeholder="e.g. Niacinamide, Panthenol, Glycerin"
                  className="w-full px-3 py-2 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#28231D] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Clinical benefits and formulation purpose"
                  className="w-full px-3 py-2 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#28231D] mb-1">Retailer / Official Link</label>
                <input
                  type="url"
                  value={retailerUrl}
                  onChange={(e) => setRetailerUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D9C5B2] bg-white text-[#28231D]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vCheck"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="accent-[#C87D87]"
                />
                <label htmlFor="vCheck" className="text-[#544B46]">
                  Flag as Verified Formula (reviewed for safety)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE3DA]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#8C7D73] hover:text-[#28231D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#28231D] hover:bg-[#3D352E] rounded-xl"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
