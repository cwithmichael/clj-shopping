(ns cwithmichael.clj-shopping.env
  (:require
    [clojure.tools.logging :as log]
    [cwithmichael.clj-shopping.dev-middleware :refer [wrap-dev]]))

(def defaults
  {:init       (fn []
                 (log/info "\n-=[clj-shopping starting using the development or test profile]=-"))
   :start      (fn []
                 (log/info "\n-=[clj-shopping started successfully using the development or test profile]=-"))
   :stop       (fn []
                 (log/info "\n-=[clj-shopping has shut down successfully]=-"))
   :middleware wrap-dev
   :opts       {:profile       :dev
                :persist-data? true}})
