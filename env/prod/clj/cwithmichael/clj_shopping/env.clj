(ns cwithmichael.clj-shopping.env
  (:require [clojure.tools.logging :as log]))

(def defaults
  {:init       (fn []
                 (log/info "\n-=[clj-shopping starting]=-"))
   :start      (fn []
                 (log/info "\n-=[clj-shopping started successfully]=-"))
   :stop       (fn []
                 (log/info "\n-=[clj-shopping has shut down successfully]=-"))
   :middleware (fn [handler _] handler)
   :opts       {:profile :prod}})
