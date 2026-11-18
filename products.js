
document.addEventListener("DOMContentLoaded", () => {
    const productTable = document.getElementById("productTable");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    if (!productTable) return;

    let allProducts = [];

    // LOAD PRODUCTS FROM DATABASE
    window.loadProducts = async function () {
        try {
            productTable.innerHTML =
                '<tr><td colspan="9">Loading products...</td></tr>';

            const response = await fetch("/api/products", {
                method: "GET",
                credentials: "same-origin"
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to load products.");
            }

            allProducts = Array.isArray(result)
                ? result
                : result.products || [];

            displayProducts(allProducts);

        } catch (error) {
            console.error("LOAD PRODUCTS ERROR:", error);

            productTable.innerHTML =
                `<tr><td colspan="9">${escapeHTML(error.message)}</td></tr>`;
        }
    };

    // AUTOMATIC EXPIRY STATUS
    function getStatus(expiryDate) {
        if (!expiryDate) return "No Expiry Date";

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiry = new Date(expiryDate);
        expiry.setHours(0, 0, 0, 0);

        const days = Math.ceil(
            (expiry - today) / (1000 * 60 * 60 * 24)
        );

        if (days < 0) return "Expired";
        if (days <= 30) return "Expiring Soon";

        return "Safe";
    }

    // DISPLAY PRODUCTS
    function displayProducts(products) {
        if (products.length === 0) {
            productTable.innerHTML =
                '<tr><td colspan="9">No products found.</td></tr>';
            return;
        }

        productTable.innerHTML = products.map(product => {
            const status = getStatus(product.expiry_date);

            return `
                <tr>
                    <td>${escapeHTML(product.product_id)}</td>
                    <td>${escapeHTML(product.product_name)}</td>
                    <td>${escapeHTML(product.category || "")}</td>
                    <td>${escapeHTML(product.brand || "")}</td>
                    <td>${escapeHTML(product.barcode || "")}</td>
                    <td>${escapeHTML(product.quantity)}</td>
                    <td>
                        ${product.expiry_date
                            ? escapeHTML(String(product.expiry_date).slice(0, 10))
                            : ""}
                    </td>
                    <td>${escapeHTML(status)}</td>
                    <td>
                        <button type="button"
                            onclick="editProduct(${Number(product.product_id)})">
                            Edit
                        </button>

                        <button type="button"
                            onclick="deleteProduct(${Number(product.product_id)})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    // HTML SECURITY
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    // EDIT PRODUCT
    window.editProduct = function (id) {
        const product = allProducts.find(
            item => Number(item.product_id) === Number(id)
        );

        if (!product) return;

        document.getElementById("productId").value = product.product_id;
        document.getElementById("productName").value = product.product_name || "";
        document.getElementById("category").value = product.category || "";
        document.getElementById("brand").value = product.brand || "";
        document.getElementById("barcode").value = product.barcode || "";
        document.getElementById("quantity").value = product.quantity ?? "";

        document.getElementById("expiryDate").value =
            product.expiry_date
                ? String(product.expiry_date).slice(0, 10)
                : "";

        document.getElementById("description").value =
            product.description || "";

        document.getElementById("saveButton").textContent = "Update Product";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // DELETE PRODUCT
    window.deleteProduct = async function (id) {
        const confirmDelete = confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
                credentials: "same-origin"
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to delete product.");
            }

            alert("Product deleted successfully!");

            window.loadProducts();

        } catch (error) {
            console.error("DELETE PRODUCT ERROR:", error);
            alert(error.message);
        }
    };

    // SEARCH PRODUCTS
    function searchProducts() {
        const keyword = searchInput.value.toLowerCase().trim();

        const filteredProducts = allProducts.filter(product => {
            return [
                product.product_name,
                product.category,
                product.brand,
                product.barcode
            ].some(value =>
                String(value || "").toLowerCase().includes(keyword)
            );
        });

        displayProducts(filteredProducts);
    }

    searchButton?.addEventListener("click", searchProducts);
    searchInput?.addEventListener("input", searchProducts);

    // INITIAL LOAD
    window.loadProducts();
});
