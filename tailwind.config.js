/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                main: '#F2F2F2',
            },
            fontFamily: {
                'open-sans': ['Open Sans', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
                lora: ['Lora', 'serif'],
            },
            backgroundImage: {
                coupon: "url('https://images.unsplash.com/photo-1687075196973-c7d04e68f4f6?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            },
        },
    },
    plugins: [],
};
