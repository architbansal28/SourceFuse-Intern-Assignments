export class DataSource<T> {
    private data: T[];
    private fieldNames: string[];
  
    constructor() {
        this.data = [];
        this.fieldNames = [];
    }
  
    async fetchData(path: string): Promise<void> {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('Error fetching data.');
        }
        this.data = await response.json();
        console.log(this.data);
        
        this.processFieldNames();
    }

    private processFieldNames(): void {
        const allFieldNames = new Set<string>();
      
        this.data.forEach((user: any) => {
            Object.keys(user).forEach((fieldName) => {
                allFieldNames.add(fieldName);
            });
        });
      
        this.fieldNames = Array.from(allFieldNames);
    }
    
    getFieldNames(): string[] {
        return this.fieldNames;
    }
  
    getData(): T[] {
        return this.data;
    }
}
  