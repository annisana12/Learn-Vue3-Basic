let app = Vue.createApp({
    data() {
        return {
            inventory: [],
            cart: {},
            showSideBar: false
        }
    },
    computed: {
        totalItems() {
            let total = 0;
            const productQuantityArray = Object.values(this.cart);

            if (productQuantityArray.length) {
                total = productQuantityArray.reduce((acc, curr) => acc + curr);
            }

            return total
        }
    },
    methods: {
        addToCart(product) {
            if (!this.cart[product.name]) {
                this.cart[product.name] = 0;
            }

            this.cart[product.name] += product.quantity
            product.quantity = 0;
        },
        toggleSideBar() {
            this.showSideBar = !this.showSideBar
        },
        removeItem(name) {
            delete this.cart[name]
        }
    },
    async mounted() {
        const res = await fetch('./food.json');
        const data = await res.json();
        this.inventory = data;
    }
})

app.component('sidebar', {
    template: `
        <aside class="cart-container">
          <div class="cart">
            <h1 class="cart-title spread">
              <span>
                Cart
                <i class="icofont-cart-alt icofont-1x"></i>
              </span>
              <button @click="toggle" class="cart-close">&times;</button>
            </h1>

            <div class="cart-body">
              <table class="cart-table">
                <thead>
                  <tr>
                    <th><span class="sr-only">Product Image</span></th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th><span class="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(quantity, key, i) in cart" :key="i">
                    <td><i :class="'icofont-' + getProductIcon(key) + ' icofont-3x'"></i></td>
                    <td>{{key}}</td>
                    <td>{{getPrice(key)}}</td>
                    <td class="center">{{quantity}}</td>
                    <td>\${{(quantity * getPrice(key)).toFixed(2)}}</td>
                    <td class="center">
                      <button @click="remove(key)" class="btn btn-light cart-remove">
                        &times;
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
              <div class="spread">
                <span><strong>Total:</strong> \${{calculateTotal()}}</span>
                <button class="btn btn-light">Checkout</button>
              </div>
            </div>
          </div>
        </aside>
      `,
    props: ['toggle', 'cart', 'inventory', 'remove'],
    methods: {
        getProductIcon(name) {
            const product = this.inventory.find(p => p.name === name);
            return product.icon
        },
        getPrice(name) {
            const product = this.inventory.find(p => p.name === name);
            return product.price.USD
        },
        calculateTotal() {
            let total = 0;
            const cartItemsArray = Object.entries(this.cart);

            if (cartItemsArray.length) {
                total = cartItemsArray.reduce((acc, curr) => acc + (curr[1] * this.getPrice(curr[0])), 0);
            }

            return total.toFixed(2)
        }
    }
})

app.mount('#app')