import NavLink from '../NavLink/Nav-link';
import './ListOrder.scss'

const ListOrder = ({props, onLoadingProducts, date, setDate}) => {
 
    const elem = props ? props.map((item, i) => {
        const {date,
            postingNumber,
            productArt,productName,
            productPrice,
            quantity,
            warehouse} = item;
  
            return(
   
                <tr className='list-order__item' key={item.postingNumber}>
                    <td className='list-order__item'>{i+=1}</td>
                    <td className='list-order__item posting-number'>{postingNumber}</td>
                    <td className='list-order__item'>{`${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`}</td>
                    <td className='productName list-order__item'>{productName}</td>
                    <td className='list-order__item'>{productArt}</td>
                    <td className='list-order__item'>{productPrice.slice(0, -7)}</td>
                    <td className='list-order__item'>{quantity}</td>
                    <td className='warehouse list-order__item'>{warehouse === "Крупногабарит" ? "П" : null}</td>
                </tr>
               
            )
    }) : null;
 


   function colculateTotalProducts (product) {
 
        // const compl = product ? 
        // product.filter(item => item.productArt === 'AR752031957-06' )
        // .map(item => {
        //    const elem = [
        //             {productName: "Крепежный кронштейн ( коннектор) 1 шт. для беседок и пергол ARSENAL PERGOLA модель AR75112Ц957-06", quantity: 6},
        //             {productName: "Крепежный кронштейн ( коннектор) 2 шт.  для беседок и пергол ARSENAL PERGOLA модель AR75312У957-06", quantity: 2},
        //             {productName: "Крепежный кронштейн ( коннектор) 1 шт.  для беседок и пергол ARSENAL PERGOLA модель AR75312T957-06", quantity: 2}]
        //     return elem
                    
        // })  
        // .reduce((accumulator, item) => {
        //    return item.concat(accumulator)
        // }) : [{}];


    //    const newElem = product ? product.concat(compl) : null;

        // const compl = product.filter(item => {
        //     if(item.productArt === 'AR752031957-06'){
        //         return
        //     } 
        // })
        // console.log(compl) 
        // const newElem = product.concat(compl);
        // console.log(newElem) 

        

        // function colculateComplProduct (items, elem) {

        //     const resFilter = items.filter(item => {
              
        //         if(item.productArt === elem){
        //             return item
        //         } 

        //     })
        //     console.log(resFilter)

        //     const resCompl = resFilter ? resFilter.map(item => {
        //    const elem = [
        //             {productName: "Крепежный кронштейн ( коннектор) 1 шт. для беседок и пергол ARSENAL PERGOLA модель AR75112Ц957-06", quantity: 6},
        //             {productName: "Крепежный кронштейн ( коннектор) 2 шт.  для беседок и пергол ARSENAL PERGOLA модель AR75312У957-06", quantity: 2},
        //             {productName: "Крепежный кронштейн ( коннектор) 1 шт.  для беседок и пергол ARSENAL PERGOLA модель AR75312T957-06", quantity: 2}]
        //     return elem
                    
        // })
        // .reduce((accumulator, item) => {
        //    return item.concat(accumulator)
        // }) 
        // : [];

        //  return resCompl;
            
        // }

        // const compl = colculateComplProduct(product, 'AR74KE23957-0')

        
        // console.log(compl)
         

        const summary = product.reduce((accumulator, item) => Object.assign(accumulator, {
            
            [item.productArt]: (accumulator[item.productArt] || 0) + item.quantity
        }), {})

       
    
     return Object.entries(summary).map(([key, value]) => (
            <tr className='list-order__item' key={key}>
              <td className='list-order__item'>{key}</td>
              <td className='list-order__item'>{value}</td>
            </tr>
          ))
             
   }
const productTotal = props ? colculateTotalProducts(props) : null;
   const dateOrders = props[0] ? `${props[0].date.slice(8, 10)}.${props[0].date.slice(5, 7)}.${props[0].date.slice(0, 4)}` : 'Нет отправлений';
  
    return(
        <>
             <NavLink onLoadingProducts={onLoadingProducts} date={date} setDate={setDate}/>
            {elem ? <Page elem={elem} productTotal={productTotal} dateOrders={dateOrders}/> : <h2>Введите дату</h2>}</>
    )
}

const Page = ({elem, productTotal, dateOrders}) => {
    return(
        <>
               
                <table className="list-order">
                    <thead>
                        <tr className='list-order__item'>
                            <th className='list-order__item'>№</th>
                            <th className='list-order__item'>Номер отправления</th>
                            <th className='list-order__item'>Дата отгрузки</th>
                            <th className='list-order__item date'>{dateOrders}</th>
                            <th className='art list-order__item'>Артикул</th>
                            <th className='list-order__item'>Стоимость</th>
                            <th className='list-order__item'>Кол-во шт.</th>
                            <th className='list-order__item'>Склад</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elem}
                        
                    </tbody>
                
                </table>
            
                <table className="list-order">
                    <h2>Итого</h2>
                    <thead>
                        <tr className='list-order__item'>
                            <th className='list-order__item'>Артикул</th> 
                            <th className='list-order__item'>Кол-во</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productTotal}
                    </tbody>
                
                </table>

        </>
    )
}

export default ListOrder;