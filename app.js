const app = Vue.createApp({
    data() {
        return {
            items: [],
            filteredItems: [],
            currentPage: 1,
            itemsPerPage: 12,
            selectedCategory: "",
            selectedAvailability: "",
            selectedColumn: "",
            selectedRow: "",
            filteredItems: 0,
            filterEmpty: false,
            itemToDelete: null,
            searchQuery: "",
            newItem: {
                ID: "",
                ISBN: "",
                Nombre: "",
                Autor: "",
                Categoria: "",
                Ubicacion: "",
                Disponible: "",
            },
            editItem: {
                ID: "",
                ISBN: "",
                Nombre: "",
                Autor: "",
                Categoria: "",
                Ubicacion: "",
                Disponible: "",
            },
        };
    },
    computed: {
        totalPages() {
            const itemsList = this.filteredItems.length
                ? this.filteredItems
                : this.items;
            return Math.ceil(itemsList.length / this.itemsPerPage);
        },

        paginatedItems() {
            const itemsList = this.filteredItems.length
                ? this.filteredItems
                : this.items;
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = Math.min(start + this.itemsPerPage, itemsList.length);

            const itemsToDisplay = itemsList.slice(start, end);

            return itemsToDisplay.length
                ? itemsToDisplay
                : Array(this.itemsPerPage).fill({
                      ID: "",
                      ISBN: "",
                      Nombre: "",
                      Autor: "",
                      Categoria: "",
                      Ubicacion: "",
                      Disponible: "",
                  });
        },
    },
    methods: {
        openDeleteModal(item) {
            this.itemToDelete = item;
            const deleteModal = document.getElementById("delete-modal");
            const deleteBackdrop = document.getElementById(
                "delete-modal-backdrop"
            );

            deleteBackdrop.style.display = "block";
            deleteModal.style.display = "block";
            setTimeout(() => {
                deleteBackdrop.style.opacity = "1";
                deleteModal.style.opacity = "1";
                deleteModal.style.transform = "translate(-50%, -50%) scale(1)";
            }, 10);
        },

        confirmDelete() {
            const index = this.items.findIndex(
                (item) => item === this.itemToDelete
            );

            if (index !== -1) {
                this.items.splice(index, 1);
            }

            this.closeDeleteModal();

            this.applyFilters();
        },

        closeDeleteModal() {
            const deleteModal = document.getElementById("delete-modal");
            const deleteBackdrop = document.getElementById(
                "delete-modal-backdrop"
            );

            this.itemToDelete = null;

            deleteBackdrop.style.opacity = "0";
            deleteModal.style.opacity = "0";
            deleteModal.style.transform = "translate(-50%, -50%) scale(0.9)";

            setTimeout(() => {
                deleteBackdrop.style.display = "none";
                deleteModal.style.display = "none";
            }, 300);
        },

        closeOnBackdropClick(event) {
            const modal = document.getElementById("delete-modal");
            this.itemToDelete = null;

            if (event.target === event.currentTarget) {
                this.closeDeleteModal();
            }
        },

        openCreateModal() {
            const createModal = document.getElementById("create-modal");
            const createBackdrop = document.getElementById(
                "create-modal-backdrop"
            );

            createBackdrop.style.display = "block";
            createModal.style.display = "block";
            setTimeout(() => {
                createBackdrop.style.opacity = "1";
                createModal.style.opacity = "1";
                createModal.style.transform = "translate(-50%, -50%) scale(1)";
            }, 10);
        },

        closeCreateModal() {
            const createModal = document.getElementById("create-modal");
            const createBackdrop = document.getElementById(
                "create-modal-backdrop"
            );

            createBackdrop.style.opacity = "0";
            createModal.style.opacity = "0";
            createModal.style.transform = "translate(-50%, -50%) scale(0.9)";

            setTimeout(() => {
                createBackdrop.style.display = "none";
                createModal.style.display = "none";
            }, 300);
        },

        closeOnBackdropClickCreate(event) {
            const modal = document.getElementById("create-modal");

            if (event.target === event.currentTarget) {
                this.closeCreateModal();
            }
        },

        closeOnBackdropClickEdit(event) {
            const modal = document.getElementById("edit-modal");

            if (event.target === event.currentTarget) {
                this.closeEditModal();
            }
        },

        confirmCreateItem() {
            if (
                this.newItem.ID &&
                this.newItem.ISBN &&
                this.newItem.Nombre &&
                this.newItem.Autor &&
                this.newItem.Categoria &&
                this.newItem.Ubicacion
            ) {
                const idDuplicado = this.items.some(
                    (item) => item.ID === this.newItem.ID
                );

                if (idDuplicado) {
                    alert(
                        "Ya existe un libro con ese ID. El ID debe ser único"
                    );
                    return;
                }

                this.items.unshift({
                    ID: this.newItem.ID,
                    ISBN: this.newItem.ISBN,
                    Nombre: this.newItem.Nombre,
                    Autor: this.newItem.Autor,
                    Categoria: this.newItem.Categoria,
                    Ubicacion: this.newItem.Ubicacion,
                    Disponible: this.newItem.Disponible,
                });

                this.refreshItems();

                this.newItem = {
                    ID: "",
                    ISBN: "",
                    Nombre: "",
                    Autor: "",
                    Categoria: "",
                    Ubicacion: "",
                    Disponible: "",
                };

                this.closeCreateModal();
            } else {
                alert("Todos los campos son obligatorios.");
            }
        },

        refreshItems() {
            const query = this.searchQuery.toLowerCase();

            this.filteredItems = this.items
                .filter(
                    (item) =>
                        item.Nombre.toLowerCase().includes(query) ||
                        item.Autor.toLowerCase().includes(query) ||
                        item.ISBN.toLowerCase().includes(query)
                )
                .slice(0, this.itemsPerPage);
        },

        openEditModal(item) {
            this.editItem = { ...item };
            const editModal = document.getElementById("edit-modal");
            const editBackdrop = document.getElementById("edit-modal-backdrop");

            editBackdrop.style.display = "block";
            editModal.style.display = "block";
            setTimeout(() => {
                editBackdrop.style.opacity = "1";
                editModal.style.opacity = "1";
                editModal.style.transform = "translate(-50%, -50%) scale(1)";
            }, 10);
        },

        closeEditModal() {
            const editModal = document.getElementById("edit-modal");
            const editBackdrop = document.getElementById("edit-modal-backdrop");

            editBackdrop.style.opacity = "0";
            editModal.style.opacity = "0";
            editModal.style.transform = "translate(-50%, -50%) scale(0.9)";

            setTimeout(() => {
                editBackdrop.style.display = "none";
                editModal.style.display = "none";
            }, 300);
        },

        confirmEditItem() {
            if (
                this.editItem.ISBN &&
                this.editItem.Nombre &&
                this.editItem.Autor &&
                this.editItem.Categoria &&
                this.editItem.Ubicacion
            ) {
                const index = this.items.findIndex(
                    (item) => item.ID === this.editItem.ID
                );
                if (index !== -1) {
                    this.items.splice(index, 1, this.editItem);
                }

                this.editItem = {};

                this.refreshItems();
                this.closeEditModal();
            } else {
                alert("Todos los campos son obligatorios.");
            }
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },

        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },

        loadJSON() {
            fetch("assets/books.json")
                .then((response) => response.json())
                .then((data) => {
                    this.items = data.map((row) => ({
                        ID: row.ID,
                        ISBN: row.isbn,
                        Nombre: row.title,
                        Autor: row.author,
                        Categoria: row.genres,
                        Ubicacion: row.Ubicacion,
                        Disponible: "Disponible",
                    }));
                })
                .catch((error) => console.error("JSON Error", error));
        },

        truncate(text) {
            if (text.length > 18) {
                return text.slice(0, 18) + "...";
            }
            return text;
        },

        resetFilters() {
            this.selectedCategory = "";
            this.selectedAvailability = "";
            this.selectedColumn = "";
            this.selectedRow = "";
            this.filteredItems = [];
            this.filterEmpty = false;
            this.currentPage = 1;
        },

        applyFilters() {
            this.filteredItems = [];
            this.currentPage = 1;
            if (
                !this.selectedCategory &&
                !this.selectedAvailability &&
                !this.selectedColumn &&
                !this.selectedRow
            ) {
                return;
            }

            this.filteredItems = this.items.filter((item) => {
                const matchesCategory =
                    !this.selectedCategory ||
                    item.Categoria === this.selectedCategory;
                const matchesAvailability =
                    !this.selectedAvailability ||
                    item.Disponible === this.selectedAvailability;

                const [, columnMatch, rowMatch] =
                    item.Ubicacion.match(/Col\s(\d+)\s-\sRow\s(\d+)/) || [];

                const matchesColumn =
                    !this.selectedColumn ||
                    (columnMatch && columnMatch === this.selectedColumn);

                const matchesRow =
                    !this.selectedRow ||
                    (rowMatch && rowMatch === this.selectedRow);

                return (
                    matchesCategory &&
                    matchesAvailability &&
                    matchesColumn &&
                    matchesRow
                );
            });

            if (this.filteredItems.length === 0) {
                this.filterEmpty = true;
                this.filteredItems = Array(this.itemsPerPage).fill({
                    ID: "",
                    ISBN: "",
                    Nombre: "",
                    Autor: "",
                    Categoria: "",
                    Ubicacion: "",
                    Disponible: "",
                });
            }
        },

        applySearch() {
            this.currentPage = 1;
            this.filterEmpty = true;
            this.filteredItems = this.items.filter((item) => {
                return (
                    item.ID.includes(this.searchQuery) ||
                    item.ISBN.includes(this.searchQuery) ||
                    item.Nombre.toLowerCase().includes(
                        this.searchQuery.toLowerCase()
                    ) ||
                    item.Autor.toLowerCase().includes(
                        this.searchQuery.toLowerCase()
                    )
                );
            });

            if (this.filteredItems.length > 0) {
                this.filterEmpty = false;
            } else {
                this.filteredItems = Array(this.itemsPerPage).fill({
                    ID: "",
                    ISBN: "",
                    Nombre: "",
                    Autor: "",
                    Categoria: "",
                    Ubicacion: "",
                    Disponible: "",
                });
            }
            this.searchQuery = "";
        },
    },
    mounted() {
        this.loadJSON();
    },
});

app.mount("#app");
