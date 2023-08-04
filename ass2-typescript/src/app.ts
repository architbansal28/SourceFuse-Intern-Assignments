import { DataSource } from './datasource';
import { Table } from './table';

class App {
    private loadDataBtn: HTMLButtonElement;

    constructor() {
        this.loadDataBtn = document.getElementById('loadDataBtn') as HTMLButtonElement;
        this.loadDataBtn.addEventListener('click', this.loadData.bind(this));
    }

    private async loadData() {
        const dataSource = new DataSource();
        await dataSource.fetchData('data.json');

        this.changeBtnText();
        new Table(dataSource);
    }

    private changeBtnText(): void {
        this.loadDataBtn.textContent = 'Refresh Data';
    }
}

new App();
