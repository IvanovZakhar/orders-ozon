import {useHttp} from '../hooks/http.hook';

const useOrderService = () => {
    const {loading, request, error, clearError} = useHttp();
 

    const getAllOrders = async (formData, headersOzon) => {
  
        const res = await request(`https://api-seller.ozon.ru/v3/posting/fbs/unfulfilled/list`, 'POST', formData, headersOzon);
        
        return res.result.postings.map(transformProduct)
    }

    const getAllProducts = async () => {
        const res = await request(`https://server-market-arsenal.vercel.app/products-for-orders`, 'GET');
     
        return res;
    }

    const getLabelOzon = async (url, method, body, headersOzon) => {
        const res = await request(url, method, body, headersOzon);
        return res
    }

 

    const getInfoProducts = async (article) => {

        const res = article.map(async (item) => {
           
          const res = await request(`https://server-market-arsenal.vercel.app/products-for-orders?article=${item.productArt}`, 'GET');
      
          res.postingNumber = item.postingNumber;
          res.date = item.date;
          res.price = item.productPrice
          res.warehouse = item.warehouse
          res.quantity = item.quantity
          return res;  
        })
        return res 

    }

    const updateData = async (url,method, headersOzon, body) => {
        const res = await request(url, method,  body, headersOzon,);
    }

    const getBaskets = async () => {
        const res = await request(`http://localhost:3001/baskets`, 'GET');
        return res 
       
    }

    const transformBaskets = (baskets) => {
         
        return{
            art: baskets.articles,
            sku: baskets.sku_id
        } 
     } 
    
 
    const transformProduct = (product) => {
        
        return{
            postingNumber: product.posting_number,
            date: product.shipment_date,
            productArt: product.products[0].offer_id,
            productName: product.products[0].name,
            productPrice: product.products[0].price,
            quantity: product.products[0].quantity,
            warehouse: product.delivery_method.warehouse
        
        } 
     }



    return {loading, error, clearError, getAllOrders, getInfoProducts, getBaskets , getAllProducts, updateData, getLabelOzon}
}

export default useOrderService;