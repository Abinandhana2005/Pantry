'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, MenuItem, Select, InputLabel, FormControl, IconButton } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#FAF3E0', // Light cream
  border: '2px solid #D8CAB8', // Warm beige
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const colors = {
  headerBg: '#C8D5B9', // Light olive green
  rowBg: '#F4F4F9', // Pale gray
  buttonBg: '#8A9A5B', // Muted green
  buttonText: '#FFFFFF', // White
  textPrimary: '#333333', // Dark gray
  textSecondary: '#666666', // Gray
  removeButton: '#FF6F61', // Pastel red
  actionButton: '#4CAF50' // Pastel green
};

const categories = ['Baking', 'Beverage', 'Spices', 'Snacks', 'Sauce', 'Fruits', 'Vegetables']; // Example categories

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() });
      });
      setInventory(inventoryList);
      setFilteredInventory(inventoryList); // Update filtered inventory as well
    } catch (error) {
      console.error("Error updating inventory: ", error);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item => 
      item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  const addItem = async () => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), itemName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { 
          quantity: quantity + 1, 
          category,
          description
        }, { merge: true });
      } else {
        await setDoc(docRef, { 
          quantity: 1,
          category,
          description
        });
      }
      setItemName('');
      setCategory('');
      setDescription('');
      handleClose();
      await updateInventory();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const updateQuantity = async (item, increment) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity + increment <= 0) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity + increment }, { merge: true });
        }
      }
      await updateInventory();
    } catch (error) {
      console.error("Error updating quantity: ", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      sx={{ bgcolor: '#EAF0F1', p: 2 }}
    >
      {/* Add the heading here */}
      <Typography variant="h3" sx={{ mb: 2, color: '#021050', textAlign: 'center' }}>
        Pantry Management
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              id="item-name"
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="item-description"
              label="Description"
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={addItem}
              sx={{ bgcolor: colors.buttonBg, color: colors.buttonText }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <TextField
        id="search-bar"
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2, maxWidth: 800 }} // Ensure the search bar is wide enough
      />
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ bgcolor: colors.buttonBg, color: colors.buttonText, mb: 2 }}
      >
        Add New Item
      </Button>
      <Box
        width="80%"
        bgcolor={'#FFFFFF'}
        border={'1px solid #E0E0E0'}
        borderRadius={1}
        boxShadow={2}
        padding={2}
        sx={{ overflow: 'auto' }} // Ensure overflow is handled properly
      >
        <Box
          display="grid"
          gridTemplateColumns="1fr 2fr 3fr 1fr 1fr"
          bgcolor={colors.headerBg}
          padding={2}
          borderBottom={'1px solid #E0E0E0'}
          alignItems="center"
          position="sticky"
          top={0}
          zIndex={1}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Item</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Category</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Description</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Quantity</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Actions</Typography>
        </Box>
        <Stack spacing={2}>
          {filteredInventory.map(({name, quantity, category, description}) => (
            <Box
              key={name}
              display="grid"
              gridTemplateColumns="1fr 2fr 3fr 1fr 1fr"
              bgcolor={colors.rowBg}
              padding={2}
              borderBottom={'1px solid #E0E0E0'}
              alignItems="center"
            >
              <Typography variant="body1">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography variant="body1">{category}</Typography>
              <Typography variant="body1">{description}</Typography>
              <Typography variant="body1">{quantity}</Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  sx={{ color: colors.actionButton }}
                  onClick={() => updateQuantity(name, 1)}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  sx={{ color: colors.actionButton }}
                  onClick={() => updateQuantity(name, -1)}
                >
                  <RemoveIcon />
                </IconButton>
                <Button
                  variant="contained"
                  sx={{ bgcolor: colors.removeButton, color: colors.buttonText }}
                  onClick={() => updateQuantity(name, -quantity)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
