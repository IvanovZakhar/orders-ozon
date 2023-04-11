import {useHttp} from '../hooks/http.hook';

const useOrderService = () => {
    const {loading, request, error, clearError} = useHttp();
 
    const bodySChema = {
        "dir": "ASC",
        "filter": {
            "cutoff_from": "2023-04-13T00:00:00.000Z",
            "cutoff_to": "2023-04-13T13:00:00Z",
            "delivery_method_id": [],
            "provider_id": [],
            "status": "awaiting_deliver",
            "warehouse_id": []
        },
        "limit": 100,
        "offset": 0,
        "with": {
            "analytics_data": true,
            "barcodes": true,
            "financial_data": true,
            "translit": true
        }
    }
    
    const formData = JSON.stringify(bodySChema)

   const headersOzon = {  
        'Client-Id': '634359' ,
         
     }
    const getAllOrders = async () => {
        const res = await request(`https://api-seller.ozon.ru/v3/posting/fbs/unfulfilled/list`, 'POST', formData, headersOzon);
     return transformProduct(res.result.postings[0].products[0].offer_id)
        console.log(res.result.postings[0].products[0].offer_id)
    }

    const getInfoProducts = async () => {
        const res = await request(`http://localhost:3001/product`, 'GET');
        return res;
    }

    const transformProduct = (comics) => {
        return{
         product: comics,
 
        } 
     }
    

    const _transformComics = (comics) => {
       return{
        id: comics.id,
        title: comics.title,
        description: comics.description || 'There is no description',
        pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
        language: comics.textObjects.language || 'en-us',
        price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not available',
        img: comics.images[0] ? `${comics.images[0].path}.${comics.images[0].extension}` : 'none'
       } 
    }

    return {loading, error, clearError, getAllOrders, getInfoProducts }
}

export default useOrderService;