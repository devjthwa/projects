import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchInventories, addInventory, updateInventory, deleteInventory, setSearchTerm} from '../Features/Inventory/inventoryslice';
import '../Customers.css';
import Footer from '../Components/Footer';
import axios from 'axios';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Inventories() {
  const dispatch = useDispatch();
  const inventories = useSelector(state => state.inventories.inventories);
  const searchTerm = useSelector(state => state.inventories.searchTerm);
  const status = useSelector(state => state.inventories.status);

  const [newInventory, setNewInventory] = React.useState({ name: '', desc: '', unit: '', hsn: '', category: ''});
  const [setIsEditing] = React.useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState(null);
  const [selectedInventories, setSelectedInventories] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchInventories());
    }
  }, [dispatch, status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInventory(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAdd = () => {
    dispatch(addInventory(newInventory));
    setNewInventory({ name: '', desc: '', unit: '', hsn: '', category: ''});
  };

  const handleUpdate = () => {
    if (selectedInventoryId) {
      console.log('Updating inventory with ID:', selectedInventoryId);
      dispatch(updateInventory({ ...newInventory, _id: selectedInventoryId }));
      setIsEditing(false);
      setSelectedInventoryId(null);
      setNewInventory({ name: '', desc: '', unit: '', hsn: '', category: ''});
    }
  };

  const handleDelete = () => {
    if (selectedInventories.length > 0 && window.confirm('Are you sure you want to delete the selected items?')) {
      selectedInventories.forEach(id => dispatch(deleteInventory(id)));
      setSelectedInventories([]);
      setIsEditing(false);
      setSelectedInventoryId(null);
      setNewInventory({ name: '', desc: '', unit: '', hsn: '', category: ''});
    }
  };

  const handleDeleteFromForm = () => {
    if (selectedInventoryId && window.confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteInventory(selectedInventoryId));
      selectedInventoryId(null); // Clear after deletion
      setNewInventory({ name: '', desc: '', unit: '', hsn: '', category: ''}); // Clear the form
      setIsEditing(false);
    } else {
      alert('Nothing selected for deletion.');
    }
  };

  const handleCancel = () => {
    setSelectedInventories([]);
  };


  const handleRowDoubleClick = (inventory) => {
    setNewInventory(inventory);
    setSelectedInventoryId(inventory._id);
    setIsEditing(true);
  };

  const handleSelectInventory = (id) => {
    setSelectedInventories(prevSelected => 
      prevSelected.includes(id) 
        ? prevSelected.filter(inventoryId => inventoryId !== id) 
        : [...prevSelected, id]
    );
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allInventoryIds = filteredInventories.map(inventory => inventory._id);
      setSelectedInventories(allInventoryIds);
    } else {
      setSelectedInventories([]);
    }
  };


    // Direct test for the PATCH request using Axios
    useEffect(() => {
      if (selectedInventoryId) {
        axios.patch(`http://localhost:5000/api/inventories/${selectedInventoryId}`, newInventory)
          .then(response => console.log('Update successful:', response))
          .catch(error => console.error('Error updating :', error));
      }
    }, [selectedInventoryId]);


  const filteredInventories = inventories.filter(inventory =>
    inventory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inventory.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="inventory-container">
        <div className="addinventory">
          <h1>Inventory Details</h1>
          <form>
            <input type="text" className='invform' name="name" placeholder="Name" onChange={handleInputChange} value={newInventory.name} required /><br />
            <input type="text" className='invform' name="desc" placeholder="Description" onChange={handleInputChange} value={newInventory.desc} required /><br />
            <input type="text" className='invform' name="unit" placeholder="Unit" onChange={handleInputChange} value={newInventory.unit} required /><br />
            <input type="text" className='invform' name="hsn" placeholder="HSN" onChange={handleInputChange} value={newInventory.hsn} required /><br />
            <input type="text" className='invform' name="category" placeholder="Category" onChange={handleInputChange} value={newInventory.category} required /><br />            
          </form>
          <div className="button-group">
              <button id="addinv" className='invbtn' type="button" onClick={handleAdd}>Add</button>
              <button id="updinv" className='invbtn' type="button" onClick={handleUpdate}>Update </button>
              <button id="delinv" className='invbtn' type="button" onClick={handleDeleteFromForm}>Delete</button>
          </div>
        </div>
        <div className="inventorylist">
          <h1>Inventory List</h1>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            className='invform'
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
          <table className="invtable">
            <thead>
              <tr>
                <th>Sr no.</th>
                <th>Name</th>
                <th>Category</th>
                <th><input type="checkbox" onChange={handleSelectAll} checked={selectedInventories.length === filteredInventories.length} /></th>
              </tr>
            </thead>
            <tbody>
              {filteredInventories.length > 0 ? (
                filteredInventories.map((inventory, index) => (
                  <tr key={inventory._id} onDoubleClick={() => handleRowDoubleClick(inventory)}>
                    <td>{index + 1}</td>  {/* Display serial number */}
                    <td>{inventory.name}</td>
                    <td>{inventory.category}</td>
                    <td><input type="checkbox" checked={selectedInventories.includes(inventory._id)} onChange={() => handleSelectInventory(inventory._id)} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No items available</td>
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

export default Inventories;
