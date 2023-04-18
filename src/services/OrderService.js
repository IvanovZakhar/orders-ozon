import {useHttp} from '../hooks/http.hook';

const useOrderService = () => {
    const {loading, request, error, clearError} = useHttp();
 
    // const bodySChema = {
    //     "dir": "ASC",
    //     "filter": {
    //         "cutoff_from": "2023-04-20T00:00:00.000Z",
    //         "cutoff_to": "2023-04-20T13:00:00Z",
    //         "delivery_method_id": [],
    //         "provider_id": [],
    //         "status": "awaiting_deliver",
    //         "warehouse_id": []
    //     },
    //     "limit": 100,
    //     "offset": 0,
    //     "with": {
    //         "analytics_data": true,
    //         "barcodes": true,
    //         "financial_data": true,
    //         "translit": true
    //     }
    // }
    
    // const formData = JSON.stringify(bodySChema)

   const headersOzon = {  
        'Client-Id': '634359' ,
     
     }
    const getAllOrders = async (formData) => {
  
        const res = await request(`https://api-seller.ozon.ru/v3/posting/fbs/unfulfilled/list`, 'POST', formData, headersOzon);
        console.log(res)
        return res.result.postings.map(transformProduct)
    }

    const getInfoProducts = async (article) => {

        const res = article.map(async (item) => {
          const res = await request(`http://localhost:3001/product?article=${item.productArt}`, 'GET');
          res.postingNumber = item.postingNumber;
          res.date = item.date;
          res.price = item.productPrice
          return res;
        })
        return res 

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



    return {loading, error, clearError, getAllOrders, getInfoProducts }
}

export default useOrderService;