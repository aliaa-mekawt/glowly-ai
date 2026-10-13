import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useBeauty } from '../context/BeautyContext';
import { ShoppingItem } from '../types';

export const ShoppingListView: React.FC = () => {
  const {
    shoppingList,
    removeFromShoppingList,
    toggleShoppingItemPurchased,
    clearPurchasedShoppingItems,
    addToShelf,
    formatPrice,
    profile,
    language,
    isRTL,
    t,
  } = useBeauty();

  const essentialItems = shoppingList.filter((item) => item.isEssential);
  const optionalItems = shoppingList.filter((item) => !item.isEssential);

  const totalCost = shoppingList.reduce((sum, i) => sum + (i.purchased ? 0 : i.price), 0);
  const essentialCost = essentialItems.reduce((sum, i) => sum + (i.purchased ? 0 : i.price), 0);
  const optionalCost = optionalItems.reduce((sum, i) => sum + (i.purchased ? 0 : i.price), 0);

  const handleMoveToShelf = (item: ShoppingItem) => {
    addToShelf({
      productId: item.productId,
      name: item.name,
      brand: item.brand,
      category: item.category,
      status: 'active',
      notes: language === 'ar' ? 'تم شراؤه ونقله من قائمة التسوق' : 'Purchased from shopping list',
    });
    toggleShoppingItemPurchased(item.id);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C7D73] font-medium tracking-wide">
            <ShoppingBag className="w-4 h-4 text-[#C87D87]" />
            <span>{language === 'ar' ? 'إدارة المشتريات والميزانية' : 'Budget Discipline & Cart'}</span>
            <span aria-hidden="true">·</span>
            <span>{shoppingList.length} {language === 'ar' ? 'عناصر بالقائمة' : 'Items Planned'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231D] tracking-tight mt-1">
            {t('shoppingHeading')}
          </h1>
          <p className="text-sm text-[#544B46] mt-1 max-w-xl leading-relaxed">
            {t('shoppingSub')}
          </p>
        </div>

        {shoppingList.some((i) => i.purchased) && (
          <button
            onClick={clearPurchasedShoppingItems}
            className="text-xs text-[#8C7D73] hover:text-[#28231D] underline cursor-pointer self-start sm:self-auto"
          >
            {language === 'ar' ? 'مسح العناصر التي تم شراؤها' : 'Clear purchased items'}
          </button>
        )}
      </div>

      {/* Spending Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DA] shadow-sm">
          <span className="text-[11px] text-[#8C7D73] block mb-1">
            {language === 'ar' ? 'إجمالي المشتريات المخططة' : 'Total Planned Spend'}
          </span>
          <span className="font-mono text-2xl font-bold text-[#28231D]">
            {formatPrice(totalCost, 'EGP')}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DA] shadow-sm">
          <span className="text-[11px] text-[#8C7D73] block mb-1">
            {language === 'ar' ? 'تكلفة الأساسيات الحيوية' : 'Essential Core Spend'}
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-800">
            {formatPrice(essentialCost, 'EGP')}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DA] shadow-sm">
          <span className="text-[11px] text-[#8C7D73] block mb-1">
            {language === 'ar' ? 'تكلفة المشتريات الاختيارية' : 'Optional Boosters'}
          </span>
          <span className="font-mono text-2xl font-bold text-[#C87D87]">
            {formatPrice(optionalCost, 'EGP')}
          </span>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {shoppingList.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <ShoppingBag className="w-8 h-8 text-[#8C7D73] mx-auto opacity-50" />
            <p className="text-xs text-[#8C7D73]">
              {language === 'ar'
                ? 'قائمة التسوق فارغة حالياً. أضيفي منتجات من دليل المنتجات أو بدائل الدوبس.'
                : 'Your shopping list is empty. Add products from the Product Finder or Dupe Finder.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {shoppingList.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.purchased ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-[#FAF7F2] border-[#EAE3DA]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleShoppingItemPurchased(item.id)}
                    className="p-1 cursor-pointer"
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        item.purchased ? 'text-emerald-600 fill-emerald-100' : 'text-[#8C7D73]'
                      }`}
                    />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8C7D73] font-semibold">{item.brand}</span>
                      {item.isEssential && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                          {t('essentialStep')}
                        </span>
                      )}
                    </div>
                    <h4 className={`font-serif text-base font-bold ${item.purchased ? 'line-through text-[#8C7D73]' : 'text-[#28231D]'}`}>
                      {item.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="font-mono font-bold text-sm text-[#28231D]">
                    {formatPrice(item.price, 'EGP')}
                  </span>

                  <div className="flex items-center gap-2">
                    {!item.purchased && (
                      <button
                        onClick={() => handleMoveToShelf(item)}
                        className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-[#F2ECE4] border border-[#EAE3DA] rounded-lg text-[#28231D] cursor-pointer"
                      >
                        {language === 'ar' ? 'تم الشراء (+ للخزانة)' : 'Bought (+ To Shelf)'}
                      </button>
                    )}

                    <button
                      onClick={() => removeFromShoppingList(item.id)}
                      className="p-1.5 text-[#8C7D73] hover:text-rose-600 cursor-pointer"
                      title={t('remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
