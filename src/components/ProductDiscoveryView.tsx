import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Star,
  CheckCircle2,
  ExternalLink,
  Plus,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  X,
  Layers,
  Sparkles,
  ArrowUpDown,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { Product, ProductCategory, SkinType, ProductOrigin } from '../types';

export const ProductDiscoveryView: React.FC = () => {
  const {
    catalog,
    addToShelf,
    shelf,
    addToShoppingList,
    shoppingList,
    favorites,
    toggleFavorite,
    formatPrice,
    profile,
    language,
    isRTL,
    t,
  } = useBeauty();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState<'all' | ProductOrigin>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('all');
  const [selectedConcern, setSelectedConcern] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'price_asc' | 'price_desc' | 'rating' | 'name'>('rating');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxPriceEGP, setMaxPriceEGP] = useState<number>(1000);

  // Smart Budget Mode State
  const [isBudgetModeActive, setIsBudgetModeActive] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState<number>(profile.monthlyBudget || 600);

  // Selected product for detailed modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Compare products state (max 3)
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  // Categories list for filter tabs
  const categoriesList: { key: string; label: string; labelAr: string }[] = [
    { key: 'all', label: 'All Categories', labelAr: 'جميع الفئات' },
    { key: 'cleanser', label: 'Cleansers', labelAr: 'غسول الوجه' },
    { key: 'moisturizer', label: 'Moisturizers & Barrier', labelAr: 'مرطبات وترميم' },
    { key: 'sunscreen', label: 'Sunscreens', labelAr: 'واقيات الشمس' },
    { key: 'serum', label: 'Serums & Actives', labelAr: 'سيرومات وعلاجات' },
    { key: 'toner', label: 'Toners & Exfoliants', labelAr: 'تونر ومقشرات' },
    { key: 'acne_care', label: 'Acne Care', labelAr: 'علاج الحبوب' },
    { key: 'makeup_remover', label: 'Makeup Removers', labelAr: 'مزيل المكياج' },
    { key: 'lip_care', label: 'Lip Care', labelAr: 'عناية الشفاه' },
    { key: 'body_wash', label: 'Body Washes', labelAr: 'غسول الجسم' },
    { key: 'body_lotion', label: 'Body Lotions', labelAr: 'ترطيب الجسم' },
    { key: 'body_treatment', label: 'Body Treatments', labelAr: 'علاجات الجسم' },
    { key: 'hair_care', label: 'Hair Care', labelAr: 'العناية بالشعر' },
    { key: 'foundation_concealer', label: 'Foundation & Concealer', labelAr: 'كريم أساس وكونسيلر' },
    { key: 'blush_powder', label: 'Blush & Powder', labelAr: 'بلاشر وبودرة' },
    { key: 'eye_lip_makeup', label: 'Eyes & Lips', labelAr: 'عيون وأرواج' },
    { key: 'tools_brushes', label: 'Tools & Brushes', labelAr: 'فرش وإسفنجات' },
  ];

  // Filtered and Sorted catalog
  const filteredProducts = useMemo(() => {
    let result = [...catalog];

    // Origin filter
    if (selectedOrigin !== 'all') {
      result = result.filter((p) => p.origin === selectedOrigin);
    }

    // Text search (Arabic and English)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.nameAr && p.nameAr.includes(q)) ||
          p.brand.toLowerCase().includes(q) ||
          (p.brandAr && p.brandAr.includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          (p.categoryAr && p.categoryAr.includes(q)) ||
          p.activeIngredients.some((i) => i.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          (p.descriptionAr && p.descriptionAr.includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedSkinType !== 'all') {
      result = result.filter(
        (p) =>
          p.targetSkinTypes.includes(selectedSkinType as SkinType) ||
          p.targetSkinTypes.includes('all' as any)
      );
    }

    if (selectedConcern !== 'all') {
      result = result.filter((p) => p.targetConcerns.includes(selectedConcern));
    }

    if (verifiedOnly) {
      result = result.filter((p) => p.verified);
    }

    // Price ceiling filter (EGP)
    if (maxPriceEGP < 1000) {
      result = result.filter((p) => (p.priceEGP || p.price * 50) <= maxPriceEGP);
    }

    // Sort
    result.sort((a, b) => {
      const priceA = a.priceEGP || a.price * 50;
      const priceB = b.priceEGP || b.price * 50;
      if (sortOption === 'price_asc') return priceA - priceB;
      if (sortOption === 'price_desc') return priceB - priceA;
      if (sortOption === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [
    catalog,
    searchQuery,
    selectedOrigin,
    selectedCategory,
    selectedSkinType,
    selectedConcern,
    sortOption,
    verifiedOnly,
    maxPriceEGP,
  ]);

  // Smart Budget Mode Routine Optimizer in EGP
  const budgetOptimizer = useMemo(() => {
    const cleansers = catalog
      .filter((p) => p.category === 'cleanser')
      .sort((a, b) => (a.priceEGP || a.price * 50) - (b.priceEGP || b.price * 50));
    const moisturizers = catalog
      .filter((p) => p.category === 'moisturizer')
      .sort((a, b) => (a.priceEGP || a.price * 50) - (b.priceEGP || b.price * 50));
    const sunscreens = catalog
      .filter((p) => p.category === 'sunscreen')
      .sort((a, b) => (a.priceEGP || a.price * 50) - (b.priceEGP || b.price * 50));
    const boosters = catalog
      .filter((p) => ['serum', 'toner', 'lip_care'].includes(p.category))
      .sort((a, b) => (a.priceEGP || a.price * 50) - (b.priceEGP || b.price * 50));

    // Prefer verified Egyptian brand options when budget is moderate
    const essentialCleanser = cleansers[0];
    const essentialMoisturizer = moisturizers[0];
    const essentialSunscreen = sunscreens[0];

    const essentials = [essentialCleanser, essentialMoisturizer, essentialSunscreen].filter(Boolean);
    const essentialCost = essentials.reduce((sum, p) => sum + (p.priceEGP || p.price * 50), 0);

    const remainingAfterEssentials = budgetLimit - essentialCost;

    let optionalItems: Product[] = [];
    let runningBudget = remainingAfterEssentials;

    for (const item of boosters) {
      const cost = item.priceEGP || item.price * 50;
      if (cost <= runningBudget) {
        optionalItems.push(item);
        runningBudget -= cost;
      }
    }

    const totalRoutineCost =
      essentialCost + optionalItems.reduce((sum, p) => sum + (p.priceEGP || p.price * 50), 0);
    const budgetRemaining = Math.max(0, budgetLimit - totalRoutineCost);

    return {
      essentials,
      optionalItems,
      essentialCost,
      totalRoutineCost,
      budgetRemaining,
      isUnderBudget: totalRoutineCost <= budgetLimit,
    };
  }, [catalog, budgetLimit]);

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter((item) => item !== id));
    } else {
      if (compareList.length >= 3) {
        return;
      }
      setCompareList([...compareList, id]);
      setIsCompareDrawerOpen(true);
    }
  };

  const comparedProducts = useMemo(() => {
    return catalog.filter((p) => compareList.includes(p.id));
  }, [catalog, compareList]);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Top Banner & Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
            <ShieldCheck className="w-4 h-4 text-[#C87D87]" />
            <span>{t('verifiedPriceBadge')}</span>
            <span aria-hidden="true">·</span>
            <span>{catalog.length} {language === 'ar' ? 'منتج موثق بالسوق المصري' : 'Egyptian Market Formulations'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231D] tracking-tight mt-1">
            {t('finderHeading')}
          </h1>
          <p className="text-sm text-[#544B46] mt-1 max-w-2xl leading-relaxed">
            {t('finderSub')}
          </p>
        </div>

        {/* Toggle Smart Budget Mode Button */}
        <button
          onClick={() => setIsBudgetModeActive(!isBudgetModeActive)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
            isBudgetModeActive
              ? 'bg-[#C87D87] text-white hover:bg-[#B76E78]'
              : 'bg-white border border-[#EAE3DA] text-[#28231D] hover:bg-[#FAF7F2]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isBudgetModeActive ? t('exitBudgetModeBtn') : t('smartBudgetModeBtn')}</span>
        </button>
      </div>

      {/* SMART BUDGET MODE PANEL */}
      {isBudgetModeActive && (
        <section className="bg-white border-2 border-[#C87D87]/40 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-[#F2ECE4]">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2 text-xs text-[#C87D87] font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ar' ? 'حاسبة الميزانية الذكية' : 'Smart Budget Optimizer'}</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#28231D]">
                {t('smartBudgetTitle')}
              </h3>
              <p className="text-xs text-[#544B46] leading-relaxed">
                {t('smartBudgetDesc')}
              </p>
            </div>

            {/* Slider Control in EGP */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE3DA] min-w-[260px]">
              <div className="flex items-center justify-between text-xs text-[#28231D] font-medium mb-2">
                <span>{t('budgetSliderLabel')}</span>
                <span className="font-mono font-bold text-sm text-[#C87D87]">
                  {formatPrice(budgetLimit, 'EGP')}
                </span>
              </div>
              <input
                type="range"
                min={250}
                max={2000}
                step={50}
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="w-full accent-[#C87D87] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8C7D73] mt-1 font-mono">
                <span>250 EGP</span>
                <span>1,000 EGP</span>
                <span>2,000 EGP</span>
              </div>
            </div>
          </div>

          {/* Budget Breakdown KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE3DA]">
              <span className="text-[11px] text-[#8C7D73] block mb-1">{t('recommendedTotal')}</span>
              <span className="font-mono text-lg font-bold text-[#28231D]">
                {formatPrice(budgetOptimizer.totalRoutineCost, 'EGP')}
              </span>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE3DA]">
              <span className="text-[11px] text-[#8C7D73] block mb-1">{t('essentialCoreCost')}</span>
              <span className="font-mono text-lg font-bold text-[#28231D]">
                {formatPrice(budgetOptimizer.essentialCost, 'EGP')}
              </span>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE3DA]">
              <span className="text-[11px] text-[#8C7D73] block mb-1">{t('budgetRemaining')}</span>
              <span className="font-mono text-lg font-bold text-emerald-700">
                {formatPrice(budgetOptimizer.budgetRemaining, 'EGP')}
              </span>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE3DA]">
              <span className="text-[11px] text-[#8C7D73] block mb-1">{t('purchasesToPostpone')}</span>
              <span className="font-mono text-lg font-bold text-[#8C7D73]">
                {catalog.length - (budgetOptimizer.essentials.length + budgetOptimizer.optionalItems.length)} {language === 'ar' ? 'منتجات' : 'items'}
              </span>
            </div>
          </div>

          {/* Curated Recommendations for Current Budget */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C7D73]">
              {t('curatedRecommendations')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budgetOptimizer.essentials.map((item, index) => {
                const title = language === 'ar' && item.nameAr ? item.nameAr : item.name;
                const brand = language === 'ar' && item.brandAr ? item.brandAr : item.brand;
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE3DA] flex items-center justify-between"
                  >
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#28231D] text-white mb-1">
                        {t('essentialStep')} {index + 1}
                      </span>
                      <h5 className="font-serif text-sm font-bold text-[#28231D] line-clamp-1">{title}</h5>
                      <p className="text-xs text-[#8C7D73]">{brand} · {formatPrice(item.priceEGP || item.price * 50, 'EGP')}</p>
                    </div>
                    <button
                      onClick={() =>
                        addToShoppingList({
                          productId: item.id,
                          name: item.name,
                          brand: item.brand,
                          price: item.priceEGP || item.price * 50,
                          currency: 'EGP',
                          category: item.category,
                          isEssential: true,
                          purchased: false,
                        })
                      }
                      className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-[#F2ECE4] border border-[#EAE3DA] rounded-lg text-[#28231D] transition-colors shrink-0 cursor-pointer"
                    >
                      {t('addToList')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FILTER & SEARCH BAR SECTION */}
      <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm space-y-4">
        {/* Origin Filter Tabs (Egyptian Brands vs Imported Brands vs All) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F2ECE4]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedOrigin('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedOrigin === 'all'
                  ? 'bg-[#28231D] text-white shadow-2xs'
                  : 'bg-[#FAF7F2] text-[#544B46] hover:bg-[#F2ECE4]'
              }`}
            >
              {t('filterAllOrigins')}
            </button>
            <button
              onClick={() => setSelectedOrigin('egyptian')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedOrigin === 'egyptian'
                  ? 'bg-[#28231D] text-white shadow-2xs'
                  : 'bg-[#FAF7F2] text-[#544B46] hover:bg-[#F2ECE4]'
              }`}
            >
              <span>🇪🇬</span>
              <span>{t('filterEgyptianOnly')}</span>
            </button>
            <button
              onClick={() => setSelectedOrigin('imported')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedOrigin === 'imported'
                  ? 'bg-[#28231D] text-white shadow-2xs'
                  : 'bg-[#FAF7F2] text-[#544B46] hover:bg-[#F2ECE4]'
              }`}
            >
              <span>🌍</span>
              <span>{t('filterImportedOnly')}</span>
            </button>
          </div>

          {/* Compare Drawer Indicator */}
          {compareList.length > 0 && (
            <button
              onClick={() => setIsCompareDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FAF7F2] text-[#C87D87] border border-[#EAE3DA] hover:bg-[#F2ECE4] cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('comparing')} ({compareList.length}/3)</span>
            </button>
          )}
        </div>

        {/* Search input + Sort dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className={`w-4 h-4 text-[#8C7D73] absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className={`w-full py-2 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs text-[#28231D] placeholder:text-[#8C7D73] focus:outline-none focus:border-[#C87D87] transition-all ${
                isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute top-2.5 text-[#8C7D73] hover:text-[#28231D] ${isRTL ? 'left-3' : 'right-3'}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="px-3 py-2 bg-[#FAF7F2] border border-[#EAE3DA] rounded-xl text-xs text-[#28231D] focus:outline-none focus:border-[#C87D87] cursor-pointer"
            >
              <option value="rating">{t('topRated')}</option>
              <option value="price_asc">{t('priceLowHigh')}</option>
              <option value="price_desc">{t('priceHighLow')}</option>
              <option value="name">{t('alphabetical')}</option>
            </select>

            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                verifiedOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-[#FAF7F2] border-[#EAE3DA] text-[#544B46] hover:bg-[#F2ECE4]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('verifiedOnlyLabel')}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          {categoriesList.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-[#C87D87] text-white font-semibold'
                  : 'bg-[#FAF7F2] text-[#544B46] hover:bg-[#F2ECE4]'
              }`}
            >
              {language === 'ar' ? cat.labelAr : cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#EAE3DA] space-y-3">
          <p className="text-sm text-[#8C7D73]">{t('noProductsFound')}</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedOrigin('all');
              setVerifiedOnly(false);
            }}
            className="px-4 py-2 text-xs font-semibold text-[#28231D] bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EAE3DA] rounded-xl cursor-pointer"
          >
            {t('resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isFav = favorites.includes(product.id);
            const isInShelf = shelf.some((s) => s.productId === product.id || s.name === product.name);
            const isComparing = compareList.includes(product.id);
            const displayName = language === 'ar' && product.nameAr ? product.nameAr : product.name;
            const displayBrand = language === 'ar' && product.brandAr ? product.brandAr : product.brand;
            const displayDesc = language === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;
            const priceVal = product.priceEGP || product.price * 50;

            return (
              <div
                key={product.id}
                className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Origin + Category Badge + Favorite Heart */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {product.origin === 'egyptian' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {t('egyptianMade')}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200">
                          {t('imported')}
                        </span>
                      )}

                      {product.verified && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>2026</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="text-[#8C7D73] hover:text-[#C87D87] transition-colors p-1 cursor-pointer"
                      title="Save to favorites"
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-[#C87D87] text-[#C87D87]' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Brand & Title */}
                  <span className="text-xs uppercase tracking-wider text-[#8C7D73] font-semibold block mb-1">
                    {displayBrand}
                  </span>
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-serif text-lg font-bold text-[#28231D] group-hover:text-[#C87D87] transition-colors cursor-pointer leading-snug line-clamp-2"
                  >
                    {displayName}
                  </h3>

                  {/* Rating + Reviews */}
                  <div className="flex items-center gap-2 mt-2 text-xs text-[#8C7D73]">
                    <div className="flex items-center text-amber-500 font-semibold gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                    <span>·</span>
                    <span>{product.reviewsCount} {t('reviews')}</span>
                    <span>·</span>
                    <span>{product.size}</span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-[#544B46] mt-2 line-clamp-2 leading-relaxed">
                    {displayDesc}
                  </p>

                  {/* Dupe Alert Tag (If alternative) */}
                  {product.isAlternativeTo && (
                    <div className="mt-2.5 p-2 bg-[#FAF7F2] rounded-lg border border-[#EAE3DA] text-[11px] text-[#28231D]">
                      <span className="font-semibold text-[#C87D87]">
                        {language === 'ar' ? 'بديل اقتصادي لـ: ' : 'Dupe for: '}
                      </span>
                      <span>{product.isAlternativeTo}</span>
                      {product.dupeSavingsEGP && (
                        <span className="block font-medium text-emerald-700 mt-0.5">
                          {language === 'ar'
                            ? `يوفر ${product.dupeSavingsEGP} ج.م في العبوة`
                            : `Saves ~${product.dupeSavingsEGP} EGP`}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active Ingredients Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {product.activeIngredients.slice(0, 3).map((act, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-[#FAF7F2] border border-[#EAE3DA] rounded text-[10px] text-[#544B46]"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Price & Actions */}
                <div className="pt-4 border-t border-[#F2ECE4] mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-lg font-bold text-[#28231D]">
                        {formatPrice(priceVal, 'EGP')}
                      </span>
                      {product.priceVerificationDate && (
                        <span className="block text-[10px] text-[#8C7D73]">
                          {t('lastVerifiedDate', { date: product.priceVerificationDate })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleCompare(product.id)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                          isComparing
                            ? 'bg-[#C87D87] text-white border-[#C87D87]'
                            : 'bg-white border-[#EAE3DA] text-[#544B46] hover:bg-[#FAF7F2]'
                        }`}
                        title={t('compare')}
                      >
                        <Layers className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          addToShoppingList({
                            productId: product.id,
                            name: product.name,
                            brand: product.brand,
                            price: priceVal,
                            currency: 'EGP',
                            category: product.category,
                            isEssential: false,
                            purchased: false,
                          })
                        }
                        className="p-1.5 rounded-lg border border-[#EAE3DA] bg-white hover:bg-[#FAF7F2] text-[#544B46] transition-colors cursor-pointer"
                        title={t('addToList')}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          addToShelf({
                            productId: product.id,
                            name: product.name,
                            brand: product.brand,
                            category: product.category,
                            status: 'in_routine',
                            openedDate: new Date().toISOString().split('T')[0],
                            expirationMonths: 12,
                            rating: 5,
                            repurchase: true,
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isInShelf
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-[#28231D] text-white hover:bg-[#3D352E]'
                        }`}
                      >
                        {isInShelf ? t('inShelf') : t('addToShelf')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-[#EAE3DA] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#8C7D73] font-semibold">
                  {selectedProduct.brand} {selectedProduct.origin === 'egyptian' ? '🇪🇬' : '🌍'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#28231D] mt-1">
                  {language === 'ar' && selectedProduct.nameAr
                    ? selectedProduct.nameAr
                    : selectedProduct.name}
                </h3>
                <span className="font-mono text-xl font-bold text-[#C87D87] block mt-1">
                  {formatPrice(selectedProduct.priceEGP || selectedProduct.price * 50, 'EGP')}
                </span>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 text-[#8C7D73] hover:text-[#28231D] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#544B46] leading-relaxed">
              <div>
                <h4 className="font-bold text-[#28231D] mb-1">{t('details')}:</h4>
                <p>
                  {language === 'ar' && selectedProduct.descriptionAr
                    ? selectedProduct.descriptionAr
                    : selectedProduct.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#28231D] mb-1">{t('whyFitsYou')}:</h4>
                <p>
                  {language === 'ar' && selectedProduct.whyItFitsAr
                    ? selectedProduct.whyItFitsAr
                    : selectedProduct.whyItFits}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#28231D] mb-1">{t('howToApplyText')}:</h4>
                <p>
                  {language === 'ar' && selectedProduct.howToUseAr
                    ? selectedProduct.howToUseAr
                    : selectedProduct.howToUse}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#28231D] mb-1">{t('precautionsNotice')}:</h4>
                <p>
                  {language === 'ar' && selectedProduct.precautionsAr
                    ? selectedProduct.precautionsAr
                    : selectedProduct.precautions || 'Standard safe cosmetic formula. Always patch-test 24 hours prior to regular use.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#28231D] mb-1">{t('keyActives')}:</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedProduct.activeIngredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#FAF7F2] border border-[#EAE3DA] rounded-lg text-xs text-[#28231D]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#8C7D73] flex items-center justify-between">
                <div>
                  <strong>{t('retailer')}:</strong> {selectedProduct.retailerName}
                </div>
                {selectedProduct.retailerUrl && (
                  <a
                    href={selectedProduct.retailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#C87D87] hover:underline font-medium text-xs"
                  >
                    <span>{language === 'ar' ? 'زيارة المتجر / الصيدلية' : 'Official Retailer'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#F2ECE4] flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-[#544B46] hover:bg-[#FAF7F2] rounded-xl cursor-pointer"
              >
                {t('close')}
              </button>
              <button
                onClick={() => {
                  addToShelf({
                    productId: selectedProduct.id,
                    name: selectedProduct.name,
                    brand: selectedProduct.brand,
                    category: selectedProduct.category,
                    status: 'in_routine',
                    openedDate: new Date().toISOString().split('T')[0],
                    expirationMonths: 12,
                  });
                  setSelectedProduct(null);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#28231D] hover:bg-[#3D352E] rounded-xl cursor-pointer"
              >
                {t('addToShelf')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE COMPARISON MODAL */}
      {isCompareDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-[#EAE3DA] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#C87D87]" />
                <h3 className="font-serif text-2xl font-bold text-[#28231D]">
                  {t('compareUpTo3')}
                </h3>
              </div>
              <button
                onClick={() => setIsCompareDrawerOpen(false)}
                className="p-1.5 text-[#8C7D73] hover:text-[#28231D] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {comparedProducts.length === 0 ? (
              <p className="text-xs text-[#8C7D73] text-center py-8">
                {language === 'ar' ? 'اختر منتجات للمقارنة من القائمة' : 'Select products from the catalog to compare.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {comparedProducts.map((p) => {
                  const title = language === 'ar' && p.nameAr ? p.nameAr : p.name;
                  const brand = language === 'ar' && p.brandAr ? p.brandAr : p.brand;
                  const why = language === 'ar' && p.whyItFitsAr ? p.whyItFitsAr : p.whyItFits;
                  return (
                    <div
                      key={p.id}
                      className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE3DA] flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C87D87]">
                            {brand} {p.origin === 'egyptian' ? '🇪🇬' : '🌍'}
                          </span>
                          <button
                            onClick={() => toggleCompare(p.id)}
                            className="text-[#8C7D73] hover:text-[#28231D] cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-serif text-base font-bold text-[#28231D]">{title}</h4>
                        <span className="font-mono text-lg font-bold text-[#28231D] block">
                          {formatPrice(p.priceEGP || p.price * 50, 'EGP')}
                        </span>
                        <div className="text-xs text-[#544B46] space-y-1 pt-2 border-t border-[#EAE3DA]">
                          <p><strong>{t('categoryLabel')}:</strong> {p.category}</p>
                          <p><strong>{t('sizeLabel')}:</strong> {p.size}</p>
                          <p><strong>{t('whyFitsYou')}:</strong> {why}</p>
                        </div>
                        <div className="pt-2">
                          <span className="text-[10px] font-semibold text-[#8C7D73] block mb-1">
                            {t('keyActives')}:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {p.activeIngredients.map((ing, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-white border border-[#EAE3DA] rounded text-[10px] text-[#544B46]"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToShelf({
                            productId: p.id,
                            name: p.name,
                            brand: p.brand,
                            category: p.category,
                            status: 'in_routine',
                            openedDate: new Date().toISOString().split('T')[0],
                            expirationMonths: 12,
                          });
                        }}
                        className="w-full py-2 text-xs font-semibold text-white bg-[#28231D] hover:bg-[#3D352E] rounded-lg transition-colors cursor-pointer"
                      >
                        {t('addToShelf')}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
