(ns cwithmichael.clj-shopping.web.controllers.cart
  (:require
   [cwithmichael.clj-shopping.web.routes.utils :as utils]
   [taoensso.carmine :as car :refer [wcar]]
   [ring.util.http-response :as http-response]))

(defn index
  "Fetch all cart items for the current session."
  [request]
  (let [{:keys [db]} (utils/route-data request)
        cart-id (-> request :session :cart-id)]
    (if-let
     [cart-items-db (wcar db (car/hgetall (format "cart:%s" cart-id)))]
      (http-response/ok (reduce (fn [acc item]
                                  (let [product (wcar db (car/get (first item)))]
                                    (conj acc {:product product :cart_quantity (parse-long (second item))})))
                                []
                                (partition 2 cart-items-db)))
      (http-response/ok []))))

(defn- get-quantity-in-cart
  "Get the quantity of a product in the cart."
  [db cart-id product-id]
  (if-let [quantity-in-cart (wcar db (car/hget (format "cart:%s" cart-id)  (format "product:%s" product-id)))]
    (parse-long quantity-in-cart)
    0))

(defn delete-item!
  "Remove a product from the cart."
  [request]
  (let [{:keys [db]} (utils/route-data request)
        cart-id (-> request :session :cart-id)
        product-id (-> request :path-params :id)
        quantity-in-cart (get-quantity-in-cart db cart-id product-id)]
    (when (> quantity-in-cart 0)
      (let [product-db (wcar db (car/get (format "product:%s" product-id)))
            new-stock (+ (product-db "stock") quantity-in-cart)]
        (wcar db (car/hdel (format "cart:%s" cart-id) (format "product:%s" product-id))
              (car/set (format "product:%s" product-id) (assoc product-db "stock" new-stock)))))
    (http-response/no-content)))

(defn clear-cart!
  "Remove all products from the cart."
  [request]
  (let [{:keys [db]} (utils/route-data request)
        cart-id (-> request :session :cart-id)
        cart-items-db (wcar db (car/hgetall (format "cart:%s" cart-id)))]
    (when (seq cart-items-db)
      (doseq [item (partition 2 cart-items-db)]
        (let [product-id (first item)
              quantity (parse-long (second item))
              product-db (wcar db (car/get product-id))
              new-stock (+ (product-db "stock") quantity)]
          (wcar db (car/hdel (format "cart:%s" cart-id) product-id)
                (car/set product-id (assoc product-db "stock" new-stock)))))
      (http-response/no-content))))

(defn update-cart!
  "Update the quantity of a product in the cart."
  [request]
  (let [{:keys [db]} (utils/route-data request)
        cart-id (-> request :session :cart-id)
        product-id (-> request :path-params :id)
        {:keys [quantity increment-by]} (-> request :parameters :body)]
    (if-let    [product-db (wcar db (car/get (format "product:%s" product-id)))]
      (let [stock (product-db "stock")
            quantity-in-cart (get-quantity-in-cart db cart-id product-id)]
        (when (some? quantity)
          (let [quantity (int quantity)
                new-stock (- stock (- quantity quantity-in-cart))]
            (if (>= new-stock 0)
              (do (wcar db (car/hset (format "cart:%s" cart-id) (format "product:%s" product-id) quantity)
                        (car/set (format "product:%s" product-id) (assoc product-db "stock" new-stock)))
                  (http-response/ok))
              (http-response/bad-request {:message "Not enough stock"}))))
        (when (some? increment-by)
          (let [quantity-after-increment (+ quantity-in-cart increment-by)
                new-stock (- stock increment-by)]
            (if (and (>= new-stock 0) (>= quantity-after-increment 0))
              (do (wcar db (car/hincrby (format "cart:%s" cart-id) (format "product:%s" product-id) increment-by)
                        (car/set (format "product:%s" product-id) (assoc product-db "stock" new-stock)))
                  (http-response/ok))
              (http-response/bad-request {:message "Not enough stock"})))))
      (http-response/not-found))))
