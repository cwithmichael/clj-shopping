(ns cwithmichael.clj-shopping.web.controllers.products
  (:require [clojure.data.json :as json]
            [cwithmichael.clj-shopping.web.routes.utils :as utils]
            [taoensso.carmine :as car :refer [wcar]]
            [ring.util.http-response :as http-response]))

(defn read-products []
  (json/read-str (slurp "./products.json")))

(defn index
  [request]
  (let [{:keys [db]} (utils/route-data request)
        product-keys (wcar db (car/keys "product:*"))]
    (if (empty? product-keys)
      (let [products (read-products)]
        (doseq [product products]
          (wcar db (car/set (format "product:%s" (product "id")) product)))
        (http-response/ok products))
      (let [products (wcar db (apply car/mget product-keys))]
        (http-response/ok products)))))

(defn get-product
  [request]
  (let [{:keys [db]} (utils/route-data request)
        id (-> request :path-params :id)
        product (wcar db (car/get (format "product:%s" id)))]
    (if product
      (http-response/ok product)
      (http-response/not-found))))

(defn reset-products
  [request]
  (let [{:keys [db]} (utils/route-data request)
        products (read-products)
        cart-keys (wcar db (car/keys "cart:*"))]
    (when (not-empty cart-keys) (wcar db (apply car/del cart-keys)))
    (doseq [product products]
      (wcar db (car/set (format "product:%s" (product "id")) product)))
    (http-response/ok)))