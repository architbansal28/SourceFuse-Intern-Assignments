function getData() {
    const btn = document.querySelector("#btn");
    btn.textContent = "Refresh Data";

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            printData(data);
        })
        .catch(error => console.log(error));

}

// prints all users data to table
function printData(data) {
    const table = document.querySelector("#table tbody");
    table.innerHTML = "";
    
    data.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td contenteditable='false'>${user.firstName}</td>
            <td contenteditable='false'>${user.middleName}</td>
            <td contenteditable='false'>${user.lastName}</td>
            <td contenteditable='false'>${user.email}</td>
            <td contenteditable='false'>${user.phoneNumber}</td>
            <td contenteditable='false'>${user.role}</td>
            <td contenteditable='false'>${user.address}</td>
            <td><button class="btn btn-secondary" id="editBtn">Edit</button></td>
            <td><button class="btn btn-secondary" id="deleteBtn">Delete</button></td>
        `;
        table.appendChild(row);

        // edit button functionality to edit a particular row
        const editBtn = row.querySelector("#editBtn");
        editBtn.addEventListener("click", () => {
            editData(row);
        });

        // delete button functionality to delete a particular row
        const deleteBtn = row.querySelector("#deleteBtn");
        deleteBtn.addEventListener("click", () => {
            row.remove();
        });
    });
 
}

// edits a particular row after clicking 'Edit' button
function editData(row) {
    // highlight the row which is being edited
    row.style.backgroundColor = "lightblue";
   
    // make all cells editable and save their contents to retrieve later on
    const cells = row.querySelectorAll("td[contenteditable='false']");
    cells.forEach(cell => {
        cell.contentEditable = true;
        cell.dataset.originalValue = cell.textContent;
    });

    // remove 'Edit' button and add 'Save' and 'Cancel' button
    const actions = row.querySelector("td:nth-of-type(8)");
    actions.innerHTML = "";

    // add 'Save' button
    const saveBtn = document.createElement("button");
    saveBtn.id = "saveBtn";
    saveBtn.className = "btn btn-secondary";
    saveBtn.textContent = "Save";
    actions.appendChild(saveBtn);
    saveBtn.addEventListener("click", () => {
        saveData(row);
    });

    // add 'Cancel' button
    const cancelBtn = document.createElement("button");
    cancelBtn.id = "cancelBtn";
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "btn btn-secondary";
    actions.appendChild(cancelBtn);
    cancelBtn.addEventListener("click", () => {
        cancelSave(row);
    });
}

// saves changes to edited row
function saveData(row) {
    // remove highlight from row
    row.style.backgroundColor = "";
    
    // make all cells uneditable
    const cells = row.querySelectorAll("td[contenteditable='true']");
    cells.forEach(cell => {
        cell.contentEditable = false;
    });

    // remove 'Save' and 'Cancel' buttons
    // add 'Edit' button
    const actions = row.querySelector("td:nth-of-type(8)");
    actions.innerHTML = "";
    const editBtn = document.createElement("button");
    editBtn.id = "editBtn";
    editBtn.className = "btn btn-secondary"
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
        editData(row);
    });
    actions.appendChild(editBtn);

}

// cancel changes and revert to original data
function cancelSave(row) {
    // remove highlight from row
    row.style.backgroundColor = "";

    // make all cells uneditable and retrieve original contents of cells
    const cells = row.querySelectorAll("td[contenteditable='true']");
    cells.forEach(cell => {
        cell.contentEditable = false;
        cell.textContent = cell.dataset.originalValue;
    });

    // remove 'Save' and 'Cancel' buttons
    // add 'Edit' button
    const actions = row.querySelector("td:nth-of-type(8)");
    actions.innerHTML = "";
    const editBtn = document.createElement("button");
    editBtn.id = "editBtn";
    editBtn.className = "btn btn-secondary"
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
        editData(row);
    });
    actions.appendChild(editBtn);

}
