import { LitElement, html, css } from "lit";
import cssstyles from "./styles.js";
import { translations } from './translations.js';

class EmployeeTable extends LitElement {
    static properties = {
        employees: { type: Array },
        currentPage: { type: Number },
        pageSize: { type: Number },
        totalPages: { type: Number },
        editId: { type: Number },
        language: { type: String },
    };

    static styles = [cssstyles];

    constructor() {
        super();
        this.employees = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalPages = 0;
        this.editId = null;
        this.language = 'en';
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadEmployees();
    }

    async loadEmployees() {
        const stored = localStorage.getItem('employees');
        if (stored) {
            this.employees = JSON.parse(stored);
            this.totalPages = Math.ceil(this.employees.length / this.pageSize);
        }
        else {
            try {
                const response = await fetch("assets/employees.json");
                const data = await response.json();
                this.employees = data;
                this.totalPages = Math.ceil(data.length / this.pageSize);
            } catch (error) {
                console.error("Failed to fetch employee data:", error);
            }
        }
    }

    saveEmployees() {
        localStorage.setItem('employees', JSON.stringify(this.employees));
    }

    paginatedEmployees() {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.employees.slice(start, start + this.pageSize);
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    renderPageNumbers() {
        return Array.from({ length: this.totalPages }, (item, index) => index + 1).map(page => html`
            <span
              class="pagination-btn ${page === this.currentPage ? 'active' : ''}"
              @click="${() => this.goToPage(page)}"
            >
              ${page}
            </span>
          `);
    }

    addEmployee(employee) {
        employee.id = Date.now();
        this.employees = [employee, ...this.employees];
        this.totalPages = Math.ceil(this.employees.length / this.pageSize);
        this.currentPage = 1;
        this.saveEmployees();
    }

    deleteEmployee(id) {
        this.employees = this.employees.filter(emp => emp.id !== id);
        this.totalPages = Math.ceil(this.employees.length / this.pageSize);
        this.saveEmployees();
    }

    editEmployee(id, updatedEmployee) {
        this.employees = this.employees.map(emp =>
            emp.id === id ? { ...emp, ...updatedEmployee } : emp
        );
        this.saveEmployees();
    }

    formatDateForInput(date) {
        return date.split("/").reverse().join("-");
    }

    formatDateForData(date) {
        return date.split("-").reverse().join("/");
    }

    populateEditForm(id) {
        const emp = this.employees.find(e => e.id === id);
        const form = this.renderRoot.querySelector('#employee-form');
        if (form) {
            form.first_name.value = emp.first_name;
            form.last_name.value = emp.last_name;
            form.date_of_birth.value = this.formatDateForInput(emp.date_of_birth);
            form.date_of_employment.value = this.formatDateForInput(emp.date_of_employment);
            form.phone.value = emp.phone;
            form.email.value = emp.email;
            form.department.value = emp.department;
            form.position.value = emp.position;
        }
        this.editId = id;
    }

    handleAddEmployee(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const employee = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            date_of_birth: this.formatDateForData(formData.get('date_of_birth')),
            date_of_employment: this.formatDateForData(formData.get('date_of_employment')),
            phone: formData.get('phone'),
            email: formData.get('email'),
            department: formData.get('department'),
            position: formData.get('position')
        };
        if (this.editId !== null) {
            this.editEmployee(this.editId, employee);
            this.editId = null;
        } else {
            this.addEmployee(employee);
        }
        event.target.reset();
        this.closeModal("#addEditModal");
    }

    showModal(modal) {
        this.renderRoot.querySelector(modal).showModal();
    }

    closeModal(modal) {
        this.renderRoot.querySelector("#employee-form").reset();
        this.renderRoot.querySelector(modal).close();
    }

    changeLanguage(event) {
        this.language = event.target.value;
    }

