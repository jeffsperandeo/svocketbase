/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("24o2lj7etirkdeb")

  collection.listRule = "@request.auth.id != \"\" && (user_id = @request.auth.id || @request.auth.id = \"\")"
  collection.viewRule = "@request.auth.id != \"\" && (user_id = @request.auth.id || @request.auth.id = \"\")"
  collection.createRule = "@request.auth.id != \"\" && user_id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("24o2lj7etirkdeb")

  collection.listRule = "@request.auth.id != \"\" && user_id = @request.auth.id"
  collection.viewRule = "@request.auth.id != \"\" && user_id = @request.auth.id"
  collection.createRule = "@request.auth.id != \"\""

  return dao.saveCollection(collection)
})
