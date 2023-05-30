class Table {

    static printData(data) {
        // create table header
        const tableHead = document.getElementById("dataTableHead");
        tableHead.innerHTML = "";
    
        const headerRow = document.createElement("tr");
        Object.keys(data[0]).forEach(header => {
            const th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
        });
    
        const blankCol1 = document.createElement("th");
        headerRow.appendChild(blankCol1);
        const blankCol2 = document.createElement("th");
        headerRow.appendChild(blankCol2);
    
        tableHead.appendChild(headerRow);
    
        // create table body/rows
        const tableBody = document.getElementById("dataTableBody");
        tableBody.innerHTML = "";
        
        data.forEach((user, index) => {
            const row = document.createElement("tr");
    
            Object.values(user).forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                td.contentEditable = false;
                row.appendChild(td);
            });
    
            // edit button functionality to edit a particular row
            const btn = document.createElement("td");
            const editBtn = document.createElement("button");
            editBtn.id = "editBtn";
            editBtn.className = "btn btn-secondary";
            editBtn.textContent = "Edit";
            btn.appendChild(editBtn);
            editBtn.addEventListener("click", () => {
                this.editData(row);
            });
            row.appendChild(btn);
    
            // delete button functionality to delete a particular row
            const btn1 = document.createElement("td");
            const deleteBtn = document.createElement("button"); 
            deleteBtn.id = "deleteBtn";
            deleteBtn.className = "btn btn-secondary";
            deleteBtn.textContent = "Delete";
            btn1.appendChild(deleteBtn);
            deleteBtn.addEventListener("click", () => {
                row.remove();
            });
            row.appendChild(btn1);
    
            tableBody.appendChild(row);
        });
     
    }
    
    // edits a particular row after clicking 'Edit' button
    static editData(row) {
        // highlight the row which is being edited
        row.style.backgroundColor = "lightblue";
       
        // make all cells editable and save their contents to retrieve later on
        const cells = Array.from(row.getElementsByTagName("td")).slice(0, -2);
        cells.forEach(cell => {
            cell.contentEditable = true;
            cell.dataset.originalValue = cell.textContent;
        });
    
        // remove 'Edit' button and add 'Save' and 'Cancel' button
        const actions = row.getElementsByTagName("td")[7];
        actions.innerHTML = "";
    
        // add 'Save' button
        const saveBtn = document.createElement("button");
        saveBtn.id = "saveBtn";
        saveBtn.className = "btn btn-secondary";
        saveBtn.textContent = "Save";
        actions.appendChild(saveBtn);
        saveBtn.addEventListener("click", () => {
            this.saveData(row);
        });
    
        // add 'Cancel' button
        const cancelBtn = document.createElement("button");
        cancelBtn.id = "cancelBtn";
        cancelBtn.textContent = "Cancel";
        cancelBtn.className = "btn btn-secondary";
        actions.appendChild(cancelBtn);
        cancelBtn.addEventListener("click", () => {
            this.cancelSave(row);
        });
    }
    
    // saves changes to edited row
    static saveData(row) {
        // remove highlight from row
        row.style.backgroundColor = "";
        
        // make all cells uneditable
        const cells = Array.from(row.getElementsByTagName("td")).slice(0, -2);
        cells.forEach(cell => {
            cell.contentEditable = false;
        });
    
        // remove 'Save' and 'Cancel' buttons
        // add 'Edit' button
        const actions = row.getElementsByTagName("td")[7];
        actions.innerHTML = "";
        const editBtn = document.createElement("button");
        editBtn.id = "editBtn";
        editBtn.className = "btn btn-secondary"
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => {
            this.editData(row);
        });
        actions.appendChild(editBtn);
    
    }
    
    // cancel changes and revert to original data
    static cancelSave(row) {
        // remove highlight from row
        row.style.backgroundColor = "";
    
        // make all cells uneditable and retrieve original contents of cells
        const cells = Array.from(row.getElementsByTagName("td")).slice(0, -2);
        cells.forEach(cell => {
            cell.contentEditable = false;
            cell.textContent = cell.dataset.originalValue;
        });
    
        // remove 'Save' and 'Cancel' buttons
        // add 'Edit' button
        const actions = row.getElementsByTagName("td")[7];
        actions.innerHTML = "";
        const editBtn = document.createElement("button");
        editBtn.id = "editBtn";
        editBtn.className = "btn btn-secondary"
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => {
            this.editData(row);
        });
        actions.appendChild(editBtn);
    
    }
}

export default Table;