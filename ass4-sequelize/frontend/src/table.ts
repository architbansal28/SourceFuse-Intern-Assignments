import { DataSource } from './datasource';

export class Table<T> {
    data: T[];
    header: Header<T>;
    rows: Row<T>[];

    constructor(data: DataSource<T>) {
        this.data = data.getData();
        this.header = new Header<T>(data);
        this.rows = [];
        this.createRow();
    }

    private createRow(): void {
        const tableBody = document.getElementById('dataTableBody')!;
        tableBody.innerHTML = '';

        this.data.forEach((user: T) => {
            const row = new Row<T>(this, user);
            this.rows.push(row);
        });
        
    }

    saveRow(row: Row<T>, updatedUser: T): void {
        const index = this.rows.indexOf(row);  
        const id = (updatedUser as any).id;   
    
        // Send PUT request to update user data
        fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('User updated:', data);
        })
        .catch((error) => {
            console.error('Error updating user:', error);
        });
    }

    removeRow(row: Row<T>): void {
        const index = this.rows.indexOf(row);  
        const id = (row.user as any).id;      

        fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (response.ok) {
                this.rows.splice(index, 1);
                const tableBody = document.getElementById('dataTableBody')!;
                const rowElement = row.getElement();
                tableBody.removeChild(rowElement);
                console.log('User deleted');
            } else {
                throw new Error('Failed to delete user');
            }
        })
        .catch((error) => {
            console.error('Error deleting user:', error);
        });

    }
    
}

class Header<T> {
    data: string[];

    constructor(data: DataSource<T>) {
        this.data = data.getFieldNames();
        this.createHeader();   
    }

    private createHeader(): void {
        const headerRow = document.getElementById('dataTableHead')!;
        headerRow.innerHTML = '';

        const newHeader: HTMLTableRowElement = document.createElement('tr');
        this.data.forEach((header: string) => {
            const th: HTMLTableCellElement = document.createElement('th');
            th.textContent = header.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            newHeader.appendChild(th);
        });
    
        const blankCol1: HTMLTableCellElement = document.createElement('th');
        newHeader.appendChild(blankCol1);
        const blankCol2: HTMLTableCellElement = document.createElement('th');
        newHeader.appendChild(blankCol2);
    
        headerRow.appendChild(newHeader);
    }
}

enum ActionBtn {
    edit = 'edit',
    delete = 'delete'
};

class Row<T> {
    user: T;
    private table: Table<T>;
    cells: Cell<T>[];
    private actions: [Action<T>, Action<T>];
    private element: HTMLTableRowElement;

    constructor(table: Table<T>, user: T) {
        this.user = user;
        this.table = table;
        this.cells = [];
        this.element = document.createElement('tr');
        
        this.table.header.data.forEach((fieldName: string) => {
            const cellData = (this.user as Record<string, string>)[fieldName] || '';
            const cell = new Cell<T>(this, cellData, fieldName);
            this.cells.push(cell);
            this.element.appendChild(cell.getElement());
        });

        const action1 = new Action<T>(this, ActionBtn.edit);
        this.element.appendChild(action1.getElement());

        const action2 = new Action<T>(this, ActionBtn.delete);
        this.element.appendChild(action2.getElement());

        this.actions = [action1, action2];

        const tableBody = document.getElementById('dataTableBody')!;
        tableBody.appendChild(this.element);
    }

    getTable(): Table<T> {
        return this.table;
    }

    getElement(): HTMLTableRowElement {
        return this.element;
    }

    editRow(): void {
        this.cells.forEach((cell) => {
            cell.makeEditable();
        });
    
        this.element.style.backgroundColor = 'lightblue';
    
        const editButton = this.actions[0].getEditButton()!;
        const saveButton = this.actions[0].getSaveButton()!;
        const cancelButton = this.actions[0].getCancelButton()!;
    
        editButton.style.display = 'none';
        saveButton.style.display = 'inline';
        cancelButton.style.display = 'inline';
    }

