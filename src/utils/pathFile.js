const pathFile = (filePath) => {
    const path = import.meta.env.VITE_SERVER_URL + filePath;
    return filePath ? path : '';
};

export default pathFile;
