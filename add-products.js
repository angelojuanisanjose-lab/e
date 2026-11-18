
document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");
    const message = document.getElementById("message");
    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");

    if (!productForm) return;

    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const productId = document.getElementById("productId").value;

        const quantityValue = document.getElementById("quantity").value;

        const product = {
            product_name: document.getElementById("productName").value.trim(),
            category: document.getElementById("category").value.trim(),
            brand: document.getElementById("brand").value.trim(),
            barcode: document.getElementById("barcode").value.trim(),
            quantity: Number(quantityValue),
            expiry_date: document.getElementById("expiryDate").value,
            description: document.getElementById("description").value.trim()
        };

        // VALIDATION
        if (
            !product.product_name ||
            !product.category ||
            !product.brand ||
            !product.expiry_date ||
            quantityValue === "" ||
            !Number.isInteger(product.quantity) ||
            product.quantity < 0
        ) {
            message.textContent = "Please complete all required fields correctly.";
            return;
        }

        try {
            saveButton.disabled = true;
            saveButton.textContent = productId ? "Updating..." : "Saving...";

            // FETCH API
            const response = await fetch(
                productId
                    ? `/api/products/${productId}`
                    : "/api/products",
                {
                    method: productId ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "same-origin",
                    body: JSON.stringify(product)
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to save product.");
            }

            message.textContent = result.message;

            productForm.reset();
            document.getElementById("productId").value = "";

            if (window.loadProducts) {
                window.loadProducts();
            }

        } catch (error) {
            message.textContent = error.message;
            console.error("PRODUCT SAVE ERROR:", error);

        } finally {
            saveButton.disabled = false;
            saveButton.textContent = "Save Product";
        }
    });

    // CANCEL BUTTON
    cancelButton?.addEventListener("click", () => {
        productForm.reset();
        document.getElementById("productId").value = "";
        message.textContent = "";
        saveButton.textContent = "Save Product";
    });
});
