import React, { useState } from 'react';
import { Store, Plus, Search, Phone, User, Trash2, AlertTriangle, MapPin, Calendar, Building } from 'lucide-react';

const DharamshalaManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state matching dharamshala schema
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact: '',
    images: []
  });

  // Sample dharamshala data
  // Sample dharamshala data
  const [dharamshalas, setDharamshalas] = useState([
    {
      _id: '1',
      name: 'चंद्रवंशी खाती धर्मशाला बिजलपुर',
      location: 'गोपालेशवर महादेव मंदिर',
      contact: '+91-9111399904',
      images: ['https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
      availableDates: ['all date'],
      bookedDates: ['2026-02-21','2026-02-22','2026-02-23','2026-02-24','2026-02-25','2026-02-26','2026-02-27','2026-02-28'],
      createdAt: '2024-01-01'
    },
    {
      _id: '2',
      name: 'चंद्रवंशी खाती धर्मशाला बिजलपुर',
      location: 'neem chowke',
      contact: '+91-9999999992',
      images: ['https://images.unsplash.com/photo-1596386461350-326ccb383e9f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8SG90ZWxzfGVufDB8fDB8fHww'],
      availableDates: ['2025-06-01', '2025-06-03', '2025-06-05'],
      bookedDates: ['2025-06-02', '2025-06-04', '2025-06-06'],
      createdAt: '2024-01-02'
    },
    {
      _id: '3',
      name: 'जैन धर्मशाला',
      location: 'near jain mandir',
      contact: '+91-9999999993',
      images: ['https://plus.unsplash.com/premium_photo-1675745329378-5573c360f69f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8SG90ZWxzfGVufDB8fDB8fHww'],
      availableDates: ['2025-06-05', '2025-06-10', '2025-06-12'],
      bookedDates: ['2025-06-06', '2025-06-07', '2025-06-11'],
      createdAt: '2024-01-03'
    },
    {
      _id: '4',
      name: 'रूपचितर धर्मशाला',
      location: 'बिजलपुर वांडर्स बिजलपुर कब्बडी ग्राउंड',
      contact: '+91-9999999994',
      images: ['https://images.unsplash.com/photo-1590447158019-883d8d5f8bc7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D'],
      availableDates: ['2025-06-15', '2025-06-18', '2025-06-20'],
      bookedDates: ['2025-06-16', '2025-06-17', '2025-06-19'],
      createdAt: '2024-01-04'
    },
    {
      _id: '5',
      name: 'माली धर्मशाला',
      location: 'भारत सागर पब्लिक स्कूल',
      contact: '+91-9999999995',
      images: ['https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D'],
      availableDates: ['2025-06-20', '2025-06-22', '2025-06-25'],
      bookedDates: ['2025-06-21', '2025-06-23', '2025-06-24'],
      createdAt: '2024-01-05'
    },
    {
      _id: '6',
      name: 'श्री राम वाटिका',
      location: 'श्री राम दरबार',
      contact: '+91-9999999991',
      images: ['https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
      availableDates: ['2025-05-25', '2025-05-28', '2025-05-30', '2025-06-02'],
      bookedDates: ['2025-05-26', '2025-05-27', '2025-05-29', '2025-06-01'],
      createdAt: '2024-01-06'
    },
    {
      _id: '7',
      name: 'मिनी स्कूल गार्डन',
      location: 'गुरुकुल आकाश बोर्डिंग',
      contact: '+91-9999999992',
      images: ['https://images.unsplash.com/photo-1596386461350-326ccb383e9f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8SG90ZWxzfGVufDB8fDB8fHww'],
      availableDates: ['2025-06-01', '2025-06-03', '2025-06-05'],
      bookedDates: ['2025-06-02', '2025-06-04', '2025-06-06'],
      createdAt: '2024-01-07'
    },
    {
      _id: '8',
      name: 'पांचाल धर्मशाला',
      location: 'मुंडी रोड',
      contact: '+91-9999999993',
      images: ['https://plus.unsplash.com/premium_photo-1675745329378-5573c360f69f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8SG90ZWxzfGVufDB8fDB8fHww'],
      availableDates: ['2025-06-05', '2025-06-10', '2025-06-12'],
      bookedDates: ['2025-06-06', '2025-06-07', '2025-06-11'],
      createdAt: '2024-01-08'
    },
    {
      _id: '9',
      name: 'अष्ट विनायक गार्डन',
      location: 'शिव सिटी रोड',
      contact: '+91-9999999994',
      images: ['https://images.unsplash.com/photo-1590447158019-883d8d5f8bc7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D'],
      availableDates: ['2025-06-15', '2025-06-18', '2025-06-20'],
      bookedDates: ['2025-06-16', '2025-06-17', '2025-06-19'],
      createdAt: '2024-01-09'
    },
    {
      _id: '10',
      name: 'शिवधाम गार्डन',
      location: 'मुंडी रोड',
      contact: '+91-9999999995',
      images: ['https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D'],
      availableDates: ['2025-06-20', '2025-06-22', '2025-06-25'],
      bookedDates: ['2025-06-21', '2025-06-23', '2025-06-24'],
      createdAt: '2024-01-10'
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Validate contact number format
    const contactRegex = /^\+91-\d{10}$/;
    if (!contactRegex.test(formData.contact)) {
      alert('Please enter a valid Indian contact number in format: +91-XXXXXXXXXX');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDharamshala = {
        _id: Date.now().toString(),
        ...formData,
        availableDates: [],
        bookedDates: [],
        createdAt: new Date().toISOString()
      };
      
      setDharamshalas(prev => [...prev, newDharamshala]);
      setFormData({ name: '', location: '', contact: '', images: [] });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating dharamshala:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDharamshala = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    setDharamshalas(prev => prev.filter(d => d._id !== deleteConfirm));
    setDeleteConfirm(null);
  };

  const filteredDharamshalas = dharamshalas.filter(dharamshala =>
    dharamshala.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dharamshala.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dharamshala.contact.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Building className="w-8 h-8 text-orange-500" />
                Dharamshala Management
              </h1>
              <p className="text-gray-600">
                Manage dharamshala venues and bookings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-600">
                <Building className="w-4 h-4" />
                <span className="font-medium">
                  {filteredDharamshalas.length} Dharamshalas
                </span>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Dharamshala
              </button>
            </div>
          </div>
        </div>

        {/* Add Dharamshala Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-500" />
                Add New Dharamshala
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Dharamshala Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter dharamshala name"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="+91-XXXXXXXXXX"
                    pattern="^\+91-\d{10}$"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Format: +91-XXXXXXXXXX</p>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.location || !formData.contact}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isSubmitting ? "Creating..." : "Create Dharamshala"}
              </button>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search dharamshalas by name, location, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dharamshala Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDharamshalas.map((dharamshala, index) => (
                  <tr
                    key={dharamshala._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={dharamshala.images[0] || "/api/placeholder/48/48"}
                            alt="Dharamshala"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {dharamshala.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: #{dharamshala._id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {dharamshala.location}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {dharamshala.contact}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-medium">
                            {dharamshala.availableDates?.length || 0} Available
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-red-500" />
                          <span className="text-red-600 font-medium">
                            {dharamshala.bookedDates?.length || 0} Booked
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteDharamshala(dharamshala._id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredDharamshalas.map((dharamshala, index) => (
            <div
              key={dharamshala._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={dharamshala.images[0] || "/api/placeholder/48/48"}
                      alt="Dharamshala"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {dharamshala.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: #{dharamshala._id}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDharamshala(dharamshala._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-gray-900">
                    {dharamshala.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium text-gray-900">
                    {dharamshala.contact}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">
                      {dharamshala.availableDates?.length || 0} Available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-medium">
                      {dharamshala.bookedDates?.length || 0} Booked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDharamshalas.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No dharamshalas found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Get started by adding your first dharamshala"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add First Dharamshala
              </button>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Delete
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this dharamshala? This action cannot be
                undone and will affect all associated bookings.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Dharamshala
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DharamshalaManagement;