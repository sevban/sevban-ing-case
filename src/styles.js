import { css } from "lit";

const cssstyles = css`
    :host {
        display: block;
    }

    :host * {
        box-sizing: border-box;
    }

    header {
        display: flex;
        justify-content: space-between;
        background: #fff;
        padding: 20px;
    }

    header nav {
        display: flex;
        justify-content: flex-end;
        gap: 5px;
    }

    header .logo {
        max-width: 100px;
    }
    
    header button {
        color: #FF6200;
        padding: 5px;
        border: 1px solid #fff;
    }

    header button:hover {
        border: 1px solid #FF6200;
    }

    .employee-container {
        background: #f8f8f8;
        padding: 40px;
        display: block;
    }
    
    .emp-table {
        width: 100%;
        border-collapse: collapse;
    }

    .emp-table th,
    .emp-table td {
        border-bottom: 1px solid #f3f3f3;
        padding: 20px;
        text-align: left;
        background: #fff;
    }

    .emp-table th {
        font-size: 14px;
        color: #FF8940;
    }

    .emp-table-action-btns {
        display: flex;
        gap: 5px;
    }

    @media (max-width: 1200px) {
        .emp-table thead {
            display: none;
        }

        .emp-table tr {
            display: grid;
            grid-template-columns: repeat(2, 1fr); 
            margin-bottom: 40px;
        }

        .emp-table td {
            display: flex;
            gap: 10px;
            padding: 10px;
            border: 1px solid #f3f3f3;
        }

        .emp-table td::before {
            content: attr(data-label);
            font-weight: bold;
            display: block;
            color: #FF6200;
        }
    }

    @media (max-width: 640px) {
        .emp-table tr {
            display: grid;
            grid-template-columns: repeat(1, 1fr); 
            margin-bottom: 40px;
        }
    }

    .pagination {
        margin-top: 40px;
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .pagination-btn {
        cursor: pointer;
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: transparent;
    }

    .pagination-btn:hover {
        background: #ddd;
    }

    .pagination-btn.active {
        background: #FF6200;
        color: #fff;
    }

    button {
        cursor: pointer;
        border: 0;
        background: transparent;
    }

    .modal {
        z-index: 100;
        width: 100%;
        min-width: 360px;
        max-width: 600px;
        padding: 0;
        border: 0;
        border-radius: 4px;
        box-shadow: 0 0 15px 0 rgba(0,0,0,0.2);
    }

    .modal h4 {
        color: #FF6200;
    }

    .modal::backdrop {
        background: rgba(0,0,0,0.5);
    }

    .modal-inner {
        position: relative;
        padding: 20px;
    }

    .modal-close-btn {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 24px;
        color: #FF6200;
    }

    .modal-actions {
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .modal-actions.modal-actions-vertical {
        flex-direction: column;
    }

    .modal-actions.modal-actions-vertical btn {
        display: block;
        width: 100%;
    }

    dialog[id^="confirmationModal"] {
        max-width: 400px;
    }

    #employee-form {
        display: grid;
        grid-template-columns: repeat(2, 1fr); 
        gap: 20px;
    }

    #employee-form .btn {
        width: 100%;
        display: block;
    }

    .form-group input {
        display: block;
        width: 100%;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-size: 14px;
    }

    .btn {
        background: #FF6200;
        display: inline-block;
        padding: 10px 20px;
        border: 1px solid #FF6200;
        color: #fff;
        border-radius: 4px;
    }

    .btn.btn-outline {
        background: #fff;
        color: #6867A6;
        border-color: #6867A6;
    }

    .btn:hover {
        border-color: #000;
    }

    input[type="text"],
    input[type="email"],
    input[type="date"] {
        border: 1px solid #ddd;
        padding: 8px 10px;
        font-size: 14px;
    }

    input:focus {
        border: #bbb;
    }

    h3, h4 {
        margin: 0 0 20px 0;
        color: #FF6200;
    }
`;

export default cssstyles;