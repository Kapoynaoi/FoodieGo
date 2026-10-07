import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from 'react-native';

import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

import Shell from '../components/Shell';
import { CategoryIcon, PlusIcon } from '../components/Icons';
import { brand, surface, text, radius } from '../theme';
import { useLayout } from '../responsive';

import {
  categories,
  dishes as staticDishes,
  peso,
  Category,
  Dish,
} from '../data';

import { useAuth } from '../store/auth';

import {
  db,
  initDatabase,
  addProduct,
  deleteProduct,
} from '../services/db';

type DatabaseProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};

export default function Home() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    s,
    gutter,
    isPortrait,
    railWidth,
  } = useLayout();

  const [active, setActive] = useState<Category>('Burgers');

  const { account } = useAuth();

  const [contentWidth, setContentWidth] = useState(0);

  const [databaseProducts, setDatabaseProducts] = useState<
    DatabaseProduct[]
  >([]);

  const [search, setSearch] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] =
    useState('Burgers');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');

  const loadProducts = (query = '') => {
    try {
      let rows: DatabaseProduct[];

      if (query.trim() === '') {
        rows = db.getAllSync<DatabaseProduct>(
          'SELECT * FROM products ORDER BY id DESC;'
        );
      } else {
        rows = db.getAllSync<DatabaseProduct>(
          `SELECT * FROM products
           WHERE name LIKE ?
           ORDER BY name ASC;`,
          [`%${query}%`]
        );
      }

      setDatabaseProducts(rows);
    } catch (error) {
      console.error('SQLite load error:', error);
    }
  };

  useEffect(() => {
    try {
      initDatabase();
      loadProducts();
    } catch (error) {
      console.error('SQLite initialization error:', error);
    }
  }, []);

  const firstName =
    (account?.name ?? '').trim().split(/\s+/)[0] || 'there';

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good Morning'
      : hour < 18
        ? 'Good Afternoon'
        : 'Good Evening';

  const estimatedW = Math.max(
    0,
    (isPortrait ? width : width - railWidth) -
      gutter * 2
  );

  const gridW =
    contentWidth > 0 ? contentWidth : estimatedW;

  const columns =
    gridW > 700 ? 3 : gridW > 450 ? 2 : 1;

  const cardW =
    columns > 0
      ? Math.floor(
          (gridW - gutter * (columns - 1)) /
            columns
        )
      : 0;

  const getImageForProduct = (product: DatabaseProduct) => {
    const original = staticDishes.find(
      (dish) =>
        dish.name.toLowerCase() ===
        product.name.toLowerCase()
    );

    return original?.image;
  };

  const handleAddProduct = () => {
    if (
      !productName.trim() ||
      !productPrice.trim() ||
      !productStock.trim()
    ) {
      Alert.alert(
        'Missing Information',
        'Please fill in the product name, price, and stock.'
      );
      return;
    }

    const price = Number(productPrice);
    const stock = Number(productStock);

    if (isNaN(price) || isNaN(stock)) {
      Alert.alert(
        'Invalid Input',
        'Price and stock must be valid numbers.'
      );
      return;
    }

    if (price < 0 || stock < 0) {
      Alert.alert(
        'Invalid Input',
        'Price and stock cannot be negative.'
      );
      return;
    }

    try {
      addProduct(
        productName.trim(),
        productCategory,
        price,
        stock
      );

      setProductName('');
      setProductPrice('');
      setProductStock('');
      setProductCategory('Burgers');

      setModalVisible(false);

      loadProducts(search);

      Alert.alert(
        'Success',
        'Product added successfully.'
      );
    } catch (error) {
      console.error('Add product error:', error);

      Alert.alert(
        'Error',
        'Unable to add the product.'
      );
    }
  };

  const handleDeleteProduct = (
    id: number,
    name: string
  ) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              deleteProduct(id);
              loadProducts(search);

              Alert.alert(
                'Deleted',
                'Product deleted successfully.'
              );
            } catch (error) {
              console.error(
                'Delete product error:',
                error
              );

              Alert.alert(
                'Error',
                'Unable to delete the product.'
              );
            }
          },
        },
      ]
    );
  };

  const renderProduct = ({
    item,
  }: {
    item: DatabaseProduct;
  }) => {
    const image = getImageForProduct(item);

    return (
      <View
        style={[
          styles.card,
          {
            width:
              cardW > 0 ? cardW : undefined,
            borderRadius: radius.card,
          },
        ]}
      >
        {image ? (
          <Pressable
            onPress={() => {
              const original = staticDishes.find(
                (dish) =>
                  dish.name.toLowerCase() ===
                  item.name.toLowerCase()
              );

              if (original) {
                router.push(
                  `/dish/${original.id}`
                );
              }
            }}
          >
            <Image
              source={image}
              style={{
                width: '100%',
                height: Math.round(
                  (isPortrait ? 190 : 159) * s
                ),
              }}
              resizeMode="cover"
            />
          </Pressable>
        ) : (
          <View
            style={[
              styles.noImage,
              {
                height: Math.round(
                  (isPortrait ? 190 : 159) * s
                ),
              },
            ]}
          >
            <Text style={styles.noImageText}>
              No Image
            </Text>
          </View>
        )}

        <View
          style={{
            padding: Math.round(14 * s),
          }}
        >
          <Text
            style={[
              styles.cardTitle,
              {
                fontSize: Math.round(15 * s),
              },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <Text
            style={[
              styles.cardBlurb,
              {
                fontSize: Math.round(12 * s),
              },
            ]}
          >
            {item.category} • Stock: {item.stock}
          </Text>

          <View style={styles.priceRow}>
            <Text
              style={[
                styles.price,
                {
                  fontSize: Math.round(16 * s),
                },
              ]}
            >
              {peso(item.price)}
            </Text>

            <Pressable
              onPress={() =>
                handleDeleteProduct(
                  item.id,
                  item.name
                )
              }
              style={[
                styles.deleteBtn,
                {
                  width: Math.round(34 * s),
                  height: Math.round(34 * s),
                  borderRadius: 17,
                },
              ]}
            >
              <Text style={styles.deleteText}>
                ×
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Shell>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + gutter,
          paddingBottom: insets.bottom + gutter,
          paddingHorizontal: gutter,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.greeting,
            {
              fontSize: Math.round(26 * s),
            },
          ]}
          numberOfLines={2}
        >
          {greeting}, {firstName}!
        </Text>

        <Text
          style={[
            styles.sub,
            {
              fontSize: Math.round(14 * s),
              marginBottom: Math.round(24 * s),
            },
          ]}
        >
          What fresh dish would you like to savor today?
        </Text>

        {/* ADD PRODUCT BUTTON */}
        <Pressable
          style={[
            styles.addProductButton,
            {
              borderRadius: radius.card,
              marginBottom: Math.round(16 * s),
              paddingVertical: Math.round(12 * s),
            },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text
            style={[
              styles.addProductText,
              {
                fontSize: Math.round(14 * s),
              },
            ]}
          >
            + Add Product
          </Text>
        </Pressable>

        {/* SEARCH */}
        <TextInput
          style={[
            styles.searchInput,
            {
              borderRadius: radius.card,
              fontSize: Math.round(14 * s),
              marginBottom: Math.round(20 * s),
            },
          ]}
          placeholder="Search products..."
          placeholderTextColor={text.muted}
          value={search}
          onChangeText={(value) => {
            setSearch(value);
            loadProducts(value);
          }}
        />

        <Text
          style={[
            styles.section,
            {
              fontSize: Math.round(17 * s),
              marginBottom: Math.round(12 * s),
            },
          ]}
        >
          Explore Categories
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingRight: gutter,
            paddingBottom: Math.round(20 * s),
          }}
        >
          {categories.map((c) => {
            const on = c === active;

            return (
              <Pressable
                key={c}
                onPress={() => setActive(c)}
                accessibilityRole="button"
                accessibilityState={{
                  selected: on,
                }}
                style={[
                  styles.pill,
                  {
                    paddingHorizontal:
                      Math.round(18 * s),
                    paddingVertical:
                      Math.round(9 * s),
                    borderRadius: radius.pill,
                    marginRight: 10,
                    backgroundColor: on
                      ? brand.deep
                      : surface.raised,
                  },
                ]}
              >
                <View style={{ marginRight: 8 }}>
                  <CategoryIcon
                    name={c}
                    size={Math.round(16 * s)}
                    color={
                      on
                        ? surface.raised
                        : brand.soft
                    }
                  />
                </View>

                <Text
                  style={{
                    color: on
                      ? surface.raised
                      : brand.soft,
                    fontWeight: '700',
                    fontSize: Math.round(14 * s),
                  }}
                >
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Math.round(12 * s),
          }}
        >
          <Text
            style={[
              styles.section,
              {
                fontSize: Math.round(17 * s),
              },
            ]}
          >
            Products
          </Text>

          <Text
            style={[
              styles.productCount,
              {
                fontSize: Math.round(12 * s),
              },
            ]}
          >
            {databaseProducts.length} items
          </Text>
        </View>

        {/* FLATLIST REQUIRED BY LAB */}
        <View
          onLayout={(e) =>
            setContentWidth(
              e.nativeEvent.layout.width
            )
          }
        >
          <FlatList
            data={databaseProducts}
            keyExtractor={(item) =>
              String(item.id)
            }
            renderItem={renderProduct}
            numColumns={columns}
            columnWrapperStyle={
              columns > 1
                ? {
                    gap: gutter,
                    marginBottom: gutter,
                  }
                : undefined
            }
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No products found.
              </Text>
            }
          />
        </View>
      </ScrollView>

      {/* ADD PRODUCT MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                borderRadius: radius.card,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  fontSize: Math.round(20 * s),
                },
              ]}
            >
              Add New Product
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Product name"
              value={productName}
              onChangeText={setProductName}
            />

            <Text
              style={styles.inputLabel}
            >
              Category
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 12 }}
            >
              {categories.map((category) => (
                <Pressable
                  key={category}
                  onPress={() =>
                    setProductCategory(category)
                  }
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor:
                        productCategory ===
                        category
                          ? brand.deep
                          : surface.raised,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        productCategory ===
                        category
                          ? surface.raised
                          : brand.deep,
                      fontWeight: '700',
                    }}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={productPrice}
              onChangeText={setProductPrice}
            />

            <TextInput
              style={styles.input}
              placeholder="Stock"
              keyboardType="numeric"
              value={productStock}
              onChangeText={setProductStock}
            />

            <View
              style={styles.modalButtons}
            >
              <Pressable
                style={styles.cancelButton}
                onPress={() =>
                  setModalVisible(false)
                }
              >
                <Text
                  style={styles.cancelText}
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                style={styles.saveButton}
                onPress={handleAddProduct}
              >
                <Text
                  style={styles.saveText}
                >
                  Save Product
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Shell>
  );
}

const styles = StyleSheet.create({
  greeting: {
    color: brand.deep,
    fontWeight: '800',
    letterSpacing: -0.6,
  },

  sub: {
    color: text.secondary,
  },

  section: {
    color: brand.deep,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  productCount: {
    color: text.muted,
    fontWeight: '600',
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  card: {
    backgroundColor: surface.raised,
    overflow: 'hidden',
    marginBottom: 0,
  },

  cardTitle: {
    color: brand.deep,
    fontWeight: '800',
    letterSpacing: -0.2,
  },

  cardBlurb: {
    color: text.muted,
    marginTop: 4,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  price: {
    color: brand.mid,
    fontWeight: '800',
  },

  addProductButton: {
    backgroundColor: brand.deep,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addProductText: {
    color: surface.raised,
    fontWeight: '800',
  },

  searchInput: {
    backgroundColor: surface.raised,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: brand.deep,
  },

  deleteBtn: {
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteText: {
    color: '#DC2626',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 25,
  },

  noImage: {
    backgroundColor: surface.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noImageText: {
    color: text.muted,
    fontWeight: '600',
  },

  empty: {
    textAlign: 'center',
    color: text.muted,
    marginTop: 30,
    marginBottom: 30,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  modalCard: {
    backgroundColor: surface.raised,
    padding: 20,
  },

  modalTitle: {
    color: brand.deep,
    fontWeight: '800',
    marginBottom: 18,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 12,
    color: brand.deep,
    backgroundColor: surface.raised,
  },

  inputLabel: {
    color: brand.deep,
    fontWeight: '700',
    marginBottom: 8,
  },

  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },

  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  cancelText: {
    color: text.muted,
    fontWeight: '700',
  },

  saveButton: {
    backgroundColor: brand.deep,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 8,
  },

  saveText: {
    color: surface.raised,
    fontWeight: '800',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});