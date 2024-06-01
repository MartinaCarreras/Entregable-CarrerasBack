class MDBProductManager {
    constructor(model) {
        this.products = [],
        this.model = model
    };

    getItems = async ( limit, page, query, sort ) => {
      let realLimit, realPage, realSort, realQuery;
      limit? realLimit = limit : realLimit = 10;
      page? realPage = page : realPage = 1;
      query? realQuery = query : realQuery = "none";
      sort? realSort = sort : realSort = "none";
      if(sort) {
      } else {
        realSort = 'none'
      }
      if (realSort == 'none') {
        if (realQuery != 'none') {
          this.products = await this.model.paginate({category: realQuery}, {limit: realLimit, page: realPage})
        }else {
          this.products = await this.model.paginate({}, {limit: realLimit, page: realPage})
        }
      } else {
        if (realQuery != 'none') {
          this.products = await this.model.paginate({category: realQuery}, {limit: realLimit, page: realPage});
        }else {
          this.products = await this.model.paginate({}, {limit: realLimit, page: realPage});
        }
        if(realSort == 'asc') {
          this.products.docs = await this.products.docs.sort((a,b) => a.price - b.price);
        } else if (realSort == 'desc') {
          this.products.docs = await this.products.docs.sort((a,b)=> b.price - a.price);
        }
      }
      return this.products;
    };

    getById = async (pid) => {
      let productById = await this.model.findById(pid);
      try {
        return (productById)
      }
      catch (error) {
        return "Lo sentimos, ha ocurrido un error enviando la información que intentó capturar."
      }
    };

    addItem = async ( newData ) => {
        this.products = await this.model.find().lean();
        try {
            this.model.create(newData);
        } catch {
            return "Error al agregar porducto. Por favor, inténtalo de nuevo.";
        }
    };

    updateItem = async ( pid, latestProduct ) => {
      const oldProduct = await this.model.findById(pid);
      let toSendObject;
      try {
        for (let i = 0; i <= 7; i++) {
          if (Object.values(latestProduct)[i] == "") {
              let oldValue = Object.values(oldProduct)[i];
              let myProp = Object.keys(latestProduct)[i];
              latestProduct = {...latestProduct, [myProp]: oldValue};
          }
        };
        const {title, description, price, code, stock, category, status, thumbnail} = latestProduct;
        await this.model.findByIdAndUpdate(pid, {title: title}, {description: description}, {price: price}, {code: code}, {stock: stock}, {category: category}, {status: status}, {thumbnail: thumbnail});
        let updatedObject = await this.model.findById(pid);
        return updatedObject
      } catch {
          return "Error al intentar actualizar el producto.";
      }
    };

    deleteItem = async (pid) => {
        try {
            await this.model.deleteOne({_id: objectId(pid)});
            return `Producto de ID "${pid}" eliminado.`;
        } catch {
            return `Error al intentar eliminar el producto de ID "${pid}".`;
        }
    }

}

export default MDBProductManager;