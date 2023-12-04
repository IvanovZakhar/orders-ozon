import {useHttp} from '../hooks/http.hook';

const useOrderService = () => {
    const {loading, request, error, clearError} = useHttp();
 
    const _url = "https://f9fd09879062.vps.myjino.ru:49256"
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
 

 
    const getAllOrdersWB = async (dateFrom, dateTo, apiKey) => { 
        const headersWB = {  
            "Authorization": `${apiKey}`,
            "Content-Type": "application/json"
         } 
         console.log(dateFrom)
         console.log(dateTo)
        const unixDateFrom = getNewDate(dateFrom)
        const unixDateTo = getNewDate(dateTo)
        const res = await request(`https://suppliers-api.wildberries.ru/api/v3/orders?limit=50&next=0&dateFrom=${unixDateFrom}&dateTo=${unixDateTo}`, 'GET', null, headersWB);
            console.log(res)
        return res.orders
    }
    const getStickersWB = async (apiKey, body) => { 
        const headersWB = {  
            "Authorization": `${apiKey}`,
            "Content-Type": "application/json"
         } 
         
        const res = await request(`https://suppliers-api.wildberries.ru/api/v3/orders/stickers?type=png&width=58&height=40`, 'POST', body, headersWB);
           
        return res.stickers
    }

    // Для создания Unix timestamp 

    function getNewDate (date) {
            // Создаем объект Date из строки
            const dateObject = new Date(date);

            // Получаем Unix timestamp (количество миллисекунд с 1 января 1970 года)
            const unixTimestamp = dateObject.getTime();
            return  Math.floor(unixTimestamp / 1000);
    
    }


    const updateData = async (url,method, headersOzon, body) => {
        const res = await request(url, method,  body, headersOzon,);
    }

    const getBaskets = async (product = 'baskets') => {
        const res = await request(`http://localhost:3002/${product}`, 'GET');
        return res 
       
    }

    const getInfoProducts = async () => {

        const res = await request(`${_url}/products-for-orders`, 'GET')
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



    return {loading, error, clearError, getAllOrders, getInfoProducts, getBaskets , getAllProducts, updateData, getLabelOzon, getAllOrdersWB, getStickersWB}
}

export default useOrderService;