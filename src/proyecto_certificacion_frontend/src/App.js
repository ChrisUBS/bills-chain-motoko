import { html, render } from 'lit-html';
import { proyecto_certificacion_backend } from 'declarations/proyecto_certificacion_backend';
import { AuthClient } from '@dfinity/auth-client';
import { Modal } from 'bootstrap'; // Importa Modal desde Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
const canisterId = process.env.CANISTER_ID_INTERNET_IDENTITY;

class App {
    greeting = '';
    identity = null;
    bills = [];
    modal = null; // Referencia al modal de Bootstrap

    constructor() {
        this.initAuthClient();
        this.loadBills();
        this.#render();
    }

    async initAuthClient() {
        this.authClient = await AuthClient.create();
        if (await this.authClient.isAuthenticated()) {
            this.identity = this.authClient.getIdentity();
            this.#render();
        }
    }

    async loadBills() {
        this.bills = await proyecto_certificacion_backend.getBills();
        this.#render();
    }

    #handleLogin = async () => {
        if (await this.authClient.isAuthenticated()) {
            await this.authClient.logout();
            this.identity = null;
        } else {
            await this.authClient.login({
                // identityProvider: "https://identity.ic0.app", // También se puede usar el proveedor de identidad de Internet Computer
                identityProvider: `http://${canisterId}.localhost:4943/`,
                onSuccess: () => {
                    this.identity = this.authClient.getIdentity();
                    this.#render();
                },
            });
        }
        this.#render();
    };

    #handleAddBill = () => {
        if (!this.modal) {
            this.modal = new Modal(document.getElementById('addBillModal'), {});
        }
        this.modal.show();
    };

    #handleSaveBill = async () => {
        const name = document.getElementById('billName').value;
        const description = document.getElementById('billDescription').value;
    
        if (name && description && this.identity) {
            await proyecto_certificacion_backend.addBill(name, description, this.identity.getPrincipal());
            await this.loadBills();
        }
    
        if (this.modal) {
            this.modal.hide();
        }
    
        this.#render();
    };

    #handleDeleteBill = async (billName) => {
        await proyecto_certificacion_backend.deleteBill(billName);
        await this.loadBills();
    };

    #handlePayBill = async (billName) => {
        if (this.identity) {
            await proyecto_certificacion_backend.payBill(billName, this.identity.getPrincipal());
            await this.loadBills();
        }
    };    

    #render() {
        let billsList = this.bills.map(
            (bill) => html`
                <div class="card case-card mb-3" style="background-color: ${bill[3] === "Pagado" ? '#e9ecef' : 'white'};">
                    <div class="card-body">
                        <h5 
                            class="card-title" 
                            style="font-size: 1.5rem; font-weight: 700; color: #343a40; ${bill[3] === "Pagado" ? 'text-decoration: line-through;' : ''}">
                            ${bill[0]}
                        </h5>
                        <p class="card-text"><strong>Creador:</strong> ${bill[1]}</p>
                        <p class="card-text"><strong>Descripción:</strong> ${bill[2]}</p>
                        <p class="card-text"><strong>Estado:</strong> ${bill[3]}</p>
                        ${bill[3] === "Pagado" 
                            ? html`<p class="card-text"><strong>Lo pagó:</strong> ${bill[4]}</p>` 
                            : null}
                        <div class="d-flex justify-content-end">
                            <button 
                                class="btn ${!this.identity || bill[3] === 'Pagado' ? 'btn-secondary' : 'btn-success'} pay-btn me-2" 
                                title="Pagar"
                                ?disabled="${!this.identity || bill[3] === 'Pagado'}"
                                @click="${() => this.#handlePayBill(bill[0])}">
                                <i class="bi bi-credit-card"></i>
                            </button>
                            <button 
                                class="btn ${!this.identity || bill[3] !== 'Pagado' ? 'btn-secondary' : 'btn-danger'} delete-case-btn me-2" 
                                title="Borrar"
                                ?disabled="${!this.identity || bill[3] !== 'Pagado'}"
                                @click="${() => this.#handleDeleteBill(bill[0])}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `
        );

        let body = html`
            <!-- Navbar -->
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <div class="navbar-brand">
                        <span class="brand-name">Bills Chain</span>
                    </div>
                    <button @click="${this.#handleLogin}" 
                        class="btn ${this.identity ? 'btn-danger' : 'btn-primary'} btn-admin d-flex align-items-center">
                        <i class="bi bi-person-circle me-2"></i> 
                        ${this.identity ? 'Logout' : 'Login'}
                    </button>
                </div>
            </nav>

            <!-- Main -->
            <main>
                <div class="container my-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="h5">Hola, ${this.identity ? this.identity.getPrincipal().toText() : 'Anónimo, identificate!'}</span>
                        <button 
                            class="btn ${this.identity ? 'btn-primary' : 'btn-secondary'} me-2" 
                            ?disabled="${!this.identity}"
                            @click="${this.#handleAddBill}">
                            Agregar factura
                        </button>
                    </div>

                    <!-- Lista de facturas -->
                    <div class="case-list">
                        ${billsList}
                    </div>
                </div>
            </main>

            <!-- Modal de Bootstrap -->
            <div class="modal fade" id="addBillModal" tabindex="-1" aria-labelledby="addBillModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addBillModalLabel">Agregar nueva factura</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label for="billName" class="form-label">Nombre de la factura</label>
                                    <input type="text" class="form-control" id="billName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="billDescription" class="form-label">Descripción</label>
                                    <textarea class="form-control" id="billDescription" required></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" @click="${this.#handleSaveBill}">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        render(body, document.getElementById('root'));
    }
}

export default App;