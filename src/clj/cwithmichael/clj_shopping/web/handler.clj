(ns cwithmichael.clj-shopping.web.handler
  (:require
   [cwithmichael.clj-shopping.web.middleware.core :as middleware]
   [integrant.core :as ig]
   [reitit.ring :as ring]
   [reitit.swagger-ui :as swagger-ui]
   [ring.util.http-response :as http-response]
   [ring.middleware.cors :refer [wrap-cors]]
   [taoensso.carmine.connections :as conn]))


(defmethod ig/init-key :handler/ring
  [_ {:keys [router api-path] :as opts}]
  (ring/ring-handler
   (router)
   (ring/routes
     ;; Handle trailing slash in routes - add it + redirect to it
     ;; https://github.com/metosin/reitit/blob/master/doc/ring/slash_handler.md 
    (ring/redirect-trailing-slash-handler)
    (ring/create-resource-handler {:path "/"})
    (when (some? api-path)
      (swagger-ui/create-swagger-ui-handler {:path api-path
                                             :url  (str api-path "/swagger.json")}))
    (ring/create-default-handler
     {:not-found
      (constantly (-> {:status 404, :body "Page not found"}
                      (http-response/content-type "text/html")))
      :method-not-allowed
      (constantly (-> {:status 405, :body "Not allowed"}
                      (http-response/content-type "text/html")))
      :not-acceptable
      (constantly (-> {:status 406, :body "Not acceptable"}
                      (http-response/content-type "text/html")))}))
   {:middleware [(middleware/wrap-base opts) #(middleware/check-session %)  #(wrap-cors % :access-control-allow-origin [#".*"]
                                                                                        :access-control-allow-methods [:get :put :post :delete :options]
                                                                                        :access-control-allow-credentials "true"
                                                                                        :access-control-allow-headers ["Origin" "X-Requested-With"
                                                                                                                       "Content-Type" "Accept"])]}))

(defmethod ig/init-key :db/redis
  [_ {:keys [uri]}]
  (let [db (conn/pooled-conn {:uri uri})]
    {:db db}))

(defmethod ig/init-key :router/routes
  [_ {:keys [routes]}]
  (mapv (fn [route]
          (if (fn? route)
            (route)
            route))
        routes))

(defmethod ig/init-key :router/core
  [_ {:keys [routes env] :as opts}]
  (if (= env :dev)
    #(ring/router ["" opts routes])
    (constantly (ring/router ["" opts routes]))))

