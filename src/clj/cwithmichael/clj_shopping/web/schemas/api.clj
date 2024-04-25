(ns cwithmichael.clj-shopping.web.schemas.api)

(def Product [:map
              ["id" :string]
              ["name" :string]
              ["price" :string]
              ["stock" :int]])

(def Item [:map
           [:product Product]
           [:cart_quantity int?]])

(def Health [:map
             [:time :string]
             [:up-since :string]
             [:app [:map [:status :string]
                    [:message :string]]]])