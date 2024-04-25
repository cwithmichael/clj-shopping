(ns cwithmichael.clj-shopping.web.schemas.api
  (:require [malli.core :as m]))

(def Product [:map
              ["id" :string]
              ["name" :string]
              ["price" :string]
              ["stock" :int]])

(def Item [:map
           [:product Product]
           [:cart_quantity int?]])