    render() {
        const t = translations[this.language];
        return html`
            <header>
                <img src="assets/inglogo.svg" alt="logo" class="logo">
                <nav>
                    <button @click="${() => this.showModal("#addEditModal")}">&plus; ${t.addNew}</button>
                    <select @change="${this.changeLanguage}">
                        <option value="en" ?selected="${this.language === 'en'}">🇬🇧 English </option>
                        <option value="tr" ?selected="${this.language === 'tr'}">🇹🇷 Türkçe</option>
                    </select>
                </nav>
            </header>
            <div class="employee-container">
                <table class="emp-table">
                    <thead>
                        <tr>
                        <th>${t.firstName}</th>
                        <th>${t.lastName}</th>
                        <th>${t.dateOfBirth}</th>
                        <th>${t.employment}</th>
                        <th>${t.phone}</th>
                        <th>${t.email}</th>
                        <th>${t.department}</th>
                        <th>${t.position}</th>
                        <th>${t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.paginatedEmployees().map((emp, index) => html`
                        <tr>
                            <td data-label="${t.firstName}">${emp.first_name}</td>
                            <td data-label="${t.lastName}">${emp.last_name}</td>
                            <td data-label="${t.dateOfBirth}">${emp.date_of_birth}</td>
                            <td data-label="${t.employment}">${emp.date_of_employment}</td>
                            <td data-label="${t.phone}">${emp.phone}</td>
                            <td data-label="${t.email}">${emp.email}</td>
                            <td data-label="${t.department}">${emp.department}</td>
                            <td data-label="${t.position}">${emp.position}</td>
                            <td data-label="${t.actions}">
                            <dialog id="confirmationModal${emp.id}" class="modal">
                                <div class="modal-inner">
                                    <button autofocus @click="${() => this.closeModal(`#confirmationModal${emp.id}`)}" class="modal-close-btn">&#xd7;</button>
                                    <h3>${t.areYouSure}</h3>
                                    <p>${t.deletionConfirmationMsg(`${emp.first_name} ${emp.last_name}`)}</p>
                                    <div class="modal-actions modal-actions-vertical">
                                        <button class="btn" @click="${() => { this.deleteEmployee(emp.id); this.closeModal(`#confirmationModal${emp.id}`); }}">${t.delete}</button>
                                        <button class="btn btn-outline" @click="${() => this.closeModal(`#confirmationModal${emp.id}`)}">${t.cancel}</button>
                                    </div>
                                </div>
                            </dialog>
                            <div class="emp-table-action-btns">
                                <button @click="${() => { this.populateEditForm(emp.id); this.showModal("#addEditModal"); }}">✏️</button>
                                <button @click="${() => this.showModal(`#confirmationModal${emp.id}`)}">🗑️</button>
                            </div>
                            </td>
                        </tr>
                        `)}
                    </tbody>
                </table>

                <div class="pagination">
                    <button @click="${() => this.goToPage(this.currentPage - 1)}" class="pagination-btn">&#10094;</button>
                    ${this.renderPageNumbers()}
                    <button @click="${() => this.goToPage(this.currentPage + 1)}" class="pagination-btn">&#10095;</button>
                </div>

                <dialog id="addEditModal" class="modal">
                    <div class="modal-inner">
                        <button autofocus @click="${() => this.closeModal("#addEditModal")}" class="modal-close-btn">&#xd7;</button>
                        <h4>Add / Edit Employee</h4>
                        <form id="employee-form" @submit="${this.handleAddEmployee}">
                            <div class="form-group">
                                <label>${t.firstName}</label>
                                <input type="text" name="first_name" placeholder="${t.firstName}" required />
                            </div>
                            <div class="form-group">
                                <label>${t.lastName}</label>
                                <input type="text" name="last_name" placeholder="${t.lastName}" required />
                            </div>
                            <div class="form-group">
                                <label>${t.dateOfBirth}</label>
                                <input type="date" name="date_of_birth" placeholder="${t.dateOfBirth}" required />
                            </div>
                            <div class="form-group">
                                <label>${t.dateOfEmployment}</label>
                                <input type="date" name="date_of_employment" placeholder="${t.dateOfEmployment}" required />
                            </div>
                            <div class="form-group">
                                <label>${t.phone}</label>
                                <input type="text" name="phone" placeholder="${t.phone}" required />
                            </div>
                            <div class="form-group">
                                <label>${t.email}</label>
                                <input type="email" name="email" placeholder="${t.email}" required />
                            </div>
                            <div class="form-group">
                                <label>${t.department}</label>
                                <input type="text" name="department" placeholder="${t.department}" required />
                            </div>
                            <div class="form-group">
                                <label>${t.position}</label>
                                <input type="text" name="position" placeholder="${t.position}" required />
                            </div>
                            <button type="submit" class="btn">${t.save}</button>
                            <button class="btn btn-outline" type="button" @click="${() => this.closeModal("#addEditModal")}">${t.cancel}</button>
                        </form>
                    </div>
                </dialog>
            </div>
        `;
    }

}

customElements.define("employee-table", EmployeeTable);

export default EmployeeTable;