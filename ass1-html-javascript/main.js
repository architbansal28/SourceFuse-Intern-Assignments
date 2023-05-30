import Data from "./data.js";
import Table from "./table.js";

async function loadData() {
    try {
        const dataFile = "data.json";
        const data = await Data.getData(dataFile);

        const loadDataBtn1 = document.getElementById("loadDataBtn");
        loadDataBtn1.textContent = "Refresh Data";

        Table.printData(data);

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

const loadDataBtn = document.getElementById("loadDataBtn");
loadDataBtn.addEventListener("click", loadData);
