import { expect } from 'chai';
import '../src/employee-table.js';
import { fixture } from '@open-wc/testing';

describe('<employee-table>', () => {
  let el;

  const sampleEmployee = {
    id: 123,
    first_name: 'Alice',
    last_name: 'Smith',
    date_of_birth: '01/01/1990',
    date_of_employment: '01/01/2020',
    phone: '+(90) 555 111 22 33',
    email: 'alice@example.com',
    department: 'Software',
    position: 'Junior',
  };

  beforeEach(async () => {
    localStorage.clear();
    el = await fixture('<employee-table></employee-table>');
  });

  it('should add an employee to the beginning of the list', () => {
    el.addEmployee({ ...sampleEmployee, first_name: "New" });
    expect(el.employees[0].first_name).to.equal('New');
  });

  it('should edit an existing employee by ID', () => {
    el.addEmployee({ ...sampleEmployee, first_name: "New2" });
    el.editEmployee(el.employees[0].id, { first_name: 'Updated' });
    expect(el.employees[0].first_name).to.equal('Updated');
  });

  it('should delete an employee by ID', () => {
    el.addEmployee({ ...sampleEmployee, id: 3 });
    el.deleteEmployee(3);
    expect(el.employees.length).to.equal(1);
  });

  it('should navigate to a valid page', () => {
    for (let i = 0; i < 25; i++) {
      el.addEmployee({ ...sampleEmployee, first_name: "New" + i });
    }
    el.goToPage(2);
    expect(el.currentPage).to.equal(2);
  });

  it('should render correct number of page buttons', async () => {
    for (let i = 0; i < 25; i++) {
      el.addEmployee({ ...sampleEmployee, id: i + 5000 });
    }

    await el.updateComplete;

    const pageButtons = el.renderPageNumbers();
    const pageArray = [...pageButtons];

    expect(pageArray.length).to.equal(el.totalPages);
  });
});
