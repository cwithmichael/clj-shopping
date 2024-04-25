(ns cwithmichael.clj-shopping.web.middleware.core
  (:require
   [cwithmichael.clj-shopping.env :as env]
   [ring.middleware.defaults :as defaults]
   [ring.middleware.session.cookie :as cookie]))

(defn wrap-base
  [{:keys [site-defaults-config cookie-session-config] :as opts}]
  (fn [handler]
    (cond-> ((:middleware env/defaults) handler opts)
      true (defaults/wrap-defaults
            (assoc-in site-defaults-config [:session :store] (cookie/cookie-store cookie-session-config))))))

(defn check-session
  [handler]
  (fn [req]
    (let [response (handler req)
          session (or (:session response) (:session req))]
      (if (nil? (:cart-id session))
        (assoc-in response [:session :cart-id] (random-uuid))
        response))))
