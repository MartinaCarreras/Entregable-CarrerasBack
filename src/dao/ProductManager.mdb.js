class MDBProductManager {
    constructor(model) {
        this.products = [],
        this.model = model
    };

    getItems = async ( limit ) => {
        this.products = await this.model.find().lean();
        if (limit != 0) {
          try {
            return (this.products.slice(0, +limit))
          } catch (error) {
            console.log( "Lo sentimos, ha ocurrido un error enviando la información que intentó capturar.");
          }
        } else {
          try {
            return this.products;
          } catch (error) {
            console.log( "Lo sentimos, ha ocurrido un error enviando la información que intentó capturar.");
          }
        }
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