    saveRow(): void {
        const editButton = this.actions[0].getEditButton()!;
        const saveButton = this.actions[0].getSaveButton()!;
        const cancelButton = this.actions[0].getCancelButton()!;

        const updatedUser: any = {};
        this.cells.forEach((cell) => {
            updatedUser[cell.fieldName] = cell.getElement().textContent || '';
            cell.saveOriginalValue();
            cell.makeReadOnly();
        });

        this.getTable().saveRow(this, updatedUser);
    
        editButton.style.display = 'inline';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
    
        this.element.style.backgroundColor = '';
    
    }

    cancelEdit(): void {
        const editButton = this.actions[0].getEditButton()!;
        const saveButton = this.actions[0].getSaveButton()!;
        const cancelButton = this.actions[0].getCancelButton()!;
    
        editButton.style.display = 'inline';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
    
        this.cells.forEach((cell) => {
            cell.cancelEdit();
        });
    
        this.element.style.backgroundColor = '';
    
    }
   
}

class Cell<T> {
    private row: Row<T>;
    private element: HTMLTableCellElement;
    fieldName: string;
    private originalValue: any;

    constructor(row: Row<T>, data: any, fieldName: string) {
        this.row = row;
        this.element = document.createElement('td');
        this.fieldName = fieldName;
        this.element.textContent = data;
        this.originalValue = this.element.textContent || '';
    }

    getElement(): HTMLTableCellElement {
        return this.element;
    }

    makeEditable(): void {
        this.element.contentEditable = 'true';
    }

    makeReadOnly(): void {
        this.element.contentEditable = 'false';
    }

    saveOriginalValue(): void {
        this.originalValue = this.element.textContent || '';
    }

    cancelEdit(): void {
        this.element.textContent = this.originalValue;
    }
}

class Action<T> {
    private row: Row<T>;
    private element: HTMLTableCellElement;
    private editBtn: HTMLButtonElement;
    private saveBtn: HTMLButtonElement;
    private cancelBtn: HTMLButtonElement;
    private deleteBtn: HTMLButtonElement;

    constructor(row: Row<T>, type: ActionBtn) {
        this.row = row;
        this.element = document.createElement('td');

        this.editBtn = document.createElement('button');
        this.saveBtn = document.createElement('button');
        this.cancelBtn = document.createElement('button');
        this.deleteBtn = document.createElement('button');
        
        if (type === ActionBtn.edit) {
            this.editBtn.className = 'btn btn-secondary';
            this.editBtn.textContent = 'Edit';
            this.editBtn.addEventListener('click', () => {
                this.row.editRow();
            });
            this.element.appendChild(this.editBtn);

            this.saveBtn.className = 'btn btn-secondary';
            this.saveBtn.textContent = 'Save';
            this.saveBtn.style.display = 'none';
            this.saveBtn.addEventListener('click', () => {
                this.row.saveRow();
            });
            this.element.appendChild(this.saveBtn);

            this.cancelBtn.className = 'btn btn-secondary';
            this.cancelBtn.textContent = 'Cancel';
            this.cancelBtn.style.display = 'none';
            this.cancelBtn.addEventListener('click', () => {
                this.row.cancelEdit();
            });
            this.element.appendChild(this.cancelBtn);

        } else if (type === ActionBtn.delete) {
            this.deleteBtn.className = 'btn btn-secondary';
            this.deleteBtn.textContent = 'Delete';
            this.deleteBtn.addEventListener('click', () => {
                this.row.getTable().removeRow(this.row);
            });
            this.element.appendChild(this.deleteBtn);

        }
    }

    getElement(): HTMLTableCellElement {
        return this.element;
    }

    getEditButton(): HTMLButtonElement | null {
        return this.editBtn;
    }
    
    getSaveButton(): HTMLButtonElement | null {
        return this.saveBtn;
    }
    
    getCancelButton(): HTMLButtonElement | null {
        return this.cancelBtn;
    }

}

