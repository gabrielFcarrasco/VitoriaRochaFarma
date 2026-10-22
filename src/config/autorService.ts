import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

// Exportando a interface do Autor/Configurações
export interface AutorInfo {
  nome: string;
  idade: string;
  especialidades: string[];
  textoIntro: string;
  textoFormacao: string;
  textoMissao: string;
  imagemUrl: string;
  instagramUrl: string;
  logoUrl?: string;
  chatbotName?: string;
  chatbotPrompt?: string;
  chatbotAvatar?: string;
  [key: string]: any; // Permite chaves dinâmicas dos textos da home
}

// Exportando a interface do Produto
export interface Produto {
  id?: string;
  titulo: string;
  descricao: string;
  precoOriginal?: string;
  precoAtual: string;
  emoji: string;
  destaque?: boolean;
  tipo?: string;
}

const AUTOR_DOC_ID = 'sobre_a_autora';
const PRODUTOS_COLLECTION = 'produtos';

export const autorService = {
  // --- INFORMAÇÕES DA AUTORA / HOME ---
  getAutorInfo: async (): Promise<AutorInfo | null> => {
    try {
      const docRef = doc(db, 'configuracoes', AUTOR_DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as AutorInfo;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar informações da autora:", error);
      return null;
    }
  },

  salvarAutorInfo: async (info: AutorInfo): Promise<boolean> => {
    try {
      const docRef = doc(db, 'configuracoes', AUTOR_DOC_ID);
      await setDoc(docRef, info, { merge: true });
      return true;
    } catch (error) {
      console.error("Erro ao salvar informações da autora:", error);
      return false;
    }
  },

  // --- CATÁLOGO DE PRODUTOS (NOVAS FUNÇÕES REAIS) ---
  getProdutos: async (): Promise<Produto[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, PRODUTOS_COLLECTION));
      const produtos: Produto[] = [];
      querySnapshot.forEach((docSnap) => {
        produtos.push({ id: docSnap.id, ...docSnap.data() } as Produto);
      });
      return produtos;
    } catch (error) {
      console.error("Erro ao buscar produtos do catálogo:", error);
      return [];
    }
  },

  adicionarProduto: async (produto: Produto): Promise<boolean> => {
    try {
      await addDoc(collection(db, PRODUTOS_COLLECTION), produto);
      return true;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      return false;
    }
  },

  deletarProduto: async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, PRODUTOS_COLLECTION, id));
      return true;
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      return false;
    }
  }
};