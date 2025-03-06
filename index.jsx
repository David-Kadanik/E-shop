import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, useWindowDimensions } from 'react-native';

// Seznam produktů
const products = [
  { id: '1', name: 'Kámen z Karlova mostu', price: '500 CZK', image: require('./images/jedna.jpg'), stock: 5 },
  { id: '2', name: 'Kámen z Velké činské zdi', price: '750 CZK', image: require('./images/dva.jpg'), stock: 3 },
  { id: '3', name: 'Školní toaleta od dodavatele Jirka.s.r.o', price: '1200 CZK', image: require('./images/tri.jpg'), stock: 2 },
  { id: '4', name: 'Ježíšův nos', price: '900 CZK', image: require('./images/ctyri.jpg'), stock: 4 },
  { id: '5', name: 'Adolfův knírek', price: '1100 CZK', image: require('./images/pet.jpg'), stock: 6 },
  { id: '6', name: 'Tajné ingerdience školní jídelny', price: '950 CZK', image: require('./images/sest.jpg'), stock: 1 },
  { id: '7', name: 'Základní kámen Stonehenge', price: '850 CZK', image: require('./images/sedm.jpg'), stock: 5 },
  { id: '8', name: 'Leaknuté úlohy maturity', price: '650 CZK', image: require('./images/osm.jpg'), stock: 3 },
  { id: '9', name: 'Oblečení Thinking mana', price: '1050 CZK', image: require('./images/devet.jpg'), stock: 4 },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const { width } = useWindowDimensions();

 
  const numColumns = width > 1200 ? 3 : width > 800 ? 2 : 1;
  const isWideScreen = width > 800;

  // Přidání produktu do košíku
  function addToCart(product) {
    const cartCount = cart.filter((item) => item.id === product.id).length;

    
    if (cartCount < product.stock) {
      setCart([...cart, product]);
    }
  }

  // Odebrání produktu z košíku
  function removeFromCart(product) {
    const newCart = [...cart];
    const index = newCart.findIndex((item) => item.id === product.id);

    
    if (index !== -1) {
      newCart.splice(index, 1);
      setCart(newCart);
    }
  }

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Bizar Shop</Text>
      
      
      <FlatList
        data={products}

        
        keyExtractor={(item) => item.id}
        key={numColumns.toString()}
        numColumns={numColumns}

        
        contentContainerStyle={styles.productList}
        renderItem={({ item }) => {
          const cartCount = cart.filter((cartItem) => cartItem.id === item.id).length;
          return (
            <View style={styles.productCard}>
              <Image source={item.image} style={styles.productImage} />


              
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              
              <Text style={styles.productStock}>Skladem: {item.stock - cartCount}</Text>
              <TouchableOpacity 
                
                style={[styles.button, cartCount >= item.stock ? styles.buttonDisabled : null]} 
                onPress={() => addToCart(item)}
                disabled={cartCount >= item.stock}
              >
                <Text style={styles.buttonText}>{cartCount >= item.stock ? 'Vyprodáno' : 'Přidat do košíku'}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      
      
      <View style={styles.cartContainer}> 

        
        <Text style={styles.cartTitle}>Košík ({cart.length})</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {cart.map((item, index) => (
            <View key={index} style={styles.cartItemContainer}>

              
              <Text style={styles.cartItem}>{item.name} - {item.price}</Text>
              <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item)}>
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}


          
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    
    color: '#fff',
    marginBottom: 20,
  },
  productList: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productCard: {
    backgroundColor: '#222',
    padding: 30,
    borderRadius: 12,
    margin: 15,
    alignItems: 'center',
    
    width: 350,
  },
  productImage: {
    width: 280,
    height: 280,
    marginBottom: 15,
    borderRadius: 12,
  },
  productName: {
    fontSize: 22,
    color: '#fff',
  },
  productPrice: {
    fontSize: 20,
    
    color: '#ccc',
    marginBottom: 10,
  },
  productStock: {
    fontSize: 18,
    color: '#bbb',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff6600',
    padding: 14,
    
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  cartContainer: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
    minWidth: 320,
    
    maxHeight: 400,
    position: 'absolute',
    right: 20,
    
    top: 80,
  },
  cartTitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 12,
    
    textAlign: 'center',
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    
  },
  cartItem: {
    fontSize: 18,
    color: '#fff',
    
  },
  removeButton: {
    backgroundColor: 'red', 
    borderRadius: 6,
    
    padding: 6,
    marginLeft: 10,
  },
  
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
