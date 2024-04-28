(ns cwithmichael.clj-shopping.web.controllers.products
  (:require [clojure.data.json :as json]
            [cwithmichael.clj-shopping.web.routes.utils :as utils]
            [taoensso.carmine :as car :refer [wcar]]
            [ring.util.http-response :as http-response]))

(defn read-products
  "Read products from a pre-loaded JSON file."
  []
  (json/read-str (slurp "./products.json")))

(defn index
  "Fetch all products."
  [request]
  (let [{:keys [db]} (utils/route-data request)]
    (if-let [product-keys (wcar db (car/keys "product:*"))]
      (let [products (wcar db (apply car/mget product-keys))]
        (http-response/ok products))
      (let [products (read-products)]
        (doseq [product products]
          (wcar db (car/set (format "product:%s" (product "id")) product)))
        (http-response/ok products)))))

(defn get-product
  "Fetch a product by ID."
  [request]
  (let [{:keys [db]} (utils/route-data request)
        id (-> request :path-params :id)]
    (if-let [product (wcar db (car/get (format "product:%s" id)))]
      (http-response/ok product)
      (http-response/not-found))))

(defn reset-products!
  "Reset products to the initial state."
  [request]
  (let [{:keys [db]} (utils/route-data request)
        products (read-products)
        cart-keys (wcar db (car/keys "cart:*"))]
    (when (seq cart-keys) (wcar db (apply car/del cart-keys)))
    (doseq [product products]
      (wcar db (car/set (format "product:%s" (product "id")) product)))
    (http-response/ok)))