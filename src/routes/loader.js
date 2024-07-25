import apiRequest from '../utils/apiRequest';

const productLoader = async ({ params }) => {
    const { productSlug } = params;
    try {
        return (await apiRequest.get('/products/' + productSlug)).data.product;
    } catch (err) {
        return { reviews: [], tags: [], colors: [] };
    }
};

const blogLoader = async ({ params }) => {
    const { blogSlug } = params;
    try {
        return (await apiRequest.get('/blogs/' + blogSlug)).data.blog;
    } catch (err) {
        return {};
    }
};

export { productLoader, blogLoader };
