// src/services/produtoService.ts
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const produtoService = {
  async getProdutoPorId(id: string) {
    // 1. Se for um produto de exemplo da home, retornamos os dados correspondentes
    if (id === 'exemplo-1' || !id) {
      return {
        id: 'exemplo-1',
        titulo: "E-book Psicofármacos na Prática",
        descricao: "Guia completo de antidepressivos, estabilizadores, antipsicóticos e manejo em saúde mental.",
        precoOriginal: "R$ 67,90",
        precoAtual: "R$ 47,90",
        emoji: "📘"
      };
    }
    if (id === 'exemplo-2') {
      return {
        id: 'exemplo-2',
        titulo: "Flashcards de Saúde Mental",
        descricao: "Estudo ativo comprovado pela neurociência para fixar doses, reações e mecanismos de ação.",
        precoAtual: "R$ 29,90",
        emoji: "🎯"
      };
    }

    // 2. Caso contrário, buscamos o produto real diretamente do Firestore (cadastrado por si no Admin)
    try {
      const docRef = doc(db, "produtos", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();
        return {
          id: docSnap.id,
          titulo: dados.titulo || "Material Clínico Especializado",
          descricao: dados.descricao || "Conteúdo exclusivo voltado para a prática e estudos em psicofarmacologia.",
          precoOriginal: dados.precoOriginal || "",
          precoAtual: dados.precoAtual || "R$ 49,90",
          emoji: dados.emoji || "📚"
        };
      }
    } catch (error) {
      console.error("Erro ao buscar produto real do banco:", error);
    }

    // 3. Fallback genérico caso o ID não seja encontrado
    return {
      id,
      titulo: "Material Clínico Especializado",
      descricao: "Conteúdo exclusivo voltado para a prática e estudos em psicofarmacologia.",
      precoAtual: "R$ 49,90",
      emoji: "📚"
    };
  }
};