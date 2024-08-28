class MDBProductManager {
    constructor(model) {
        this.products = [],
        this.model = model
    };

    getItems = async ( limit = 10, page = 1, query = 'none', sort = 'none', available = 'true', cid = null) => {
      let preLink, postLink;
      let generalLink = `/products?limit=${limit}`;
      if (query != 'none') {
        generalLink = generalLink + `&query=${query}`;
      }
      if (sort != 'none') {
        generalLink = generalLink + `&sort=${sort}`;
      }
      cid? generalLink = generalLink + `&cid=${cid}`: generalLink;
      preLink = generalLink + `&page=${+page-1}`
      postLink = generalLink + `&page=${+page+1}`

      let RealSort
      let filtros = {}
      let opciones = {limit: limit, page: page};
      query != 'none'? filtros = {category: query}: filtros ;
      available != 'true'? filtros = {...filtros, stock: {$eq: 0}}: filtros = {...filtros, stock: {$ne: 0}};
      if (sort != 'none') {
        if (sort == 'asc') {
          RealSort = 1;
        } else {
          RealSort = -1;
        }
        opciones = {...opciones, sort: {price: RealSort }}
      }
      this.products = await this.model.paginate(filtros, opciones)

      let newArray = []
      this.products.docs.forEach(product=>{
        const temporalproduct = {_id: product._id, title: product.title, code: product.code, description: product.description, price: product.price, thumbnail: product.thumbnail, stock: product.stock, category: product.category}
        newArray.push(temporalproduct)
      })


      let finishedArray = {
        payload: newArray,
        totalPages: this.products.totalPages,
        prevPage: +page == 1? 'none': +page - 1,
        nextPage: +page == this.products.totalPages? 'none': +page + 1,
        page: this.products.page,
        hasPrevPage: +page == 1? false: true,
        hasNextPage: +page == this.products.totalDocs? false: true,
        prevLink: +page == 1? null: preLink,
        nextLink: +page == this.products.totalDocs? null: postLink
        
      }

      return finishedArray;
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