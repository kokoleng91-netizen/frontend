import { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState("list"); // list | view | edit | add
  const [selected, setSelected] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setName("");
    setPrice("");
    setImage(null);
    setSelected(null);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    const res = await fetch(`http://localhost:8000/api/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) fetchProducts();
    else alert("Delete failed");
  };

  // VIEW
  const handleView = (product) => {
    setSelected(product);
    setMode("view");
  };

  // EDIT
  const handleEdit = (product) => {
    setSelected(product);
    setName(product.name);
    setPrice(product.price);
    setImage(null);
    setMode("edit");
  };

  // ADD
  const handleAdd = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", name);
    fd.append("price", price);
    fd.append("image", image);

    const res = await fetch("http://localhost:8000/api/products", {
      method: "POST",
      body: fd,
    });

    if (res.ok) {
      resetForm();
      setMode("list");
      fetchProducts();
    } else alert("Add failed");
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", name);
    fd.append("price", price);
    if (image) fd.append("image", image);
    fd.append("_method", "PUT");

    const res = await fetch(
      `http://localhost:8000/api/products/${selected.id}`,
      {
        method: "POST",
        body: fd,
      }
    );

    if (res.ok) {
      resetForm();
      setMode("list");
      fetchProducts();
    } else alert("Update failed");
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  /* ================= VIEW ================= */
  if (mode === "view" && selected) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Product Details
          </h2>

          <img
            src={selected.image || "https://via.placeholder.com/300"}
            alt={selected.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />

          <div className="space-y-2 text-gray-700">
            <p><b>ID:</b> {selected.id}</p>
            <p><b>Name:</b> {selected.name}</p>
            <p><b>Price:</b> ${selected.price}</p>
          </div>

          <button
            onClick={() => setMode("list")}
            className="mt-6 w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  /* ================= ADD / EDIT ================= */
  if (mode === "add" || mode === "edit") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <form
          onSubmit={mode === "add" ? handleAdd : handleUpdate}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">
            {mode === "add" ? "Add Product" : "Update Product"}
          </h2>

          <img
            src={
              image
                ? URL.createObjectURL(image)
                : selected?.image || "https://via.placeholder.com/200"
            }
            className="w-40 h-40 mx-auto object-cover rounded-lg border"
            alt="Preview"
          />

          <input
            className="w-full border rounded-lg p-2"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="number"
            className="w-full border rounded-lg p-2"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required={mode === "add"}
          />

          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
              {mode === "add" ? "Save" : "Update"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setMode("list");
              }}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ================= LIST ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Product List</h1>
          <button
            onClick={() => setMode("add")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            + Add Product
          </button>
        </div>

        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Image</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">${item.price}</td>
                <td className="border p-2">
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    className="w-16 h-16 mx-auto object-cover rounded-lg shadow"
                    alt={item.name}
                  />
                </td>
                <td className="border p-2">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleView(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
