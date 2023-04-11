import {useHttp} from '../hooks/http.hook';

const useOrderService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=baaab7750b9c96f0a5da18949146680e';
    const _baseOffset = 210;

    const getAllOrders = async (offset = _baseOffset) => {
        const res = await request(`https://api-seller.ozon.ru/v3/posting/fbs/unfulfilled/list`);
        console.log(res)
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

    return {loading, error, clearError, getAllOrders }
}

export default useOrderService;