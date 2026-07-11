# DESIGN.md

# Data Model

The application contains four main collections.

## User

Stores authentication information.

Fields

- name
- email
- password
- role

The role determines whether a user is an Admin or Shopper.

---

## Store

Stores physical store information.

Fields

- name
- location

---

## Product

Stores product details.

Fields

- name
- sku

SKU has a unique index to prevent duplicate products.

---

## Stock

Represents product quantity inside a store.

Fields

- product
- store
- quantity

A compound unique index on:

- product
- store

ensures only one stock document exists for each product-store combination.

---

# Preventing Negative Stock

The application prevents negative stock using MongoDB's atomic update.

During stock transfer, the source stock is updated using:

```javascript
findOneAndUpdate(
  {
    product: productId,
    store: fromStore,
    quantity: { $gte: quantity }
  },
  {
    $inc: {
      quantity: -quantity
    }
  }
)
```

The update succeeds only if sufficient stock is available.

This avoids race conditions that can occur with a read-then-write approach.

Stock adjustments are also validated so the final quantity never becomes negative.

---

# Atomic Transfers

Stock transfers use MongoDB Transactions.

Transfer Flow

1. Start Session
2. Start Transaction
3. Decrease Source Stock
4. Increase Destination Stock
5. Commit Transaction

If any operation fails, the transaction is aborted and no changes are saved.

This guarantees consistency.

---

# Authentication

Authentication uses JWT stored in HTTP-only cookies.

Protected routes require a valid token.

Admin middleware restricts stock modification APIs.

---

# Frontend

The frontend is built using React and Vite.

Admin users can manage stores, products, and stock.

Shopper users have read-only access to products and stock.