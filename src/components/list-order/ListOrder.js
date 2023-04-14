import './ListOrder.scss'

const ListOrder = (props) => {
    const elem = props.props ? props.props.map((item, i) => {
        const {date,
            postingNumber,
            productArt,productName,
            productPrice,
            quantity,
            warehouse} = item;
            return(
            
                <tr key={item.postingNumber}>
                    <td>{i+=1}</td>
                    <td>{postingNumber}</td>
                    <td>{`${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`}</td>
                    <td className='productName'>{productName}</td>
                    <td>{productArt}</td>
                    <td>{productPrice.slice(0, -7)}</td>
                    <td>{quantity}</td>
                    <td className='warehouse'>{warehouse === "Крупногабарит" ? "П" : null}</td>
                </tr>
                 
            )
    }) : null;


   function colculateTotalProducts (product) {
    console.log(product)
        const compl = product ? 
        product.filter(item => item.productArt === 'AR752031957-06' )
        .map(item => {
           const elem = [
                    {productName: "Крепежный кронштейн ( коннектор) 1 шт. для беседок и пергол ARSENAL PERGOLA модель AR75112Ц957-06", quantity: 6},
                    {productName: "Крепежный кронштейн ( коннектор) 2 шт.  для беседок и пергол ARSENAL PERGOLA модель AR75312У957-06", quantity: 2},
                    {productName: "Крепежный кронштейн ( коннектор) 1 шт.  для беседок и пергол ARSENAL PERGOLA модель AR75312T957-06", quantity: 2}]
            return elem
                    
        })  
        .reduce((accumulator, item) => {
           return item.concat(accumulator)
        }) : [{}];


       const newElem = product ? product.concat(compl) : null;
      

        const summary = newElem ? newElem.reduce((accumulator, item) => Object.assign(accumulator, {
            
            [item.productName]: (accumulator[item.productName] || 0) + item.quantity
        }), {}) : null
    
       if(summary) {return Object.entries(summary).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))} 
             
   }
const productTotal = colculateTotalProducts(props.props)
    
    return(
        <>
            <table className="list-order">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Номер отправления</th>
                        <th>Дата отгрузки</th>
                        <th>Наименование товара</th>
                        <th className='art'>Артикул</th>
                        <th>Стоимость</th>
                        <th>Кол-во шт.</th>
                        <th>Склад</th>
                    </tr>
                </thead>
                <tbody>
                    {elem}
                    
                </tbody>
            
            </table>
            <table className="list-order">
                <thead>
                    <tr>
                        <th>Наименование товара</th> 
                        <th>Кол-во</th>
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