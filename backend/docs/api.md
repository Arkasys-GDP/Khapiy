# Kaphiy Core API Reference

The Kaphiy Core API is an RESTful architectural service built on top of NestJS. This documentation outlines the system's endpoints, expected payloads, and default responses. 

## Base URL
All API endpoints are relative to the environments configured base URL. In local development environments, the standard prefix applies:
`http://localhost:3000/api`

## Content Type
All requests must be encoded as `application/json` unless otherwise specified. A standard client request must include the `Content-Type: application/json` header for POST and PATCH operations.

## OpenAPI Documentation
An automated OpenAPI (Swagger) interface is integrated within the server lifecycle. To visualize the schema and execute dry-run requests, navigate to the `/api` route via any web browser when the application is running.

---

## 1. Orders Resource

The orders object represents a point-of-sale transaction within the restaurant flow, coordinating items, tables, and fulfillment statuses.

### Endpoints

| Method | Endpoint      | Description |
|--------|--------------|-------------|
| GET    | `/orders`    | Retrieves a paginated list of all registered orders. |
| GET    | `/orders/:id`| Retrieves single order details, including related `orderItems` and `table` associations. |
| POST   | `/orders`    | Commits a new order transaction to the database. |
| PATCH  | `/orders/:id`| Partially updates the root fields of an order object and overrides related items if specified. |
| DELETE | `/orders/:id`| Cascades delete operations, removing both `orderItems` and the parent `order` from persistence. |

### POST/PATCH Payload Schema

```json
{
  "tableId": 1, 
  "paymentStatus": "PENDING", 
  "kitchenStatus": "WAITING", 
  "chatSessionId": "2cd8f331-b682-42da-9ffb-94d1ab5de193", 
  "paymentCode": "732XDA",
  "items": [
    {
      "productId": 5,
      "quantity": 2,
      "aiNotes": "Sin azúcar añadida"
    }
  ]
}
```
*Note: `tableId`, `chatSessionId`, `paymentCode`, and `aiNotes` are strictly optional. Enums strictly accept valid `PaymentStatus` (PENDING, PAID, CANCELLED) and `KitchenStatus` (WAITING, PREPARING, READY, DELIVERED).*

---

## 2. Products Resource

The product catalog object is the fundamental inventory entity.

### Endpoints

| Method | Endpoint        | Description |
|--------|-----------------|-------------|
| GET    | `/products`     | Returns the complete menu, joining categories and relations with `productIngredients`. |
| GET    | `/products/:id` | Returns the specified product tree. |
| POST   | `/products`     | Registers a new product linking to a root category. |
| PATCH  | `/products/:id` | Updates price, availability, or restructures ingredient associations. |
| DELETE | `/products/:id` | Deletes the product. |

### POST/PATCH Payload Schema

```json
{
  "name": "Mocha Clásico",
  "categoryId": 1,
  "price": 3.50,
  "aiDescription": "Mezcla robusta con toques de cacao dulce.",
  "isAvailable": true,
  "ingredients": [
     { "ingredientId": 2, "isOptional": false }
  ]
}
```
*Note: `price` must meet decimal constraint specifications.*

---

## 3. Categories Resource

Classification nodes utilized for menu sorting mechanisms.

### Endpoints

| Method | Endpoint          | Description |
|--------|-------------------|-------------|
| GET    | `/categories`     | Lists structural categories. |
| GET    | `/categories/:id` | Lists single category details. |
| POST   | `/categories`     | Creates a base category element. |
| PATCH  | `/categories/:id` | Updates structural details (e.g. `isActive` state). |
| DELETE | `/categories/:id` | Issues a permanent deletion command. |

### POST/PATCH Payload Schema

```json
{
  "name": "Bebidas Calientes",
  "isActive": true
}
```

---

## 4. Ingredients Resource

Granular stock items which compose related standard products.

### Endpoints

| Method | Endpoint            | Description |
|--------|---------------------|-------------|
| GET    | `/ingredients`      | Retrieves stock item collection. |
| GET    | `/ingredients/:id`  | Focuses on a single ingredient metadata instance. |
| POST   | `/ingredients`      | Ingests logic for new ingredient definition. |
| PATCH  | `/ingredients/:id`  | Standard update vector. |
| DELETE | `/ingredients/:id`  | Hard delete for target identifier. |

### POST/PATCH Payload Schema

```json
{
  "name": "Leche Deslactosada",
  "isAllergen": false
}
```

---

## 5. Tables Resource

Spatial distribution nodes mapping physical or designated logical space to active orders.

### Endpoints

| Method | Endpoint        | Description |
|--------|-----------------|-------------|
| GET    | `/tables`       | Lists available spaces spanning all physical configurations. |
| GET    | `/tables/:id`   | Verifies state of local table. |
| POST   | `/tables`       | Instantiates a new tracking space. |
| PATCH  | `/tables/:id`   | Mutates values like name and occupancy enumeration. |
| DELETE | `/tables/:id`   | Deletes table definition tracking. |

### POST/PATCH Payload Schema

```json
{
  "tableName": "Mesa Principal 01",
  "status": "Available" 
}
```
*Note: `status` constraints accept ONLY defined states: `Available`, `Occupied`, or `Reserved`.*
