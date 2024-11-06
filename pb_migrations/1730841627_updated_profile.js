/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("24o2lj7etirkdeb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mvozau5p",
    "name": "gym_id",
    "type": "relation",
    "required": false,
    "presentable": true,
    "unique": false,
    "options": {
      "collectionId": "sv6vdmf7y1uou64",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("24o2lj7etirkdeb")

  // remove
  collection.schema.removeField("mvozau5p")

  return dao.saveCollection(collection)
})
