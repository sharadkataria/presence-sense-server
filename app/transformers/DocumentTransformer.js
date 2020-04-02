const DocumentTransformer = async documents => {
  if (Array.isArray(documents) && documents.length) {
    for await (let doc of documents) {
      let dataValues = doc.dataValues;
      dataValues.id = dataValues.uuid;
      delete dataValues.uuid;
      delete dataValues.user_id;
      delete dataValues.owner_id;
      dataValues.public = dataValues.public ? true : false;
      doc.dataValues = dataValues;
    }

    return documents;
  } else if (!Array.isArray(documents) && documents) {
    let dataValues = documents.dataValues;
    dataValues.id = dataValues.uuid;
    delete dataValues.uuid;
    delete dataValues.user_id;
    delete dataValues.owner_id;
    dataValues.public = dataValues.public ? true : false;
    documents.dataValues = dataValues;
    return documents;
  } else return documents;
};

module.exports = DocumentTransformer;
