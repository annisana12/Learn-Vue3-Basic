<template>
  <header class="top-bar spread">
    <nav class="top-bar-nav">
      <router-link to="/" class="top-bar-link">
        <i class="icofont-spoon-and-fork"></i>
        <span>Home</span>
      </router-link>
      <router-link to="/products" class="top-bar-link">
        <span>Products</span>
      </router-link>
      <router-link to="/past-orders" class="top-bar-link">
        <span>Past Orders</span>
      </router-link>
    </nav>
    <div @click="toggleSideBar" class="top-bar-cart-link">
      <i class="icofont-cart-alt icofont-1x"></i>
      <span>Cart ({{ totalItems }})</span>
    </div>
  </header>
  <router-view :inventory="inventory" :addToCart="addToCart" />

  <Sidebar v-if="showSideBar" :toggle="toggleSideBar" :cart="cart" :inventory="inventory" :remove="removeItem" />
</template>

<style>
* {
  margin: 0;
}
</style>

<script>
// @ is an alias to /src
import Sidebar from '@/components/Sidebar.vue'
import food from './food.json'

export default {
  components: {
    Sidebar
  },
  data () {
    return {
      showSideBar: false,
      inventory: food,
      cart: {}
    }
  },
  computed: {
    totalItems () {
      let total = 0
      const productQuantityArray = Object.values(this.cart)

      if (productQuantityArray.length) {
        total = productQuantityArray.reduce((acc, curr) => acc + curr)
      }

      return total
    }
  },
  methods: {
    addToCart (product, quantity) {
      if (!this.cart[product.name]) {
        this.cart[product.name] = 0
      }

      this.cart[product.name] += quantity
    },
    toggleSideBar () {
      this.showSideBar = !this.showSideBar
    },
    removeItem (name) {
      delete this.cart[name]
    }
  }
}
</script>
