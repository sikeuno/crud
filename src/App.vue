<template>
  <div class="container">
    <div :class="form">
      <form @submit.prevent="submitForm">
        <div>
          <label for="name">Product Name</label>
          <input type="text" id="name" placeholder="Enter the Name" required v-model="productName">
        </div>
        <div>
          <label for="desc">Product Description</label>
          <textarea id="desc" placeholder="Enter the Description" required v-model="productDescription"></textarea>
        </div>
        <div>
          <label for="price">Price</label>
          <input type="number" id="price" placeholder="Enter the Price" required v-model="productPrice">
        </div>
        <div>
          <label for="image">Product Image</label>
          <input type="file" id="image" required accept="image/*" @change="handleImageUpload">
        </div>
        <button v-if="!editMode" type="submit">Add Product</button>
        <button v-if="editMode" type="submit">Update Product</button>
      </form>
    </div>

    <table v-if="products.length > 0">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Product Description</th>
          <th>Price</th>
          <th>Product Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="index">
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.price }}</td>
          <td>
            <img :src="product.image" alt="Product Image" width="100">
          </td>
          <td>
            <button class="edit" @click="editProduct(index)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete" @click="deleteProduct(index)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No products available</p>
  </div>
</template>



<script>
import { db } from './firebase.js';
import { collection, addDoc, setDoc, deleteDoc, getDocs,doc } from 'firebase/firestore';

export default {
  data() {
    return {
      form:null,
      productName: '',
      productDescription: '',
      productPrice: '',
      productImage: null,
      products: [],
      editMode: false,
      editIndex: null
    };
  },
  methods: {
    async handleImageUpload(event) {
      this.productImage = event.target.files[0];
    },
    async submitForm() {
      if (this.editMode) {
        await this.updateProduct();
      } else {
        await this.addProduct();
      }
    },
    async addProduct() {
      const newProduct = {
        name: this.productName,
        description: this.productDescription,
        price: this.productPrice,
        image: URL.createObjectURL(this.productImage)
      };

      const docRef = await addDoc(collection(db, 'products'), newProduct);
      newProduct.id = docRef.id;

      this.products.push(newProduct);

      this.resetForm();
    },
    editProduct(index) {
      const productToEdit = this.products[index];

      this.productName = productToEdit.name;
      this.productDescription = productToEdit.description;
      this.productPrice = productToEdit.price;
      this.productImage = null;

      this.editMode = true;
      this.editIndex = index;
    },
    async updateProduct() {
  const updatedProduct = {
    id: this.products[this.editIndex].id, // Add the id property
    name: this.productName,
    description: this.productDescription,
    price: this.productPrice,
    image: this.productImage ? URL.createObjectURL(this.productImage) : null
  };

  const docId = updatedProduct.id; // Use the updatedProduct.id when setting the docId

  if (docId) {
    await setDoc(doc(db, 'products', docId), updatedProduct);
    this.products.splice(this.editIndex, 1, updatedProduct);
    this.resetForm();
  } else {
    console.error('Invalid product data');
  }
},


async deleteProduct(index) {
  const productToDelete = this.products[index];
  
  console.log('productToDelete:', productToDelete);
  console.log('productToDelete.id:', productToDelete && productToDelete.id);
  
  if (productToDelete && productToDelete.id) {
    await deleteDoc(doc(db, 'products', productToDelete.id));
    this.products.splice(index, 1);
  } else {
    console.error("Invalid product data");
  }
},





async fetchProducts() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  querySnapshot.forEach((doc) => {
    const product = doc.data();
    product.id = doc.id;
    this.products.push(product);
  });
},

    resetForm() {
      this.productName = '';
      this.productDescription = '';
      this.productPrice = '';
      this.productImage = null;
      this.editMode = false;
      this.editIndex = null;
    }
  },
  created() {
    this.fetchProducts();
  }
};
</script>



<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input,
textarea {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  justify-content: center;
}

button {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background-color: #42b883;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

button:hover {
  background-color: #2c9055;
}

button:active {
  background-color: #196235;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td
{
padding: 0.5rem;
text-align: left;
border-bottom: 1px solid #ccc;
}

th {
font-weight: bold;
}

tbody tr:last-child td {
border-bottom: none;
}

img {
max-width: 100px;
height: auto;
}

p {
text-align: center;
margin-top: 2rem;
}

.edit{
  
  background-color: blue;
}
.edit:hover{
  
  background-color: lightseagreen;
}
.delete{
  
  background-color: red;
}
.delete:hover{
  
  background-color: rgb(237, 95, 95);
}

</style>
