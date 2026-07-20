// src/features/fitness/views/diet/FoodScannerView.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image as ImageIcon, Loader2, Sparkles, Check, Trash2, Plus, Minus, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { estimateCaloriesFromImage } from '../../../../services/aiService';
import { addDietEntry } from '../../../../utils/dietManager';
import BackButton from '../../../../components/BackButton';
import FooterBrand from '../../../../components/FooterBrand';

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result vem como "data:image/jpeg;base64,AAAA..." — removemos o prefixo
      const result = reader.result;
      const commaIdx = result.indexOf(',');
      resolve(result.slice(commaIdx + 1));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function FoodScannerView() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // { dishName, items, totalCalories, confidenceNote }
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);
    setSaved(false);

    try {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      setIsAnalyzing(true);
      const base64 = await fileToBase64(file);
      const analysis = await estimateCaloriesFromImage(base64, file.type || 'image/jpeg');

      // Garante que cada item tenha um id local para permitir edição/remoção
      const itemsWithIds = (analysis.items || []).map((item, idx) => ({
        id: `item_${idx}_${Date.now()}`,
        name: item.name || t('diet.unnamedItem', 'Item'),
        estimatedGrams: Number(item.estimatedGrams) || 0,
        calories: Number(item.calories) || 0,
      }));

      setResult({
        dishName: analysis.dishName || '',
        confidenceNote: analysis.confidenceNote || '',
        items: itemsWithIds,
      });
    } catch (err) {
      console.error('[FoodScannerView] Erro ao analisar imagem:', err);
      setError(
        t('diet.scanError', 'Não foi possível analisar a foto. Verifique sua conexão e tente novamente.')
      );
    } finally {
      setIsAnalyzing(false);
      // Reseta o input para permitir selecionar o mesmo arquivo de novo, se precisar
      e.target.value = '';
    }
  };

  const totalCalories = (result?.items || []).reduce((sum, i) => sum + (Number(i.calories) || 0), 0);

  const updateItem = (id, field, value) => {
    setResult((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === id ? { ...it, [field]: field === 'name' ? value : Math.max(0, Number(value) || 0) } : it
      ),
    }));
  };

  const removeItem = (id) => {
    setResult((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
    }));
  };

  const addManualItem = () => {
    setResult((prev) => ({
      ...prev,
      items: [
        ...(prev?.items || []),
        { id: `item_manual_${Date.now()}`, name: '', estimatedGrams: 0, calories: 0 },
      ],
    }));
  };

  const handleConfirm = async () => {
    if (!result || result.items.length === 0 || isSaving) return;
    setIsSaving(true);
    try {
      // Salva cada item identificado como uma entrada separada no diário,
      // mantendo o rastreamento individual (nome + calorias).
      for (const item of result.items) {
        if (!item.name.trim() && !item.calories) continue;
        await addDietEntry({
          foodName: item.name.trim() || t('diet.unnamedItem', 'Item'),
          calories: item.calories,
          source: 'ai_scanner',
        });
      }
      setSaved(true);
      setTimeout(() => navigate('/fitness/diet'), 900);
    } catch (err) {
      console.error('[FoodScannerView] Erro ao salvar entradas:', err);
      setError(t('diet.saveError', 'Erro ao salvar os itens no seu diário.'));
    } finally {
      setIsSaving(false);
    }
  };

  const resetAll = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    setSaved(false);
  };

  return (
    <div className="w-full pt-8 animate-fade-in px-4 pb-24 min-h-screen -mt-5 -mb-20">
      <BackButton to="/fitness/diet" label={t('general.back', 'Voltar')} />

      <div className="flex items-center gap-3 my-6">
        <div className="p-3 bg-orange-500/20 text-orange-400 rounded-2xl">
          <Camera size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{t('diet.scannerTitle', 'Escanear Prato')}</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
            {t('diet.scannerSubtitle', 'Tire uma foto e a IA estima as calorias')}
          </p>
        </div>
      </div>

      {/* INPUTS OCULTOS DE ARQUIVO */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelected}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* PREVIEW DA IMAGEM */}
      {imagePreview && (
        <div className="mb-5 rounded-3xl overflow-hidden border border-gray-700 shadow-lg bg-gray-800">
          <img src={imagePreview} alt="Prato escaneado" className="w-full max-h-72 object-cover" />
        </div>
      )}

      {/* BOTÕES DE CAPTURA — só aparecem antes de qualquer resultado */}
      {!result && !isAnalyzing && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="bg-gray-800 border border-orange-500/30 hover:border-orange-400 rounded-2xl p-5 flex flex-col items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <div className="p-3 bg-orange-500/20 text-orange-400 rounded-xl"><Camera size={24} /></div>
            <span className="text-sm font-black text-white">{t('diet.takePhoto', 'Tirar Foto')}</span>
          </button>
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-2xl p-5 flex flex-col items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <div className="p-3 bg-gray-700 text-gray-300 rounded-xl"><ImageIcon size={24} /></div>
            <span className="text-sm font-black text-white">{t('diet.fromGallery', 'Da Galeria')}</span>
          </button>
        </div>
      )}

      {/* ESTADO: ANALISANDO */}
      {isAnalyzing && (
        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 flex flex-col items-center text-center gap-4 mb-6 shadow-lg">
          <Loader2 className="text-orange-400 animate-spin" size={40} />
          <p className="text-white font-bold">{t('diet.analyzing', 'Analisando o prato com IA...')}</p>
          <p className="text-xs text-gray-500">{t('diet.analyzingDesc', 'Isso pode levar alguns segundos.')}</p>
        </div>
      )}

      {/* ERRO */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={resetAll}
              className="text-xs font-bold text-red-400 underline mt-2"
            >
              {t('diet.tryAgain', 'Tentar novamente')}
            </button>
          </div>
        </div>
      )}

      {/* RESULTADO DA ANÁLISE */}
      {result && !isAnalyzing && (
        <div className="animate-fade-in">
          {result.dishName && (
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-orange-400" />
              <h3 className="text-lg font-black text-white">{result.dishName}</h3>
            </div>
          )}

          {result.confidenceNote && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 mb-5">
              <p className="text-xs text-orange-200 leading-relaxed">{result.confidenceNote}</p>
            </div>
          )}

          {/* CARD DE TOTAL */}
          <div className="bg-gradient-to-br from-orange-900/40 to-gray-800 border border-orange-500/30 rounded-3xl p-5 mb-5 text-center shadow-lg">
            <p className="text-[10px] font-bold text-orange-300 uppercase tracking-widest mb-1">
              {t('diet.totalEstimated', 'Total Estimado')}
            </p>
            <p className="text-3xl font-black text-white">{Math.round(totalCalories)} <span className="text-base font-bold text-gray-400">kcal</span></p>
          </div>

          {/* LISTA DE ITENS EDITÁVEIS */}
          <div className="space-y-3 mb-5">
            {result.items.map((item) => (
              <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder={t('diet.itemNamePlaceholder', 'Nome do alimento')}
                    className="flex-1 bg-transparent text-white font-bold text-sm border-b border-gray-700 focus:border-orange-500 focus:outline-none pb-1"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                      {t('diet.grams', 'Gramas (aprox.)')}
                    </label>
                    <input
                      type="number"
                      value={item.estimatedGrams}
                      onChange={(e) => updateItem(item.id, 'estimatedGrams', e.target.value)}
                      className="w-full bg-gray-900 text-white p-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                      {t('diet.calories', 'Calorias')}
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateItem(item.id, 'calories', item.calories - 10)}
                        className="p-2 bg-gray-900 rounded-lg border border-gray-700 text-gray-400 hover:text-white shrink-0"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        value={item.calories}
                        onChange={(e) => updateItem(item.id, 'calories', e.target.value)}
                        className="w-full bg-gray-900 text-white p-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-sm text-center"
                      />
                      <button
                        onClick={() => updateItem(item.id, 'calories', item.calories + 10)}
                        className="p-2 bg-gray-900 rounded-lg border border-gray-700 text-gray-400 hover:text-white shrink-0"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {result.items.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-6 bg-gray-800/50 rounded-2xl border border-gray-700">
                {t('diet.noItemsFound', 'Nenhum item identificado. Adicione manualmente abaixo.')}
              </div>
            )}
          </div>

          <button
            onClick={addManualItem}
            className="w-full mb-6 py-3 rounded-2xl border-2 border-dashed border-gray-700 text-gray-400 hover:border-orange-500/50 hover:text-orange-400 transition-colors flex items-center justify-center gap-2 text-sm font-bold"
          >
            <Plus size={16} /> {t('diet.addItemManually', 'Adicionar item manualmente')}
          </button>

          {/* AÇÕES FINAIS */}
          <div className="flex gap-3">
            <button
              onClick={resetAll}
              className="flex-1 py-4 rounded-2xl bg-gray-800 border border-gray-700 text-white font-bold hover:bg-gray-700 transition-colors"
            >
              {t('diet.scanAgain', 'Nova Foto')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSaving || result.items.length === 0}
              className="flex-1 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : saved ? (
                <><Check size={20} /> {t('diet.saved', 'Salvo!')}</>
              ) : (
                <><Check size={20} /> {t('diet.confirmAndSave', 'Confirmar e Salvar')}</>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="shrink-0 mt-10">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>
    </div>
  );
}