import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import toast from "react-hot-toast";

function EditMenu() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const token = sessionStorage.getItem("token");

  const fetchCategories = async () => {
    const res = await axios.get(`${API_URL}/categories`);
    setCategories(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    setProducts(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
    fetchProducts();
  }, []);

  const addCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    await axios.post(
      `${API_URL}/categories`,
      { name: categoryName },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setCategoryName("");
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await axios.delete(`${API_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    }
  };

  const addProduct = async () => {
    if (!productName.trim() || !price || !category) {
      toast.error("Please fill in all required fields");
      return;
    }
    const formData = new FormData();

    formData.append("name", editingProduct.name);
    formData.append("price", editingProduct.price);

    formData.append(
      "category",
      editingProduct.category?._id || editingProduct.category,
    );

    formData.append(
      "customizationGroups",
      JSON.stringify(editingProduct.customizationGroups || []),
    );

    if (editingProduct.image instanceof File) {
      formData.append("image", editingProduct.image);
    }
    if (image) {
      formData.append("image", image);
    }
    await axios.post(`${API_URL}/products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    setProductName("");
    setPrice("");
    setCategory("");
    setImage(null);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-pos-text">Edit Menu</h1>
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="font-medium text-pos-muted transition-colors hover:text-pos-text"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-8">
        {/* Categories Section */}
        <div className="rounded-[10px] border border-pos-border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-pos-text">
            Categories
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-pos-text">
                Category Name
              </label>
              <input
                className="w-full rounded-md border border-pos-border px-4 py-3 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCategory()}
              />
            </div>
            <button
              type="button"
              onClick={addCategory}
              className="rounded-md bg-pos-orange px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pos-orange-hover focus:outline-none focus:ring-2 focus:ring-pos-peach"
            >
              Add Category
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {categories.length === 0 ? (
              <p className="py-8 text-center text-pos-muted">
                No categories yet
              </p>
            ) : (
              categories.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between rounded-md border border-pos-border bg-pos-bg px-6 py-4 transition-colors hover:bg-white"
                >
                  <span className="text-lg font-medium text-pos-text">
                    {c.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteCategory(c._id)}
                    className="rounded-md bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="rounded-[10px] border border-pos-border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-pos-text">
            Products
          </h2>

          {/* Add Product Form */}
          <div className="mb-8 rounded-[10px] bg-pos-bg p-6">
            <h3 className="mb-4 text-lg font-semibold text-pos-text">
              Add New Product
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-pos-text">
                  Product Name
                </label>
                <input
                  className="w-full rounded-md border border-pos-border px-4 py-2 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                  placeholder="Product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-pos-text">
                  Price (£)
                </label>
                <input
                  className="w-full rounded-md border border-pos-border px-4 py-2 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                  placeholder="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-pos-text">
                  Category
                </label>
                <select
                  className="w-full rounded-md border border-pos-border bg-white px-4 py-2 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-pos-text">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-md border border-pos-border px-4 py-2 text-sm text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addProduct}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-pos-orange px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pos-orange-hover focus:outline-none focus:ring-2 focus:ring-pos-peach"
            >
              Add Product
            </button>
          </div>

          {/* Products List */}
          <div className="mb-4">
            <input
              className="w-full rounded-md border border-pos-border px-4 py-3 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            {products.length === 0 ? (
              <p className="py-8 text-center text-pos-muted">No products yet</p>
            ) : (
              products
                .filter((p) =>
                  (p.name || "").toLowerCase().includes(search.toLowerCase()),
                )
                .map((p) => (
                  <div
                    key={p._id}
                    className="rounded-[10px] border border-pos-border bg-pos-bg p-4 transition-colors hover:bg-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-pos-text">
                          {p.name}
                        </h4>
                        <div className="mt-2 flex gap-6 text-sm">
                          <p className="text-pos-muted">
                            Price:{" "}
                            <span className="font-semibold text-pos-text">
                              £ {p.price}
                            </span>
                          </p>
                          <p className="text-pos-muted">
                            Category:{" "}
                            <span className="font-semibold text-pos-text">
                              {p.category?.name || "No Category"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          className="rounded-md border-2 border-pos-orange bg-white px-6 py-2 text-sm font-semibold text-pos-orange transition-colors hover:bg-pos-peach focus:outline-none focus:ring-2 focus:ring-pos-peach"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p._id)}
                          className="rounded-md bg-red-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4">
          <div className="w-full max-w-2xl rounded-[10px] border border-pos-border bg-white p-8 shadow-xl my-8">
            <h2 className="mb-6 text-2xl font-bold text-pos-text">
              Edit Product
            </h2>

            <div className="mb-6 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="mb-2 block text-sm font-medium text-pos-text">
                  Product Name
                </label>
                <input
                  className="w-full rounded-md border border-pos-border px-4 py-2 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-pos-text">
                  Price
                </label>
                <input
                  className="w-full rounded-md border border-pos-border px-4 py-2 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-pos-text">
                  Category
                </label>
                <select
                  className="w-full rounded-md border border-pos-border bg-white px-4 py-2 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                  value={editingProduct.category?._id || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-pos-text">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-md border border-pos-border px-4 py-2 text-sm text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      image: e.target.files[0],
                    })
                  }
                />
              </div>

              {/* DISCOUNT SECTION */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-pos-text mb-4">
                  Discount
                </h3>

                <div className="mb-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={editingProduct.discountEnabled || false}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          discountEnabled: e.target.checked,
                        })
                      }
                      className="h-5 w-5 rounded border-pos-border text-pos-orange focus:ring-2 focus:ring-pos-peach"
                    />
                    <span className="text-sm font-medium text-pos-text">
                      Enable Discount
                    </span>
                  </label>
                </div>

                {editingProduct.discountEnabled && (
                  <div className="space-y-4 bg-pos-bg p-4 rounded-md">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-pos-text">
                        Discount Type
                      </label>
                      <select
                        className="w-full rounded-md border border-pos-border bg-white px-4 py-2 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                        value={editingProduct.discountType || "percentage"}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            discountType: e.target.value,
                          })
                        }
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed (£)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-pos-text">
                        Discount Value
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full rounded-md border border-pos-border px-4 py-2 text-pos-text focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
                        placeholder={
                          editingProduct.discountType === "percentage"
                            ? "e.g., 10 for 10%"
                            : "e.g., 2.50 for £2.50"
                        }
                        value={editingProduct.discountValue || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            discountValue: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CUSTOMIZATION GROUPS SECTION */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-pos-text mb-4">
                  Customization Groups
                </h3>

                {editingProduct.customizationGroups?.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {editingProduct.customizationGroups.map(
                      (group, groupIdx) => (
                        <div
                          key={groupIdx}
                          className="p-3 border border-pos-border rounded-md bg-pos-bg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <input
                              className="flex-1 rounded-md border border-pos-border px-2 py-1 text-sm focus:outline-none"
                              placeholder="Group title (e.g., Size)"
                              value={group.title}
                              onChange={(e) => {
                                const updated = [
                                  ...editingProduct.customizationGroups,
                                ];
                                updated[groupIdx].title = e.target.value;
                                setEditingProduct({
                                  ...editingProduct,
                                  customizationGroups: updated,
                                });
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated =
                                  editingProduct.customizationGroups.filter(
                                    (_, i) => i !== groupIdx,
                                  );
                                setEditingProduct({
                                  ...editingProduct,
                                  customizationGroups: updated,
                                });
                              }}
                              className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>

                          <div className="flex gap-2 mb-2 text-xs">
                            <label className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={group.required}
                                onChange={(e) => {
                                  const updated = [
                                    ...editingProduct.customizationGroups,
                                  ];
                                  updated[groupIdx].required = e.target.checked;
                                  setEditingProduct({
                                    ...editingProduct,
                                    customizationGroups: updated,
                                  });
                                }}
                              />
                              Required
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={group.multiSelect}
                                onChange={(e) => {
                                  const updated = [
                                    ...editingProduct.customizationGroups,
                                  ];
                                  updated[groupIdx].multiSelect =
                                    e.target.checked;
                                  setEditingProduct({
                                    ...editingProduct,
                                    customizationGroups: updated,
                                  });
                                }}
                              />
                              Multi-Select
                            </label>
                          </div>

                          {/* Options */}
                          <div className="pl-2 space-y-2 border-l-2 border-pos-orange">
                            {group.options?.map((option, optIdx) => (
                              <div key={optIdx} className="flex gap-2 text-xs">
                                <input
                                  className="flex-1 rounded border border-pos-border px-2 py-1 focus:outline-none"
                                  placeholder="Option (e.g., Small)"
                                  value={option.name}
                                  onChange={(e) => {
                                    const updated = [
                                      ...editingProduct.customizationGroups,
                                    ];
                                    updated[groupIdx].options[optIdx].name =
                                      e.target.value;
                                    setEditingProduct({
                                      ...editingProduct,
                                      customizationGroups: updated,
                                    });
                                  }}
                                />
                                <input
                                  type="number"
                                  className="w-16 rounded border border-pos-border px-2 py-1 focus:outline-none"
                                  placeholder="Price +£"
                                  step="0.1"
                                  value={option.extraPrice || 0}
                                  onChange={(e) => {
                                    const updated = [
                                      ...editingProduct.customizationGroups,
                                    ];
                                    updated[groupIdx].options[
                                      optIdx
                                    ].extraPrice =
                                      parseFloat(e.target.value) || 0;
                                    setEditingProduct({
                                      ...editingProduct,
                                      customizationGroups: updated,
                                    });
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [
                                      ...editingProduct.customizationGroups,
                                    ];
                                    updated[groupIdx].options = updated[
                                      groupIdx
                                    ].options.filter((_, i) => i !== optIdx);
                                    setEditingProduct({
                                      ...editingProduct,
                                      customizationGroups: updated,
                                    });
                                  }}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [
                                  ...editingProduct.customizationGroups,
                                ];
                                updated[groupIdx].options = [
                                  ...(updated[groupIdx].options || []),
                                  { _id: null, name: "", extraPrice: 0 },
                                ];
                                setEditingProduct({
                                  ...editingProduct,
                                  customizationGroups: updated,
                                });
                              }}
                              className="text-xs text-pos-orange hover:underline"
                            >
                              + Add Option
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const updated = [
                      ...(editingProduct.customizationGroups || []),
                      {
                        _id: null,
                        title: "",
                        required: false,
                        multiSelect: false,
                        options: [],
                      },
                    ];
                    setEditingProduct({
                      ...editingProduct,
                      customizationGroups: updated,
                    });
                  }}
                  className="text-sm text-pos-orange hover:underline font-medium"
                >
                  + Add Customization Group
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-md bg-pos-green px-4 py-2 font-semibold text-white transition-colors hover:bg-pos-green-hover focus:outline-none focus:ring-2 focus:ring-pos-peach"
                onClick={async () => {
                  const formData = new FormData();
                  formData.append("name", editingProduct.name);
                  formData.append("price", editingProduct.price);
                  formData.append(
                    "category",
                    editingProduct.category?._id || editingProduct.category,
                  );
                  formData.append("discountEnabled", editingProduct.discountEnabled || false);
                  formData.append("discountType", editingProduct.discountType || "percentage");
                  formData.append("discountValue", editingProduct.discountValue || 0);
                  formData.append(
                    "customizationGroups",
                    JSON.stringify(editingProduct.customizationGroups || []),
                  );
                  if (editingProduct.image) {
                    formData.append("image", editingProduct.image);
                  }

                  try {
                    const response = await axios.put(
                      `${API_URL}/products/${editingProduct._id}`,
                      formData,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                      },
                    );

                    console.log("Product updated:", response.data);
                    toast.success("Product saved successfully");
                    setEditingProduct(null);
                    fetchProducts();
                  } catch (error) {
                    console.error(
                      "Error updating product:",
                      error.response?.data || error.message,
                    );
                    toast.error(
                      "Error saving product: " +
                        (error.response?.data?.error || error.message),
                    );
                  }
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="flex-1 rounded-md border border-pos-border bg-white px-4 py-2 font-semibold text-pos-text transition-colors hover:bg-pos-bg focus:outline-none focus:ring-2 focus:ring-pos-border"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditMenu;
