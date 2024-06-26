(ns cwithmichael.clj-shopping.web.routes.api
  (:require [cwithmichael.clj-shopping.web.controllers.cart :as cart]
            [cwithmichael.clj-shopping.web.controllers.health :as health]
            [cwithmichael.clj-shopping.web.controllers.products :as products]
            [cwithmichael.clj-shopping.web.middleware.exception :as exception]
            [cwithmichael.clj-shopping.web.middleware.formats :as formats]
            [cwithmichael.clj-shopping.web.schemas.api :refer [Health Item
                                                               Product]]
            [integrant.core :as ig]
            [reitit.coercion.malli :as malli]
            [reitit.ring.coercion :as coercion]
            [reitit.ring.middleware.muuntaja :as muuntaja]
            [reitit.ring.middleware.parameters :as parameters]
            [reitit.swagger :as swagger]))

(defn route-data [opts]
  (merge
   opts
   {:coercion   malli/coercion
    :muuntaja   formats/instance
    :swagger    {:id ::api}
    :middleware [parameters/parameters-middleware
                  ;; content-negotiation
                 muuntaja/format-negotiate-middleware
                  ;; encoding response body
                 muuntaja/format-response-middleware
                  ;; exception handling
                 coercion/coerce-exceptions-middleware
                  ;; decoding request body
                 muuntaja/format-request-middleware
                  ;; coercing response bodys
                 coercion/coerce-response-middleware
                  ;; coercing request parameters
                 coercion/coerce-request-middleware
                  ;; exception handling
                 exception/wrap-exception]}))

;; Routes
(defn api-routes [_opts]
  [["/swagger.json"
    {:get {:no-doc  true
           :swagger {:info {:title "cwithmichael.clj-shopping API"}}
           :handler (swagger/create-swagger-handler)}}]
   ["/cart"
    {:delete {:handler cart/clear-cart!
              :respones {204 nil}
              :swagger {:summary "Clear the cart."}}
     :get  {:handler cart/index
            :responses {200 {:body [:sequential Item]}}
            :swagger {:summary "Fetch all cart items."}}}]
   ["/cart/:id"
    {:delete {:handler cart/delete-item!
              :parameters {:path [:map [:id [:string]]]}
              :respones {204 nil}
              :swagger {:summary "Remove a product from the cart."}}
     :put {:handler cart/update-cart!
           :parameters {:body [:map
                               [:increment-by  [:int {:min -1 :max 1}]]]
                        :path [:map [:id [:string]]]}
           :responses {200 nil
                       400 {:body [:map [:message {:optional true} [:string]]]}}
           :swagger {:summary "Update the quantity of a product in the cart."}}}]
   ["/reset"
    {:post {:handler products/reset-products!
            :respones {200 nil}
            :swagger {:summary "Reset products to the initial state."}}}]
   ["/products/:id"
    {:get  {:handler products/get-product
            :parameters {:path [:map [:id [:string]]]}
            :responses {200 {:body Product}}
            :swagger {:summary "Fetch a product by ID."}}}]

   ["/products"
    {:get  {:handler products/index
            :responses {200 {:body [:sequential Product]}}
            :swagger {:summary "Fetch all products."}}}]
   ["/health"
    {:get {:handler health/healthcheck!
           :responses {200 {:body Health}}
           :swagger {:summary "Health check."}}}]])

(derive :reitit.routes/api :reitit/routes)

(defmethod ig/init-key :reitit.routes/api
  [_ {:keys [base-path]
      :or   {base-path ""}
      :as   opts}]
  [base-path (route-data opts) (api-routes opts)])