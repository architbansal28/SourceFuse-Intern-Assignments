"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var UserRole;
(function (UserRole) {
    UserRole["SuperAdmin"] = "SuperAdmin";
    UserRole["Admin"] = "Admin";
    UserRole["Subscriber"] = "Subscriber";
})(UserRole || (UserRole = {}));
;
;
class App {
    constructor() {
        this.loadDataBtn = document.getElementById('loadDataBtn');
        this.loadDataBtn.addEventListener('click', this.loadData.bind(this));
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataFile = 'data.json';
                const response = yield fetch(dataFile);
                if (!response.ok) {
                    throw new Error('Error fetching data.');
                }
                const data = yield response.json();
                this.changeBtnText();
                new PrintTable(data);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    changeBtnText() {
        this.loadDataBtn.textContent = 'Refresh Data';
    }
}
new App();
class PrintTable {
    constructor(data) {
        this.data = data;
        this.tableHead = document.getElementById('dataTableHead');
        this.tableHead.innerHTML = '';
        this.createHead();
        this.tableBody = document.getElementById('dataTableBody');
        this.tableBody.innerHTML = '';
        this.createBody();
    }
    createHead() {
        const headerRow = document.createElement('tr');
        Object.keys(this.data[0]).forEach((header) => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        const blankCol1 = document.createElement('th');
        headerRow.appendChild(blankCol1);
        const blankCol2 = document.createElement('th');
        headerRow.appendChild(blankCol2);
        this.tableHead.appendChild(headerRow);
    }
    createBody() {
        this.data.forEach((user) => {
            const row = document.createElement('tr');
            Object.values(user).forEach((value) => {
                const td = document.createElement('td');
                td.textContent = value;
                td.setAttribute('contentEditable', 'false');
                row.appendChild(td);
            });
            const btn = document.createElement('td');
            const editBtn = document.createElement('button');
            editBtn.id = 'editBtn';
            editBtn.className = 'btn btn-secondary';
            editBtn.textContent = 'Edit';
            btn.appendChild(editBtn);
            editBtn.addEventListener('click', () => {
                new EditTableRow(row);
            });
            row.appendChild(btn);
            const btn1 = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.id = 'deleteBtn';
            deleteBtn.className = 'btn btn-secondary';
            deleteBtn.textContent = 'Delete';
            btn1.appendChild(deleteBtn);
            deleteBtn.addEventListener('click', () => {
                new DeleteTableRow(row);
            });
            row.appendChild(btn1);
            this.tableBody.appendChild(row);
        });
    }
}
class EditTableRow {
    constructor(row) {
        this.row = row;
        this.editRow();
    }
    editRow() {
        this.row.style.backgroundColor = 'lightblue';
        const cells = Array.from(this.row.getElementsByTagName('td')).slice(0, -2);
        cells.forEach((cell) => {
            cell.setAttribute('contentEditable', 'true');
            cell.dataset.originalValue = cell.textContent;
        });
        const actions = this.row.getElementsByTagName('td')[7];
        actions.innerHTML = '';
        const saveBtn = document.createElement('button');
        saveBtn.id = 'saveBtn';
        saveBtn.className = 'btn btn-secondary';
        saveBtn.textContent = 'Save';
        actions.appendChild(saveBtn);
        saveBtn.addEventListener('click', () => {
            this.saveRow();
        });
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancelBtn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'btn btn-secondary';
        actions.appendChild(cancelBtn);
        cancelBtn.addEventListener('click', () => {
            this.cancelRow();
        });
    }
    saveRow() {
        this.row.style.backgroundColor = '';
        const cells = Array.from(this.row.getElementsByTagName('td')).slice(0, -2);
        cells.forEach((cell) => {
            cell.setAttribute('contentEditable', 'false');
        });
        const actions = this.row.getElementsByTagName('td')[7];
        actions.innerHTML = '';
        const editBtn = document.createElement('button');
        editBtn.id = 'editBtn';
        editBtn.className = 'btn btn-secondary';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            this.editRow();
        });
        actions.appendChild(editBtn);
    }
    cancelRow() {
        this.row.style.backgroundColor = '';
        const cells = Array.from(this.row.getElementsByTagName('td')).slice(0, -2);
        cells.forEach((cell) => {
            cell.setAttribute('contentEditable', 'false');
            cell.textContent = cell.dataset.originalValue;
        });
        const actions = this.row.getElementsByTagName('td')[7];
        actions.innerHTML = '';
        const editBtn = document.createElement('button');
        editBtn.id = 'editBtn';
        editBtn.className = 'btn btn-secondary';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            this.editRow();
        });
        actions.appendChild(editBtn);
    }
}
class DeleteTableRow {
    constructor(row) {
        this.row = row;
        this.deleteRow();
    }
    deleteRow() {
        this.row.remove();
    }
}
//# sourceMappingURL=app.js.map