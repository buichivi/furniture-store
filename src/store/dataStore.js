import { create } from 'zustand';

// Hàm lọc các danh mục
const getActiveCategories = (categories) => {
    // Lọc ra các category có active và cha cũng active
    return categories.filter((category) => {
        if (category.parentId && category.active) {
            const parent = categories.find((cate) => cate._id == category.parentId);
            if (parent) return parent.active;
        }
        return category.active;
    });
};

const getActiveProducts = (products, categories) => {
    return products.filter((prod) => {
        if (prod?.category?.parentId && prod?.category?.active && prod?.active) {
            const parentCate = categories.find((cate) => cate._id == prod?.category?.parentId);
            if (parentCate) return parentCate?.active;
            return false;
        }
        return prod?.category?.active && prod?.active;
    });
};

const useDataStore = create((set, get) => ({
    products: [],
    categories: [],
    promoCode: {},
    setProducts: (_products) => set((state) => ({ products: getActiveProducts(_products, state.categories) })),
    setCategories: (_categories) => set(() => ({ categories: getActiveCategories(_categories) })),
    setPromoCode: (_promoCode) => set(() => ({ promoCode: _promoCode })),
    getNavigationPath: (item, type) => {
        let paths = '/shop';
        const categories = get().categories;
        if (type == 'category') {
            if (item.parentId) {
                const parent = categories.find((cate) => cate._id == item.parentId);
                if (parent) paths += '/' + parent.slug;
            }
            paths += '/' + item.slug;
        } else if (type == 'product') {
            const productCate = categories.find((cate) => cate?._id == item?.category?._id);
            if (productCate?.parentId) {
                const parent = categories.find((cate) => cate?._id == productCate?.parentId);
                if (parent) paths += '/' + parent?.slug;
            }
            paths += '/' + productCate?.slug;
            paths += '/' + item?.slug;
        }
        return paths;
    },
}));

// eslint-disable-next-line react-hooks/rules-of-hooks
export default useDataStore;
