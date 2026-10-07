/** Static catalogue + user/order data mirroring the prototype copy. */

export type Category = 'Burgers' | 'Pizza' | 'Sushi' | 'Desserts' | 'Drinks';

export const categories: Category[] = ['Burgers', 'Pizza', 'Sushi', 'Desserts', 'Drinks'];

export type Dish = {
  id: string;
  name: string;
  /** Short descriptor shown under the name on cards. */
  blurb: string;
  price: number;
  category: Category;
  rating: number;
  reviews: number;
  /** Figma badge text, e.g. "CHEF'S SPECIAL". */
  badge?: string;
  description: string;
  image: any;
};

export const dishes: Dish[] = [
  {
    id: 'angus-burger',
    name: 'Gourmet Angus Burger',
    blurb: 'Cooked Fresh To Order',
    price: 345,
    category: 'Burgers',
    rating: 4.9,
    reviews: 128,
    badge: "CHEF'S SPECIAL",
    description:
      'Indulge in a premium masterpiece featuring a flame-grilled Angus beef patty, melted cheddar, caramelized onions and house truffle aioli. Served hot on a toasted brioche bun.',
    image: require('../design/assets/angus-burger.png'),
  },
  {
    id: 'truffle-burger',
    name: 'Ultimate Angus Truffle Burger',
    blurb: 'Cooked Fresh To Order',
    price: 345,
    category: 'Burgers',
    rating: 4.9,
    reviews: 32,
    badge: "CHEF'S SPECIAL",
    description:
      'Double flame-grilled Angus patties layered with aged cheddar, crisp lettuce and vine tomatoes, finished with truffle aioli. Served hot with rosemary fries.',
    image: require('../design/assets/truffle-burger.png'),
  },
  {
    id: 'napolitan-pizza',
    name: 'Classic Neapolitan Pizza',
    blurb: 'Cooked Fresh To Order',
    price: 420,
    category: 'Pizza',
    rating: 4.8,
    reviews: 96,
    description:
      'Stone-baked sourdough base, San Marzano tomato, fior di latte and hand-torn basil. Finished in a wood-fired oven for a blistered, leopard-spotted crust.',
    image: require('../design/assets/napolitan-pizza.png'),
  },
  {
    id: 'sushi-set',
    name: 'Premium Sushi Set',
    blurb: 'Prepared Fresh Daily',
    price: 580,
    category: 'Sushi',
    rating: 4.9,
    reviews: 77,
    description:
      'Chef selection of nigiri, sashimi and hand-pressed maki, served with wasabi, pickled ginger and soy.',
    image: require('../design/assets/placeholder-sushi-set.png'),
  },
  {
    id: 'dessert-platter',
    name: 'Signature Dessert Platter',
    blurb: 'Prepared Fresh Daily',
    price: 395,
    category: 'Desserts',
    rating: 4.8,
    reviews: 41,
    description:
      'A generous assortment of chef-made desserts to finish your meal.',
    image: require('../design/assets/placeholder-dessert-platter.png'),
  },
  {
    id: 'chicken-burger',
    name: 'Crispy Chicken Zinger Burger',
    blurb: 'Cooked Fresh To Order',
    price: 295,
    category: 'Burgers',
    rating: 4.6,
    reviews: 63,
    description:
      'Buttermilk-brined chicken thigh fried to order, with pickled slaw, chipotle mayo and lettuce on a toasted sesame bun.',
    image: require('../design/assets/placeholder-chicken-burger.png'),
  },
  {
    id: 'four-cheese-pizza',
    name: 'Four Cheese Bianca',
    blurb: 'Stone Baked To Order',
    price: 445,
    category: 'Pizza',
    rating: 4.7,
    reviews: 58,
    description:
      'No tomato base - mozzarella, gorgonzola, aged parmesan and creamy ricotta finished with wild rocket and honey.',
    image: require('../design/assets/napolitan-pizza.png'),
  },
  {
    id: 'pepperoni-pizza',
    name: 'Spicy Pepperoni Inferno',
    blurb: 'Stone Baked To Order',
    price: 465,
    category: 'Pizza',
    rating: 4.8,
    reviews: 112,
    description:
      'Cup-and-char pepperoni, San Marzano base, mozzarella and a chilli-honey finish on a blistered leopard-spotted crust.',
    image: require('../design/assets/napolitan-pizza.png'),
  },
  {
    id: 'salmon-nigiri',
    name: 'Salmon Nigiri Board',
    blurb: 'Prepared Fresh Daily',
    price: 495,
    category: 'Sushi',
    rating: 4.8,
    reviews: 52,
    description:
      'Eight pieces of hand-cut salmon over seasoned rice, served chilled with shiso, daikon and ponzu.',
    image: require('../design/assets/placeholder-salmon-nigiri.png'),
  },
  {
    id: 'tuna-maki',
    name: 'Spicy Tuna Maki Roll',
    blurb: 'Prepared Fresh Daily',
    price: 365,
    category: 'Sushi',
    rating: 4.7,
    reviews: 44,
    description:
      'Chopped bluefin tuna, scallion and sesame rolled in nori with a light chili mayo glaze.',
    image: require('../design/assets/placeholder-tuna-maki.png'),
  },
  {
    id: 'chocolate-cake',
    name: 'Molten Chocolate Cake',
    blurb: 'Baked To Order',
    price: 285,
    category: 'Desserts',
    rating: 4.9,
    reviews: 88,
    description:
      'Warm dark chocolate fondant with a liquid centre, served with vanilla bean gelato.',
    image: require('../design/assets/placeholder-chocolate-cake.png'),
  },
  {
    id: 'matcha-cheesecake',
    name: 'Matcha Cheesecake Slice',
    blurb: 'Chilled Daily',
    price: 265,
    category: 'Desserts',
    rating: 4.6,
    reviews: 37,
    description:
      'Baked cream-cheesecake on a delicate biscuit base, finished with ceremonial matcha and white chocolate.',
    image: require('../design/assets/placeholder-matcha-cheesecake.png'),
  },
  {
    id: 'mango-shake',
    name: 'Organic Mango Shake',
    blurb: 'Blended To Order',
    price: 150,
    category: 'Drinks',
    rating: 4.7,
    reviews: 54,
    description:
      'Ripe organic mango blended with coconut milk and a hint of vanilla. Thick, chilled and served over ice.',
    image: require('../design/assets/placeholder-mango-shake.png'),
  },
  {
    id: 'iced-lemonade',
    name: 'Fresh Iced Lemonade',
    blurb: 'Brewed To Order',
    price: 120,
    category: 'Drinks',
    rating: 4.5,
    reviews: 29,
    description:
      'Hand-squeezed lemons, cane sugar and plenty of ice. Sweetened to order.',
    image: require('../design/assets/placeholder-lemonade.png'),
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew Coffee',
    blurb: 'Brewed Daily',
    price: 140,
    category: 'Drinks',
    rating: 4.7,
    reviews: 66,
    description:
      'Single-origin arabica steeped for eighteen hours, served over ice with an optional splash of milk.',
    image: require('../design/assets/placeholder-cold-brew.png'),
  },
];

export function dishById(id: string) {
  return dishes.find((d) => d.id === id) ?? dishes[0];
}

export type CartLine = { dish: Dish; qty: number };


export type SeedUser = never;


export const address = {
  label: 'Home (Primary Address)',
  line: '128 Orchid Street, Barangay Kapitolyo, Pasig City, Metro Manila, 1603',
};

export const rider = {
  name: 'Kuya Jun (Your Rider)',
  note: 'On-route to retrieve fresh items',
};

export const settings = [
  { id: 'profile', title: 'Edit Profile', sub: 'Change username, email and default phone number', icon: 'person' },
  { id: 'orders', title: 'My Orders', sub: 'View all active, completed and canceled culinary requests', icon: 'list' },
  { id: 'address', title: 'Delivery Addresses', sub: 'Configure shipping details for home, work or alternative hubs', icon: 'pin' },
  { id: 'payment', title: 'Payment Settings', sub: 'Visa, Mastercard, digital wallets link options', icon: 'card' },
  { id: 'config', title: 'App Configuration & Notifications', sub: 'Manage alarms, bedtime trackers, push updates', icon: 'sliders' },
];

export const peso = (n: number) => `₱${n.toLocaleString('en-PH')}`;
