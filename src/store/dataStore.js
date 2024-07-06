import { create } from 'zustand';
const initPromoCode = JSON.parse(localStorage.getItem('promoCode')) || {};

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

const getActiveProducts = (products, categories, wishlist) => {
    return products
        .filter((prod) => {
            if (prod?.category?.parentId && prod?.category?.active && prod?.active) {
                const parentCate = categories.find((cate) => cate._id == prod?.category?.parentId);
                if (parentCate) return parentCate?.active;
                return false;
            }
            return prod?.category?.active && prod?.active;
        })
        .map((prod) => {
            let isInWishlist = false;
            for (const item of wishlist) {
                if (item?.product?._id == prod._id) {
                    isInWishlist = true;
                    break;
                }
            }
            return { ...prod, isInWishlist };
        });
};

const getCategoryTree = (categories) => {
    const categoryMap = {};
    categories.forEach((cate) => (categoryMap[cate._id] = { ...cate, child: [], selected: false }));

    const categoryTree = [];
    categories.forEach((cate) => {
        if (cate.parentId === '') {
            categoryTree.push(categoryMap[cate._id]);
        } else {
            categoryMap[cate.parentId]?.child.push(categoryMap[cate._id]);
        }
    });
    return categoryTree;
};

const useDataStore = create((set) => ({
    products: [],
    categories: [],
    wishlist: [],
    blogs: [],
    promoCode: initPromoCode,
    categoryTree: [],
    setProducts: (_products) =>
        set((state) => ({ products: getActiveProducts(_products, state.categories, state.wishlist) })),
    setCategories: (_categories) =>
        set(() => ({
            categories: getActiveCategories(_categories),
            categoryTree: getCategoryTree(getActiveCategories(_categories)),
        })),
    setCategoryTree: (_categoryTree) => set(() => ({ categoryTree: _categoryTree })),
    setPromoCode: (_promoCode) => {
        set(() => ({ promoCode: _promoCode }));
        localStorage.setItem('promoCode', JSON.stringify(_promoCode));
    },
    setWishlist: (_wishlist) => set(() => ({ wishlist: _wishlist })),
    setBlogs: (_blogs) => set(() => ({ blogs: _blogs })),
}));

// eslint-disable-next-line react-hooks/rules-of-hooks
export default useDataStore;
