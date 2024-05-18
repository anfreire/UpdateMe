import {create} from 'zustand';
import { useVersions } from '../computed/versions';

const INDEX_URL = 'https://raw.githubusercontent.com/anfreire/updateMe/gh-pages/scripts/index2.json';
const CATEGORIES_URL =
  'https://raw.githubusercontent.com/anfreire/updateMe/gh-pages/scripts/categories.json';

export interface AppProviderProps {
  packageName: string;
  source: string;
  version: string;
  link: string;
  download: string;
  sha256: string;
  safe: boolean;
}

export interface AppProps {
  icon: string;
  providers: Record<string, AppProviderProps>;
  depends: string[];
  complements: string[];
  features: string[];
}

export type IndexProps = Record<string, AppProps>;

export type CategoriesProps = Record<
  string,
  {
    apps: string[];
    icon: string;
    type: undefined | string;
  }
>;

interface useIndexProps {
  index: IndexProps;
  categories: CategoriesProps;
  fetchIndex: () => Promise<boolean>;
  fetchCategories: () => Promise<boolean>;
  fetchAll: () => Promise<boolean>;
  isLoaded: boolean;
}

const getIndex = async () => {
  try {
    const response = await fetch(INDEX_URL);
    return await response.json();
  } catch (error) {
    return null;
  }
};

const getCategories = async () => {
  try {
    const response = await fetch(CATEGORIES_URL);
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const useIndex = create<useIndexProps>((set, get) => ({
  index: {},
  categories: {},
  isLoaded: false,
  fetchIndex: async () => {
    set({isLoaded: false, index: {}});
    const data = await getIndex();
    if (!data) return false;
    set({isLoaded: true, index: data});
    return true;
  },
  fetchCategories: async () => {
    set({isLoaded: false, categories: {}});
    const data = await getCategories();
    if (!data) return false;
    set({isLoaded: true, categories: data});
    return true;
  },
  fetchAll: async () => {
    set({isLoaded: false, index: {}, categories: {}});
    const index = await getIndex();
    const categories = await getCategories();
    if (!index || !categories) return false;
    set({isLoaded: true, index, categories});
    await useVersions.getState().refresh();
    return true;
  },
}));
