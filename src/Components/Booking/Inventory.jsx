import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X, Check } from "lucide-react";

import { useParams } from "react-router-dom";
import Axios from "../../Axios";

const InventoryTable = ({ inventory, setInventory }) => {
  const { id } = useParams(); // Get venue ID from URL params

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    quantity: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    quantity: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setInventory((prevInventory) =>
        prevInventory.filter((item) => item._id !== itemId)
      );
      // Fire-and-forget delete request
      Axios.delete(`/inventory/${id}/${itemId}`).catch((error) => {
        console.error("Error deleting inventory item:", error);
        alert("Failed to delete item on server. Please refresh.");
      });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditForm({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
    });
  };

  const handleSaveEdit = async () => {
    try {
      // Optimistically update UI
      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item._id === editingId
            ? {
                ...item,
                name: editForm.name,
                description: editForm.description,
                quantity: parseInt(editForm.quantity),
              }
            : item
        )
      );

      // Fire-and-forget API call
      Axios.put(`/inventory/${id}`, {
        itemId: editingId,
        name: editForm.name,
        description: editForm.description,
        quantity: parseInt(editForm.quantity),
      }).catch((error) => {
        console.error("Error updating inventory item:", error);
        alert("Failed to update item on server. Please refresh.");
      });

      // Clear editing state
      setEditingId(null);
      setEditForm({ name: "", description: "", quantity: "" });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "", quantity: "" });
  };

  const handleAddItem = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!newItem.name || !newItem.description || !newItem.quantity) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a temporary optimistic item
      const tempId = Date.now();
      const optimisticItem = {
        _id: tempId,
        name: newItem.name,
        description: newItem.description,
        quantity: parseInt(newItem.quantity),
      };

      // Optimistically update inventory
      setInventory((prev) => [...prev, optimisticItem]);

      // Make API call
      const response = await Axios.post(`/inventory/${id}`, {
        name: newItem.name,
        description: newItem.description,
        quantity: parseInt(newItem.quantity),
      });

      // Update with actual data from server
      setInventory(response.data.inventory);

      // Reset form and close modal
      setNewItem({ name: "", description: "", quantity: "" });
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Failed to add item. Please try again.");

      // Rollback optimistic update
      setInventory((prev) => prev.filter((item) => item._id !== tempId));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 mt-10">
      <style>{`
        .bg-overlay {
          background-color: #3f3f3f61;
        }
        .bg-dark {
          background-color: #3f3f3f;
        }
        .bg-primary {
          background-color: #f75c1e;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 50;
        }
        .modal-box {
          background: white;
          max-width: 500px;
          width: 90%;
          border-radius: 10px;
          position: relative;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Inventory Management
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  S.No.
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Quantity
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item._id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item._id ? (
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item._id ? (
                      <input
                        type="number"
                        value={editForm.quantity}
                        onChange={(e) =>
                          setEditForm({ ...editForm, quantity: e.target.value })
                        }
                        className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.quantity < 20
                            ? "bg-red-100 text-red-800"
                            : item.quantity < 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingId === item._id ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {inventory.map((item, index) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-dark text-white text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.quantity < 20
                          ? "bg-red-100 text-red-800"
                          : item.quantity < 50
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-box p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Item
                </h2>
                <button
                  type="button" // Add type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter item description"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter quantity"
                    min="0"
                  />
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex-1 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Adding..." : "Add Item"}
                  </button>
                  <button
                    type="button" // Add type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryTable;
