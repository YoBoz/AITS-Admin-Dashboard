import type { MenuCategory } from '@/types/menu.types';

export const mockMenuCategories: MenuCategory[] = [
  {
    id: 'cat-hot-drinks',
    name: 'Hot Drinks',
    description: 'Freshly brewed coffees and teas',
    sort_order: 1,
    is_available: true,
    items: [
      {
        id: 'item-americano', category_id: 'cat-hot-drinks', name: 'Americano', description: 'Rich espresso diluted with hot water for a smooth, bold taste.',
        price: 4.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 3,
        allergens: [], tags: ['Popular'], status: 'published', sort_order: 1,
        modifier_groups: [
          { id: 'mg-milk', name: 'Milk Type', required: false, min_select: 0, max_select: 1, options: [
            { id: 'opt-whole', name: 'Whole Milk', price: 0, is_available: true },
            { id: 'opt-oat', name: 'Oat Milk', price: 0.50, is_available: true },
            { id: 'opt-almond', name: 'Almond Milk', price: 0.50, is_available: true },
            { id: 'opt-soy', name: 'Soy Milk', price: 0.50, is_available: true },
          ]},
          { id: 'mg-size', name: 'Size', required: true, min_select: 1, max_select: 1, options: [
            { id: 'opt-regular', name: 'Regular', price: 0, is_available: true },
            { id: 'opt-large', name: 'Large', price: 1.00, is_available: true },
          ]},
        ],
      },
      {
        id: 'item-cappuccino', category_id: 'cat-hot-drinks', name: 'Cappuccino', description: 'Espresso with steamed milk and a thick layer of foam.',
        price: 5.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 4,
        allergens: ['Dairy'], tags: ['Popular'], status: 'published', sort_order: 2,
        modifier_groups: [
          { id: 'mg-cap-size', name: 'Size', required: true, min_select: 1, max_select: 1, options: [
            { id: 'opt-cap-reg', name: 'Regular', price: 0, is_available: true },
            { id: 'opt-cap-lg', name: 'Large', price: 1.00, is_available: true },
          ]},
        ],
      },
      {
        id: 'item-latte', category_id: 'cat-hot-drinks', name: 'Caffè Latte', description: 'Smooth espresso with velvety steamed milk.',
        price: 5.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 4,
        allergens: ['Dairy'], tags: [], status: 'published', sort_order: 3, modifier_groups: [],
      },
      {
        id: 'item-flat-white', category_id: 'cat-hot-drinks', name: 'Flat White', description: 'Velvety double ristretto with micro-foam milk.',
        price: 5.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 4,
        allergens: ['Dairy'], tags: [], status: 'published', sort_order: 4, modifier_groups: [],
      },
      {
        id: 'item-espresso', category_id: 'cat-hot-drinks', name: 'Espresso', description: 'Intense, concentrated shot of coffee.',
        price: 3.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 2,
        allergens: [], tags: [], status: 'published', sort_order: 5, modifier_groups: [],
      },
      {
        id: 'item-mocha', category_id: 'cat-hot-drinks', name: 'Mocha', description: 'Rich chocolate combined with espresso and steamed milk.',
        price: 6.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: true, prep_time_minutes: 5,
        allergens: ['Dairy'], tags: [], status: 'published', sort_order: 6, modifier_groups: [],
      },
      {
        id: 'item-chai', category_id: 'cat-hot-drinks', name: 'Chai Latte', description: 'Spiced tea blended with steamed milk.',
        price: 5.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 4,
        allergens: ['Dairy'], tags: ['Spicy'], status: 'published', sort_order: 7, modifier_groups: [],
      },
      {
        id: 'item-matcha-latte', category_id: 'cat-hot-drinks', name: 'Matcha Latte', description: 'Premium Japanese matcha whisked with steamed milk.',
        price: 6.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 4,
        allergens: ['Dairy'], tags: ['New'], status: 'draft', sort_order: 8, modifier_groups: [],
      },
    ],
  },
  {
    id: 'cat-cold-drinks',
    name: 'Cold Drinks',
    description: 'Refreshing iced beverages',
    sort_order: 2,
    is_available: true,
    items: [
      {
        id: 'item-iced-americano', category_id: 'cat-cold-drinks', name: 'Iced Americano', description: 'Chilled espresso over ice.',
        price: 5.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 2,
        allergens: [], tags: ['Popular'], status: 'published', sort_order: 1, modifier_groups: [],
      },
      {
        id: 'item-iced-latte', category_id: 'cat-cold-drinks', name: 'Iced Latte', description: 'Espresso and milk served over ice.',
        price: 5.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 3,
        allergens: ['Dairy'], tags: [], status: 'published', sort_order: 2, modifier_groups: [],
      },
      {
        id: 'item-cold-brew', category_id: 'cat-cold-drinks', name: 'Cold Brew', description: 'Slow-steeped for 20 hours, smooth and refreshing.',
        price: 5.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 1,
        allergens: [], tags: [], status: 'published', sort_order: 3, modifier_groups: [],
      },
      {
        id: 'item-fresh-oj', category_id: 'cat-cold-drinks', name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice.',
        price: 6.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 3,
        allergens: [], tags: ['Healthy'], status: 'published', sort_order: 4, modifier_groups: [],
      },
      {
        id: 'item-smoothie', category_id: 'cat-cold-drinks', name: 'Berry Smoothie', description: 'Mixed berries blended with yogurt and honey.',
        price: 7.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 4,
        allergens: ['Dairy'], tags: ['Healthy'], status: 'published', sort_order: 5, modifier_groups: [],
      },
      {
        id: 'item-sparkling', category_id: 'cat-cold-drinks', name: 'Sparkling Water', description: 'Chilled carbonated mineral water.',
        price: 3.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 1,
        allergens: [], tags: [], status: 'published', sort_order: 6, modifier_groups: [],
      },
    ],
  },
  {
    id: 'cat-food',
    name: 'Food',
    description: 'Sandwiches, salads, and warm bites',
    sort_order: 3,
    is_available: true,
    items: [
      {
        id: 'item-croissant', category_id: 'cat-food', name: 'Butter Croissant', description: 'Flaky, buttery French croissant.',
        price: 3.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 2,
        allergens: ['Gluten', 'Dairy', 'Eggs'], tags: ['Popular'], status: 'published', sort_order: 1, modifier_groups: [],
      },
      {
        id: 'item-club-sandwich', category_id: 'cat-food', name: 'Club Sandwich', description: 'Triple-decker with chicken, bacon, lettuce, and tomato.',
        price: 12.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 8,
        allergens: ['Gluten', 'Eggs'], tags: [], status: 'published', sort_order: 2, modifier_groups: [],
      },
      {
        id: 'item-caesar-salad', category_id: 'cat-food', name: 'Caesar Salad', description: 'Romaine lettuce, parmesan, croutons, Caesar dressing.',
        price: 10.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 5,
        allergens: ['Gluten', 'Dairy', 'Eggs'], tags: ['Healthy'], status: 'published', sort_order: 3, modifier_groups: [],
      },
      {
        id: 'item-panini', category_id: 'cat-food', name: 'Grilled Panini', description: 'Pressed sandwich with mozzarella, tomato, and pesto.',
        price: 9.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 7,
        allergens: ['Gluten', 'Dairy'], tags: [], status: 'published', sort_order: 4, modifier_groups: [],
      },
      {
        id: 'item-quiche', category_id: 'cat-food', name: 'Quiche Lorraine', description: 'Classic French quiche with bacon and cheese.',
        price: 8.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 5,
        allergens: ['Gluten', 'Dairy', 'Eggs'], tags: [], status: 'published', sort_order: 5, modifier_groups: [],
      },
      {
        id: 'item-wrap', category_id: 'cat-food', name: 'Falafel Wrap', description: 'Crispy falafel with hummus, veggies, and tahini.',
        price: 9.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 6,
        allergens: ['Gluten'], tags: ['Vegan', 'Halal'], status: 'published', sort_order: 6, modifier_groups: [],
      },
      {
        id: 'item-soup', category_id: 'cat-food', name: 'Soup of the Day', description: 'Chef\'s daily selection, served with artisan bread.',
        price: 7.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: true, prep_time_minutes: 3,
        allergens: ['Gluten'], tags: [], status: 'published', sort_order: 7, modifier_groups: [],
      },
      {
        id: 'item-avocado-toast', category_id: 'cat-food', name: 'Avocado Toast', description: 'Smashed avocado on sourdough with chili flakes.',
        price: 8.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 4,
        allergens: ['Gluten'], tags: ['Healthy', 'Vegan'], status: 'published', sort_order: 8, modifier_groups: [],
      },
      {
        id: 'item-eggs-bene', category_id: 'cat-food', name: 'Eggs Benedict', description: 'Poached eggs on muffin with hollandaise.',
        price: 11.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 10,
        allergens: ['Gluten', 'Dairy', 'Eggs'], tags: [], status: 'draft', sort_order: 9, modifier_groups: [],
      },
      {
        id: 'item-beef-slider', category_id: 'cat-food', name: 'Beef Sliders', description: 'Three mini burgers with cheddar and pickles.',
        price: 13.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 12,
        allergens: ['Gluten', 'Dairy'], tags: [], status: 'draft', sort_order: 10, modifier_groups: [],
      },
    ],
  },
  {
    id: 'cat-snacks',
    name: 'Snacks',
    description: 'Quick bites and treats',
    sort_order: 4,
    is_available: true,
    items: [
      {
        id: 'item-muffin', category_id: 'cat-snacks', name: 'Blueberry Muffin', description: 'Soft muffin loaded with fresh blueberries.',
        price: 4.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 1,
        allergens: ['Gluten', 'Dairy', 'Eggs'], tags: [], status: 'published', sort_order: 1, modifier_groups: [],
      },
      {
        id: 'item-cookie', category_id: 'cat-snacks', name: 'Chocolate Chip Cookie', description: 'Freshly baked with Belgian chocolate chips.',
        price: 3.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 1,
        allergens: ['Gluten', 'Dairy', 'Eggs', 'Nuts'], tags: ['Popular'], status: 'published', sort_order: 2, modifier_groups: [],
      },
      {
        id: 'item-brownie', category_id: 'cat-snacks', name: 'Double Chocolate Brownie', description: 'Fudgy, rich chocolate brownie.',
        price: 4.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 1,
        allergens: ['Gluten', 'Dairy', 'Eggs'], tags: [], status: 'published', sort_order: 3, modifier_groups: [],
      },
      {
        id: 'item-granola', category_id: 'cat-snacks', name: 'Granola Bar', description: 'Oats, honey, and dried fruit energy bar.',
        price: 3.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 1,
        allergens: ['Gluten', 'Nuts'], tags: ['Healthy'], status: 'published', sort_order: 4, modifier_groups: [],
      },
      {
        id: 'item-chips', category_id: 'cat-snacks', name: 'Mixed Nuts', description: 'Premium roasted and salted nut mix.',
        price: 5.00, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 1,
        allergens: ['Nuts'], tags: ['Healthy'], status: 'published', sort_order: 5, modifier_groups: [],
      },
      {
        id: 'item-fruit-cup', category_id: 'cat-snacks', name: 'Fresh Fruit Cup', description: 'Seasonal mixed fruit cup.',
        price: 5.50, currency: 'USD', image_url: null, is_available: true, is_out_of_stock: false, prep_time_minutes: 2,
        allergens: [], tags: ['Healthy', 'Vegan'], status: 'published', sort_order: 6, modifier_groups: [],
      },
    ],
  },
];
