import {useHttp} from '../hooks/http.hook';

const useOrderService = () => {
    const {loading, request, error, clearError} = useHttp();
 
    const _url = "https://ced1fd25fcf8.vps.myjino.ru:49191"
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
 
    const getAllOrdersYandex = async (clientId) => { 
      
        const res = await request(`https://ced1fd25fcf8.vps.myjino.ru:49191/yandex-orders/${clientId}`, 'GET');
         
        return res.orders
    }

    const getStickersOrdersYandex = async (orderId, campaignId) => { 
        console.log(orderId)
        const res = await request(`https://ced1fd25fcf8.vps.myjino.ru:49191/yandex-stickers/${campaignId}/${orderId}`, 'GET', null, {'Content-Type': 'application/pdf'}, false); 
        return res
    }
 
    const getAllOrdersWB = async (dateFrom, dateTo, apiKey) => { 
        const unixDateFrom = getNewDate(dateFrom)
        const unixDateTo = getNewDate(dateTo)
        const res = await request(`https://ced1fd25fcf8.vps.myjino.ru:49191/wb-orders/${unixDateFrom}/${unixDateTo}`, 'GET', null );
         console.log(res)
        return res.orders
    }
    const getStickersWB = async (apiKey, body) => {   
        const res = await request(`https://ced1fd25fcf8.vps.myjino.ru:49191/wb-stickers`, 'POST', body); 
        return res.stickers
    }

    const getAllOrdersWBCMA = async (dateFrom, dateTo, apiKey) => { 
        const unixDateFrom = getNewDate(dateFrom)
        const unixDateTo = getNewDate(dateTo)
        const res = await request(`https://ced1fd25fcf8.vps.myjino.ru:49191/wbcma-orders/${unixDateFrom}/${unixDateTo}`, 'GET', null );
         console.log(res)
        return res.orders
    }
    const getStickersWBCMA = async (apiKey, body) => {   
        const res = await request(`https://ced1fd25fcf8.vps.myjino.ru:49191/wbcma-stickers`, 'POST', body); 
        return res.stickers
    }
    
    const getAllOrdersWBArsenal = async (dateFrom, dateTo, apiKey) => { 
        const unixDateFrom = getNewDate(dateFrom)
        const unixDateTo = getNewDate(dateTo)
        const res = await request(`https://ced1fd25fcf8.vps.myjino.ru:49191/wbarsenal-orders/${unixDateFrom}/${unixDateTo}`, 'GET', null );
         console.log(res)
        return res.orders
    } 

    const getAllOrdersWBMD = async (dateFrom, dateTo, apiKey) => { 
        const unixDateFrom = getNewDate(dateFrom)
        const unixDateTo = getNewDate(dateTo)
        const res = await request(`https://ced1fd25fcf8.vps.myjino.ru:49191/wbmd-orders/${unixDateFrom}/${unixDateTo}`, 'GET', null );
         console.log(res)
        return res.orders
    }
    const getStickersWBMD = async (apiKey, body) => {   
        const res = await request(`https://ced1fd25fcf8.vps.myjino.ru:49191/wbmd-stickers`, 'POST', body); 
        console.log(res.stickers)
        return res.stickers
    }

    const getStickersWBArsenal = async (apiKey, body) => {   
        const res = await request(`https://ced1fd25fcf8.vps.myjino.ru:49191/wbarsenal-stickers`, 'POST', body); 
        console.log(res.stickers)
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

    const updateProductQuantity = async (data) => {
        const res = await request(
            `${_url}/update/products-for-warehouse/updateQuantity`, 
            'POST', 
            JSON.stringify(data) 
            )

        return res
    }

    const getBaskets = async (product = 'baskets') => {
        const res = await request(`http://localhost:3002/${product}`, 'GET');
        return res 
       
    }

    const getInfoProducts = async () => {

        const res = await request(`${_url}/products-for-orders`, 'GET')
        return res
    }
    
    const getPhotoProducts = async (article) => {
        const res = await request(`${_url}/allproducts?article=${article}`, 'GET');
      return res 
    }

    const transformBaskets = (baskets) => {
         
        return{
            art: baskets.articles,
            sku: baskets.sku_id
        } 
     } 
     const getAllLogs = async () => {
        
        const res = await request(`${_url}/logs/products-for-warehouse`, 
                                    'GET')
    
        return res
    }

    const getProductsForOrdersBarcode = async () => {
        const res = await request(`${_url}/products-for-orders-barcode`, 'GET');
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



    return {loading, error, 
            clearError, 
            getAllOrders, 
            getInfoProducts, 
            getBaskets , 
            getAllProducts, 
            updateData, 
            getLabelOzon, 
            getAllOrdersWB, 
            getStickersWB, 
            getAllLogs, 
            getAllOrdersYandex,
            getStickersOrdersYandex,
            getProductsForOrdersBarcode,
            updateProductQuantity, 
            getStickersWBCMA,
            getAllOrdersWBCMA,
            getStickersWBMD,
            getStickersWBArsenal,
            getAllOrdersWBMD,
            getAllOrdersWBArsenal, 
            getPhotoProducts}
}

export default useOrderService;