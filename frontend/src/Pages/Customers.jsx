import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, addCustomer, deleteCustomer, updateCustomer, setSearchTerm } from '../Features/Customers/customerSlice';
import '../Customers.css';
import Footer from '../Components/Footer';
import axios from 'axios';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Customers() {
  const dispatch = useDispatch();
  const customers = useSelector(state => state.customers.customers);
  const searchTerm = useSelector(state => state.customers.searchTerm);
  const status = useSelector(state => state.customers.status);

  const [newCustomer, setNewCustomer] = React.useState({ name: '', email: '', phone: '', address: '' });
  const [setIsEditing] = React.useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCustomers());
    }
  }, [dispatch, status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAdd = () => {
    dispatch(addCustomer(newCustomer));
    setNewCustomer({ name: '', email: '', phone: '', address: '' });
  };

  const handleUpdate = () => {
    if (selectedCustomerId) {
      console.log('Updating customer with ID:', selectedCustomerId);
      dispatch(updateCustomer({ ...newCustomer, _id: selectedCustomerId }));
      setIsEditing(false);
      setSelectedCustomerId(null);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
    }
  };

  const handleDelete = () => {
    if (selectedCustomers.length > 0 && window.confirm('Are you sure you want to delete the selected customers?')) {
      selectedCustomers.forEach(id => dispatch(deleteCustomer(id)));
      setSelectedCustomers([]);
      setIsEditing(false);
      setSelectedCustomerId(null);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
    }
  };

  const handleDeleteFromForm = () => {
    if (selectedCustomerId && window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomer(selectedCustomerId));
      setSelectedCustomerId(null); // Clear after deletion
      setNewCustomer({ name: '', email: '', phone: '', address: '' }); // Clear the form
      setIsEditing(false);
    } else {
      alert('No customer selected for deletion.');
    }
  };

  const handleCancel = () => {
    setSelectedCustomers([]);
  };


  const handleRowDoubleClick = (customer) => {
    setNewCustomer(customer);
    setSelectedCustomerId(customer._id);
    setIsEditing(true);
  };

  const handleSelectCustomer = (id) => {
    setSelectedCustomers(prevSelected => 
      prevSelected.includes(id) 
        ? prevSelected.filter(customerId => customerId !== id) 
        : [...prevSelected, id]
    );
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allCustomerIds = filteredCustomers.map(customer => customer._id);
      setSelectedCustomers(allCustomerIds);
    } else {
      setSelectedCustomers([]);
    }
  };


    // Direct test for the PATCH request using Axios
    useEffect(() => {
      if (selectedCustomerId) {
        axios.patch(`http://localhost:5000/api/customers/${selectedCustomerId}`, newCustomer)
          .then(response => console.log('Update successful:', response))
          .catch(error => console.error('Error updating customer:', error));
      }
    }, [selectedCustomerId]);


  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="customer-container">
        <div className="addcustomers">
          <h1>Customer Details</h1>
          <form>
            <input type="text" className='cstform' name="name" placeholder="Name" onChange={handleInputChange} value={newCustomer.name} required /><br />
            <input type="email" className='cstform' name="email" placeholder="Email" onChange={handleInputChange} value={newCustomer.email} required /><br />
            <input type="tel" className='cstform' name="phone" placeholder="Phone" onChange={handleInputChange} value={newCustomer.phone} required /><br />
            <input type="text" className='cstform' name="address" placeholder="Address" onChange={handleInputChange} value={newCustomer.address} required /><br />
          </form>
          <div className="button-group">
              <button id="addcst" className='cstbtn' type="button" onClick={handleAdd}>Add</button>
              <button id="updcst" className='cstbtn' type="button" onClick={handleUpdate}>Update </button>
              <button id="delcst" className='cstbtn' type="button" onClick={handleDeleteFromForm}>Delete</button>
          </div>
        </div>
        <div className="customerlist">
          <h1>Customer List</h1>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            className='cstform'
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
          <table className="csttable">
            <thead>
              <tr>
                <th>Sr no.</th>
                <th>Name</th>
                <th>Email</th>
                <th><input type="checkbox" onChange={handleSelectAll} checked={selectedCustomers.length === filteredCustomers.length} /></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer._id} onDoubleClick={() => handleRowDoubleClick(customer)}>
                    <td>{index + 1}</td>  {/* Display serial number */}
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td><input type="checkbox" checked={selectedCustomers.includes(customer._id)} onChange={() => handleSelectCustomer(customer._id)} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No customers available</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="action-buttons">
            <button type="button" className= 'alldel'onClick={handleDelete}>Delete Selected</button>
            <button type="button" className= 'alldel'onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Customers;
