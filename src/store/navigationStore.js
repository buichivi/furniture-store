import { create } from 'zustand';

const useCategoryStore = create((set, get) => ({
    categories: [],
    setCategories: (categories) => set(() => ({ categories: categories })),
    getNavigationPath: (item, type) => {
        let paths = '/shop';
        const categories = get().categories;
        if (type == 'category') {
            if (item.parentId) {
                const parent = categories.find((cate) => cate._id == item.parentId);
                paths += '/' + parent.slug;
            }
            paths += '/' + item.slug;
        } else if (type == 'product') {
            const productCate = categories.find((cate) => cate?._id == item?.category?._id);
            if (productCate?.parentId) {
                const parent = categories.find((cate) => cate?._id == productCate?.parentId);
                paths += '/' + parent?.slug;
            }
            paths += '/' + productCate?.slug;
            paths += '/' + item?.slug;
        }
        return paths;
    },
}));

// eslint-disable-next-line react-hooks/rules-of-hooks
export default useCategoryStore;
