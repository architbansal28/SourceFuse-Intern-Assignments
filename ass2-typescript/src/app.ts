// import { Data } from './data.js';
// import { Table } from './table.js';

enum UserRole {
    SuperAdmin = 'SuperAdmin',
    Admin = 'Admin',
    Subscriber = 'Subscriber',
};

interface MyData {
    'First Name': string;
    'Middle Name': string;
    'Last Name': string;
    'Email': string;
    'Phone Number': string;
    'Role': UserRole;
    'Address': string;
};

class App {
    loadDataBtn: HTMLButtonElement;

    constructor() {
        this.loadDataBtn = document.getElementById('loadDataBtn') as HTMLButtonElement;
        this.loadDataBtn.addEventListener('click', this.loadData.bind(this));
    }

    private async loadData() {
        try {
            const dataFile = 'data.json';
            const response = await fetch(dataFile);
            if (!response.ok) {
                throw new Error('Error fetching data.');
            }
            const data: MyData[] = await response.json();
            
            this.changeBtnText();
            new PrintTable(data);
            
        } catch (error) {
            console.error(error);
        }

    }

    changeBtnText(): void {
        this.loadDataBtn.textContent = 'Refresh Data';
    }
}

new App();

class PrintTable {
    data: MyData[];
    tableHead: HTMLTableRowElement;
    tableBody: HTMLTableElement;

    constructor(data: MyData[]) {
        this.data = data;

        this.tableHead = document.getElementById('dataTableHead') as HTMLTableRowElement;
        this.tableHead.innerHTML = '';
        this.createHead();

        this.tableBody = document.getElementById('dataTableBody') as HTMLTableElement;
        this.tableBody.innerHTML = '';
        this.createBody();
    }

    private createHead(): void {
        const headerRow: HTMLTableRowElement = document.createElement('tr');
        Object.keys(this.data[0]).forEach((header: string) => {
            const th: HTMLTableCellElement = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
    
        const blankCol1: HTMLTableCellElement = document.createElement('th');
        headerRow.appendChild(blankCol1);
        const blankCol2: HTMLTableCellElement = document.createElement('th');
        headerRow.appendChild(blankCol2);
    
        this.tableHead.appendChild(headerRow);
    }

    private createBody(): void {
        this.data.forEach((user: MyData) => {
            const row: HTMLTableRowElement = document.createElement('tr');
    
            Object.values(user).forEach((value: string) => {
                const td: HTMLTableCellElement = document.createElement('td');
                td.textContent = value;
                td.setAttribute('contentEditable', 'false');
                row.appendChild(td);
            });
    
            // edit button functionality to edit a particular row
            const btn: HTMLTableCellElement = document.createElement('td');
            const editBtn: HTMLButtonElement = document.createElement('button');
            editBtn.id = 'editBtn';
            editBtn.className = 'btn btn-secondary';
            editBtn.textContent = 'Edit';
            btn.appendChild(editBtn);
            editBtn.addEventListener('click', () => {
                new EditTableRow(row);
            });
            row.appendChild(btn);
    
            // delete button functionality to delete a particular row
            const btn1: HTMLTableCellElement = document.createElement('td');
            const deleteBtn: HTMLButtonElement = document.createElement('button');
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
    row: HTMLTableRowElement;

    constructor(row: HTMLTableRowElement) {
        this.row = row;
        this.editRow();
    }

    // edits a particular row after clicking 'Edit' button
    private editRow(): void {
        // highlight the row which is being edited
        this.row.style.backgroundColor = 'lightblue';
       
        // make all cells editable and save their contents to retrieve later on
        const cells = Array.from(this.row.getElementsByTagName('td')).slice(0, -2);
        cells.forEach((cell: HTMLTableCellElement) => {
            cell.setAttribute('contentEditable', 'true');
            cell.dataset.originalValue = cell.textContent!;
        });
    
        // remove 'Edit' button and add 'Save' and 'Cancel' button
        const actions: HTMLTableCellElement = this.row.getElementsByTagName('td')[7];
        actions.innerHTML = '';
    
        // add 'Save' button
        const saveBtn: HTMLButtonElement = document.createElement('button');
        saveBtn.id = 'saveBtn';
        saveBtn.className = 'btn btn-secondary';
        saveBtn.textContent = 'Save';
        actions.appendChild(saveBtn);
        saveBtn.addEventListener('click', () => {
            this.saveRow();
        });
    
        // add 'Cancel' button
        const cancelBtn: HTMLButtonElement = document.createElement('button');
        cancelBtn.id = 'cancelBtn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'btn btn-secondary';
        actions.appendChild(cancelBtn);
        cancelBtn.addEventListener('click', () => {
            this.cancelRow();
        });
    }

    // saves changes to edited row
    private saveRow(): void {
        // remove highlight from row
        this.row.style.backgroundColor = '';
        
        // make all cells uneditable
        const cells = Array.from(this.row.getElementsByTagName('td')).slice(0, -2);
        cells.forEach((cell: HTMLTableCellElement) => {
            cell.setAttribute('contentEditable', 'false');
        });
    
        // remove 'Save' and 'Cancel' buttons
        const actions: HTMLTableCellElement = this.row.getElementsByTagName('td')[7];
        actions.innerHTML = '';

        // add 'Edit' button
        const editBtn: HTMLButtonElement = document.createElement('button');
        editBtn.id = 'editBtn';
        editBtn.className = 'btn btn-secondary'
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            this.editRow();
        });
        actions.appendChild(editBtn);
    }

    // cancel changes and revert to original data
    private cancelRow(): void {
        // remove highlight from row
        this.row.style.backgroundColor = '';
    
        // make all cells uneditable and retrieve original contents of cells
        const cells = Array.from(this.row.getElementsByTagName('td')).slice(0, -2);
        cells.forEach((cell: HTMLTableCellElement) => {
            cell.setAttribute('contentEditable', 'false');
            cell.textContent = cell.dataset.originalValue!;
        });
    
        // remove 'Save' and 'Cancel' buttons
        const actions: HTMLTableCellElement = this.row.getElementsByTagName('td')[7];
        actions.innerHTML = '';
        
        // add 'Edit' button
        const editBtn: HTMLButtonElement = document.createElement('button');
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
    row: HTMLTableRowElement;

    constructor(row: HTMLTableRowElement) {
        this.row = row;
        this.deleteRow();
    }

    private deleteRow(): void {
        this.row.remove();
    }
}