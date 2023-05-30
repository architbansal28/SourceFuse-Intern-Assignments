class Data {
    static async getData(file) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error("Error fetching data.");
            }
            const data = await response.json();
            return data; 
        } catch (error) {
            console.log(error);
        }
    }
}

export default Data;